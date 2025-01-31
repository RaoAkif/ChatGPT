import { useState, useRef, useEffect } from "react";
import { VALID_MODELS, ValidModel, DEFAULT_MODEL } from "../../app/api/utils/models";

interface HeaderProps {
  selectedModel: ValidModel;
  setSelectedModel: (model: ValidModel) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ selectedModel, setSelectedModel, toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ensure `DEFAULT_MODEL` is used when no model is selected
  useEffect(() => {
    if (!VALID_MODELS.some((model) => model.value === selectedModel)) {
      setSelectedModel(DEFAULT_MODEL);
    }
  }, [selectedModel, setSelectedModel]);

  const selectedModelLabel = VALID_MODELS.find((model) => model.value === selectedModel)?.label || "Select a model";

  return (
    <div className="w-full bg-[#212121] p-4 flex items-center space-x-4 relative">
      {/* Sidebar Toggle */}
      <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-200">
        <i className={`fa-solid ${isSidebarOpen ? "" : "fa-list"} text-xl`}></i>
      </button>

      {/* Model Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 bg-[#212121] text-white rounded-lg flex items-center space-x-2 hover:bg-[#2F2F2F] border border-gray-700"
        >
          <span>{selectedModelLabel}</span>
          <i className="fa-solid fa-chevron-down text-sm"></i>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-72 bg-[#2F2F2F] border border-gray-700 rounded-lg shadow-lg z-50 text-white">
            <div className="p-3 text-sm font-semibold text-gray-400 border-b border-gray-600">Model</div>
            {VALID_MODELS.map((model) => (
              <button
                key={model.value}
                className={`w-full text-left px-4 py-3 flex flex-col hover:bg-[#424242] transition-all ${
                  selectedModel === model.value ? "bg-[#424242]" : ""
                }`}
                onClick={() => {
                  setSelectedModel(model.value);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{model.label}</span>
                  {selectedModel === model.value && <i className="fa-solid fa-check text-sm pl-4"></i>}
                </div>
                <span className="text-xs text-gray-400">{model.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
