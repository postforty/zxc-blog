import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Post } from "./PostList";
import { usePosts } from '@/contexts/PostContext';

interface PostViewProps {
  post: Post;
}

export default function PostView({ post }: PostViewProps) {
  const { t } = useTranslation();
  const { deletePost } = usePosts();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(t('delete_confirm_message'))) {
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
          <Link to={`/editor/${post.id}`} className="px-4 py-2 border rounded-md text-sm">{t('edit')}</Link>
          <button onClick={handleDelete} className="px-4 py-2 border rounded-md text-sm bg-red-600 text-white hover:bg-red-700">{t('delete')}</button>
        </div>
      </div>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
