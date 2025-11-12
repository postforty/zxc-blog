import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'viewCount'>) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  addLike: (id: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'viewCount'>) => {
    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...post, authorId: user.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to add post');
      }
      const newPost = await response.json();
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      const newPost = await response.json();
      setPosts(prevPosts =>
        prevPosts.map(post => (post.id === newPost.id ? newPost : post))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(prevPosts => prevPosts.filter(post => post.id !== parseInt(id, 10)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addLike = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${id}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to add like');
      }
      const updatedPost = await response.json();
      setPosts(prevPosts =>
        prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PostContext.Provider value={{ posts, isLoading, error, addPost, updatePost, deletePost, addLike }}>
      {children}
    </PostContext.Provider>
  );
};
export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
