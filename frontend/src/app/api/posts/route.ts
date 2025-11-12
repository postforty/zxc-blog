import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/posts`);

    if (!response.ok) {
      throw new Error("Failed to fetch posts from backend");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);

    // Return mock data if backend is not available
    const mockData = [
      {
        id: 1,
        title: { ko: "첫 번째 포스트", en: "First Post" },
        content: { ko: "내용", en: "Content" },
        author: { name: "Admin" },
        createdAt: "2025-11-10T10:00:00Z",
        likes: 5,
        viewCount: 100,
      },
    ];

    return NextResponse.json(mockData);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
