"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import ChatContainer from "../../components/ChatContainer";
import ChatInput from "../../components/ChatInput";
import Sidebar from "../../components/Sidebar";
import { DEFAULT_MODEL, ValidModel } from "../../api/utils/models";

export type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const params = useParams(); // Extract the `id` parameter
  const id = params?.id as string; // `id` is the dynamic route parameter

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<ValidModel>(DEFAULT_MODEL);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Debugging: Log the `id` to verify it's correct
  console.log("Dynamic Route ID:", id);

  // Load chat history from localStorage when the `id` changes
  useEffect(() => {
    if (id) {
      // Debugging: Log the keys in localStorage
      console.log("LocalStorage Keys:", Object.keys(localStorage));

      const chatHistory = localStorage.getItem(id);
      if (chatHistory) {
        // Debugging: Log the fetched chat history
        console.log("Chat History:", chatHistory);

        const chatData = JSON.parse(chatHistory);
        setMessages(chatData.messages);
      } else {
        console.error("Chat not found in localStorage");
      }
    }
  }, [id]);

  const loadChatFromStorage = (timestamp: string) => {
    const chatHistory = localStorage.getItem(timestamp);
    if (chatHistory) {
      const chatData = JSON.parse(chatHistory);
      setMessages(chatData.messages);
    }
  };

  const handleSend = async (): Promise<void> => {
    // Add your logic here
  };

  const handleAudioSend = async (transcribedText: string): Promise<string | void> => {
    // Add your logic here
    return transcribedText; // Example return value
  };

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        loadChat={loadChatFromStorage}
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
          isLoading={false}
          chatContainerRef={chatContainerRef}
        />
        <ChatInput
          message={""}
          setMessage={() => {}}
          handleSend={handleSend}
          handleAudioSend={handleAudioSend}
          isButtonDisabled={true}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
}