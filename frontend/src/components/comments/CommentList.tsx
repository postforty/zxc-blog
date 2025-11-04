import { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useComments } from "@/contexts/CommentContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types";
import CommentForm from "./CommentForm";

interface CommentListProps {
  postId: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
}

const CommentItem = ({ comment, onReply }: CommentItemProps) => {
  const { t } = useTranslation();
  const { updateComment } = useComments();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleUpdate = async () => {
    if (editedContent.trim() !== comment.content) {
      await updateComment(comment.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{comment.author}</p>
        <p className="text-sm text-muted-foreground mb-2">{new Date(comment.createdAt).toLocaleString()}</p>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdate}>{t('save')}</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
            </div>
          </div>
        ) : (
          <p className="prose dark:prose-invert">{comment.content}</p>
        )}
        {!isEditing && (
          <div className="flex gap-2">
            <Button variant="link" size="sm" onClick={() => setShowReplyForm(!showReplyForm)} className="pl-0">
              {t('reply')}
            </Button>
            <Button variant="link" size="sm" onClick={() => setIsEditing(true)} className="pl-0">
              {t('edit')}
            </Button>
          </div>
        )}
        {showReplyForm && (
          <div className="mt-4 ml-4">
            <CommentForm postId={comment.postId} parentId={comment.id} onCommentAdded={() => setShowReplyForm(false)} />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 mt-4 space-y-6">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CommentList({ postId }: CommentListProps) {
  const { t } = useTranslation();
  const { comments, getComments, isLoading, error } = useComments();

  useEffect(() => {
    getComments(postId);
  }, [postId, getComments]);

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">{t('comments_heading', { count: comments.length })}</h3>
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <CommentItem comment={comment} onReply={() => {}} />
            {index < comments.length - 1 && <Separator className="my-6" />} 
          </div>
        ))}
        {comments.length === 0 && <p className="text-muted-foreground">{t('no_comments_yet')}</p>}
      </div>
    </section>
  );
}
