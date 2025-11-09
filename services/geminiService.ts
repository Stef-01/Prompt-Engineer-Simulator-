
import { GoogleGenAI, Type } from "@google/genai";
import { GamePlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy and relevant title for the game.",
    },
    tagline: {
      type: Type.STRING,
      description: "A short, memorable slogan for the game.",
    },
    coreLoop: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "The primary sequence of actions the player repeats.",
    },
    learningObjectives: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "What players will learn about prompt engineering.",
    },
    levels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The title of the game level or chapter.",
          },
          description: {
            type: Type.STRING,
            description: "A brief overview of what the level covers.",
          },
          exampleChallenge: {
            type: Type.STRING,
            description: "A specific example of a puzzle or challenge in this level.",
          },
        },
        required: ["title", "description", "exampleChallenge"],
      },
      description: "A breakdown of the game's progression through levels or chapters.",
    },
    monetizationIdea: {
      type: Type.STRING,
      description: "A creative idea for how the game could be monetized.",
    },
  },
  required: ["title", "tagline", "coreLoop", "learningObjectives", "levels", "monetizationIdea"],
};

export const generateGamePlan = async (gameIdea: string): Promise<GamePlan> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following game concept, generate a basic game plan. Concept: "${gameIdea}"`,
      config: {
        systemInstruction: "You are an expert game designer specializing in creating engaging educational games. Your task is to generate a basic game plan based on the user's concept. The game should be focused on teaching the principles of prompt engineering. The output must be a valid JSON object matching the provided schema.",
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating game plan:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate game plan from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the game plan.");
  }
};
   