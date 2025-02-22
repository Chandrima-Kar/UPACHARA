/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBLvGgf-IdpH2fakfG0O2aNHwMoCsdKp-A";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Define the prompt and session for the Biomedical and Healthcare Management System Expert
export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "You are an expert in Biomedical and Healthcare Management System. Act as an expert in Biomedical and Healthcare and answer all the questions related only to this field. Keep information precise, and if someone asks something irrelevant, respond that it's irrelevant.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `
{
  "response": "Sure, I can help with Biomedical and Healthcare Management System information in the specified language. Please ask your question.",
  "irrelevantResponse": "The question asked is irrelevant to Biomedical and Healthcare Management System. Please ask a relevant question."
}`,
        },
      ],
    },
  ],
});

// Example usage of the chatSession
export const askExpert = async (question, language) => {
  const response = await chatSession.continue({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Please provide information about the cultural heritage of Egypt in ${language}.`,
          },
        ],
      },
    ],
  });

  return response.data; // This will return the expert's response in the specified language
};
