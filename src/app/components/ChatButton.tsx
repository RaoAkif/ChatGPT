import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

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
      className={`absolute right-8 bottom-3 w-8 h-8 bg-white text-black p-3 mr-4 rounded-full hover:bg-white transition-all ${
        (isLoading || isButtonDisabled) ? 'opacity-50 cursor-not-allowed' : ''
      } flex items-center justify-center`}
    >
      <i className={`fa-solid ${isLoading ? 'fa-square' : 'fa-arrow-up-long'} w-4 h-4`}></i>
    </button>
  );
};

export default ChatButton;
