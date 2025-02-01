import { useRef, useEffect, useState } from "react";
import { IoArrowUp } from "react-icons/io5";
import { PiWaveformBold } from "react-icons/pi";
import AudioRecordingModal from "./AudioRecordingModal";

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
  handleAudioSend: (transcribedText: string) => Promise<string | void>;
  isButtonDisabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  handleAudioSend,
  isButtonDisabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);

  const handleAudioTranscription = async (transcribedText: string) => {
    const aiResponse = await handleAudioSend(transcribedText);
    if (aiResponse) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-resize the textarea to fit its content up to a max height of 6 lines.
  useEffect(() => {
    if (textareaRef.current) {
      // Reset the height to let the browser recalc the scrollHeight
      textareaRef.current.style.height = "auto";
      // Assume each line is ~24px tall.
      const lineHeight = 24;
      const maxHeight = lineHeight * 6;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center h-screen -mt-32">
      <h1 className="text-white text-3xl mb-4">What can I help with?</h1>
      
      {/* 
        The overall container acts as a “card”. 
        We give it a fixed overall layout where the textarea is on top and the button area is below.
      */}
      <div className="w-full max-w-2xl bg-[#2F2F2F] rounded-3xl shadow-lg overflow-hidden">
        
        {/* Upper section: Textarea container */}
        <div className="px-4 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isButtonDisabled) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message ChatGPT"
            rows={1}
            className="w-full resize-none overflow-hidden bg-transparent text-white placeholder-gray-400 outline-none text-lg"
          />
        </div>

        {/* Lower section: Button area (fixed height) */}
        <div
          className="pr-2 pb-4 flex justify-end items-center"
          style={{ height: "2.5rem", minWidth: "50%" }}
        >
          <button
            onClick={message.trim() ? handleSend : () => setIsAudioModalOpen(true)}
            disabled={isButtonDisabled && message.trim().length > 0}
            className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            {message.trim() ? <IoArrowUp size={20} /> : <PiWaveformBold size={24} />}
          </button>
        </div>
      </div>

      {isAudioModalOpen && (
        <AudioRecordingModal
          onClose={() => setIsAudioModalOpen(false)}
          onTranscription={handleAudioTranscription}
        />
      )}
    </div>
  );
};

export default ChatInput;
