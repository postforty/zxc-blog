import { Router } from 'express';
import { create, findAllByPostId } from './comments.controller.js';
import { verifyToken } from '../../middleware/verifyToken.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createCommentSchema } from '../../zod/comments.schema.js';


const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Retrieve a list of comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of comments
 */
router.get('/', findAllByPostId);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComment'
 *     responses:
 *       201:
 *         description: Successfully created a comment
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  verifyToken,
  validateRequest({ body: createCommentSchema }),
  create
);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateComment:
 *       type: object
 *       required:
 *         - content
 *         - authorId
 *         - postId
 *       properties:
 *         content:
 *           type: string
 *         authorId:
 *           type: integer
 *         postId:
 *           type: integer
 *         parentId:
 *           type: integer
 *     UpdateComment:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 */

export default router;
