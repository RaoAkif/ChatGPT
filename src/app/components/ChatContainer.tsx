import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: { role: string; content: string }[];
  isLoading: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContainer = ({ messages, isLoading, chatContainerRef }: ChatContainerProps) => (
  // Added bottom padding (e.g., pb-32 using Tailwind, which equals 8rem)
  <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-32">
    <div className="max-w-[55%] mx-auto pr-10">
      {messages.map((msg, index) => (
        <ChatMessage key={index} msg={msg} isLoading={isLoading} />
      ))}
    </div>
  </div>
);

export default ChatContainer;
