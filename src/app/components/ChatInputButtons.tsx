"use client";
import { IoMdArrowUp } from "react-icons/io";
import { PiWaveformBold } from "react-icons/pi";

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
      disabled={isButtonDisabled && hasText}
      className="p-2 text-black bg-white rounded-full hover:bg-slate-50 transition-colors duration-200"
    >
      {hasText ? (
        <IoMdArrowUp size={20} />
      ) : (
        <PiWaveformBold size={20} />
      )}
    </button>
  );
};

export default ChatInputButtons;
