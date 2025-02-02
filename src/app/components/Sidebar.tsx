import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  loadChat: (timestamp: string) => void;
}

const Sidebar = ({ isOpen, toggleSidebar, loadChat }: SidebarProps) => {
  const [savedChats, setSavedChats] = useState<{ timestamp: string }[]>([]);

  useEffect(() => {
    const chats = Object.keys(localStorage)
      .filter((key) => key !== "timestamp") // Avoid unwanted entries
      .map((key) => {
        const chat = JSON.parse(localStorage.getItem(key)!);
        return { timestamp: chat.timestamp };
      });
    setSavedChats(chats);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleString() : "Invalid Date";
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-[#171717] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="p-4">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-200">
          <i className="fa-solid fa-list text-xl"></i>
        </button>
        <h2 className="mt-4 text-xl font-bold">Previous Chats</h2>
        <ul className="mt-2 space-y-2">
          {savedChats.map((chat, index) => (
            <li
              key={index}
              className="p-2 rounded bg-[#3F3F3F] hover:bg-[#4F4F4F]"
              onClick={() => loadChat(chat.timestamp)}
            >
              {formatTimestamp(chat.timestamp)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
