
import type { Request, Response } from 'express';
import * as commentService from './comments.service.js';

export const create = async (req: Request, res: Response) => {
  try {
    const newComment = await commentService.createComment(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    const userId = (req as any).user.id; // Assuming user ID is available in req.user.id after authentication
    const updatedComment = await commentService.updateComment(id, req.body, userId);
    res.json(updatedComment);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'Comment not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    // Add logic to check if the user is the author of the comment
    await commentService.deleteComment(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const findAllByPostId = async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.postId, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }
        const comments = await commentService.getCommentsByPostId(postId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getAllComments();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
