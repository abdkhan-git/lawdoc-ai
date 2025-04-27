
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'), // Updated model
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
