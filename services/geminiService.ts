import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData, Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Analysis (Existing) ---
export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    const systemPrompt = `
      You are NutriLens Pro, an expert Clinical AI Nutritionist.
      Task: Analyze the food image accurately.
      Compliance: Use USDA FoodData Central standards for estimation.
      Output: JSON only.
      Specific Requirement: 'advice' must be 'Explainable (XAI)' - explain WHY this food is good or bad, citing specific nutrients.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: `${systemPrompt} \n Return JSON.` }
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
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["foodName", "calories", "protein", "carbs", "fat", "healthScore", "description", "advice"]
        }
      }
    });

    if (response.text) return JSON.parse(response.text) as NutritionData;
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// --- RAG & XAI Chat Simulation (Strict Data Collection) ---
export const createNutritionChat = () => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `
Eres NutriLens AI, un asistente nutricional profesional, cálido y claro.
Tu tarea es recolectar los siguientes datos del usuario antes de generar cualquier recomendación:
• Edad
• Peso
• Estatura
• Objetivo nutricional
• Enfermedades o condiciones
• Alergias
• Preferencias (gustos y alimentos a evitar)

REGLAS:
1. Si el usuario aún no dio un dato, debes pedirlo educadamente antes de avanzar.
2. No generes recomendaciones ni planes hasta tener al menos: edad + peso + objetivo + condiciones de salud.
3. Cada vez que el usuario entregue un dato, confírmalo y solicítalo cuando falte uno nuevo.
4. El tono siempre debe ser: profesional, carismático, motivador, respetuoso y sencillo.
5. Cuando tengas todos los datos, responde:
   o Resumen del perfil del usuario
   o Pregunta si desea un menú diario, recetas, análisis de alimentos o un plan semanal

💾 EXTRACCIÓN DE DATOS (SISTEMA INTERNO):
Al final de cada respuesta, si el usuario te ha dado NUEVOS datos sobre su perfil, incluye SIEMPRE un bloque JSON oculto con este formato exacto:

\`\`\`json
{
  "user_profile_update": {
    "edad": "...",
    "peso": "...",
    "talla": "...",
    "objetivo": "...",
    "actividad": "...",
    "enfermedades": ["..."],
    "alergias": ["..."],
    "preferencias": ["..."],
    "evitar": ["..."]
  }
}
\`\`\`
Si no hay datos nuevos, NO incluyas el bloque JSON.
            `
        }
    });
};

// --- Recipe Generator with XAI ---
export const generateRecipes = async (preferences: string): Promise<Recipe[]> => {
    try {
        const prompt = `
            Generate 3 healthy recipes based on: "${preferences}".
            
            MANDATORY HEALTH CHECKS:
            1. If the input mentions "diabetes" or "sugar", strictly limit carbohydrates and sugars.
            2. If "heart", reduce sodium and saturated fats.
            3. If "allergy", strictly exclude the allergen.
            
            Requirements:
            1. Validated against WHO healthy diet guidelines.
            2. JSON Output.
            3. Include an 'explanation' field (XAI) detailing why this recipe fits the user's request scientifically.
            4. Include a list of 'ingredients'.
            5. Include step-by-step 'instructions' on how to cook the food.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            macros: { 
                                type: Type.OBJECT,
                                properties: {
                                    protein: { type: Type.STRING },
                                    carbs: { type: Type.STRING },
                                    fat: { type: Type.STRING }
                                }
                            },
                            prepTime: { type: Type.STRING },
                            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            explanation: { type: Type.STRING },
                            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                            instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["name", "calories", "macros", "prepTime", "explanation", "ingredients", "instructions"]
                    }
                }
            }
        });

        if (response.text) return JSON.parse(response.text) as Recipe[];
        return [];
    } catch (error) {
        console.error("Recipe Generation Error", error);
        return [];
    }
};