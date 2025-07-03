import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
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
        Each question must be multiple-choice with 4 options (A, B, C, D) and a clear correct answer.
        Use Nigerian context and examples where appropriate (e.g., using Naira, local names, places).
        Return the result as a JSON array of objects. Each object should have the following structure:
        { "question": "The question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "The full text of the correct option" }
        Do not include any other text or markdown fences like \`\`\`json in your response. Just the raw JSON array.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 1.0,
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData: MockQuestion[] = JSON.parse(jsonStr);

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
