
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateThumbnail(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `YouTube thumbnail for a video about: ${prompt}. Vibrant, eye-catching, high-contrast, clear focal point.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No images were generated.");
        }
    } catch (error) {
        console.error("Error generating thumbnail with Gemini:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}
