import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";

interface PostViewProps {
  post: Post;
}

export default function PostView({ post }: PostViewProps) {
  const { t, i18n } = useTranslation();
  const { deletePost } = usePosts();
  const { user } = useAuth(); // Get user from useAuth
  const router = useRouter();
  const [currentPost, setCurrentPost] = useState(post);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const lang = i18n.language.startsWith("ko") ? "ko" : "en";
  const title =
    currentPost.title[lang] || currentPost.title.ko || currentPost.title.en;
  const content =
    currentPost.content[lang] ||
    currentPost.content.ko ||
    currentPost.content.en;

  const handleDelete = () => {
    if (window.confirm(t("delete_confirm_message"))) {
      deletePost(currentPost.id);
      router.push("/");
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/posts/${currentPost.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add like");
      }
      const updatedPost = await response.json();
      // Map likeCount to likes and update local state while preserving existing data
      setCurrentPost({
        ...currentPost,
        ...updatedPost,
        likes: updatedPost.likes ?? updatedPost.likeCount ?? 0,
        author: currentPost.author, // Preserve author info
        tags: currentPost.tags, // Preserve tags info
      });
    } catch (error) {
      console.error("Failed to add like:", error);
    }
  };

  const isAdmin = user && user.role === "Admin"; // Check if user is admin

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center text-sm text-gray-500">
          <span>{currentPost.author?.name}</span> &middot;{" "}
          <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {currentPost.viewCount}
          </Badge>
        </div>
        {isAdmin && ( // Conditionally render edit/delete buttons
          <div className="flex gap-4 items-center">
            <Link
              href={`/editor/${currentPost.id}`}
              className="px-4 py-2 border rounded-md text-sm"
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
      </div>
      {/* Add this section to display tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {currentPost.tags?.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm"
        >
          <Heart className="h-4 w-4" />
          <span>{currentPost.likes || 0}</span>
        </button>
      </div>
    </article>
  );
}
