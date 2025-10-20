import { usePosts } from "@/contexts/PostContext";
import PostListItem from "./PostListItem";

// Post 타입 정의는 PostContext 또는 별도 types 파일로 이동하는 것이 좋지만, 우선 유지합니다.
export interface Post {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  summary?: string;
  content: string;
}

export default function PostList() {
  const { posts } = usePosts();
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8">
      {sortedPosts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  );
}
