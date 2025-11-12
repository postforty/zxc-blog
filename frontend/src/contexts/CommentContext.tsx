"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Comment } from '../types'; // Adjusted path
import { useAuth } from './AuthContext';

interface CommentContextType {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  getComments: (postId: string) => void;
  addComment: (content: string, postId: string, parentId?: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getComments = useCallback(async (postId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addComment = async (content: string, postId: string, parentId?: string) => {
    if (!user) {
      setError('You must be logged in to comment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, postId: parseInt(postId), authorId: user.id, parentId: parentId ? parseInt(parentId) : undefined }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const newComment = await response.json();
      setComments(prevComments => [...prevComments, newComment]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      const updatedComment = await response.json();
      setComments(prevComments =>
        prevComments.map(c => (c.id === updatedComment.id ? updatedComment : c))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <CommentContext.Provider value={{ comments, getComments, addComment, updateComment, deleteComment, isLoading, error }}>
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
