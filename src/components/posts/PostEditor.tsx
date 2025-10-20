import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/contexts/PostContext';
import { Post } from './PostList';

interface PostEditorProps {
  post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addPost, updatePost } = usePosts();
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = { title, content, author: 'Dandy', summary: content.substring(0, 100) };

    if (post) {
      updatePost({ ...post, ...postData });
      navigate(`/posts/${post.id}`);
    } else {
      addPost(postData);
      navigate(`/`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md bg-transparent"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">내용 (Markdown 지원)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md bg-transparent"
          rows={15}
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        저장
      </button>
    </form>
  );
}
