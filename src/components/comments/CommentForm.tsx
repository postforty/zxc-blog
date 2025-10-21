import { useState } from 'react';
import { useComments } from '@/contexts/CommentContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const { addComment } = useComments();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addComment({
      postId,
      author: 'Guest', // TODO: Implement user authentication
      content,
    });

    setContent('');
  };

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold mb-4">댓글 작성</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="댓글을 입력하세요..."
          required
        />
        <Button type="submit">등록</Button>
      </form>
    </section>
  );
}
