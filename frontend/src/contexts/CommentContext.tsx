import { createContext, useContext, useState, ReactNode } from 'react';
import initialComments from '@/data/comments.json';
import { Comment } from '@/types';

interface CommentContextType {
  getComments: (postId: string) => Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'> & { parentId?: string }) => void;
  updateComment: (commentId: string, content: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments as Comment[]);

  const getComments = (postId: string) => {
    const postComments = comments.filter(c => c.postId === postId);

    const commentMap = new Map<string, Comment>();
    postComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] }); // replies 배열 초기화
    });

    const rootComments: Comment[] = [];
    commentMap.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies?.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    // 각 댓글의 replies 배열을 생성일 기준으로 정렬
    commentMap.forEach(comment => {
      if (comment.replies) {
        comment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    });

    return rootComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'> & { parentId?: string }) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  const updateComment = (commentId: string, content: string) => {
    setComments(prevComments =>
      prevComments.map(c => (c.id === commentId ? { ...c, content } : c))
    );
  };

  return (
    <CommentContext.Provider value={{ getComments, addComment, updateComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};
