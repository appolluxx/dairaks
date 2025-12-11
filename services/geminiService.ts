import { GoogleGenAI, Type } from "@google/genai";
import { WasteType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface RecycleAnalysisResult {
  wasteType: WasteType;
  quantityEstimate: string;
  confidence: number;
  itemDescription: string;
}

export const analyzeRecycleImage = async (file: File): Promise<RecycleAnalysisResult> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          {
            text: `Analyze this image of waste for recycling. 
                   Identify the primary material type (Plastic, Paper, Glass, Metal, Organic, Electronic, or Other).
                   Estimate the quantity or size (e.g., "2 bottles", "Small bag", "Large stack").
                   Provide a short description of the item.
                   Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wasteType: { type: Type.STRING, enum: Object.values(WasteType) },
            quantityEstimate: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            itemDescription: { type: Type.STRING }
          },
          required: ["wasteType", "quantityEstimate", "itemDescription"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RecycleAnalysisResult;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails
    return {
      wasteType: WasteType.OTHER,
      quantityEstimate: "Unknown",
      confidence: 0,
      itemDescription: "Could not analyze image"
    };
  }
};
