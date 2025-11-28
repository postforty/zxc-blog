"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { TableOfContents, Heading } from "./TableOfContents";

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

  // heading 추출
  const [headings, setHeadings] = useState<Heading[]>([]);

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
    console.log("Extracted headings:", extractedHeadings);
    setHeadings(extractedHeadings);
  }, [content]);

  return (
    <div className="container mx-auto px-4 py-8 flex gap-8">
      <article className="prose dark:prose-invert max-w-none flex-1 min-w-0">
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
      </article>
      <aside className="w-64 flex-shrink-0">
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}
