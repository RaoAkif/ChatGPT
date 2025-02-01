"use client";
import { useRef, useEffect, useState } from "react";
import ChatInputButtons from "./ChatInputButtons";
import AudioRecordingModal from "./AudioRecordingModal";

type ChatInputProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
  isButtonDisabled: boolean;
  isSidebarOpen: boolean;
};

const ChatInput = ({ message, setMessage, handleSend, isButtonDisabled, isSidebarOpen }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  // state to toggle the audio recording modal
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // When the Audio modal finishes recording, this callback is called with the transcribed text.
  const handleAudioTranscription = async (transcribedText: string) => {
    // Optionally, update your conversation with the transcribed text:
    // For example, you could call a handleSendAudio(transcribedText) function here.
    // In this example, we mimic the behavior of sending the text to BACKEND_URL and then using TTS.
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: transcribedText }), // you can also include a model if needed
      });

      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      const aiResponseText = data.data || "No response from AI.";

      // Use SpeechSynthesis to speak the AI response
      const utterance = new SpeechSynthesisUtterance(aiResponseText);
      window.speechSynthesis.speak(utterance);
    } catch (error: unknown) {
      console.error("Audio API error:", error);
    }
  };

  useEffect(() => {
    if (textareaRef.current && inputContainerRef.current) {
      const lineCount = message.split("\n").length;
      let newHeight = 90; // Default height for one line
      if (lineCount === 2) newHeight = 115;
      else if (lineCount === 3) newHeight = 140;
      else if (lineCount === 4) newHeight = 165;
      else if (lineCount === 5) newHeight = 190;
      else if (lineCount === 6) newHeight = 205;
      else if (lineCount >= 7) newHeight = 230; // max limit

      textareaRef.current.style.height = `${newHeight}px`;
      inputContainerRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  return (
    <>
      <div className="fixed bottom-0 w-full" style={{ backgroundColor: "#212121" }}>
        <div className="max-w-3xl mx-auto pb-4">
          <div 
            className="flex gap-3 items-center relative transition-all ease-in-out duration-300" 
            style={{ marginRight: isSidebarOpen ? "119px" : "0", marginLeft: isSidebarOpen ? "-132px" : "0" }}
          >
            {/* Scrollable Input Area */}
            <div 
              ref={inputContainerRef}
              className="flex-1 rounded-3xl bg-[#2F2F2F] text-gray-100 px-4 py-3 relative overflow-hidden"
              style={{ height: "90px", paddingLeft: "22px" }}
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
                rows={3}
                className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none resize-none"
                style={{ minHeight: "48px", maxHeight: "210px", overflow: "hidden", scrollbarWidth: "none" }}
              />
            </div>
            <ChatInputButtons
              message={message}
              handleSend={handleSend}
              isButtonDisabled={isButtonDisabled}
              // When message is empty, clicking the button opens the audio modal
              onAudioClick={() => setIsAudioModalOpen(true)}
            />
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
