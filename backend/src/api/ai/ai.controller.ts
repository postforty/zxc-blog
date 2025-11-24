import type { Request, Response } from "express";
import { generateAIContent, type AITaskType } from "./ai.service.js";

export const generate = async (req: Request, res: Response) => {
  try {
    const { task, topic, content, language, targetLanguage } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const result = await generateAIContent({
      task: task as AITaskType,
      topic,
      content,
      language,
      targetLanguage,
    });

    res.json({ result });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
};
