import { db } from "@/lib/db";
 import { chats } from "@/lib/db/schema";
 import {eq} from "drizzle-orm";
 import { auth } from '@clerk/nextjs/server'
 import { redirect } from 'next/navigation'
 import React from 'react'
 import { parse } from "path";
 import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
 
 type Props = {
   params: {
     chatid: string;
   };
      
 };
 
 const ChatPage = async ({ params: { chatid } }: Props) => {
   const { userId } = await auth();
 
   if (!userId) {
     return redirect("/sign-in");
   }
 
   const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
 
   if (!_chats) {
     return redirect("/");
   }
 
   if (!_chats.find((chat) => chat.id === parseInt(chatid))) {
     return redirect("/");
   }
 
   const currentChat = _chats.find((chat) => chat.id === parseInt(chatid));
 
   return (
     <div className="flex max-h-screen overflow-hidden">
       <div className="flex w-full max-h-screen overflow-x-hidden">
         {/* chat sidebar */}
         <div className="flex-[1] max-w-xs">
           <ChatSideBar chats={_chats} chatId={parseInt(chatid)} />
         </div>
 
         {/* pdf viewer */}
         <div className="max-h-screen p-4 overflow-hidden flex-[5]">
           <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
         </div>
         
         
 
         {/* chat component */}
         <div className="flex-[3] border-l-4 border-l-slate-200">
           <ChatComponent />
         </div>
       </div>
     </div>
   )
 }
 
 export default ChatPage