import { notFound } from "next/navigation";
import { Metadata } from "next";
import PostViewServer from "@/components/posts/PostViewServer";
import PostNavigationBar from "@/components/posts/PostNavigationBar";
import PostDetailClient from "./PostDetailClient";
import PostInteractions from "./PostInteractions";
import { Post } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts/${id}`, {
      cache: "no-store", // 항상 최신 데이터 가져오기
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return {
      ...data,
      likes: data.likes ?? data.likeCount ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

// 조회수 증가 (서버 사이드에서 처리)
async function incrementViewCount(id: string) {
  try {
    await fetch(`${API_URL}/api/posts/${id}/view`, {
      method: "POST",
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = post.title.ko || post.title.en || "Untitled";
  const summary = post.summary?.ko || post.summary?.en || "";

  return {
    title: title,
    description: summary,
    openGraph: {
      title: title,
      description: summary,
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.author?.name || "Unknown"],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  // 조회수 증가
  await incrementViewCount(id);

  // TODO: 이전/다음 게시글 로직 구현
  const prevPost = undefined;
  const nextPost = undefined;

  return (
    <div>
      <PostViewServer post={post} />
      <PostInteractions post={post} />
      <PostNavigationBar prevPost={prevPost} nextPost={nextPost} />
      <PostDetailClient postId={post.id.toString()} />
    </div>
  );
}
