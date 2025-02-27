import React from "react";
import { BillingRecord } from "../../store/billingSlice";
import EmailDisplay from "./EmailDisplay";

interface BillingTableProps {
  records: BillingRecord[];
  showEmail: { [key: number]: boolean };
  onToggleEmail: (id: number) => void;
  onEdit: (record: BillingRecord) => void;
  onDelete: (id: number) => void;
  deletingId: string | null;
  deleteError?: string;
}

const BillingTable: React.FC<BillingTableProps> = ({
  records,
  showEmail,
  onToggleEmail,
  onEdit,
  onDelete,
  deletingId,
  deleteError,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
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
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records && records.length > 0 ? (
            records.map((record) => (
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
                  <EmailDisplay
                    email={record.email}
                    isVisible={showEmail[record.id]}
                    onToggle={() => onToggleEmail(record.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.firstName} {record.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.photo && (
                    <img
                      src={record.photo}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(record.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <div className="flex flex-col items-start">
                      <button
                        onClick={() => onDelete(record.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                      >
                        Delete
                      </button>
                      {deleteError && record.id.toString() === deletingId && (
                        <div className="text-red-600 text-xs mt-1">
                          {deleteError}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
