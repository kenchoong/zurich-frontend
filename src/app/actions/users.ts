"use server";
import { getUserClient } from "../../services/userClient";

export async function getFilteredUsers() {
  try {
    // Use the UserClient singleton to get filtered users
    const userClient = getUserClient();
    const filteredUsers = await userClient.getFilteredUsers();

    return { data: filteredUsers };
  } catch (error) {
    console.error("Error fetching filtered users:", error);
    throw error;
  }
}
