// app/chat/[chatid]/page.tsx
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";

type Props = {
  params: {
    chatid: string;
  };
};

const ChatPage = async ({ params }: Props) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats || _chats.length === 0) {
    return redirect("/");
  }

  const chatId = parseInt(params.chatid);
  const currentChat = _chats.find((chat) => chat.id === chatId);

  if (!currentChat) {
    return redirect("/");
  }

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="flex w-full max-h-screen overflow-hidden">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={chatId} />
        </div>

        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat.pdfUrl} />
        </div>

        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
