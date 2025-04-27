"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Copy, User, Bot } from "lucide-react";
import { Button } from "./ui/button";

type Message = {
  id: number;
  role: "system" | "user";
  content: string;
  createdAt: Date | string;
};

type Props = {
  messages: Message[];
  onCopy?: (text: string) => void;
};

// Simple function to format code blocks
const formatMessage = (content: string) => {
  // Split content by code blocks
  const parts = content.split(/```([^`]+)```/).filter(Boolean);

  return (
    <>
      {parts.map((part, i) => {
        // Even indices are normal text, odd indices are code blocks
        if (i % 2 === 0) {
          // Process regular text - handle basic markdown
          const textWithBreaks = part
            .replace(/\n\n/g, "<br /><br />")
            .replace(/\n/g, "<br />");

          // Format links using regex
          const textWithLinks = textWithBreaks.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>'
          );

          // Format bold text
          const textWithBold = textWithLinks.replace(
            /\*\*([^*]+)\*\*/g,
            "<strong>$1</strong>"
          );

          // Format headings (simplified, just h1, h2, h3)
          const textWithHeadings = textWithBold
            .replace(
              /^# (.*?)$/gm,
              '<h1 class="text-xl font-bold my-2">$1</h1>'
            )
            .replace(
              /^## (.*?)$/gm,
              '<h2 class="text-lg font-semibold my-2">$1</h2>'
            )
            .replace(
              /^### (.*?)$/gm,
              '<h3 class="text-base font-semibold my-1">$1</h3>'
            );

          return (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: textWithHeadings }}
            />
          );
        } else {
          // This is a code block
          return (
            <pre
              key={i}
              className="bg-gray-100 p-3 rounded-md my-2 overflow-x-auto text-sm font-mono"
            >
              {part}
            </pre>
          );
        }
      })}
    </>
  );
};

const MessageList = ({ messages, onCopy }: Props) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
          <Bot className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Start by asking a question about your document.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <div
            key={message.id}
            className={cn("flex group", {
              "justify-end": isUser,
            })}
          >
            <div
              className={cn(
                "flex items-start gap-3 max-w-[80%] group relative",
                { "flex-row-reverse": isUser }
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  isUser ? "bg-blue-600" : "bg-gray-200"
                )}
              >
                {isUser ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-gray-700" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "rounded-lg px-4 py-3 shadow-sm",
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {formatMessage(message.content)}
                  </div>
                )}

                {/* Copy button for AI messages */}
                {!isUser && onCopy && (
                  <Button
                    onClick={() => onCopy(message.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-600 p-1 rounded-full"
                    size="icon"
                    variant="ghost"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
