"use client";
import { useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

// const dummyResponses = [
//   "I’m thinking... Let me calculate that for you!",
//   "Hold on a second, I’m processing your request.",
//   "Please wait ",
//   "Almost there, let me figure this out!",
//   "Just a moment, I’ll have the answer soon.",
// ];

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsButtonDisabled(true);

    // Temporary AI message with loading dots
    const temporaryResponse = {
      role: "ai" as const,
      content: "Please wait  ",
    };
    setMessages((prev) => [...prev, temporaryResponse]);

    setTimeout(async () => {
      // Replace temporary AI response with the real response after 5 seconds
      const aiMessage = { role: "ai" as const, content: "Here's the real AI response!" };
      
      // Replace the last AI message (the "Please wait" message)
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = aiMessage; // Replace the last AI message
        return updatedMessages;
      });

      setIsLoading(false);
      setIsButtonDisabled(false);
    }, 5000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <div className="w-full bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Chat</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 pt-4">
        <div className="max-w-3xl mx-auto px-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 mb-4 ${msg.role === "ai" ? "justify-start" : "justify-end flex-row-reverse"}`}
            >
              {msg.role === "ai" && (
                <div className="flex items-start">
                  {/* AI Icon */}
                  <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c.79 0 1.5-.71 1.5-1.5S8.79 9 8 9s-1.5.71-1.5 1.5S7.21 11 8 11zm8 0c.79 0 1.5-.71 1.5-1.5S16.79 9 16 9s-1.5.71-1.5 1.5.71 1.5 1.5 1.5zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
                    </svg>
                  </div>
                </div>
              )}

              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  msg.role === "ai"
                    ? "text-gray-100 bg-gray-800 border border-gray-700"
                    : "bg-[#1F2937] text-white ml-auto"
                }`}
              >
                <div className="flex items-center">
                  {msg.content}
                  {isLoading && msg.content === "Please wait  " && (
                    <span className="ml-2 flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 w-full" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-3xl mx-auto pb-4">
          <div className="flex gap-3 items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={3}
              className="flex-1 rounded-xl border border-gray-700 bg-[#1F2937] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || isButtonDisabled}
              className="bg-cyan-600 text-white px-5 py-3 rounded-xl hover:bg-cyan-700 transition-all disabled:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
