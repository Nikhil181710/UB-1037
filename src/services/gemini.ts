import { GoogleGenAI, Modality } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  analyzeSkin: async (imageBase64: string, answers: string) => {
    const ai = getAI();
    const prompt = `You are an AI Skin Care Specialist. Analyze this skin photo and these user answers: ${answers}. 
    Identify possible concerns (acne, dryness, oiliness, pigmentation) and recommend a daily skincare routine. 
    Also, warn about comedogenic ingredients if relevant. 
    Format the response in a structured JSON-like way but as a readable string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: imageBase64.split(',')[1], mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    });
    return response.text;
  },

  speak: async (text: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and gently: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audio.play();
    }
  }
};
