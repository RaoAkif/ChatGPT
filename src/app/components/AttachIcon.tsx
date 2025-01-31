import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface AttachIconProps {
  isLoading: boolean;
}

const AttachIcon: React.FC<AttachIconProps> = ({
  // isLoading,
}) => {
  return (
    <button
      className={`absolute left-3 bottom-3 w-8 h-8 text-white p-3 rounded-full transition-all flex items-center justify-center`}>
      <i className={`fa-solid fa-paperclip w-4 h-4`}></i>
    </button>
  );
};

export default AttachIcon;
