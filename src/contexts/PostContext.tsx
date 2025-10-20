import { createContext, useContext, useState, ReactNode } from 'react';
import initialPosts from '@/data/posts.json';
import { Post } from '@/components/posts/PostList';

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts as Post[]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: `new-post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const deletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
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
