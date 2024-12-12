"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import ScrollDownButton from "./components/ScrollDownButton";
import Sidebar from "./components/Sidebar";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        content: error instanceof Error ? error.message : "An error occurred while fetching the response.",
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

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={`flex flex-col transition-all duration-300 flex-grow ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <Header
          title="ChatFusion"
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          chatContainerRef={chatContainerRef}
        />
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          isButtonDisabled={isButtonDisabled}
          isSidebarOpen={isSidebarOpen}
        />
        <ScrollDownButton
          onClick={() =>
            chatContainerRef.current?.scrollTo({
              top: chatContainerRef.current.scrollHeight,
              behavior: "smooth",
            })
          }
        />
      </div>
    </div>
  );
}
