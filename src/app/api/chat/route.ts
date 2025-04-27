import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import { eq } from "drizzle-orm";
import { chats } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { getContext } from '@/lib/context';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages, chatid } = await req.json();
  const _chats = await db.select().from(chats).where(eq(chats.id, chatid));

  if (_chats.length !== 1) {
    return NextResponse.json('Chat not found', { status: 404 });
  }

  const fileKey = _chats[0].fileKey;
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage, fileKey);

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

  const recentMessages = messages.slice(-10); // Only send last 10 messages

  const result = await streamText({
    model: openai('gpt-3.5-turbo-1106'), // or 'gpt-4o'
    messages: [
      systemPrompt,
      ...recentMessages,
    ],
    maxTokens: 512,
    temperature: 0.2,
  });

  return result.toDataStreamResponse();
}