"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Download, Send, FileDown, Copy, ArrowDown } from "lucide-react";
import MessageList from "./MessageList";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

type Message = {
  id: number;
  role: "system" | "user";
  content: string;
  createdAt: Date;
};

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ chatid: string }>();
  const chatId = parseInt(params.chatid as string);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${chatId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    try {
      setLoading(true);

      // Optimistically add user message to UI
      const userMessage: Message = {
        id: Date.now(), // Temporary ID
        role: "user",
        content: input,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput(""); // Clear input field

      // Show typing indicator
      setIsTyping(true);

      // Send message to API
      const response = await axios.post("/api/chat", {
        message: input,
        chatId,
      });

      // Hide typing indicator and add AI response
      setIsTyping(false);

      const aiMessage: Message = {
        id: Date.now() + 1, // Temporary ID
        role: "system",
        content: response.data.message,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeDocument = async () => {
    try {
      setLoading(true);

      // Add user request message
      const userMessage: Message = {
        id: Date.now(),
        role: "user",
        content:
          "Please create a comprehensive cheat sheet of this document that can be used as a quick reference.",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Show typing indicator
      setIsTyping(true);

      // Request comprehensive summary
      const response = await axios.post("/api/summarize", {
        chatId,
      });

      // Hide typing indicator
      setIsTyping(false);

      // Add AI response with summary
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "system",
        content: response.data.summary,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      toast.success("Document cheat sheet created!");
    } catch (error) {
      console.error("Error creating summary:", error);
      setIsTyping(false);
      toast.error("Failed to create document summary");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <div className="relative h-screen flex flex-col">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit z-10 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Chat</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleSummarizeDocument}
              className="bg-green-600 text-white text-xs px-2 py-1 hover:bg-green-700 transition-colors"
              size="sm"
              disabled={loading || isTyping}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Generate Cheat Sheet
            </Button>
          </div>
        </div>
      </div>

      {/* message list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 chat-container">
        <MessageList messages={messages} onCopy={copyToClipboard} />

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 p-4">
            <div className="typing-indicator">
              <div className="typing-indicator-dot"></div>
              <div className="typing-indicator-dot"></div>
              <div className="typing-indicator-dot"></div>
              <span className="text-sm text-gray-500 ml-2">
                AI is thinking...
              </span>
            </div>
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button, shown only when not already at bottom */}
      <Button
        onClick={scrollToBottom}
        className="absolute bottom-20 right-4 rounded-full p-2 bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        size="icon"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white border-t border-gray-200"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any question about the document..."
            className="w-full shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading || isTyping}
          />

          <Button
            className="bg-blue-600 ml-2 transition-all hover:bg-blue-700 shadow-sm"
            type="submit"
            disabled={loading || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
