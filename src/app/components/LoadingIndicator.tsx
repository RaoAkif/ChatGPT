const LoadingIndicator = () => (
    <span className="ml-2 flex gap-1">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    </span>
  );
  
  export default LoadingIndicator;
  