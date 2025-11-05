// backend/src/api/stats/index.ts
import { Router } from 'express';
import * as statsController from '../admin/stats.controller.js';

const router = Router();

router.post('/visit', statsController.recordVisit);
router.get('/visitors', statsController.getVisitorStats);

export default router;
