 
import ollama from "ollama";
export const AnalyzeImage = async (imageBuffer) => {


         const response = await ollama.chat({
              model: "qwen3-vl:4b",
              messages: [
                {
                  role: "user",
                  content :`Identify the main category of this video. Return ONLY the category name.First, infer the category from the video's title, description, transcript, visual content, and other available context.If the context is insufficient or ambiguous, do NOT say "Unknown", "Other", or "Unclear". Instead, infer the closest relevant broad category from the information you do have. Prefer a common, meaningful category that is reasonably related to the context rather than making a completely random choice.Return exactly ONE category and nothing else.`,

              
                  images: [imageBuffer]
                }
              ]
            });

     return     response.message.content
}

 