"use client";

import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { usePost } from "../../../../hooks/usePost";
import PostView from "../../../../components/posts/PostView";
import CommentList from "../../../../components/comments/CommentList";
import CommentForm from "../../../../components/comments/CommentForm";
import PostNavigationBar from "../../../../components/posts/PostNavigationBar";

export default function PostDetailPageClient() {
  const { t } = useTranslation();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { post, isLoading, error } = usePost(id);

  if (isLoading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>{t("post_not_found")}</div>;
  }

  // TODO: Implement logic for prevPost and nextPost based on fetched post data
  const prevPost = undefined;
  const nextPost = undefined;

  return (
    <div>
      <PostView post={post} />
      <PostNavigationBar prevPost={prevPost} nextPost={nextPost} />
      <CommentList postId={post.id} />
      <CommentForm postId={post.id} />
    </div>
  );
}
