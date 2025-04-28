import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the most recent chat for this user
    const recentChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt)) // Use the exact column name from your schema
      .limit(1);

    if (recentChats.length === 0) {
      // No chats found
      return NextResponse.json({ chatId: null });
    }

    // Return the ID of the most recent chat
    return NextResponse.json({ chatId: recentChats[0].id });
    
  } catch (error) {
    console.error("Error fetching latest chat:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}