import { useState, useEffect, useRef } from "react";
import { Post } from "@/types";

export const usePost = (id: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewCountedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        // Map likeCount to likes
        const mappedData = {
          ...data,
          likes: data.likes ?? data.likeCount ?? 0,
        };
        setPost(mappedData);

        // Increment view count only once
        if (!viewCountedRef.current) {
          viewCountedRef.current = true;
          try {
            await fetch(`http://localhost:3001/api/posts/${id}/view`, {
              method: "POST",
            });
          } catch (viewError) {
            console.error("Failed to increment view count:", viewError);
            // Don't throw error - view count increment failure shouldn't break the page
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, isLoading, error };
};
