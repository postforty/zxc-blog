import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type AITaskType = "draft" | "expand" | "translate" | "grammar";

interface GenerateOptions {
  task: AITaskType;
  topic?: string;
  content?: string;
  language?: "ko" | "en";
  targetLanguage?: "ko" | "en";
}

export const generateAIContent = async (options: GenerateOptions): Promise<string> => {
  let prompt = "";

  switch (options.task) {
    case "draft":
      prompt = `Write a blog post draft about "${options.topic}". 
      Language: ${options.language === "ko" ? "Korean" : "English"}.
      Format: Markdown.
      Structure: Introduction, Main Body (with headers), Conclusion.`;
      break;
    
    case "expand":
      prompt = `Continue writing the following blog post content. 
      Language: ${options.language === "ko" ? "Korean" : "English"}.
      Current content:
      """
      ${options.content}
      """
      Keep the same tone and style.`;
      break;

    case "translate":
      prompt = `Translate the following title and content to ${options.targetLanguage === "ko" ? "Korean" : "English"}.
      
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
      prompt = `Fix grammar and improve the style of the following text.
      Language: ${options.language === "ko" ? "Korean" : "English"}.
      Text:
      """
      ${options.content}
      """
      Output only the corrected text.`;
      break;
      
    default:
      throw new Error("Invalid task type");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
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
