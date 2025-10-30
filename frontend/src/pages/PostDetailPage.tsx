import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePosts } from "@/contexts/PostContext";
import PostView from "@/components/posts/PostView";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import PostNavigationBar from "@/components/posts/PostNavigationBar";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { posts } = usePosts();

  const sortedPosts = [...posts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const postIndex = sortedPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return <div>{t('post_not_found')}</div>;
  }

  const post = sortedPosts[postIndex];
  const prevPost = postIndex > 0 ? sortedPosts[postIndex - 1] : undefined;
  const nextPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : undefined;

  return (
    <div>
      <PostView post={post} />
      <PostNavigationBar prevPost={prevPost} nextPost={nextPost} />
      <CommentList postId={post.id} />
      <CommentForm postId={post.id} />
    </div>
  );
}
