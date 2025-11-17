import type { Request, Response } from "express";
import { uploadImage, deleteUnusedImages } from "./uploads.service.js";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadImage(req.file);
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const cleanupImagesController = async (req: Request, res: Response) => {
  try {
    const deletedCount = await deleteUnusedImages();
    res.status(200).json({ message: `Deleted ${deletedCount} unused images` });
  } catch (error) {
    console.error("Image cleanup error:", error);
    res.status(500).json({ error: "Failed to cleanup images" });
  }
};
