const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type AITaskType = "draft" | "expand" | "translate" | "grammar";

export interface GenerateOptions {
  task: AITaskType;
  topic?: string;
  content?: string;
  language?: "ko" | "en";
  targetLanguage?: "ko" | "en";
  contextUrls?: string[];
  contextFiles?: File[];
}

export async function generateAIContent(options: GenerateOptions): Promise<string> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  let body: BodyInit;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (options.contextFiles && options.contextFiles.length > 0) {
    const formData = new FormData();
    formData.append("task", options.task);
    if (options.topic) formData.append("topic", options.topic);
    if (options.content) formData.append("content", options.content);
    if (options.language) formData.append("language", options.language);
    if (options.targetLanguage) formData.append("targetLanguage", options.targetLanguage);
    
    if (options.contextUrls && options.contextUrls.length > 0) {
      // Send as JSON string or individual fields
      formData.append("contextUrls", JSON.stringify(options.contextUrls));
    }

    options.contextFiles.forEach((file) => {
      formData.append("contextFiles", file);
    });

    body = formData;
    // Content-Type header should be omitted for FormData to let browser set boundary
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options);
  }

  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Failed to generate content");
  }

  const data = await response.json();
  return data.result;
}
