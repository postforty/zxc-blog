import { Router } from 'express';
import { findAll, findOne, create, update, remove, getAllTags, incrementView } from './posts.controller.js';
import { toggle } from './likes.controller.js';
import { optionalAuth } from '../../middleware/optionalAuth.js';
import { verifyToken } from '../../middleware/verifyToken.js';
import { checkRole } from '../../middleware/checkRole.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createPostSchema, updatePostSchema } from '../../zod/posts.schema.js';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 */
router.get('/', findAll);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Retrieve a list of all unique tags
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of unique tags
 */
router.get('/tags', getAllTags);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retrieve a single post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single post
 *       404:
 *         description: Post not found
 */
router.get('/:id', findOne);

/**
 * @swagger
 * /api/posts/{id}/view:
 *   post:
 *     summary: Increment view count for a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View count incremented successfully
 *       400:
 *         description: Invalid post ID
 *       500:
 *         description: Failed to increment view count
 */
router.post('/:id/view', incrementView);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: Successfully created a post
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  verifyToken,
  checkRole(['Admin']),
  validateRequest({ body: createPostSchema }),
  create
);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
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
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: Successfully updated a post
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.put(
  '/:id',
  verifyToken,
  checkRole('Admin'),
  validateRequest({ body: updatePostSchema }),
  update
);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
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
 *         description: Successfully deleted a post
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.delete('/:id', verifyToken, checkRole('Admin'), remove);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully toggled like on a post
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post('/:id/like', optionalAuth, toggle);

/**
 * @swagger
 * components:
 *   schemas:
 *     I18nString:
 *       type: object
 *       properties:
 *         ko:
 *           type: string
 *         en:
 *           type: string
 *     CreatePost:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - authorId
 *       properties:
 *         title:
 *           $ref: '#/components/schemas/I18nString'
 *         content:
 *           $ref: '#/components/schemas/I18nString'
 *         summary:
 *           $ref: '#/components/schemas/I18nString'
 *         authorId:
 *           type: integer
 *         published:
 *           type: boolean
 *     UpdatePost:
 *       type: object
 *       properties:
 *         title:
 *           $ref: '#/components/schemas/I18nString'
 *         content:
 *           $ref: '#/components/schemas/I18nString'
 *         summary:
 *           $ref: '#/components/schemas/I18nString'
 *         published:
 *           type: boolean
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;