"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { checkAuth } from "../store/authSlice";
import Header from "./Header";
import Footer from "./Footer";
import LoginScreen from "./LoginScreen";
import BillingRecords from "./BillingRecords";
import FilteredUsers from "./FilteredUsers";

export function MainContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await dispatch(checkAuth());
      setIsInitialized(true);
    };
    initializeAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {isAuthenticated ? (
          <div className="space-y-8 p-6">
            <FilteredUsers />
            <div className="border-t border-gray-200 pt-8">
              <BillingRecords />
            </div>
          </div>
        ) : (
          <LoginScreen />
        )}
      </main>
      <Footer />
    </div>
  );
}
