"use client";
import { useRef, useEffect, useState } from "react";
import ChatInputButtons from "./ChatInputButtons";
import AudioRecordingModal from "./AudioRecordingModal";

type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
  handleAudioSend: (transcribedText: string) => Promise<string | void>;
  isButtonDisabled: boolean;
  isSidebarOpen: boolean;
};

const ChatInput = ({
  message,
  setMessage,
  handleSend,
  handleAudioSend,
  isButtonDisabled,
  isSidebarOpen,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Auto-resize the textarea as the user types.
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to recalc scrollHeight properly
      textareaRef.current.style.height = "auto";
      // newHeight will be at least the scrollHeight, but you can also cap it.
      const newHeight = Math.min(textareaRef.current.scrollHeight, 210); // for example, max 210px
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleAudioTranscription = async (transcribedText: string) => {
    const aiResponse = await handleAudioSend(transcribedText);
    if (aiResponse) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 w-full" style={{ backgroundColor: "#212121" }}>
        <div className="max-w-3xl mx-auto pb-4">
          {/* Container split vertically into text and button parts */}
          <div
            className="flex flex-col gap-0 relative transition-all ease-in-out duration-300"
            style={{
              marginRight: isSidebarOpen ? "119px" : "0",
              marginLeft: isSidebarOpen ? "-132px" : "0",
            }}
          >
            {/* Top half: Text input container */}
            <div
              className="rounded-t-3xl bg-[#2F2F2F] text-gray-100 px-4 pt-3 pb-0 relative"
              style={{ minHeight: "65px" }} // Starting at one line height (upper half)
            >
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
                placeholder="Message ChatFusion"
                rows={1}
                // Added "custom-scroll" for our custom scrollbar
                className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none resize-none custom-scroll"
                style={{
                  overflowY: "auto", // will scroll if content exceeds the container's available space
                }}
              />
            </div>

            {/* Bottom half: Button container with fixed height */}
            <div
              className="flex justify-end items-center rounded-b-3xl bg-[#2F2F2F] px-4 pr-2 pb-2"
              style={{ height: "45px" }}
            >
              <ChatInputButtons
                message={message}
                handleSend={handleSend}
                isButtonDisabled={isButtonDisabled}
                onAudioClick={() => setIsAudioModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audio Recording Modal */}
      {isAudioModalOpen && (
        <AudioRecordingModal
          onClose={() => setIsAudioModalOpen(false)}
          onTranscription={handleAudioTranscription}
        />
      )}
    </>
  );
};

export default ChatInput;
