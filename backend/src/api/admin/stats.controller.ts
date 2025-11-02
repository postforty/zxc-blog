// backend/src/api/admin/stats.controller.ts
import type { Request, Response } from 'express';
import * as statsService from './stats.service.js';

/**
 * @openapi
 * /api/admin/stats/summary:
 *   get:
 *     tags:
 *       - Admin - Stats
 *     summary: Get a summary of site statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A summary of site statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                 totalComments:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *                 totalLikes:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export const getSummary = async (req: Request, res: Response) => {
  try {
    const summary = await statsService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary', error });
  }
};

/**
 * @openapi
 * /api/admin/stats/top-viewed:
 *   get:
 *     tags:
 *       - Admin - Stats
 *     summary: Get top 5 most viewed posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of top 5 most viewed posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: object
 *                   viewCount:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export const getTopViewedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await statsService.getTopViewedPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top viewed posts', error });
  }
};

/**
 * @openapi
 * /api/admin/stats/top-liked:
 *   get:
 *     tags:
 *       - Admin - Stats
 *     summary: Get top 5 most liked posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of top 5 most liked posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: object
 *                   likes:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export const getTopLikedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await statsService.getTopLikedPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top liked posts', error });
  }
};
