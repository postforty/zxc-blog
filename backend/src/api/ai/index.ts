import { Router } from "express";
import * as aiController from "./ai.controller.js";

import multer from "multer";

const router = Router();
const upload = multer();

router.post("/generate", upload.array("contextFiles"), aiController.generate);

export default router;
