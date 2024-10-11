"use client";
import React from "react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { cn } from "@/lib/utils";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { messages } = useChat({
    api: "/api/chat",
    body: { chatId },
    initialMessages: data || [],
  });

  return (
    <div className="relative max-h-screen overflow-scroll" id="message-container">
      <MessageList messages={messages} isLoading={isLoading} />
      {/* Form components */}
    </div>
  );
};

type MessageListProps = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages }: MessageListProps) => (
  <div className="flex flex-col gap-2 px-4">
    {messages.map((message) => (
      <div key={message.id} className={cn("flex", { 'justify-end pl-10': message.role === 'user', 'justify-start pr-10': message.role === 'assistant' })}>
        <div className={cn("rounded-lg px-3 text-sm py-1 shadow-md ring-1", { 'bg-blue-600 text-white': message.role === 'user' })}>
          <p>{message.content}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ChatComponent;