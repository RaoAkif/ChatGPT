import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AiBotIcon from "./AiBotIcon";
import LoadingIndicator from "./LoadingIndicator";

interface ChatMessageProps {
  msg: {
    role: string;
    content: string;
  };
  isLoading: boolean;
}

const ChatMessage = ({ msg, isLoading }: ChatMessageProps) => (
  <div className={`flex gap-4 mb-16 items-start ${msg.role === "ai" ? "justify-start" : "justify-end flex-row-reverse"}`}>
    {msg.role === "ai" && <AiBotIcon />}
    <div
      style={{fontSize: "16px", fontFamily: "Inter, sans-serif", lineHeight: "1.7em"}}
      className={`px-4 py-2 rounded-2xl ${
        msg.role === "ai" ? "text-[#ECECEC] text-pretty" : "bg-[#2F2F2F] text-[#ECECEC] ml-auto max-w-[100%]"
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
      {isLoading && msg.content === "" && <LoadingIndicator />}
    </div>
  </div>
);

export default ChatMessage;
