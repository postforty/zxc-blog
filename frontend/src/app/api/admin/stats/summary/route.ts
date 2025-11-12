import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const response = await fetch(`${BACKEND_URL}/api/admin/stats/summary`, {
      headers: { Authorization: token || "" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch summary from backend");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
