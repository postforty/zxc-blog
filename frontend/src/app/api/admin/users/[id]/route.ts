import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      headers: { Authorization: token || "" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch user" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");
    const body = await request.json();

    console.log("PUT request to backend:", {
      url: `${BACKEND_URL}/api/admin/users/${id}`,
      body,
      token: token,
    });

    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("Backend response:", {
      status: response.status,
      body: responseText,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }
      console.error("Backend error:", errorData);
      return NextResponse.json(
        {
          error:
            errorData.message || errorData.error || "Failed to update user",
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log("Backend success:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");
    const response = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: token || "" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to delete user" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
