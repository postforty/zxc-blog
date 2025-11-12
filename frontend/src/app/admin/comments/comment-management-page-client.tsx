"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom's useNavigate
import { useTranslation } from "react-i18next";

interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
  postId: string;
  post: {
    title: {
      ko: string;
      en: string;
    };
  };
}

const CommentManagementPageClient = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Changed from useNavigate
  const { i18n } = useTranslation();
  const currentLang = i18n.language as "ko" | "en";

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/comments/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== commentId)
      );
    } catch (err: any) {
      console.error(err);
      alert("Error deleting comment");
    }
  };

  const handleRowClick = (postId: string) => {
    router.push(`/posts/${postId}`); // Changed from navigate
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Comment Management</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Post Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow
                key={comment.id}
                onClick={() => handleRowClick(comment.postId)}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <TableCell className="font-medium">
                  {comment.author.name}
                </TableCell>
                <TableCell>{comment.content}</TableCell>
                <TableCell>
                  {comment.post?.title?.[currentLang] ||
                    comment.post?.title?.ko ||
                    comment.post?.title?.en ||
                    "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {" "}
                  {/* Stop propagation to prevent row click */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommentManagementPageClient;
