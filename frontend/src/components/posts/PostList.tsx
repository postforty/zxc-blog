import { useState, useMemo, useEffect } from "react";
import PostListItem from "./PostListItem";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 6;

interface PostListProps {
  posts: any[]; // Add posts prop
  selectedTag: string | null;
  searchQuery: string;
}

export default function PostList({ posts, selectedTag, searchQuery }: PostListProps) {
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

  // No longer need isLoading and error from usePosts, handle them in HomePage if necessary
  if (posts.length === 0 && !searchQuery && !selectedTag) {
    return <div>게시물이 없습니다.</div>; // Or a more appropriate message
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