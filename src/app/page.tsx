"use client";

import { useState, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

const BACKEND_URL = "/api/chat";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const chatContainerRef = useRef<null | HTMLDivElement>(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsButtonDisabled(true);

    const temporaryResponse = {
      role: "ai" as const,
      content: "Please wait...",
    };
    setMessages(prev => [...prev, temporaryResponse]);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response.");
      }

      const data = await response.json();
      const aiMessage = {
        role: "ai" as const,
        content: data.data || "No response from AI.",
      };

      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = aiMessage;
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        role: "ai" as const,
        content: "An error occurred while fetching the response.",
      };
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = errorMessage;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <div className="w-full bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Chat</h1>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-32 pt-4">
  <div className="max-w-3xl mx-auto px-4 pr-0">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex gap-4 mb-4 items-start ${msg.role === "ai" ? "justify-start" : "justify-end flex-row-reverse"}`}
      >
        {msg.role === "ai" && (
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c.79 0 1.5-.71 1.5-1.5S8.79 9 8 9s-1.5.71-1.5 1.5S7.21 11 8 11zm8 0c.79 0 1.5-.71 1.5-1.5S16.79 9 16 9s-1.5.71-1.5 1.5.71 1.5 1.5 1.5zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
              </svg>
            </div>
          </div>
        )}

        <div
          className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.role === "ai" ? "text-gray-100" : "bg-[#1F2937] text-white ml-auto"}`}
        >
          <div className="flex items-center">
            {msg.content}
            {isLoading && msg.content === "Please wait..." && (
              <span className="ml-2 flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              </span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      <div
        className="fixed bottom-0 w-full"
        style={{ backgroundColor: "#111827" }}
      >
        <div className="max-w-3xl mx-auto pb-4">
          <div className="flex gap-3 items-center relative">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              rows={3}
              className="flex-1 rounded-xl border border-gray-700 bg-[#1F2937] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || isButtonDisabled}
              className="absolute right-3 bottom-3 w-10 h-10 bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition-all disabled:bg-cyan-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i className={`fa-solid ${isLoading ? 'fa-square' : 'fa-arrow-up-long'} w-4 h-4`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
