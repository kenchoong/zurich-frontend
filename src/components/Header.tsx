'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, email } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold tracking-tight">Zurich Customer Portal</h1>
        {isAuthenticated && (
          <div className="flex items-center gap-6">
            <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
              {email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
