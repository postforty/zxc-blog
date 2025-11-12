import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");

    console.log("PATCH deactivate request:", {
      url: `${BACKEND_URL}/api/admin/users/${id}/deactivate`,
    });

    const response = await fetch(
      `${BACKEND_URL}/api/admin/users/${id}/deactivate`,
      {
        method: "PATCH",
        headers: { Authorization: token || "" },
      }
    );

    const responseText = await response.text();
    console.log("Deactivate response:", {
      status: response.status,
      body: responseText.substring(0, 200),
    });

    if (!response.ok) {
      // Backend endpoint doesn't exist (404) or other error
      return NextResponse.json(
        { error: "Deactivate endpoint not available on backend" },
        { status: 501 }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: "User deactivated" };
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
