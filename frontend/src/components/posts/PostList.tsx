import { useState, useMemo, useEffect } from "react";
import { usePosts } from "@/contexts/PostContext";
import PostListItem from "./PostListItem";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 6;

interface PostListProps {
  selectedTag: string | null;
  searchQuery: string;
}

export default function PostList({ selectedTag, searchQuery }: PostListProps) {
  const { posts, isLoading, error } = usePosts();
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = useMemo(() => {
    if (posts.length === 0) return [];
    let filtered = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.some(tag => tag.name === selectedTag));
    }

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [posts, selectedTag, searchQuery]);

  useEffect(() => {
    setVisiblePostsCount(POSTS_PER_PAGE);
  }, [selectedTag, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visiblePostsCount);

  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_PAGE);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
