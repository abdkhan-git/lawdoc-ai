import { db } from "@/lib/db"; // Database connection
import { chats } from "@/lib/db/schema"; // Database schema for chats table
import { loadS3IntoPinecone } from "@/lib/pinecone"; // Utility to process PDFs and store in vector database
import { getS3Url } from "@/lib/s3"; // Utility to generate URLs for S3 objects
import { auth } from "@clerk/nextjs/server"; // Authentication from Clerk
import { NextResponse } from "next/server"; // Next.js API response helper


// API Route: /api/create-chat
// This endpoint handles the creation of a new chat associated with an uploaded PDF
export async function POST(req: Request) {

  // Get the authenticated user's ID from Clerk
  const { userId } = await auth(); // ✅ needs await
  
  // If no user is authenticated, return 401 Unauthorized response
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body to get file information
    const body = await req.json();
    const { file_key, file_name } = body;

    // Log the received file information for debugging
    console.log("Received file_key:", file_key, "file_name:", file_name);

    // Step 1: Process the PDF file
    // This loads the file from S3, extracts text, splits into chunks,
    // generates embeddings, and stores them in Pinecone for semantic search
    await loadS3IntoPinecone(file_key);

    // Step 2: Create a new chat record in the database
    // This associates the uploaded file with the user and stores metadata
    const insertedChats = await db
      .insert(chats)
      .values({
        fileKey: file_key,     // S3 key of the uploaded file
        pdfName: file_name,    // Original name of the PDF
        pdfUrl: getS3Url(file_key), // Generate a URL to access the file
        userId,                // Associate with the current user
      })
      .returning({
        insertedId: chats.id,  // Return the ID of the newly created chat
      });

    // Return success response with the new chat ID
    // This allows the client to redirect to the new chat
    return NextResponse.json(
      { chat_id: insertedChats[0].insertedId },
      { status: 200 }
    );
  } catch (error) {
    // Log any errors that occur during processing
    console.error("Error in create-chat:", error);
    
    // Return a generic error response
    // This prevents exposing sensitive error details to the client
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
