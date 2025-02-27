import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/store/authSlice";
import { getBillingRecords } from "@/app/actions/billing";

interface EmailDisplayProps {
  email: string;
  isVisible: boolean;
  onToggle: () => void;
  recordId: number;
}

const EmailDisplay: React.FC<EmailDisplayProps> = ({
  email,
  isVisible,
  onToggle,
  recordId,
}) => {
  const [originalEmail, setOriginalEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector(selectAccessToken);

  // Fetch the original email when isVisible changes to true
  useEffect(() => {
    // Reset originalEmail when visibility changes to false
    if (!isVisible) {
      setOriginalEmail(null);
      return;
    }

    const fetchOriginalEmail = async () => {
      if (isVisible && !originalEmail && accessToken) {
        try {
          setLoading(true);

          // Fetch the original email from the API
          const response = await getBillingRecords(
            accessToken,
            undefined,
            true
          );

          // Find the record with the matching ID
          const record = response.find((r: any) => r.id === recordId);

          if (record && record.email) {
            setOriginalEmail(record.email);
          }
        } catch (error) {
          console.error("Error fetching original email:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOriginalEmail();
  }, [isVisible, recordId, accessToken, originalEmail]);

  // Function to display the appropriate email
  const displayEmail = (): string => {
    if (!isVisible) {
      return email; // Return the masked email when not visible
    }

    if (loading) {
      return "Loading...";
    }

    // When visible, return the original email if we have it, otherwise return the masked email
    return originalEmail || email;
  };

  return (
    <div className="flex items-center space-x-2">
      <span>{displayEmail()}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
      >
        {isVisible ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default EmailDisplay;
