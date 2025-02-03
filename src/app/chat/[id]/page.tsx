"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import ChatContainer from "../../components/ChatContainer";
import ChatInput from "../../components/ChatInput";
import Sidebar from "../../components/Sidebar";
import { DEFAULT_MODEL, ValidModel } from "../../api/utils/models";

const ChatPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ValidModel>(DEFAULT_MODEL);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch(`/api/chat/${id}`);
        if (!response.ok) throw new Error("Failed to fetch chat history");
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (id) {
      loadChatHistory();
    }
  }, [id]);

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} loadChat={function (timestamp: string): void {
          throw new Error("Function not implemented.");
        } }      />
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
        <ChatContainer messages={messages} isLoading={false} chatContainerRef={chatContainerRef} />
        <ChatInput message={""} setMessage={() => { } } isButtonDisabled={true} handleSend={function (): Promise<void> {
          throw new Error("Function not implemented.");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } } handleAudioSend={function (transcribedText: string): Promise<string | void> {
          throw new Error("Function not implemented.");
        } } isSidebarOpen={false} />
      </div>
    </div>
  );
};

export default ChatPage;
