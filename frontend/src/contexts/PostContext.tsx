"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Post } from "../types"; // Adjusted path
import { useAuth } from "./AuthContext"; // Adjusted path

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  addPost: (
    post: Omit<Post, "id" | "createdAt" | "likes" | "viewCount">
  ) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  addLike: (id: string) => void;
  refetch: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      console.log("Posts data from API:", data);
      // Map likeCount to likes if needed
      const mappedData = data.map((post: any) => ({
        ...post,
        likes: post.likes ?? post.likeCount ?? 0,
      }));
      setPosts(mappedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (
    post: Omit<Post, "id" | "createdAt" | "likes" | "viewCount">
  ) => {
    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...post, authorId: user.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to add post");
      }
      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      const newPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === newPost.id ? newPost : post))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== parseInt(id, 10))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addLike = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add like");
      }
      const updatedPost = await response.json();
      // Map likeCount to likes
      const mappedPost = {
        ...updatedPost,
        likes: updatedPost.likes ?? updatedPost.likeCount ?? 0,
      };
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === mappedPost.id ? mappedPost : post))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        error,
        addPost,
        updatePost,
        deletePost,
        addLike,
        refetch: fetchPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
