import { Link } from "react-router-dom";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          <Link to={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{post.summary}</p>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-500">
          <span>{post.author}</span> &middot; <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
