import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface AttachIconProps {
  onClick: () => void;
  isLoading: boolean;
  isButtonDisabled: boolean;
}

const AttachIcon: React.FC<AttachIconProps> = ({
  onClick,
  isLoading,
  isButtonDisabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isButtonDisabled}
      className={`absolute left-3 bottom-3 w-8 h-8 text-white p-3 rounded-full transition-all ${
        (isLoading || isButtonDisabled) ? "opacity-50 cursor-not-allowed" : ""
      } flex items-center justify-center`}
    >
      <i className={`fa-solid fa-paperclip w-4 h-4`}></i>
    </button>
  );
};

export default AttachIcon;
