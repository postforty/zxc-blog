
import type { Request, Response } from 'express';
import * as postService from './posts.service.js';

export const findAll = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const findOne = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    const post = await postService.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
