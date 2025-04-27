// For the orderBy issue, you need to use the column name as defined in your schema
// Looking at your error, it seems the column is defined as "createdAt" in your code but "created_at" in the database
// The solution is to import the specific column from your schema and use that:

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { messages as messagesTable, chats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { OpenAI } from "openai";
import { getPineconeClient } from "@/lib/pinecone";
import { convertToAscii } from "@/lib/utils";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, chatId } = body;

    if (!message || !chatId) {
      return NextResponse.json(
        { error: "Message and chatId are required" },
        { status: 400 }
      );
    }

    // 1. Get the chat details to find the fileKey
    const chat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .then((res) => res[0]);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // 2. Store user message in database
    await db.insert(messagesTable).values({
      chatId: chatId,
      content: message,
      role: "user",
    });

    // 3. Get previous conversation messages for context (up to 10 most recent)
    // FIXED: Use the correct column reference from the schema
    const previousMessages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.chatId, chatId))
      .orderBy(desc(messagesTable.createdAt)) // Use the column reference directly
      .limit(10)
      .then((messages) => messages.reverse());

    const conversationHistory = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Rest of your code remains the same...

    // 4. Vectorize the user's message using Pinecone
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME!);

    // Use the chat's fileKey as the namespace in Pinecone
    const namespace = pineconeIndex.namespace(convertToAscii(chat.fileKey));

    // 5. Get embeddings for user query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: message,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // 6. Search Pinecone for similar content
    const queryResponse = await namespace.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    // 7. Format context from similar results
    let context = "";
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      context = queryResponse.matches
        .map((match) => {
          if (match.metadata?.text) {
            return `Page ${match.metadata.pageNumber}: ${match.metadata.text}`;
          }
          return "";
        })
        .join("\n\n");
    }

    // 8. Generate AI response with context and conversation history
    const systemPrompt = `
You are an AI assistant for answering questions about legal documents.
You are given the following extracted parts of a legal document and a question.
Provide a conversational, thoughtful, and detailed answer based on the context provided.

If you don't know the answer or if the context doesn't provide enough information, explain what you don't know 
and suggest what might help answer the question better.

Use markdown formatting in your responses to improve readability:
- Use **bold** for important terms or concepts
- Use bullet points or numbered lists for multiple items
- Use headings (## or ###) for organization
- Use code blocks for examples of clauses or citations

DOCUMENT CONTEXT:
${context}

PREVIOUS CONVERSATION:
${conversationHistory
  .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
  .join("\n\n")}
`;

    // 9. Generate completion with a more capable model
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7, // Slightly creative but still focused
      max_tokens: 1500, // Allow for thorough responses
    });

    const aiMessage = response.choices[0].message.content;

    // 10. Save AI response to database
    await db.insert(messagesTable).values({
      chatId: chatId,
      content: aiMessage || "Sorry, I couldn't generate a response.",
      role: "system",
    });

    // 11. Return formatted response
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
