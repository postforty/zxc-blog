import { Router } from "express";
import { upload } from "./multer.config.js";
import {
  uploadImageController,
  cleanupImagesController,
} from "./uploads.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const router = Router();

router.post(
  "/images",
  verifyToken,
  upload.single("image"),
  uploadImageController
);
router.delete("/cleanup", verifyToken, cleanupImagesController);

export default router;
