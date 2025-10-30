
import { Router } from 'express';
import { findAll, findOne } from './posts.controller.js';

const router = Router();

router.get('/', findAll);
router.get('/:id', findOne);

export default router;
