import { Router } from 'express';
import { findAll } from './comments.controller.js';

const router = Router();

router.get('/all', findAll);

export default router;
