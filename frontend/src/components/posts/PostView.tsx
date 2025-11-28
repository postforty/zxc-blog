"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import { TableOfContents, Heading } from "./TableOfContents";

interface PostViewProps {
  post: Post;
}

export default function PostView({ post }: PostViewProps) {
  console.log("PostView rendered"); // Debug log
  const { t, i18n } = useTranslation();
  const { deletePost } = usePosts();
  const { user } = useAuth(); // Get user from useAuth
  const router = useRouter();
  const [currentPost, setCurrentPost] = useState(post);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const [headings, setHeadings] = useState<Heading[]>([]);

  const lang = i18n.language.startsWith("ko") ? "ko" : "en";
  const title =
    currentPost.title[lang] || currentPost.title.ko || currentPost.title.en;
  
  // HTML 엔티티 디코딩 함수
  const decodeHtmlEntities = (text: string) => {
    if (typeof window === 'undefined') return text; // SSR check
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };
  
  const rawContent =
    currentPost.content[lang] ||
    currentPost.content.ko ||
    currentPost.content.en;
  
  const content = decodeHtmlEntities(rawContent);

  useEffect(() => {
    const extractedHeadings: Heading[] = [];
    
    // 코드 블록을 제거한 콘텐츠 생성 (``` 로 감싸진 부분 제거)
    const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
    
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/[*_~`]/g, ""); // Remove basic markdown syntax
      const id = text
        .toLowerCase()
        .replace(/[^\w\uAC00-\uD7A3]+/g, "-")
        .replace(/^-+|-+$/g, "");
      extractedHeadings.push({ id, text, level });
    }
    console.log("Extracted headings:", extractedHeadings); // Debug log
    setHeadings(extractedHeadings);
  }, [content]);

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
    <div className="container mx-auto px-4 py-8 flex gap-8">
      <article className="prose dark:prose-invert max-w-none flex-1 min-w-0">
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
          {currentPost.tags
            ?.filter((tag) => {
              const tagName =
                typeof tag.name === "object" ? tag.name[lang] : tag.name;
              return tagName && tagName.trim() !== "";
            })
            .map((tag) => {
              const tagName =
                typeof tag.name === "object" ? tag.name[lang] : tag.name;
              return (
                <Badge key={tag.id} variant="secondary">
                  {tagName}
                </Badge>
              );
            })}
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          skipHtml={false}
          components={{
            code: ({ node, inline, className, children, ...props }: any) => {
              // className이 없으면 인라인 코드
              if (!className) {
                return (
                  <code className="px-1.5 py-0.5 rounded bg-muted font-mono" {...props}>
                    {children}
                  </code>
                );
              }
              // className이 있으면 코드 블록
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ node, ...props }) => {
              const getText = (children: any): string => {
                if (typeof children === "string") return children;
                if (Array.isArray(children)) return children.map(getText).join("");
                if (children?.props?.children) return getText(children.props.children);
                return "";
              };
              const text = getText(props.children);
              const id = text
                .toLowerCase()
                .replace(/[^\w\uAC00-\uD7A3]+/g, "-")
                .replace(/^-+|-+$/g, "");
              return <h1 id={id} {...props} />;
            },
            h2: ({ node, ...props }) => {
              const getText = (children: any): string => {
                if (typeof children === "string") return children;
                if (Array.isArray(children)) return children.map(getText).join("");
                if (children?.props?.children) return getText(children.props.children);
                return "";
              };
              const text = getText(props.children);
              const id = text
                .toLowerCase()
                .replace(/[^\w\uAC00-\uD7A3]+/g, "-")
                .replace(/^-+|-+$/g, "");
              return <h2 id={id} {...props} />;
            },
            h3: ({ node, ...props }) => {
              const getText = (children: any): string => {
                if (typeof children === "string") return children;
                if (Array.isArray(children)) return children.map(getText).join("");
                if (children?.props?.children) return getText(children.props.children);
                return "";
              };
              const text = getText(props.children);
              const id = text
                .toLowerCase()
                .replace(/[^\w\uAC00-\uD7A3]+/g, "-")
                .replace(/^-+|-+$/g, "");
              return <h3 id={id} {...props} />;
            },
          }}
        >
          {content}
        </ReactMarkdown>
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
      <aside className="w-64 flex-shrink-0">
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}
