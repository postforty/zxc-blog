const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type AITaskType = "draft" | "expand" | "translate" | "grammar";

export interface GenerateOptions {
  task: AITaskType;
  topic?: string;
  content?: string;
  language?: "ko" | "en";
  targetLanguage?: "ko" | "en";
}

export async function generateAIContent(options: GenerateOptions): Promise<string> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error("Failed to generate content");
  }

  const data = await response.json();
  return data.result;
}
