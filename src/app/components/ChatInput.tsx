import { useRef, useEffect } from "react";
import ChatInputButtons from "./ChatInputButtons";

 type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
  isButtonDisabled: boolean;
  isSidebarOpen: boolean;
};

const ChatInput = ({ message, setMessage, handleSend, isButtonDisabled, isSidebarOpen }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textareaRef.current && inputContainerRef.current) {
      const lineCount = message.split("\n").length;

      let newHeight = 90; // Default height for one line

      if (lineCount === 2) {
        newHeight = 115; // 2 lines
      } else if (lineCount === 3) {
        newHeight = 140; // 3 lines
      } else if (lineCount === 4) {
        newHeight = 165; // 4 lines
      } else if (lineCount === 5) {
        newHeight = 190; // 5 lines
      } else if (lineCount === 6) {
        newHeight = 205; // 6 lines
      } else if (lineCount >= 7) {
        newHeight = 230; // 7+ lines (max limit)
      }

      textareaRef.current.style.height = `${newHeight}px`;
      inputContainerRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  return (
    <div className={`fixed bottom-0 w-full`} style={{ backgroundColor: "#212121" }}>
      <div className="max-w-3xl mx-auto pb-4">
        <div 
          className="flex gap-3 items-center relative transition-all ease-in-out duration-300" 
          style={{ marginRight: isSidebarOpen ? "119px" : "0", marginLeft: isSidebarOpen ? "-132px" : "0" }}
        >
          {/* Scrollable Input Area */}
          <div 
            ref={inputContainerRef}
            className="flex-1 rounded-3xl bg-[#2F2F2F] text-gray-100 px-4 py-3 relative overflow-hidden"
            style={{ height: "90px", paddingLeft: "22px" }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !isButtonDisabled && (e.preventDefault(), handleSend())}
              placeholder="Message ChatFusion"
              rows={3}
              className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none resize-none"
              style={{ minHeight: "48px", maxHeight: "210px", overflow: "hidden", scrollbarWidth: "none" }}
            />
          </div>
          <ChatInputButtons handleSend={handleSend} isButtonDisabled={isButtonDisabled} />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;