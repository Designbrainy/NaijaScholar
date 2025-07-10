import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ message: "API key is not configured." }) };
  }

  try {
    const { history, message, systemInstruction } = JSON.parse(event.body);

    const apiHistory = history.map((msg: ChatMessage) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: apiHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (error) {
    console.error("Error in gemini-chat function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "An internal error occurred." }),
    };
  }
};

export { handler };