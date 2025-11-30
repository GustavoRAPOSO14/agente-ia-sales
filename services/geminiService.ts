import { GoogleGenAI } from "@google/genai";
import { GeminiResponse } from "../types";

// Initialize Gemini Client
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o SmartShopper, um assistente de compras inteligente e entusiasta do Brasil.
Seu objetivo é ajudar os usuários a encontrar os melhores produtos, promoções reais e oportunidades de compra.

Diretrizes:
1. Use a ferramenta 'googleSearch' para encontrar preços ATUAIS, promoções e disponibilidade de produtos.
2. Sempre forneça o nome do produto, o preço encontrado (se disponível) e a loja.
3. Se o usuário pedir "promoções", procure por ofertas reais e tendências atuais.
4. Responda em Português do Brasil de forma amigável, clara e formatada com Markdown.
5. Use listas e negrito para destacar preços e nomes de produtos.
6. Não invente preços. Se não encontrar o preço exato, dê uma estimativa baseada na pesquisa ou diga que varia.
7. Seja conciso, mas útil.
`;

export const sendMessageToAgent = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<GeminiResponse> => {
  
  try {
    // We use generateContent for a stateless-like feel but respecting history if we were to implement full chat session.
    // For this implementation, we will treat it as a single turn with history context passed if needed, 
    // or just use the model directly. To keep it simple and robust with tools, we'll use a new chat session each time or generateContent.
    // Given the complexity of tools in Chat, generateContent is often more predictable for single-turn-with-context.
    
    // Construct the full content with history + new prompt
    // However, the SDK 'chats' API is better for history management.
    // Let's use ai.chats.create for proper history handling.

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash', // Using 2.5 Flash for speed and Search tool support
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // ENABLE SEARCH GROUNDING
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({
        message: prompt
    });

    // Extract text
    const text = result.text || "Não encontrei informações sobre isso no momento.";
    
    // Extract grounding metadata (sources)
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;

    return {
      text,
      groundingMetadata: groundingMetadata as any // Cast because our local type might be slightly simplified
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};