import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";
import type { MockQuestion } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!process.env.API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ message: "API key is not configured." }) };
    }

    try {
        const { subject, numberOfQuestions } = JSON.parse(event.body);

        const prompt = `Generate a ${numberOfQuestions}-question mock test for a Nigerian student preparing for the JAMB/WAEC exam in ${subject}.
        The questions should cover various topics within the Nigerian secondary school syllabus for ${subject}.
        Each question must be multiple-choice with 4 options.
        Use Nigerian context and examples where appropriate (e.g., using Naira, local names, places).`;
        
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
                            question: {
                                type: Type.STRING,
                                description: "The question text.",
                            },
                            options: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                },
                                description: "An array of 4 multiple-choice options.",
                            },
                            correctAnswer: {
                                type: Type.STRING,
                                description: "The full text of the correct option.",
                            },
                        },
                        required: ["question", "options", "correctAnswer"],
                    },
                },
            },
        });

        const parsedData: MockQuestion[] = JSON.parse(response.text);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsedData),
        };

    } catch (error) {
        console.error("Error in generate-test function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message || "Could not generate the mock test. Please try again." }),
        };
    }
};

export { handler };