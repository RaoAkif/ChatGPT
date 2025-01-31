import ChatButton from "./ChatButton";
import AttachIcon from "./AttachIcon";

type ChatInputButtonsProps = {
  handleSend: () => Promise<void>;
  isButtonDisabled: boolean;
};

const ChatInputButtons = ({ handleSend, isButtonDisabled }: ChatInputButtonsProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#212121] rounded-lg">
      <AttachIcon isLoading={false} />
      <ChatButton onClick={handleSend} isLoading={false} isButtonDisabled={isButtonDisabled} />
    </div>
  );
};

export default ChatInputButtons;
