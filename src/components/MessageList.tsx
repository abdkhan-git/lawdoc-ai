'use client';
import { cn } from '@/lib/utils';
import { Message } from 'ai/react';
import React from 'react';
import { User, Bot } from 'lucide-react';

type Props = {
    messages: Message[]
}

const MessageList = ({ messages }: Props) => {
    if (!messages || messages.length === 0) {
        return (
            // If no conversations have started, program will return a UI that displays a message to start asking questions.
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Bot className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                    <p className="text-gray-500 max-w-md">Start by asking a question about your document.</p>
                </div>
            </div>
        );
    }
    
    return (
        // Main container for the message list
        <div className='flex flex-col gap-4 px-4 py-4'>
            {/* Map through each message in the conversation */}
            {messages.map(message => {
                // Determine if the message is from the user or the AI
                const isUser = message.role === 'user';
                
                return (
                    // Message container with conditional styling based on sender
                    <div key={message.id}
                        className={cn('flex group', {
                            'justify-end': isUser, // Align user messages to the right
                        })}
                    >
                        {/* Inner message container with avatar and content */}
                        <div className={cn(
                            'flex items-start gap-3 max-w-[80%] group relative',
                            { 'flex-row-reverse': isUser } // Reverse order for user messages (avatar on right)
                        )}>
                            {/* Avatar section - different styling for user and A.I Chatbot */}
                            <div className={cn(
                                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                                isUser ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-blue-100' // Blue gradient for user, light blue for AI
                            )}>
                                {/* Display appropriate icon based on sender */}
                                {isUser ? (
                                    <User className="h-5 w-5 text-white" /> // User icon for user messages
                                ) : (
                                    <Bot className="h-5 w-5 text-blue-600" /> // Bot icon for AI messages
                                )}
                            </div>
                            
                            {/* Message bubble with content */}
                            <div className={cn(
                                'rounded-lg px-4 py-3 shadow-sm',
                                isUser 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none' // Blue gradient icon, top-right corner for user
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none' // White with border icon, top-left corner for AI
                            )}>

                                {/* This is how chat messages are being rendered for both User and A.I in the chatbox */}
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

}

export default MessageList;