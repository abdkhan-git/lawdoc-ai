
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import {eq} from "drizzle-orm";
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

  const prompt = {
    role: "system",
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
  };

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: [
      prompt, // system prompt
      ...messages, // all previous messages (including user & assistant)
    ],
  });

  return result.toDataStreamResponse();

}
