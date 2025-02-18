import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchBillingRecords,
  createBillingRecord,
  updateBillingRecord,
  deleteBillingRecord,
  BillingRecord,
} from "../store/billingSlice";

const BillingRecords: React.FC = () => {
  const [showEmail, setShowEmail] = useState<{ [key: number]: boolean }>({});

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`;
  };

  const toggleEmail = (id: number) => {
    setShowEmail(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const dispatch = useDispatch<AppDispatch>();
  const { records, loading, error, createError, updateError, deleteError } = useSelector(
    (state: RootState) => state.billing
  );

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
  const [editingProductCode, setEditingProductCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    const filters: { productCode?: string; location?: string } = {};
    if (productCodeFilter) filters.productCode = productCodeFilter;
    if (locationFilter) filters.location = locationFilter;
    dispatch(fetchBillingRecords(filters));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProductCode) {
      const result = await dispatch(
        updateBillingRecord({
          id: parseInt(editingId!),
          data: {
            location: formData.location,
            premiumPaid: formData.premiumPaid,
          },
        })
      );
      if (!result.hasOwnProperty('error')) {
        resetForm();
        handleSearch();
      }
    } else {
      const result = await dispatch(createBillingRecord(formData));
      if (!result.hasOwnProperty('error')) {
        resetForm();
        handleSearch();
      }
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (record: BillingRecord) => {
    const productCode = record.productId.toString();
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setDeletingId(id.toString());
      const result = await dispatch(deleteBillingRecord(id));
      if (!result.hasOwnProperty('error')) {
        handleSearch();
      }
      // Keep the deletingId set if there was an error, so we can show it
      if (!deleteError) {
        setDeletingId(null);
      }
    }
  };

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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Search Filters */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Search Records
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Product Code"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            value={productCodeFilter}
            onChange={(e) => setProductCodeFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
          >
            Search Records
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md font-medium"
        >
          {showForm ? "Cancel" : "+ Add New Record"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingProductCode ? "Edit Record" : "Add New Record"}
            </h2>
            {createError && !editingProductCode && (
              <div className="text-red-600 mb-4 text-sm">{createError}</div>
            )}
            {updateError && editingProductCode && (
              <div className="text-red-600 mb-4 text-sm">{updateError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {!editingProductCode && (
                <input
                  type="text"
                  placeholder="Product Code"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  value={formData.productCode}
                  onChange={(e) =>
                    setFormData({ ...formData, productCode: e.target.value })
                  }
                  required
                />
              )}
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Premium Paid"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                value={formData.premiumPaid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    premiumPaid: parseFloat(e.target.value),
                  })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="First Name"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
              <input
                type="url"
                placeholder="Photo URL"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                value={formData.photo}
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.value })
                }
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md font-medium"
                >
                  {editingProductCode ? "Update Record" : "Create Record"}
                </button>
                {editingProductCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductCode(null);
                      setEditingId(null);
                      setFormData({
                        productCode: "",
                        location: "",
                        premiumPaid: 0,
                        email: "",
                        firstName: "",
                        lastName: "",
                        photo: "",
                      });
                      setShowForm(false);
                    }}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md font-medium"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Premium Paid
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => {
              // Use the unique record id as the key
              return (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {record.productId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.premiumPaidAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span>{showEmail[record.id] ? record.email : maskEmail(record.email)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEmail(record.id);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        {showEmail[record.id] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.firstName} {record.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.photo && (
                      <img src={record.photo} alt="Profile" className="h-8 w-8 rounded-full" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(record.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(record.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <div className="flex flex-col items-start">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                      >
                        Delete
                      </button>
                      {deleteError && record.id.toString() === deletingId && (
                        <div className="text-red-600 text-xs mt-1">{deleteError}</div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingRecords;
