import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/contexts/PostContext';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="title">제목</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="content">내용 (Markdown 지원)</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          required
        />
      </div>
      <Button type="submit">저장</Button>
    </form>
  );
}
