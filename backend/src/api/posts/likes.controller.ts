
import type { Request, Response } from 'express';
import * as likeService from './likes.service.js';

export const like = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id;
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    await likeService.likePost(postId, userId);
    res.status(201).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unlike = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id, 10);
    // @ts-ignore
    const userId = req.user.id;
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    await likeService.unlikePost(postId, userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
