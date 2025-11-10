const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const getPostById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post with id ${id}`);
  }
  return response.json();
};