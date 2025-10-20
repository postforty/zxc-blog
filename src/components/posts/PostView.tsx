import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from "./PostList";
import { usePosts } from '@/contexts/PostContext';

interface PostViewProps {
  post: Post;
}

export default function PostView({ post }: PostViewProps) {
  const { deletePost } = usePosts();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      deletePost(post.id);
      navigate('/');
    }
  };

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-gray-500">
          <span>{post.author}</span> &middot; <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-4">
          <Link to={`/editor/${post.id}`} className="px-4 py-2 border rounded-md text-sm">수정</Link>
          <button onClick={handleDelete} className="px-4 py-2 border rounded-md text-sm bg-red-600 text-white hover:bg-red-700">삭제</button>
        </div>
      </div>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
