import { useComments } from "@/contexts/CommentContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{comment.author}</p>
                <p className="text-sm text-muted-foreground mb-2">{new Date(comment.createdAt).toLocaleString()}</p>
                <p className="prose dark:prose-invert">{comment.content}</p>
              </div>
            </div>
            {index < comments.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        {comments.length === 0 && <p className="text-muted-foreground">아직 댓글이 없습니다.</p>}
      </div>
    </section>
  );
}
