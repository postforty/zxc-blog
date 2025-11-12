import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    // First, get the current user data
    const getUserResponse = await fetch(
      `${BACKEND_URL}/api/admin/users/${params.id}`,
      {
        headers: { Authorization: token || "" },
      }
    );

    if (!getUserResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: getUserResponse.status }
      );
    }

    const userData = await getUserResponse.json();

    // Update user with new role
    const response = await fetch(
      `${BACKEND_URL}/api/admin/users/${params.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          role: body.role,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to update role" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
