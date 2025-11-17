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
  addPost: (post: any) => void; // 타입을 유연하게 변경
  updatePost: (post: any) => void; // 타입을 유연하게 변경
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

  const addPost = async (post: any) => {
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

  const updatePost = async (updatedPost: any) => {
    try {
      const token = localStorage.getItem("token");

      // tags 형태 확인 및 변환
      let tagsToSend = updatedPost.tags;
      if (tagsToSend && tagsToSend.length > 0) {
        // tags가 { id, name } 형태인지 { ko, en } 형태인지 확인
        if (tagsToSend[0].name) {
          // { id, name } 형태 -> name만 추출
          tagsToSend = tagsToSend.map((t: any) => t.name);
        }
        // 이미 { ko, en } 형태면 그대로 사용
      }

      // 백엔드가 기대하는 형태로 데이터 변환
      const updateData = {
        title: updatedPost.title,
        content: updatedPost.content,
        summary: updatedPost.summary,
        tags: tagsToSend,
      };

      console.log("PostContext - Sending update data:", updateData);

      const response = await fetch(`/api/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update post error response:", errorData);
        throw new Error(`Failed to update post: ${JSON.stringify(errorData)}`);
      }
      const newPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === newPost.id ? newPost : post))
      );
    } catch (err: any) {
      console.error("Update post error:", err);
      setError(err.message);
      throw err;
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
