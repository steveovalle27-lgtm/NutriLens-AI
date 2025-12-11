import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    // Enhanced System Instruction to simulate the "Professional Nutritionist" backend
    const systemPrompt = `
      You are an expert AI Nutritionist (NutriLens Pro). 
      Your goal is to provide a highly accurate, scientific, yet accessible analysis of food images.
      
      1. Identify the food item precisely.
      2. Estimate calories and macros for a standard serving size based on USDA/Scientific standards.
      3. Calculate a 'Health Score' (0-100) based on nutrient density, processing level, and sugar/sodium content.
      4. Provide a professional 'Clinical Advice' summary explaining the benefits or risks.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `${systemPrompt} \n Analyze this image and return the data in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            healthScore: { type: Type.NUMBER },
            description: { type: Type.STRING },
            advice: { type: Type.STRING },
            ingredients: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["foodName", "calories", "protein", "carbs", "fat", "healthScore", "description", "advice"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as NutritionData;
    } else {
      throw new Error("No data returned from AI");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};