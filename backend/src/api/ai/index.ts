import { Router } from "express";
import * as aiController from "./ai.controller.js";

const router = Router();

router.post("/generate", aiController.generate);

export default router;
