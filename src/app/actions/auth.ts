"use server";

import { headers } from "next/headers";
import axios from "axios";

// ============================================================
// Helper Functions
// ============================================================
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

/**
 * Sign in with Google
 */
export async function signInWithGoogle(email: string) {
  try {
    // Create the URL for the Next.js API route
    const url = new URL("/api/auth", getBaseUrl());

    // Make the request to the Next.js API route
    const response = await axios.post(url.toString(), { email });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error signing in:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to sign in"
      );
    }
    console.error("Error signing in:", error);
    throw error;
  }
}
