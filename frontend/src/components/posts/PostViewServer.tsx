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
  
  // HTML 엔티티 디코딩 함수
  const decodeHtmlEntities = (text: string) => {
    if (typeof window === 'undefined') return text; // SSR 환경에서는 디코딩 스킵
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };
  
  const rawContent = post.content[lang] || post.content.ko || post.content.en;
  const content = decodeHtmlEntities(rawContent);
  
  // 디버깅
  console.log('Content first 200:', content.substring(0, 200));

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
        skipHtml={false}
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            console.log('Code component called:', { inline, className, children });
            // className이 없으면 인라인 코드 (language-xxx 같은 클래스가 없음)
            if (!className) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono" {...props}>
                  {children}
                </code>
              );
            }
            // className이 있으면 코드 블록 (```python 같은 경우)
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
