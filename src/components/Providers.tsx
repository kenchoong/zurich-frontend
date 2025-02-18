'use client';

import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from '../store/store';
import { useRef, useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log('Environment variables:', {
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    });
    setClientId(id || null);
  }, []);

  if (typeof window !== 'undefined' && !storeRef.current) {
    storeRef.current = store;
  }

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Configuration Error</h1>
          <p>Google OAuth Client ID is not configured.</p>
          <p className="mt-2 text-sm text-gray-600">Please check your environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={storeRef.current}>{children}</Provider>
    </GoogleOAuthProvider>
  );
}
