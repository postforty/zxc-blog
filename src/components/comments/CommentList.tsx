import { useComments } from "@/contexts/CommentContext";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { getComments } = useComments();
  const comments = getComments(postId);

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">댓글 ({comments.length})</h3>
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="border-t pt-6">
            <p className="font-semibold">{comment.author}</p>
            <p className="text-sm text-gray-500 mb-2">{new Date(comment.createdAt).toLocaleString()}</p>
            <p>{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500">아직 댓글이 없습니다.</p>}
      </div>
    </section>
  );
}
