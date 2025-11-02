// backend/src/api/admin/index.ts
import { Router } from 'express';
import { verifyToken } from '../../middleware/verifyToken.js';
import { checkRole } from '../../middleware/checkRole.js';
import * as usersController from './users.controller.js';
import * as settingsController from './settings.controller.js';
import * as statsController from './stats.controller.js';

const router = Router();

// User management routes
router.get('/users', verifyToken, checkRole(['ADMIN']), usersController.getAllUsers);
router.get('/users/:id', verifyToken, checkRole(['ADMIN']), usersController.getUserById);
router.put('/users/:id', verifyToken, checkRole(['ADMIN']), usersController.updateUser);
router.delete('/users/:id', verifyToken, checkRole(['ADMIN']), usersController.deleteUser);

// Settings routes
router.get('/settings', verifyToken, checkRole(['ADMIN']), settingsController.getSettings);
router.put('/settings', verifyToken, checkRole(['ADMIN']), settingsController.updateSettings);

// Stats routes
router.get('/stats/summary', verifyToken, checkRole(['ADMIN']), statsController.getSummary);
router.get('/stats/top-viewed', verifyToken, checkRole(['ADMIN']), statsController.getTopViewedPosts);
router.get('/stats/top-liked', verifyToken, checkRole(['ADMIN']), statsController.getTopLikedPosts);

export default router;
