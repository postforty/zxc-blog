"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface PostViewServerProps {
  post: Post;
}

export default function PostViewServer({ post }: PostViewServerProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language.startsWith("ko") ? "ko" : "en") as "ko" | "en";

  const title = post.title[lang] || post.title.ko || post.title.en;
  const content = post.content[lang] || post.content.ko || post.content.en;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center text-sm text-gray-500">
          <span>{post.author?.name}</span> &middot;{" "}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewCount}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags
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
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
