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
      <div className="flex gap-3 items-center relative transition-all ease-in-out duration-300" style={{ marginRight: isSidebarOpen ? "119px" : "0", marginLeft: isSidebarOpen ? "-132px" : "0" }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !isButtonDisabled && (e.preventDefault(), handleSend())}
          placeholder="Message ChatFusion"
          rows={3}
          className="flex-1 rounded-3xl bg-[#2F2F2F] text-gray-100 px-4 py-3 placeholder-gray-400 outline-none"
        />
        <ChatButton onClick={handleSend} isLoading={false} isButtonDisabled={isButtonDisabled} />
        <AttachIcon onClick={handleSend} isLoading={false} isButtonDisabled={isButtonDisabled} />
      </div>
    </div>
  </div>
);

export default ChatInput;
