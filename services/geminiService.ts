
import { ChatMessage, MockQuestion } from '../types';

export const getTutorResponse = async (history: ChatMessage[], message: string, systemInstruction: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, message, systemInstruction }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get response from AI tutor.');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Error getting tutor response:", error);
        return "Sorry, I encountered an error. Please check your connection or try again later.";
    }
};


export const generateMockTest = async (subject: string, numberOfQuestions: number): Promise<MockQuestion[]> => {
    try {
        const response = await fetch('/api/generate-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, numberOfQuestions }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'The AI failed to generate the test.');
        }

        const data: MockQuestion[] = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].question && data[0].options) {
            return data;
        }
        throw new Error("Invalid test structure received from AI.");

    } catch (error) {
        console.error("Failed to generate or parse mock test:", error);
        throw new Error(error.message || "Could not generate the mock test. Please try again.");
    }
};
