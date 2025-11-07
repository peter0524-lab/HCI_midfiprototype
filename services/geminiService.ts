import { GoogleGenAI, Type } from "@google/genai";
import type { Contact, GiftRecommendation, OcrData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getGiftRecommendations(contact: Contact, prompt: string): Promise<GiftRecommendation[]> {
  const model = 'gemini-2.5-flash';
  
  const fullPrompt = `You are a thoughtful gift recommendation AI for business professionals. Based on the following information about a person, recommend 3 unique gifts.

**Person's Details:**
- Name: ${contact.name}
- Job: ${contact.title} at ${contact.company}
- Notes: ${contact.notes || 'No specific notes.'}

**Gift Request:**
- Occasion/Reason/Budget: "${prompt}"

Please provide the recommendations in a structured JSON format. Each recommendation must include a 'name', 'description', and an estimated 'price' in Korean Won, formatted as a string with the "원" symbol (e.g., "150,000원"). The JSON should be an array of 3 objects.
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'The name of the gift.' },
              description: { type: Type.STRING, description: 'A brief description of the gift.' },
              price: { type: Type.STRING, description: 'The estimated price in Korean Won, ending with "원" (e.g., "150,000원").' }
            },
            required: ["name", "description", "price"]
          }
        },
      }
    });

    const jsonString = response.text.trim();
    const recommendations: GiftRecommendation[] = JSON.parse(jsonString);
    return recommendations;
  } catch (error) {
    console.error("Error fetching gift recommendations:", error);
    // Return a fallback array in case of an API error
    return [
      { name: "Error", description: "Could not fetch recommendations. Please try again.", price: "N/A" }
    ];
  }
}

export async function extractContactInfoFromImage(base64Image: string): Promise<OcrData> {
  const model = 'gemini-2.5-flash';

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Extract the contact information from this business card image. Provide the output in a structured JSON format with the following keys: "name", "title", "company", "phone", and "email". If a piece of information is not found, omit the key or set its value to an empty string.`
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            phone: { type: Type.STRING },
            email: { type: Type.STRING },
          },
        },
      }
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error extracting text from image:", error);
    return { name: "Error", company: "Could not extract data." };
  }
}