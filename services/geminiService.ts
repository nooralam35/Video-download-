import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates social media metadata (captions, hashtags) based on a video description/title.
 */
export const generateVideoMetadata = async (
  videoTitle: string, 
  platform: string, 
  userContext: string
) => {
  try {
    const prompt = `
      I am a content creator reposting a video on ${platform}.
      
      Video Title/Context: "${videoTitle}"
      User's Extra Notes: "${userContext}"

      Please generate the following in JSON format:
      1. 3 Viral Captions (engaging, short, punchy).
      2. 15 Trending Hashtags relevant to the niche.
      3. A professional Video Description (SEO optimized).
      4. A brief "Content Strategy" tip (1 sentence) on how to best market this specific video.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            description: { type: Type.STRING },
            analysis: { type: Type.STRING }
          },
          required: ["captions", "hashtags", "description", "analysis"]
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI content. Please try again.");
  }
};
