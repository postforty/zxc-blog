// backend/src/api/admin/stats.controller.ts
import type { Request, Response } from 'express';
import * as statsService from './stats.service.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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

/**
 * @openapi
 * /api/stats/visit:
 *   post:
 *     tags:
 *       - Stats
 *     summary: Record a new visit
 *     responses:
 *       200:
 *         description: Visit recorded successfully.
 *       500:
 *         description: Error recording visit.
 */
export const recordVisit = async (req: Request, res: Response) => {
  const visitorToken = req.cookies['visitor-token'];
  const secret = process.env.VISITOR_JWT_SECRET || 'default_secret_for_visitors';

  if (visitorToken) {
    try {
      jwt.verify(visitorToken, secret);
      // Token is valid, user has visited recently
      return res.status(204).send();
    } catch (error) {
      // Token is invalid, proceed to record a new visit
    }
  }

  try {
    await statsService.recordVisit();

    const newVisitorId = uuidv4();
    
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999); // End of the current day

    const expiresInMs = endOfDay.getTime() - now.getTime();
    const expiresInSec = Math.floor(expiresInMs / 1000);

    const newVisitorToken = jwt.sign({ visitorId: newVisitorId }, secret, {
      expiresIn: expiresInSec,
    });

    res.cookie('visitor-token', newVisitorToken, {
      httpOnly: true,
      maxAge: expiresInMs,
      sameSite: 'lax',
    });

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: 'Error recording visit', error });
  }
};

/**
 * @openapi
 * /api/stats/visitors:
 *   get:
 *     tags:
 *       - Stats
 *     summary: Get visitor statistics
 *     responses:
 *       200:
 *         description: Visitor statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dailyVisitors:
 *                   type: integer
 *                 yesterdayVisitors:
 *                   type: integer
 *                 totalVisitors:
 *                   type: integer
 *       500:
 *         description: Error fetching visitor stats.
 */
export const getVisitorStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getVisitorStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visitor stats', error });
  }
};
