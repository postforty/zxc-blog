import type { Request, Response } from "express";
import { generateAIContent, type AITaskType } from "./ai.service.js";

export const generate = async (req: Request, res: Response) => {
  try {
    const { task, topic, content, language, targetLanguage, contextUrls } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    // Parse contextUrls if it's a string (FormData might send it as stringified JSON or comma-separated)
    let parsedContextUrls: string[] = [];
    if (contextUrls) {
      if (Array.isArray(contextUrls)) {
        parsedContextUrls = contextUrls;
      } else if (typeof contextUrls === 'string') {
        try {
          parsedContextUrls = JSON.parse(contextUrls);
        } catch (e) {
          // If not JSON, assume comma separated or single URL
          parsedContextUrls = contextUrls.split(',').map(url => url.trim());
        }
      }
    }

    const result = await generateAIContent({
      task: task as AITaskType,
      topic,
      content,
      language,
      targetLanguage,
      contextUrls: parsedContextUrls,
      contextFiles: files || [],
    });

    res.json({ result });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
};
