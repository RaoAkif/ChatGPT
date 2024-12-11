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
      className="absolute right-3 bottom-3 w-10 h-10 bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-700 transition-all disabled:bg-cyan-600 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <i className={`fa-solid ${isLoading ? 'fa-square' : 'fa-arrow-up-long'} w-4 h-4`}></i>
    </button>
  );
};

export default ChatButton;
