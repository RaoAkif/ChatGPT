"use client";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

type AudioRecordingModalProps = {
  onClose: () => void;
  onTranscription: (transcribedText: string) => void;
};

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

const AudioRecordingModal = ({ onClose, onTranscription }: AudioRecordingModalProps) => {
  useEffect(() => {
    // Use the browser's SpeechRecognition API.
    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscription(transcript);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // Ignore the "aborted" error to avoid console spam when unmounting.
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      // Optionally handle when recognition ends.
    };

    return () => {
      recognition.abort();
    };
  }, [onTranscription]);

  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50">
      {/* Pulsating circle with a sliding background */}
      <div className="relative w-40 h-40 rounded-full animate-pulse overflow-hidden">
        <div
          className="absolute inset-0 bg-center animate-bg-slide"
          style={{
            backgroundImage: "url('/audio-background.svg')",
          }}
        />
      </div>
      {/* Close button */}
      <div className="absolute bottom-10">
        <button onClick={handleClose} className="text-white">
          <FaTimes size={30} />
        </button>
      </div>
    </div>
  );
};

export default AudioRecordingModal;
