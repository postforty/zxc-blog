import { useParams } from "react-router-dom";
import { usePosts } from "@/contexts/PostContext";
import PostView from "@/components/posts/PostView";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { posts } = usePosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <PostView post={post} />
      <CommentList postId={post.id} />
      <CommentForm postId={post.id} />
    </div>
  );
}
