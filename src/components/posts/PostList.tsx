import { useState, useMemo } from "react";
import { usePosts } from "@/contexts/PostContext";
import PostListItem from "./PostListItem";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 6;

interface PostListProps {
  selectedTag: string | null;
}

export default function PostList({ selectedTag }: PostListProps) {
  const { posts } = usePosts();
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (!selectedTag) {
      return sorted;
    }
    return sorted.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  const visiblePosts = filteredPosts.slice(0, visiblePostsCount);

  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_PAGE);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>
      {visiblePostsCount < filteredPosts.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore}>더 보기</Button>
        </div>
      )}
    </div>
  );
}
