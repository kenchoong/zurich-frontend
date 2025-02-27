"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchFilter from "./billing/SearchFilter";
import BillingForm from "./billing/BillingForm";
import BillingTable from "./billing/BillingTable";
import {
  getBillingRecords,
  createBillingRecord,
  updateBillingRecord,
  deleteBillingRecord,
} from "@/app/actions/billing";
import { toggleEmailVisibility } from "@/store/emailMaskSlice";
import { RootState, AppDispatch } from "@/store/store";
import { selectAccessToken } from "@/store/authSlice";

interface BillingRecord {
  id: number;
  productId: string;
  location: string;
  premiumPaidAmount: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

const BillingRecords: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const visibleEmails = useSelector(
    (state: RootState) => state.emailMask.visibleEmails
  );
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEmail = (id: number) => {
    dispatch(toggleEmailVisibility(id));
  };

  // Filter states
  const [productCodeFilter, setProductCodeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productCode: "",
    location: "",
    premiumPaid: 0,
    email: "",
    firstName: "",
    lastName: "",
    photo: "",
  });
  const [editingProductCode, setEditingProductCode] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const accessToken = useSelector(selectAccessToken);

  // Load billing records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Function to fetch records with optional filters
  const fetchRecords = async (filters?: {
    productCode?: string;
    location?: string;
  }) => {
    try {
      setLoading(true);

      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      const response = await getBillingRecords(accessToken, filters);
      setRecords(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching records"
      );
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with filters
  const handleSearch = async () => {
    const filters: {
      productCode?: string;
      location?: string;
    } = {};
    if (productCodeFilter) filters.productCode = productCodeFilter;
    if (locationFilter) filters.location = locationFilter;

    await fetchRecords(filters);
  };

  // Handle form submission for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      if (editingId && editingProductCode) {
        // Update existing record
        await updateBillingRecord(accessToken, parseInt(editingId), {
          location: formData.location,
          premiumPaid: formData.premiumPaid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          photo: formData.photo,
        });
      } else {
        // Create new record
        await createBillingRecord(accessToken, formData);
      }

      // Reset form and refresh records
      resetForm();
      await handleSearch();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the record"
      );
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit record
  const handleEdit = (record: BillingRecord) => {
    const productCode = record.productId;
    setFormData({
      productCode,
      location: record.location,
      premiumPaid: record.premiumPaidAmount,
      email: record.email || "",
      firstName: record.firstName || "",
      lastName: record.lastName || "",
      photo: record.photo || "",
    });
    setEditingProductCode(productCode);
    setEditingId(record.id.toString());
    setShowForm(true);
  };

  // Handle delete record
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        setDeletingId(id.toString());
        setError(null);

        if (!accessToken) {
          throw new Error("Unauthorized");
        }

        await deleteBillingRecord(accessToken, id);

        // Refresh records after deletion
        await handleSearch();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while deleting the record"
        );
        console.error("Error deleting record:", err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      productCode: "",
      location: "",
      premiumPaid: 0,
      email: "",
      firstName: "",
      lastName: "",
      photo: "",
    });
    setEditingProductCode(null);
    setEditingId(null);
    setShowForm(false);
  };

  // Loading and error states
  if (loading && records.length === 0) {
    return <div className="text-center p-4">Loading records...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <SearchFilter
        productCodeFilter={productCodeFilter}
        locationFilter={locationFilter}
        onProductCodeChange={setProductCodeFilter}
        onLocationChange={setLocationFilter}
        onSearch={handleSearch}
      />

      {/* Add/Edit Form */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md font-medium"
        >
          {showForm ? "Cancel" : "+ Add New Record"}
        </button>

        {showForm && (
          <BillingForm
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            editingProductCode={editingProductCode}
            onCancel={() => {
              resetForm();
            }}
          />
        )}
      </div>

      {loading && records.length > 0 && (
        <div className="text-center p-2 mb-4 bg-blue-50 rounded">
          Updating records...
        </div>
      )}

      <BillingTable
        records={records}
        showEmail={visibleEmails}
        onToggleEmail={toggleEmail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
};

export default BillingRecords;
