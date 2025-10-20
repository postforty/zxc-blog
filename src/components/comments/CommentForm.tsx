import { useState } from 'react';
import { useComments } from '@/contexts/CommentContext';

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
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md bg-transparent"
          rows={4}
          placeholder="댓글을 입력하세요..."
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          등록
        </button>
      </form>
    </section>
  );
}
