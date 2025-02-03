"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import ScrollDownButton from "./components/ScrollDownButton";
import Sidebar from "./components/Sidebar";
import { DEFAULT_MODEL, ValidModel } from "../app/api/utils/models";

const BACKEND_URL = "/api/chat";

export type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ValidModel>(DEFAULT_MODEL);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const isButtonDisabled = !message.trim() || isLoading;

  // This function sends a message—whether from text or audio—and updates the chat accordingly.
  const handleSendMessage = async (content: string): Promise<string | void> => {
    if (!content.trim()) return;

    // Capture the current messages so we can build the conversation history correctly.
    const previousMessages = [...messages];
    const userMessage: Message = { role: "user", content };

    // Update state with the new user message.
    setMessages([...previousMessages, userMessage]);
    // Clear the text input (for text messages, this has no effect on audio).
    setMessage("");

    setIsLoading(true);

    // Add a temporary AI message (to be updated when the API returns).
    const temporaryResponse: Message = { role: "ai", content: "" };
    setMessages((prev) => [...prev, temporaryResponse]);

    try {
      // Build the conversation history including the new user message.
      const conversationHistory = [...previousMessages, userMessage]
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");
      const fullQuery = `${conversationHistory}\nuser: ${content}`;

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: fullQuery, model: selectedModel }),
      });

      if (response.status === 429) {
        const errorData = await response.json();
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            role: "ai",
            content: `Rate limit exceeded. Try again in ${errorData.remainingTime} seconds.`,
          };
          return updatedMessages;
        });
        return;
      }

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      const aiResponseText = data.data || "No response from AI.";
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          role: "ai",
          content: aiResponseText,
        };
        return updatedMessages;
      });
      return aiResponseText;
    } catch (error: unknown) {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          role: "ai",
          content:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching the response.",
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For text messages, we call handleSendMessage with the current message.
  const handleSend = async () => {
    await handleSendMessage(message);
  };

  // Checks whether the chat container is scrollable and if it’s at the bottom.
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const isScrollableNow = container.scrollHeight > container.clientHeight;
      setIsScrollable(isScrollableNow);

      // A tolerance of 5px for minor discrepancies.
      const isBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 5;
      setIsAtBottom(isBottom);
    }
  };

  // Run when messages update: update scroll position and scroll if already at bottom.
  useEffect(() => {
    handleScroll();
    if (isAtBottom) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Attach the scroll event listener.
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex flex-col transition-all duration-300 flex-grow ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
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
          handleAudioSend={handleSendMessage}
          isButtonDisabled={isButtonDisabled}
          isSidebarOpen={isSidebarOpen}
        />
        {isScrollable && !isAtBottom && (
          <ScrollDownButton
            onClick={() =>
              chatContainerRef.current?.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
              })
            }
          />
        )}
      </div>
    </div>
  );
}
