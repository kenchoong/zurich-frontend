"use server";

import { headers } from "next/headers";
import axios from "axios";
import {
  BillingRecord,
  CreateBillingRecord,
  UpdateBillingRecord,
  BillingRecordFilters,
} from "../interfaces/billing";

// ============================================================
// Helper Functions
// ============================================================
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

// ============================================================
// API Functions
// ============================================================
/**
 * Create a new billing record
 */
export async function createBillingRecord(
  token: string,
  data: CreateBillingRecord
) {
  try {
    // Create the URL for the Next.js API route
    const url = new URL("/api/billing", getBaseUrl());

    const headers: Record<string, string> = {};

    let accessToken = token;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Make the request to the Next.js API route
    const response = await axios.post(url.toString(), data, { headers });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating billing record:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to create billing record"
      );
    }
    console.error("Error creating billing record:", error);
    throw error;
  }
}

/**
 * Update an existing billing record
 */
export async function updateBillingRecord(
  token: string,
  id: number,
  data: UpdateBillingRecord
) {
  try {
    // Create the URL for the Next.js API route with the ID parameter
    const url = new URL("/api/billing", getBaseUrl());
    url.searchParams.append("id", id.toString());

    const headers: Record<string, string> = {};

    let accessToken = token;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Make the request to the Next.js API route
    const response = await axios.put(url.toString(), data, { headers });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error updating billing record:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to update billing record"
      );
    }
    console.error("Error updating billing record:", error);
    throw error;
  }
}

/**
 * Delete a billing record
 */
export async function deleteBillingRecord(token: string, id: number) {
  try {
    // Create the URL for the Next.js API route with the ID parameter
    const url = new URL("/api/billing", getBaseUrl());
    url.searchParams.append("id", id.toString());

    const headers: Record<string, string> = {};

    let accessToken = token;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Make the request to the Next.js API route
    const response = await axios.delete(url.toString(), { headers });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting billing record:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to delete billing record"
      );
    }
    console.error("Error deleting billing record:", error);
    throw error;
  }
}

/**
 * Get billing records with optional filters
 */
export async function getBillingRecords(
  token: string,
  filters?: BillingRecordFilters
) {
  try {
    const url = new URL("/api/billing", getBaseUrl());

    if (filters) {
      if (filters.productCode)
        url.searchParams.append("productCode", filters.productCode);
      if (filters.location)
        url.searchParams.append("location", filters.location);
    }

    const headers: Record<string, string> = {};

    let accessToken = token;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await axios.get(url.toString(), { headers });

    return response.data.records || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching billing records:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch billing records"
      );
    }
    console.error("Error fetching billing records:", error);
    throw error;
  }
}
