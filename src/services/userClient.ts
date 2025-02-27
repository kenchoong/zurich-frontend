import { AxiosInstance } from "axios";
import ApiClient from "./apiClient";
import { User, UserResponse } from "@/app/interfaces/user";

/**
 * Client for interacting with the User API endpoints
 */
class UserClient {
  private static instance: UserClient | null = null;
  private apiClient: AxiosInstance;
  private baseUrl: string = "https://reqres.in/api";

  private constructor() {
    // Get the API client instance from the ApiClient singleton
    this.apiClient = ApiClient.getInstance().getClient();
  }

  /**
   * Get the singleton instance of UserClient
   */
  public static getInstance(): UserClient {
    if (!UserClient.instance) {
      UserClient.instance = new UserClient();
    }
    return UserClient.instance;
  }

  /**
   * Get all users from all pages
   */
  public async getAllUsers(): Promise<User[]> {
    try {
      const allUsers: User[] = [];

      // Get the first page to determine total pages
      const firstPageResponse = await this.apiClient.get<UserResponse>(
        `${this.baseUrl}/users`
      );
      allUsers.push(...firstPageResponse.data.data);

      // Fetch remaining pages if any
      const totalPages = firstPageResponse.data.total_pages;
      for (let page = 2; page <= totalPages; page++) {
        const response = await this.apiClient.get<UserResponse>(
          `${this.baseUrl}/users?page=${page}`
        );
        allUsers.push(...response.data.data);
      }

      return allUsers;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  /**
   * Get users filtered by first name starting with 'G' or last name starting with 'W'
   */
  public async getFilteredUsers(): Promise<User[]> {
    try {
      const allUsers = await this.getAllUsers();

      // Filter users whose first name starts with 'G' or last name starts with 'W'
      return allUsers.filter(
        (user) =>
          user.first_name.startsWith("G") || user.last_name.startsWith("W")
      );
    } catch (error) {
      console.error("Error fetching filtered users:", error);
      throw error;
    }
  }

  /**
   * Get a single user by ID
   */
  public async getUserById(id: number): Promise<User> {
    try {
      const response = await this.apiClient.get<{ data: User }>(
        `${this.baseUrl}/users/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }
}

// Helper function to get the User client instance
export function getUserClient(): UserClient {
  return UserClient.getInstance();
}

export default UserClient;
