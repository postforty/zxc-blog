// backend/src/api/admin/settings.controller.ts
import type { Request, Response } from 'express';
import * as settingsService from './settings.service.js';

/**
 * @openapi
 * /api/admin/settings:
 *   get:
 *     tags:
 *       - Admin - Settings
 *     summary: Get all settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of settings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getAllSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
};

/**
 * @openapi
 * /api/admin/settings:
 *   put:
 *     tags:
 *       - Admin - Settings
 *     summary: Update settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated settings object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updatedSettings = await settingsService.updateSettings(req.body);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error });
  }
};
