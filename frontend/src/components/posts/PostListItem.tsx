"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Post } from "../../types"; // Adjusted path
import {
  Card,
  CardAction,
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
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ko") ? "ko" : "en";

  const title = post.title[lang] || post.title.ko || post.title.en;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewCount}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-sm text-gray-500">
          <span>{post.author?.name || "Unknown"}</span> &middot;{" "}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-muted-foreground">
            {post.tags?.map((tag) => (
              <Badge key={tag.id} variant="outline" className="mr-1">
                {tag.name}
              </Badge>
            ))}
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
