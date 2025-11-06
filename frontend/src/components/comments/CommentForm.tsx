import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useComments } from '@/contexts/CommentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

interface CommentFormProps {
  postId: string;
  parentId?: string; // 대댓글 작성을 위한 부모 댓글 ID
  onCommentAdded?: () => void; // 댓글 추가 후 호출될 콜백
}

export default function CommentForm({ postId, parentId, onCommentAdded }: CommentFormProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const { addComment } = useComments();
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isAuthenticated) return;

    await addComment(content, postId, parentId);

    setContent('');
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-8 text-center">
        <p>Please <Link to="/profile" className="underline">log in</Link> to write a comment.</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold mb-4">{t('write_comment')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder={t('comment_placeholder')}
          required
        />
        <Button type="submit">{t('submit_comment')}</Button>
      </form>
    </section>
  );
}
