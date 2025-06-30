import { GoogleGenerativeAI } from "@google/generative-ai";

// Define ChatMessage type
export type ChatMessage = { role: 'user' | 'assistant'; content: string; };

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDkHvLRZolseWGmTSxf0rehUnHAFOFFA_c");

// sendChat sends a conversation array to Gemini and returns the assistant reply
export async function sendChat(messages: ChatMessage[]): Promise<ChatMessage> {
  try {
    // Convert messages to Gemini format
    const history = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Get the Gemini model instance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Start chat with history
    const chat = model.startChat({
      history: history.slice(0, -1), // All messages except the last one
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Get the last message (current user input)
    const currentMessage = messages[messages.length - 1].content;
    
    // Send message and get response
    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    const text = response.text();

    return { role: 'assistant', content: text };
  } catch (error) {
    console.error('Error sending chat:', error);
    throw new Error('Failed to get response from Gemini');
  }
}
