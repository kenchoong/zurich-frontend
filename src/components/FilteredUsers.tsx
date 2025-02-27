'use client';

import React, { useEffect, useState } from 'react';
import { getFilteredUsers } from '@/app/actions/users';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const FilteredUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getFilteredUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Filtered Users</h2>
      <p className="mb-4 text-gray-600">
        Showing users with first name starting with "G" or last name starting with "W"
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar} 
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No users found matching the filter criteria
        </div>
      )}
    </div>
  );
};

export default FilteredUsers;
