"use client";
import { FaPaperPlane, FaMicrophone } from "react-icons/fa";

type ChatInputButtonsProps = {
  message: string;
  handleSend: () => Promise<void>;
  isButtonDisabled: boolean;
  onAudioClick: () => void;
};

const ChatInputButtons = ({ message, handleSend, isButtonDisabled, onAudioClick }: ChatInputButtonsProps) => {
  const hasText = message.trim().length > 0;

  const handleClick = () => {
    if (hasText) {
      handleSend();
    } else {
      onAudioClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isButtonDisabled && hasText} // disable only for sending text if necessary
      className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200"
    >
      {hasText ? (
        <FaPaperPlane size={20} />
      ) : (
        <FaMicrophone size={20} />
      )}
    </button>
  );
};

export default ChatInputButtons;
