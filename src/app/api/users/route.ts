"use server";

import { NextResponse } from "next/server";
import { getUserClient } from "../../../services/userClient";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export async function GET() {
  try {
    // Use the UserClient singleton to get filtered users
    const userClient = getUserClient();
    const filteredUsers = await userClient.getFilteredUsers();

    return NextResponse.json({
      total: filteredUsers.length,
      data: filteredUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
