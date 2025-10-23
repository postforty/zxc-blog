import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ko') ? 'ko' : 'en';

  const title = post.title[lang] || post.title.ko;
  const summary = post.summary ? (post.summary[lang] || post.summary.ko) : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          <Link to={`/posts/${post.id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{summary}</p>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">
          <span>{post.author}</span> &middot; <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
