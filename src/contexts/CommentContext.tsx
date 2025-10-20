import { createContext, useContext, useState, ReactNode } from 'react';
import initialComments from '@/data/comments.json';

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentContextType {
  getComments: (postId: string) => Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments as Comment[]);

  const getComments = (postId: string) => {
    return comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  return (
    <CommentContext.Provider value={{ getComments, addComment }}>
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
