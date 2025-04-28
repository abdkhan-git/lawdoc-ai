import { streamText } from 'ai'; // Utility for streaming AI responses
import { openai } from '@ai-sdk/openai'; // OpenAI client from AI SDK
import { db } from '@/lib/db'; // Database connection
import { eq } from "drizzle-orm"; // SQL query builder utility
import { chats } from '@/lib/db/schema'; // Database schema for chats
import { NextResponse } from 'next/server'; // Next.js API response helper
import { getContext } from '@/lib/context'; // Utility to retrieve relevant document context


// Specify the runtime environment for this API route
export const runtime = 'nodejs';


/**
 * API Route: /api/chat
 * This endpoint handles chat message processing and AI responses
 * @param req Request
 * @returns OpenAI Responses
 */
export async function POST(req: Request) {

  // Parse the request body to get messages and chat ID
  const { messages, chatid } = await req.json();
  

  // Fetch the chat from the database using the provided chat ID
  const _chats = await db.select().from(chats).where(eq(chats.id, chatid));


  // If the chat doesn't exist, return 404 Not Found response
  if (_chats.length !== 1) {
    return NextResponse.json('Chat not found', { status: 404 });
  }

  // Get the file key associated with this chat
  const fileKey = _chats[0].fileKey;
  

  // Get the last message from the user to understand their query
  const lastMessage = messages[messages.length - 1];
  

  // Retrieve relevant context from the document based on the user's query
  // This uses vector search to find the most relevant parts of the document
  const context = await getContext(lastMessage, fileKey);

  // Create a system prompt that instructs the AI how to respond
  // This includes the retrieved context to ground the AI's responses
  const systemPrompt = {
    role: "system",
    content: `
      You are a helpful AI assistant. Use the CONTEXT BLOCK provided.
      Do not make up answers outside the context. If unknown, respond with:
      "I'm sorry, but I don't know the answer to that question."
      
      CONTEXT BLOCK:
      ${context}
    `,
  };

  // Only use the most recent messages to stay within token limits
  // This prevents the conversation from becoming too long for the model
  const recentMessages = messages.slice(-10); // Only send last 10 messages

  
  // Generate a streaming text response from the AI model
  const result = await streamText({
    model: openai('gpt-3.5-turbo-1106'), // Specify which OpenAI model to use
    messages: [
      systemPrompt,           // Instructions and context for the AI
      ...recentMessages,      // Recent conversation history
    ],
    maxTokens: 512,           // Limit response length
    temperature: 0.2,         // Lower temperature for more focused/deterministic responses
  });

  // Return the streaming response to the client
  // This allows the AI's response to appear gradually as it's generated
  return result.toDataStreamResponse();
}
