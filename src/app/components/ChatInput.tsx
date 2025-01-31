import ChatButton from "./ChatButton";
import AttachIcon from "./AttachIcon";

type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
  isButtonDisabled: boolean;
  isSidebarOpen: boolean;
};

const ChatInput = ({ message, setMessage, handleSend, isButtonDisabled, isSidebarOpen }: ChatInputProps) => (
  <div className={`fixed bottom-0 w-full`} style={{ backgroundColor: "#212121" }}>
    <div className="max-w-3xl mx-auto pb-4">
      <div 
        className="flex gap-3 items-center relative transition-all ease-in-out duration-300" 
        style={{ marginRight: isSidebarOpen ? "119px" : "0", marginLeft: isSidebarOpen ? "-132px" : "0" }}
      >
        {/* Scrollable Input Area */}
        <div className="flex-1 rounded-3xl bg-[#2F2F2F] text-gray-100 px-4 py-3 relative overflow-hidden max-h-32">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !isButtonDisabled && (e.preventDefault(), handleSend())}
            placeholder="Message ChatFusion"
            rows={3}
            className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none resize-none mb-16"
            style={{ minHeight: "48px", maxHeight: "128px", overflow: "hidden", scrollbarWidth: "none" }}
          />
        </div>

        {/* Buttons Section */}
        <div className="flex items-center gap-2 pb-2">
          <AttachIcon isLoading={false} />
          <ChatButton onClick={handleSend} isLoading={false} isButtonDisabled={isButtonDisabled} />
        </div>
      </div>
    </div>
  </div>
);

export default ChatInput;
