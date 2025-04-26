import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server"; // <-- ✅ fix here
import { NextResponse } from "next/server";


// /api/create-chat
export async function POST(req: Request) {
  const { userId } = await auth(); // ✅ needs await
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    console.log("Received file_key:", file_key, "file_name:", file_name);

    // 1. Load and insert into Pinecone
    await loadS3IntoPinecone(file_key);

    // 2. Insert into database
    const insertedChats = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      { chat_id: insertedChats[0].insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in create-chat:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}