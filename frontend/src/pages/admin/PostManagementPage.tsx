import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/contexts/PostContext';

interface Post {
  id: number;
  title: {
    ko: string;
    en: string;
  };
  author: {
    name: string;
  };
  createdAt: string;
}

const PostManagementPage = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'ko' | 'en';
  const { posts, isLoading, error, deletePost } = usePosts();
  const navigate = useNavigate();

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(postId.toString());
    } catch (err) {
      console.error(err);
      alert('Error deleting post');
    }
  };

  const handleEdit = (postId: number) => {
    navigate(`/editor/${postId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Post Management</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title (Korean)</TableHead>
              <TableHead>Title (English)</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title.ko}</TableCell>
                <TableCell className="font-medium">{post.title.en}</TableCell>
                <TableCell>{post.author.name}</TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(post.id)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(post.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PostManagementPage;