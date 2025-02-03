interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => (
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
        {/* Dummy chat titles */}
        {["Chat 1", "Chat 2", "Chat 3"].map((chat, index) => (
          <li key={index} className="p-2 rounded bg-[#3F3F3F] hover:bg-[#4F4F4F]">
            {chat}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Sidebar;
