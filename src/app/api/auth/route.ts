import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * POST handler for sign-in
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Make API request to the backend
    const response = await axios.post(
      "http://host.docker.internal:3337/sign-in",
      data
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error in POST /api/auth:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}
