"use client";
import { useState, useRef, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ChatButton from "./components/ChatButton"; // Importing ChatButton component
import ScrollDownButton from "./components/ScrollDownButton"; // Importing ScrollDownButton component
import AiBotIcon from "./components/AiBotIcon"; // Importing AiBotIcon component

const BACKEND_URL = "/api/chat";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState(""); // State to hold the user's message
  const [messages, setMessages] = useState<Message[]>([]); // Start with an empty array
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button while waiting for response

  const chatContainerRef = useRef<null | HTMLDivElement>(null); // Reference to scroll container

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsButtonDisabled(true);

    const temporaryResponse = {
      role: "ai" as const,
      content: "Please wait...",
    };
    setMessages((prev) => [...prev, temporaryResponse]);

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

      setMessages((prev) => {
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
      setMessages((prev) => {
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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#212121] text-gray-100">
      <div className="w-full bg-[#212121] p-4">
        <div className="mx-auto">
        <h1 className="text-2xl font-bold text-white text-left">Chat</h1>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-32 pt-4">
        <div className="max-w-3xl mx-auto px-4 pr-0">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 mb-4 items-start ${
                msg.role === "ai"
                  ? "justify-start"
                  : "justify-end flex-row-reverse"
              }`}
            >
              {msg.role === "ai" && <AiBotIcon />}
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  msg.role === "ai"
                    ? "text-gray-100"
                    : "bg-[#2F2F2F] text-white ml-auto"
                }`}
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

      <div className="fixed bottom-0 w-full" style={{ backgroundColor: "#212121" }}>
        <div className="max-w-3xl mx-auto pb-4">
          <div className="flex gap-3 items-center relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              rows={3}
              className="flex-1 rounded-xl border bg-[#2F2F2F] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white-100 focus:border-transparent placeholder-gray-400 resize-none"
            />
            <ChatButton
              onClick={handleSend}
              isLoading={isLoading}
              isButtonDisabled={isButtonDisabled}
            />
          </div>
        </div>
      </div>

      <ScrollDownButton onClick={scrollToBottom} />
    </div>
  );
}
