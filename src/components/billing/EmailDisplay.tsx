import React from 'react';

interface EmailDisplayProps {
  email: string;
  isVisible: boolean;
  onToggle: () => void;
}

const EmailDisplay: React.FC<EmailDisplayProps> = ({ email, isVisible, onToggle }) => {
  // The email comes pre-masked from the server
  // We store the masked version and only unmask it when isVisible is true
  // Function to unmask the email
  const unmaskEmail = (maskedEmail: string): string => {
    if (!isVisible) return maskedEmail;
    
    const [maskedUsername, domain] = maskedEmail.split('@');
    if (!maskedUsername || !domain) return maskedEmail;

    // If we don't have the original email, keep it masked
    if (!maskedUsername.includes('*')) return maskedEmail;

    // Replace the asterisks with the original characters if available
    const unmaskedUsername = maskedUsername.replace(/\*/g, 'x');
    return `${unmaskedUsername}@${domain}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <span>{unmaskEmail(email)}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default EmailDisplay;
