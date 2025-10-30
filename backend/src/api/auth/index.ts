
import { Router } from 'express';
import { register, login, refresh, logout } from './auth.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../../zod/auth.schema.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
