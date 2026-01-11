import { GoogleGenAI, Type } from "@google/genai";
import { WeeklyPlan, ShoppingListResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateShoppingList = async (plan: WeeklyPlan): Promise<ShoppingListResponse> => {
  // Filter out empty days/slots to save tokens and improve relevance
  const activeItems = Object.entries(plan).reduce((acc, [date, dayPlan]) => {
    const meals = Object.entries(dayPlan)
      .filter(([_, value]) => value.trim().length > 0)
      .map(([type, value]) => `${type}: ${value}`)
      .join(", ");
    
    if (meals) {
      acc.push(`On ${date}: ${meals}`);
    }
    return acc;
  }, [] as string[]);

  if (activeItems.length === 0) {
    return { items: [] };
  }

  const prompt = `
    Based on the following weekly meal plan, create a consolidated shopping list.
    Group similar items (e.g., "2 eggs" and "3 eggs" should become "5 eggs" or just "Eggs").
    Categorize them into standard grocery store aisles (e.g., "Produce", "Dairy", "Meat", "Pantry").
    
    Meal Plan:
    ${activeItems.join("\n")}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING, description: "The name of the item to buy" },
                category: { type: Type.STRING, description: "The grocery aisle category" }
              },
              required: ["item", "category"]
            }
          }
        },
        required: ["items"]
      }
    }
  });

  const text = response.text;
  if (!text) return { items: [] };
  
  try {
    return JSON.parse(text) as ShoppingListResponse;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return { items: [] };
  }
};