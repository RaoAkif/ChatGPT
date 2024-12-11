"use client";
import { useState, useRef, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ChatButton from "./components/ChatButton";
import AttachIcon from "./components/AttachIcon";
import ScrollDownButton from "./components/ScrollDownButton";
import AiBotIcon from "./components/AiBotIcon";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BACKEND_URL = "/api/chat";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const chatContainerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setIsButtonDisabled(!message.trim() || isLoading);
  }, [message, isLoading]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsButtonDisabled(true);

    const temporaryResponse = {
      role: "ai" as const,
      content: "",
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

      if (response.status === 429) {
        const errorData = await response.json();
        
        // AI should acknowledge rate limit exceeded
        const aiMessage = {
          role: "ai" as const,
          content: `Rate limit exceeded. Try again in ${errorData.remainingTime} seconds.`,
        };
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = aiMessage;
          return updatedMessages;
        });

        setIsLoading(false);
        setIsButtonDisabled(true);
        return;
      }

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
    } catch (error: unknown) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        role: "ai" as const,
        content: (error instanceof Error ? error.message : "An error occurred while fetching the response."),
      };
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = errorMessage;
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isButtonDisabled) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      return;
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
          <h1 className="text-2xl font-bold text-white text-left">ChatFusion</h1>
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
                    ? "text-gray-100 text-justify"
                    : "bg-[#2F2F2F] text-white ml-auto"
                }`}
              >
                <div className="flex items-center">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="markdown"
                  >
                    {msg.content}
                  </ReactMarkdown>
                  {isLoading && msg.content === "" && (
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
              placeholder="Message ChatFusion"
              rows={3}
              className="flex-1 rounded-3xl bg-[#2F2F2F] text-gray-100 px-4 py-3 placeholder-gray-400 outline-none"
            />
            <ChatButton
              onClick={handleSend}
              isLoading={isLoading}
              isButtonDisabled={isButtonDisabled}
            />
            <AttachIcon
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
