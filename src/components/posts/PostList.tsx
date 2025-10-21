import { usePosts } from "@/contexts/PostContext";
import PostListItem from "./PostListItem";
import { Post } from "@/types";

export default function PostList() {
  const { posts } = usePosts();
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sortedPosts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  );
}
