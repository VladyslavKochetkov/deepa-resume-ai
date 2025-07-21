import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.GEMINI_API_KEY,
});

const model = google("gemini-2.5-flash", {
  structuredOutputs: true,
  useSearchGrounding: true,
});

export const gemini = model;
