'use client';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    chats: DrizzleChat[],
    chatId: number,
}

const ChatSideBar = ({ chats, chatId }: Props) => {
    return (
        <div className='w-full h-screen p-4 text-white bg-[#1c3e94] flex flex-col'>
            {/* Header/Logo */}
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-blue-300" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                    LawDocAI
                </span>
            </div>
            
            {/* New Chat Button */}
            <Link href='/'>
                <Button className='w-full bg-blue-800/50 hover:bg-blue-700/60 border border-blue-700/50 backdrop-blur-sm text-white mb-4 transition-all'>
                    <PlusCircle className='mr-2 w-4 h-4' />
                    New Document
                </Button>
            </Link>

            {/* Chat List that contains history of past conversations */}
            <div className="flex flex-col gap-2 mt-2 overflow-y-auto flex-grow">
                <h3 className="text-sm text-blue-300 font-medium mb-1 ml-1">Your Documents</h3>

                {/* Display list of chat conversations from database */}
                {chats.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={
                            cn('rounded-lg p-3 flex items-center transition-all', {
                                'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md': chat.id === chatId,
                                'bg-blue-800/30 text-blue-100 hover:bg-blue-800/50 backdrop-blur-sm border border-blue-700/50': chat.id !== chatId,
                            })
                        }>
                            <MessageCircle className='mr-2 flex-shrink-0 text-blue-300' />
                            <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer Links */}
            <div className='mt-4 pt-4 border-t border-blue-800/50'>
                <div className='flex items-center gap-3 text-sm text-blue-300'>
                    <Link href='/' className="hover:text-white transition-colors">Home</Link>
                    <span className="text-blue-700">•</span>
                    <Link href='/' className="hover:text-white transition-colors">Support</Link>
                </div>
                <p className="text-xs text-blue-400 mt-2">© {new Date().getFullYear()} LawDocAI</p>
            </div>
        </div>
    )
}

export default ChatSideBar