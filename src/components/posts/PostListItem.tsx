import { Link } from "react-router-dom";
import { Post } from "./PostList";

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <article>
      <h3 className="text-2xl font-bold mb-2">
        <Link to={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="text-muted-foreground mb-4">{post.summary}</p>
      <div className="text-sm text-gray-500">
        <span>{post.author}</span> &middot; <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </article>
  );
}
