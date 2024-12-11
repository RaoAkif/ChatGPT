import React from "react";

interface ChatButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isButtonDisabled: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isLoading, isButtonDisabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isButtonDisabled}
      className={`absolute right-3 bottom-3 w-8 h-8 bg-white text-black p-3 rounded-full hover:bg-white transition-all ${
        (isLoading || isButtonDisabled) ? 'opacity-50 cursor-not-allowed' : ''
      } flex items-center justify-center`}
    >
      <i className={`fa-solid ${isLoading ? 'fa-square' : 'fa-arrow-up-long'} w-4 h-4`}></i>
    </button>
  );
};

export default ChatButton;
