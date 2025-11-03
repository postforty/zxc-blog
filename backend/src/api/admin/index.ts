// backend/src/api/admin/index.ts
import { Router } from 'express';
import { verifyToken } from '../../middleware/verifyToken.js';
import { checkRole } from '../../middleware/checkRole.js';
import * as usersController from './users.controller.js';
import * as settingsController from './settings.controller.js';
import * as statsController from './stats.controller.js';

const router = Router();

// User management routes
router.get('/users', verifyToken, checkRole(['Admin']), usersController.getAllUsers);
router.get('/users/:id', verifyToken, checkRole(['Admin']), usersController.getUserById);
router.put('/users/:id', verifyToken, checkRole(['Admin']), usersController.updateUser);
router.delete('/users/:id', verifyToken, checkRole(['Admin']), usersController.deleteUser);

// Settings routes
router.get('/settings', verifyToken, checkRole(['Admin']), settingsController.getSettings);
router.put('/settings', verifyToken, checkRole(['Admin']), settingsController.updateSettings);

// Stats routes
router.get('/stats/summary', verifyToken, checkRole(['Admin']), statsController.getSummary);
router.get('/stats/top-viewed', verifyToken, checkRole(['Admin']), statsController.getTopViewedPosts);
router.get('/stats/top-liked', verifyToken, checkRole(['Admin']), statsController.getTopLikedPosts);

export default router;
