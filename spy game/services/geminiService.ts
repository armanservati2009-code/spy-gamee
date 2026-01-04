
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSecretWord = async (
  category: string, 
  lang: Language, 
  excludeWords: string[] = []
): Promise<{ word: string; sources: string[] }> => {
  const excludePart = excludeWords.length > 0 
    ? (lang === 'fa' 
        ? `ضمناً از انتخاب این کلمات خودداری کن: ${excludeWords.join('، ')}.` 
        : `Avoid choosing these words: ${excludeWords.join(', ')}.`)
    : "";

  const prompt = lang === 'fa' 
    ? `یک کلمه یا عبارت کوتاه و خلاقانه برای بازی "جاسوس" در دسته‌بندی "${category}" انتخاب کن. ${excludePart} فقط کلمه را به فارسی بنویس.`
    : `Choose a single creative word or short phrase for a "Spy" game in the category "${category}". ${excludePart} Return only the word in English.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: lang === 'fa' 
          ? "تو یک استاد بازی‌های دورهمی هستی. کلماتی انتخاب کن که نه خیلی ساده باشند و نه خیلی پیچیده. از کلمات تکراری دوری کن."
          : "You are a master of social games. Choose words that are neither too simple nor too complex. Avoid repetitive words.",
        temperature: 1.0, 
      },
    });

    const word = response.text?.trim().replace(/[".]/g, '') || (lang === 'fa' ? "مریخ" : "Mars");
    // Extract grounding chunks if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter(Boolean) || [];

    return { word, sources };
  } catch (error) {
    console.error("Error fetching word from Gemini:", error);
    const fallbacks = lang === 'fa' 
      ? ["مریخ", "زیردریایی", "ایستگاه فضایی", "رستوران چینی", "موزه لوور"]
      : ["Mars", "Submarine", "Space Station", "Chinese Restaurant", "Louvre Museum"];
    return { word: fallbacks[Math.floor(Math.random() * fallbacks.length)], sources: [] };
  }
};
