import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: { role: string; content: string }[];
  isLoading: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatContainer = ({ messages, isLoading, chatContainerRef }: ChatContainerProps) => (
  <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-32 pt-4">
    <div className="max-w-3xl mx-auto px-4 pr-0">
      {messages.map((msg: { role: string; content: string }, index: number) => (
        <ChatMessage key={index} msg={msg} isLoading={isLoading} />
      ))}
    </div>
  </div>
);

export default ChatContainer;
