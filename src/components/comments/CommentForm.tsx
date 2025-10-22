import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useComments } from '@/contexts/CommentContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  postId: string;
  parentId?: string; // 대댓글 작성을 위한 부모 댓글 ID
  onCommentAdded?: () => void; // 댓글 추가 후 호출될 콜백
}

export default function CommentForm({ postId, parentId, onCommentAdded }: CommentFormProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const { addComment } = useComments();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addComment({
      postId,
      author: 'Guest', // TODO: Implement user authentication
      content,
      parentId, // parentId 전달
    });

    setContent('');
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

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
