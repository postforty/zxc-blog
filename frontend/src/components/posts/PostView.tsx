import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Post } from "@/types";
import { usePosts } from '@/contexts/PostContext';
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";

interface PostViewProps {
  post: Post;
}

export default function PostView({ post }: PostViewProps) {
  const { t, i18n } = useTranslation();
  const { deletePost, addLike } = usePosts();
  const navigate = useNavigate();

  const lang = i18n.language.startsWith('ko') ? 'ko' : 'en';
  const title = post.title[lang] || post.title.ko;
  const content = post.content[lang] || post.content.ko;

  const handleDelete = () => {
    if (window.confirm(t('delete_confirm_message'))) {
      deletePost(post.id);
      navigate('/');
    }
  };

  const handleLike = () => {
    addLike(post.id);
  };

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center text-sm text-gray-500">
          <span>{post.author}</span> &middot; <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewCount}
          </Badge>
        </div>
        <div className="flex gap-4 items-center">
          <Link to={`/editor/${post.id}`} className="px-4 py-2 border rounded-md text-sm">{t('edit')}</Link>
          <button onClick={handleDelete} className="px-4 py-2 border rounded-md text-sm bg-red-600 text-white hover:bg-red-700">{t('delete')}</button>
        </div>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      <div className="flex justify-center mt-8">
        <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm">
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </button>
      </div>
    </article>
  );
}
