import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchBillingRecords } from '../store/billingSlice';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, loading, error } = useSelector((state: RootState) => state.billing);
  const [showEmail, setShowEmail] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    dispatch(fetchBillingRecords());
  }, [dispatch]);

  const filteredRecords = records.filter(
    record =>
      record.firstName.startsWith('G') || record.lastName.startsWith('W')
  );

  const toggleEmail = (id: number) => {
    setShowEmail(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Filtered Billing Records</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-center">
              {record.firstName} {record.lastName}
            </h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-600 text-center">
                {showEmail[record.id] ? record.email : maskEmail(record.email)}
              </p>
              <p className="text-gray-600 text-center">
                Amount: {formatAmount(record.premiumPaidAmount / 100)}
              </p>
              <p className="text-gray-600 text-center">
                Created: {formatDate(record.createdAt)}
              </p>
              <p className="text-gray-600 text-center">
                Location: {record.location}
              </p>
              <div className="text-center">
                <button
                  onClick={() => toggleEmail(record.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {showEmail[record.id] ? 'Hide Email' : 'Show Email'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
