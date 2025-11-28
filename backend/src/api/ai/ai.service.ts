import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type AITaskType = "draft" | "expand" | "translate" | "grammar" | "outline";

interface GenerateOptions {
  task: AITaskType;
  topic?: string;
  content?: string;
  language?: "ko" | "en";
  targetLanguage?: "ko" | "en";
  contextUrls?: string[];
  contextFiles?: Express.Multer.File[];
}

const uploadToGemini = async (file: Express.Multer.File) => {
  // Use REST API to upload file since we are using @google/genai which might not have the helper yet
  // or we want to avoid @google/generative-ai dependency.
  
  const API_KEY = process.env.GEMINI_API_KEY;
  const UPLOAD_URL = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`;
  
  try {
    // 1. Start Resumable Upload
    const startResponse = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': file.size.toString(),
        'X-Goog-Upload-Header-Content-Type': file.mimetype,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: { display_name: file.originalname } }),
    });

    const uploadUrl = startResponse.headers.get('x-goog-upload-url');
    if (!uploadUrl) {
      throw new Error("Failed to get upload URL");
    }

    // 2. Upload File Content
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Length': file.size.toString(),
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize',
      },
      body: file.buffer as any,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const fileInfo = await uploadResponse.json();
    const fileUri = fileInfo.file.uri;
    const fileName = fileInfo.file.name; // This is the resource name, e.g. files/123

    // 3. Wait for processing (if video/audio)
    let state = "PROCESSING";
    while (state === "PROCESSING") {
      const stateResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`);
      const stateData = await stateResponse.json();
      state = stateData.state;
      if (state === "PROCESSING") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else if (state === "FAILED") {
        throw new Error("File processing failed");
      }
    }

    return { uri: fileUri, mimeType: file.mimetype };
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

const fetchUrlContent = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, and other unnecessary elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();
    
    // Extract text from main content areas if possible, or body
    const content = $('article').text() || $('main').text() || $('body').text();
    return content.replace(/\s+/g, ' ').trim().substring(0, 10000); // Limit context size
  } catch (error) {
    console.error(`Failed to fetch URL ${url}:`, error);
    return "";
  }
};

export const generateAIContent = async (options: GenerateOptions): Promise<string> => {
  let prompt = "";
  let parts: any[] = [];

  // Handle External Contexts
  if (options.contextUrls && options.contextUrls.length > 0) {
    for (const url of options.contextUrls) {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        // For YouTube, we can pass the URL directly to Gemini 2.0 Flash? 
        // Actually, the cookbook says we can pass the URL as fileUri if it's a YouTube URL?
        // Wait, the cookbook example: youtubeUrl = "..." ... { fileData: { fileUri: youtubeUrl } }
        // This implies we can pass it directly as a fileUri without uploading?
        // Let's try that as per the user's finding.
        parts.push({ fileData: { fileUri: url, mimeType: "video/mp4" } }); // Mime type might be ignored or needed?
        prompt += `\nRefer to the YouTube video at ${url}.\n`;
      } else {
        const urlContent = await fetchUrlContent(url);
        prompt += `\nReference content from ${url}:\n"""\n${urlContent}\n"""\n`;
      }
    }
  }

  if (options.contextFiles && options.contextFiles.length > 0) {
    for (const file of options.contextFiles) {
      const uploadedFile = await uploadToGemini(file);
      parts.push({
        fileData: {
          mimeType: uploadedFile.mimeType,
          fileUri: uploadedFile.uri,
        },
      });
      prompt += `\nRefer to the uploaded file: ${file.originalname}\n`;
    }
  }

  switch (options.task) {
    case "draft":
      prompt += `Write a blog post draft about "${options.topic}". 
      Language: ${options.language === "ko" ? "Korean" : "English"}.
      Format: Markdown.
      Structure: Introduction, Main Body (with headers), Conclusion.
      
      IMPORTANT - Use proper heading hierarchy:
      - Use # for the main title
      - Use ## for major sections (e.g., ## 1. Introduction, ## 2. Main Topic)
      - Use ### for subsections (e.g., ### 1-1. Subtopic, ### 1-2. Another Subtopic)
      - Number your sections appropriately (1., 2., 3. for ##, and 1-1., 1-2. for ###)
      
      Example structure:
      # Title
      ## 1. Introduction
      ### 1-1. Background
      ### 1-2. Purpose
      ## 2. Main Content
      ### 2-1. Key Point
      ### 2-2. Details
      ## 3. Conclusion
      
      Use the provided context (files, URLs) as reference material.`;
      break;
    
    case "expand":
      prompt += `Continue writing the following blog post content. 
      Language: ${options.language === "ko" ? "Korean" : "English"}.
      Current content:
      """
      ${options.content}
      """
      Keep the same tone and style.
      
      IMPORTANT - Use proper heading hierarchy when adding new sections:
      - Use ## for major sections (e.g., ## 1. Section Name, ## 2. Next Section)
      - Use ### for subsections (e.g., ### 1-1. Subsection, ### 1-2. Details)
      - Number your sections appropriately to continue from existing content
      
      Use the provided context as reference.`;
      break;

    case "translate":
      prompt += `Translate the following title and content to ${options.targetLanguage === "ko" ? "Korean" : "English"}.
      
      Title: "${options.topic}"
      Content:
      """
      ${options.content}
      """
      
      Output format: JSON
      {
        "title": "Translated Title",
        "content": "Translated Content"
      }`;
      break;

    case "grammar":
      prompt += `Fix grammar and improve the style of the following text.
      
      IMPORTANT: The text is in ${options.language === "ko" ? "Korean" : "English"}.
      You MUST keep the output in the SAME language (${options.language === "ko" ? "Korean" : "English"}).
      DO NOT translate the text to another language.
      Only fix grammar, spelling, and improve the writing style while maintaining the original language.
      
      Text to correct:
      """
      ${options.content}
      """
      
      Output only the corrected text in ${options.language === "ko" ? "Korean" : "English"}.`;
      break;

    case "outline":
      prompt += `Expand the following outline/keywords into a detailed blog post section.
      Language: ${options.language === "ko" ? "Korean" : "English"}.
      
      The input is a list of items or questions. For each item:
      1. Use the item as a header (or sub-header) with proper markdown heading levels.
      2. Write a detailed explanation or answer for that item.
      3. Maintain a logical flow between items.
      
      IMPORTANT - Use proper heading hierarchy:
      - Use # for the main title
      - Use ## for major sections (e.g., ## 1. Section Name)
      - Use ### for subsections (e.g., ### 1-1. Subsection Name)
      - Number your sections appropriately (1., 2., 3. for ##, and 1-1., 1-2. for ###)
      
      Example structure:
      # Main Title
      ## 1. First Topic
      ### 1-1. Subtopic
      ### 1-2. Another Subtopic
      ## 2. Second Topic
      ### 2-1. Details
      
      Input:
      """
      ${options.content}
      """
      
      Format: Markdown.`;
      break;
      
    default:
      throw new Error("Invalid task type");
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts }],
    });
    const text = response.text || "";
    // Remove markdown code block fences if present
    const cleanedText = text.replace(/^```markdown\n/, "").replace(/^```json\n/, "").replace(/^```\n/, "").replace(/\n```$/, "");
    return cleanedText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content from AI");
  }
};
