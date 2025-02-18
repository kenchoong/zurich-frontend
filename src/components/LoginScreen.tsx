"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { signInWithGoogle } from "../store/authSlice";
import { GoogleLogin } from "@react-oauth/google";

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleSuccess = (credentialResponse: any) => {
    dispatch(signInWithGoogle(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    console.error("Google Sign In Failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Zurich Portal
          </h2>
          <p className="text-gray-600">
            Please sign in with your Google account
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            shape="pill"
            size="large"
            auto_select
            ux_mode="popup"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
