"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { Heart } from "lucide-react";

interface PostViewActionsProps {
  post: Post;
  showLikeButton?: boolean;
}

export default function PostViewActions({
  post,
  showLikeButton = false,
}: PostViewActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [likes, setLikes] = useState(post.likes || 0);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from localStorage/API
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:3001/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const isAdmin = user && user.role === "Admin";

  const handleDelete = async () => {
    if (window.confirm(t("delete_confirm_message"))) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/posts/${post.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add like");
      }
      const updatedPost = await response.json();
      setLikes(updatedPost.likes ?? updatedPost.likeCount ?? 0);
    } catch (error) {
      console.error("Failed to add like:", error);
    }
  };

  if (showLikeButton) {
    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-accent"
        >
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </button>
      </div>
    );
  }

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="flex gap-4 items-center">
      <Link
        href={`/editor/${post.id}`}
        className="px-4 py-2 border rounded-md text-sm hover:bg-accent"
      >
        {t("edit")}
      </Link>
      <button
        onClick={handleDelete}
        className="px-4 py-2 border rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
      >
        {t("delete")}
      </button>
    </div>
  );
}
