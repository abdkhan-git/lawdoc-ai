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
        <div className='relative flex flex-col h-screen bg-gray-100'>
            {/* header */}
            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit z-10'>
                <h3 className='text-xl font-bold'>Ask our amazing LawDoc A.I for answers!</h3>
            </div>

            {/* message list  */}
            <div className='flex-1 overflow-y-auto pb-20'>
                <MessageList messages={messages} />
            </div>

            {/* input form */}
            <form onSubmit={handleSubmit}
                className='absolute bottom-0 inset-x-0 px-2 py-4 bg-white border-t border-gray-200'
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