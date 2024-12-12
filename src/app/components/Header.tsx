interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ title, toggleSidebar, isSidebarOpen }: HeaderProps) => (
  <div className="w-full bg-[#212121] p-4 flex items-center relative">
    <button
      onClick={toggleSidebar}
      className="text-gray-400 hover:text-gray-200 absolute left-4 top-4"
    >
      <i
        className={`fa-solid ${isSidebarOpen ? "" : "fa-list"} text-xl`}
      ></i>
    </button>
    <h1 className={`text-2xl font-bold -mt-1 text-white text-left ${!isSidebarOpen ? "ml-10" : ""}`}>{title}</h1>
  </div>
);

export default Header;
