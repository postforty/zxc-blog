"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Post } from "../../types"; // Adjusted path
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ko") ? "ko" : "en";

  const title = post.title[lang] || post.title.ko || post.title.en;
  const rawSummary =
    post.summary?.[lang] || post.summary?.ko || post.summary?.en;

  // 마크다운 표기 제거
  const summary = rawSummary
    ?.replace(/#{1,6}\s/g, "") // 헤딩 제거
    .replace(/\*\*(.+?)\*\*/g, "$1") // 볼드 제거
    .replace(/\*(.+?)\*/g, "$1") // 이탤릭 제거
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // 링크 제거
    .replace(/`(.+?)`/g, "$1") // 인라인 코드 제거
    .replace(/~~(.+?)~~/g, "$1") // 취소선 제거
    .replace(/>\s/g, "") // 인용구 제거
    .replace(/[-*+]\s/g, "") // 리스트 마커 제거
    .replace(/\n/g, " ") // 줄바꿈을 공백으로
    .trim();

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <Card
      className="@container/card bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-start gap-2">
          <span className="flex-1">{title}</span>
          <Badge
            variant="outline"
            className="flex items-center gap-1 flex-shrink-0"
          >
            <Eye className="h-4 w-4" />
            {post.viewCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      {summary && (
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">{summary}</p>
        </CardContent>
      )}
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-sm text-gray-500">
          <span>{post.author?.name || "Unknown"}</span> &middot;{" "}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-muted-foreground">
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
                  <Badge key={tag.id} variant="outline" className="mr-1">
                    {tagName}
                  </Badge>
                );
              })}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-4 w-4" />
            {post.likes || 0}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
