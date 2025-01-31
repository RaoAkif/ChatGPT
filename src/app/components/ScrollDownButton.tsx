import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface ScrollDownButtonProps {
  onClick: () => void;
}

const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-[#212121] text-white px-4 py-3 rounded-full transition-all shadow-lg border border-[#393636] flex items-center justify-center"
      style={{ width: "30px", height: "30px", paddingTop: "13px", paddingRight: "16px" }}
      aria-label="Scroll Down"
    >
      <i className="fa-solid fa-arrow-down-long w-4 h-4"></i>
    </button>
  );
};

export default ScrollDownButton;
