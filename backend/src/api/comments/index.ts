
import { Router } from 'express';
import { create, update, remove, findAllByPostId } from './comments.controller.js';
import { verifyToken } from '../../middleware/verifyToken.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createCommentSchema, updateCommentSchema } from '../../zod/comments.schema.js';


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
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComment'
 *     responses:
 *       200:
 *         description: Successfully updated a comment
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.put(
  '/:id',
  verifyToken,
  validateRequest({ body: updateCommentSchema }),
  update
);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted a comment
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', verifyToken, remove);

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
