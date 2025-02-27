import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import https from "https";

/**
 * Singleton API Client for making authenticated HTTP requests
 */
class ApiClient {
  private static instance: ApiClient | null = null;
  private client: AxiosInstance | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Get the singleton instance of ApiClient
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Initialize or get the axios client with authentication
   * @param customToken Optional token to override the default token from cookies
   */
  public getClient(customToken?: string): AxiosInstance {
    if (!this.client || customToken) {
      let accessToken = customToken;

      // Use host.docker.internal for server-side API calls
      const baseURL = typeof window === 'undefined' 
        ? 'http://host.docker.internal:3337'
        : process.env.NEXT_PUBLIC_API_URL;

      this.client = axios.create({
        baseURL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
    }
    return this.client;
  }

  /**
   * Reset the client instance (useful for testing or when token changes)
   */
  public resetClient(): void {
    this.client = null;
  }
}

/**
 * Helper function to get the API client instance
 */
export function getApiClient(): AxiosInstance {
  return ApiClient.getInstance().getClient();
}

/**
 * Helper function to reset the API client
 */
export function resetApiClient(): void {
  return ApiClient.getInstance().resetClient();
}

export default ApiClient;
