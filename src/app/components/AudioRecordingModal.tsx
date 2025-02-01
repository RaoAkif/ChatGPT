"use client";
import { useEffect } from "react";
import { FaTimes, FaHeart } from "react-icons/fa";

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
    // Check for browser support for the Web Speech API
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
    recognition.continuous = false; // one shot per start

    // Start recognition
    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      // Instead of showing text, just call the transcription callback
      onTranscription(transcript);
      // We do not close the modal automatically
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };

    // When speech recognition ends (silence), we do nothing to allow the user to hear audio feedback.
    recognition.onend = () => {
      // Optionally, you could restart recognition here if desired.
    };

    // Clean up on unmount
    return () => {
      recognition.abort();
    };
  }, [onTranscription]);

  // When the close button is clicked, stop any ongoing speech synthesis and then close the modal.
  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50">
      {/* Center pulsating heart animation */}
      <div className="w-40 h-40 flex items-center justify-center">
        <FaHeart className="text-red-500 animate-pulse" size={80} />
      </div>
      {/* Cross icon at bottom center */}
      <div className="absolute bottom-10">
        <button onClick={handleClose} className="text-white">
          <FaTimes size={30} />
        </button>
      </div>
    </div>
  );
};

export default AudioRecordingModal;
