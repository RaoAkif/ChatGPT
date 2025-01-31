import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./ChatMessage.css";
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
  <div
    className={`flex gap-4 mb-16 items-start ${
      msg.role === "ai" ? "justify-start" : "flex-row-reverse"
    }`}
  >
    {msg.role === "ai" && <AiBotIcon />}

    {/* Outer container for the message bubble */}
    <div
      style={{
        fontSize: "16px",
        fontFamily: "Inter, sans-serif",
        lineHeight: "1.7em",
      }}
      className={`px-4 py-2 rounded-2xl max-w-[95%] ${
        msg.role === "ai"
          ? "text-[#ECECEC]"
          : "text-[#ECECEC] bg-[#303030] flex"
      }`}
    >
      {/* Render Markdown with GFM and syntax highlighting */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        className="prose prose-invert max-w-none"
      >
        {msg.content}
      </ReactMarkdown>

      {/* Loading indicator if needed */}
      {isLoading && msg.content === "" && <LoadingIndicator />}
    </div>
  </div>
);

export default ChatMessage;
