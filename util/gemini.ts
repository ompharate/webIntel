import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function askGeminiAI(
  content: string,
  question: string,
  url: string
) {
  const combined = [
    {
      role: "user",
      parts: [
        {
          text: `
           You are visiting a website, and here is the content provided to you:
          ${content}
          Please read the content carefully and answer the user's question:
        **User's Question:** ${question}
      **Website URL:** ${url}
          `,
        },
      ],
    },
  ];

  try {
    const result = await model.generateContent({
      contents: combined,
      generationConfig: {
        maxOutputTokens: 350,
        temperature: 0.1,
      },
    });

    return result.response?.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content from Gemini AI");
  }
}
