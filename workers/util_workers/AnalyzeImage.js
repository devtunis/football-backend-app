
import { Ollama } from "ollama";
import "dotenv/config";

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
});

export const AnalyzeImage = async (imageBuffer) => {
  const response = await ollama.chat({
    model: "gemma4:31b-cloud",
    messages: [
      {
        role: "user",
      content: `Identify the single main category that best describes this video.

Use the provided image as the primary source of evidence. If a title, description, transcript, or other context is explicitly provided, use it as additional evidence.

Classification rules:
- Choose the broadest meaningful category that accurately describes the main subject or activity.
- Consider the main scene, objects, people, animals, activities, and environment.
- If the image is ambiguous or incomplete, infer the most likely category from the available evidence.
- Never return "Unknown", "Other", or "Unclear".
- Do not invent details or rely on unsupported assumptions.
- Prefer the dominant subject or activity over incidental background elements.
- Use a common, concise category name, such as Sports, Football, Nature, Wildlife, Gaming, Technology, News, Education, Cooking, Travel, Music, or Entertainment.
- If multiple categories are plausible, choose the single best-supported one.

Output requirements:
Return exactly ONE category name.
Do not include explanations, punctuation, quotes, or additional text.`,
        images: [imageBuffer],
      },
    ],
    stream: false,
  });

  return response.message.content.trim();
};