'use client'
import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import MessageList from './MessageList'

type Props = {}

const ChatComponent = (props: Props) => {
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        //endpoint so that when "enter" is pressed, user's message will be sent to ai and the ai will send back responses
        api: "/api/chat",
    });

    return (
        <div className='relative max-h-screen overflow-scroll'>
            {/* header */}
            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>

            {/* message list */}
            <MessageList messages={messages} />

            <form onSubmit={handleSubmit}
                className='sticky top-0 inset-x-0 px-2 py-4 bg-white'
            >
                <div className='flex'>
                    {/* this allows ai to control this input  */}
                    <Input value={input}
                        onChange={handleInputChange}
                        placeholder='Ask any question...'
                        className='w-full' 
                    />

                    <Button className='bg-blue-600 ml-2' >
                        <Send className='h-4 w-4' />
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default ChatComponent