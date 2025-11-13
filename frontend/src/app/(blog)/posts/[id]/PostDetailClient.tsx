"use client";

import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";

interface PostDetailClientProps {
  postId: string;
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
  return (
    <>
      <CommentList postId={postId} />
      <CommentForm postId={postId} />
    </>
  );
}
