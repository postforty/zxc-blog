import { Router } from 'express';
import { findAll, remove, update } from './comments.controller.js';
import { verifyToken } from '../../middleware/verifyToken.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { updateCommentSchema } from '../../zod/comments.schema.js';

const router = Router();

router.get('/all', findAll);
router.delete('/:id', verifyToken, remove);
router.put('/:id', verifyToken, validateRequest({ body: updateCommentSchema }), update);

export default router;
