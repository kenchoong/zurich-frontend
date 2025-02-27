import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import ApiClient from "../../../services/apiClient";

// Helper function to mask email - kept server-side only
function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  const maskedLocal =
    localPart.charAt(0) +
    "*".repeat(localPart.length - 2) +
    localPart.charAt(localPart.length - 1);
  return `${maskedLocal}@${domain}`;
}

/**
 * GET handler for billing records
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get("productCode");
    const location = searchParams.get("location");
    const showEmails = searchParams.get("showEmails") === "true";

    // Extract the authorization token from the request headers
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader ? authHeader.replace("Bearer ", "") : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    // Get API client with the custom token
    const apiClient = ApiClient.getInstance().getClient(accessToken);

    // Build query parameters
    const params: Record<string, string> = {};
    if (productCode) params.productCode = productCode;
    if (location) params.location = location;

    // Make API request
    const response = await apiClient.get("/billing", { params });
    let records = response.data;

    // Create a map to store original emails by record ID
    const originalEmails: Record<number, string> = {};
    
    // Store original emails before masking
    records.forEach((record: any) => {
      originalEmails[record.id] = record.email;
    });

    // Mask emails server-side and format data
    records = records.map((record: any) => ({
      ...record,
      email: showEmails ? originalEmails[record.id] : maskEmail(record.email),
      premiumPaidAmount: Number(record.premiumPaidAmount) / 100,
    }));

    return NextResponse.json({ records, originalEmails: showEmails ? originalEmails : undefined });
  } catch (error: any) {
    console.error("Error in GET /api/billing-records:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * POST handler for creating a billing record
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Extract the authorization token from the request headers
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader ? authHeader.replace("Bearer ", "") : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    const apiClient = ApiClient.getInstance().getClient(accessToken);

    const response = await apiClient.post("/billing", {
      productId: data.productCode,
      location: data.location,
      premiumPaidAmount: data.premiumPaid * 100, // Convert to cents
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      photo: data.photo,
    });

    // Mask email in response and format data
    const record = response.data;
    console.log(record);
    record.email = maskEmail(record.email);
    record.premiumPaidAmount = Number(record.premiumPaidAmount) / 100;

    return NextResponse.json({ record });
  } catch (error: any) {
    console.error("Error in POST /api/billing-records:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * PUT handler for updating a billing record
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();

    // Extract the authorization token from the request headers
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader ? authHeader.replace("Bearer ", "") : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    const apiClient = ApiClient.getInstance().getClient(accessToken);

    const response = await apiClient.put(`/billing?id=${id}`, {
      location: data.location,
      premiumPaidAmount: data.premiumPaid * 100, // Convert to cents
      ...(data.email && { email: data.email }),
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.photo && { photo: data.photo }),
    });

    // Mask email in response and format data
    const record = response.data;
    record.email = maskEmail(record.email);
    record.premiumPaidAmount = Number(record.premiumPaidAmount) / 100;

    return NextResponse.json({ record });
  } catch (error: any) {
    console.error("Error in PUT /api/billing-records:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * DELETE handler for removing a billing record
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Extract the authorization token from the request headers
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader ? authHeader.replace("Bearer ", "") : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    const apiClient = ApiClient.getInstance().getClient(accessToken);

    const response = await apiClient.delete(`/billing?id=${id}`);

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/billing-records:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}
