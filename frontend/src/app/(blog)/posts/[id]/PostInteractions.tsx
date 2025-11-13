"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { Heart } from "lucide-react";

interface PostInteractionsProps {
  post: Post;
}

export default function PostInteractions({ post }: PostInteractionsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [likes, setLikes] = useState(post.likes || 0);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  return (
    <>
      {!isLoading && isAdmin && (
        <div className="flex justify-end gap-4 items-center mb-4">
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
      )}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-accent"
        >
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </button>
      </div>
    </>
  );
}
