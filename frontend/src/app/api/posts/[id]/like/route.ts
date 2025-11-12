import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/posts/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: token || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add like");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add like" }, { status: 500 });
  }
}
