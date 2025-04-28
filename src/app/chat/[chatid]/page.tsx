// Import necessary dependencies
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { parse } from "path";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";


/**
 * Define the props type for this page component.
 * Uses Next.js dynamic route parameter 'chatid'
 */
type Props = {
  params: {
    chatid: string; // URL parameter for the chat ID
  };
};



const ChatPage = async ({ params: { chatid } }: Props) => {
  // Get the authenticated user's ID from Clerk
  const { userId } = await auth();

  // If no user is authenticated, redirect to sign-in page
  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch all chats belonging to the current user from the database
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  // If no chats exist for the user, redirect to home page
  if (!_chats) {
    return redirect("/");
  }

  // If the requested chat ID doesn't belong to the user, redirect to home page
  // This is a security measure to prevent accessing other users' chats
  if (!_chats.find((chat) => chat.id === parseInt(chatid))) {
    return redirect("/");
  }


  // Find the current chat from the list of user's chats
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatid));

  // Render the chat interface with a three-panel layout
  return (
    <div className="flex max-h-screen overflow-hidden bg-[#1c3e94]/5">
      <div className="flex w-full max-h-screen overflow-x-hidden">
        {/* Left panel: Chat sidebar for navigation between chats */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatid)} />
        </div>

        {/* Middle panel: PDF viewer to display the document */}
        <div className="max-h-screen p-4 overflow-hidden flex-[5] bg-white">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
        </div>

        {/* Right panel: Chat component for interaction with the AI */}
        <div className="flex-[3] border-l border-blue-200">
          <ChatComponent chatid={parseInt(chatid)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
