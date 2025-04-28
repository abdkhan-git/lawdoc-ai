'use client';
import React, { useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Send, Bot, ArrowDown } from 'lucide-react';
import MessageList from './MessageList';

type Props = { chatid: number };

const ChatComponent = ({ chatid }: Props) => {
    // Use the useChat hook to manage chat state and functionality
    // This handles input state, message history, and API communication
    const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
        api: "/api/chat",
        id: chatid.toString(), // Use unique ID to maintain conversation history
        body: {
            chatid  // Pass the chat ID to the API to maintain conversation context
        }
    });

    // Reference to automatically scroll to the latest message
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Reference to the chat container for scroll management
    const chatContainerRef = useRef<HTMLDivElement>(null);

    
    // Scroll to bottom of messages when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='relative flex flex-col h-screen bg-gray-50'>
            {/* Header */}
            <div className='sticky top-0 inset-x-0 p-3 bg-white border-b border-gray-200 z-10 shadow-sm'>
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <h3 className='font-semibold text-gray-800'>Ask about your document</h3>
                </div>
            </div>

            {/* Message List where the user and A.I Chatbot can exchange messages */}
            <div className="flex-1 overflow-y-auto pb-20" ref={chatContainerRef}>
                <MessageList messages={messages} />
                <div ref={messagesEndRef} />
                
                {/* AI is typing indicator */}
                {isLoading && (
                    <div className="flex items-center space-x-2 p-4 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                    </div>
                )}
            </div>
            
            {/* Scroll to bottom button - shows only when scrolled up */}
            <Button
                onClick={scrollToBottom}
                className="absolute bottom-20 right-4 rounded-full p-2 bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                size="icon"
            >
                <ArrowDown className="h-4 w-4" />
            </Button>

            {/* Input Form */}
            <form 
                onSubmit={handleSubmit}
                className='absolute bottom-0 inset-x-0 px-4 py-3 bg-white border-t border-gray-200'
            >

                {/* Input field to ask questions to the A.I chatbot */}
                <div className='flex'>
                    <Input 
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Ask any question about your document...'
                        className='w-full border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50' 
                        disabled={isLoading}
                    />

                    {/* Send button to submit the question */}
                    <Button 
                        className='ml-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm' 
                        disabled={isLoading || !input.trim()}
                        type="submit"
                    >
                        <Send className='h-4 w-4' />
                    </Button>
                </div>
            </form>
            
            {/* Scrollbar Styling */}
            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(30, 58, 138, 0.1);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.5);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(96, 165, 250, 0.7);
                }
            `}</style>
        </div>
    );
};

export default ChatComponent;