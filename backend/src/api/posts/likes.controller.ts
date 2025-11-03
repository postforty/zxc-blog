import type { Request, Response } from 'express';
import * as likeService from './likes.service.js';

export const toggle = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // @ts-ignore
    const userId = req.user ? req.user.id : undefined;

    const updatedPost = await likeService.toggleLike(postId, userId);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error in toggle like controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};