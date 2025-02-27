import React from 'react';

interface FormData {
  productCode: string;
  location: string;
  premiumPaid: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
}

interface BillingFormProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingProductCode: string | null;
  createError?: string;
  updateError?: string;
  onCancel: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  editingProductCode,
  createError,
  updateError,
  onCancel
}) => {
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <form
      onSubmit={onSubmit}
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
            onChange={(e) => handleInputChange('productCode', e.target.value)}
            required
          />
        )}
        <input
          type="text"
          placeholder="Location"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Premium Paid"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={formData.premiumPaid}
          onChange={(e) => handleInputChange('premiumPaid', parseFloat(e.target.value))}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Photo URL"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={formData.photo}
          onChange={(e) => handleInputChange('photo', e.target.value)}
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
              onClick={onCancel}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default BillingForm;
