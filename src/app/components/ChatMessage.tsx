// ChatMessage.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import AiBotIcon from './AiBotIcon';
import LoadingIndicator from './LoadingIndicator';

interface Message {
  role: string;
  content: string;
}

interface ChatMessageProps {
  msg: Message;
  isLoading: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, isLoading }) => (
  <div
    className={`flex gap-4 mb-16 items-start ${
      msg.role === 'ai' ? 'justify-start' : 'flex-row-reverse'
    }`}
  >
    {msg.role === 'ai' && <AiBotIcon />}

    {/* Outer container for the message bubble */}
    <div
      style={{
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.7em',
      }}
      className={`px-4 py-2 rounded-2xl max-w-[95%] ${
        msg.role === 'ai'
          ? 'text-[#ECECEC]'
          : 'text-[#ECECEC] bg-[#303030] flex'
      }`}
    >
      {/* Render Markdown with GFM and custom code block component */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        // Conditionally apply whitespace-pre-wrap for non-ai messages.
        className={`prose prose-invert max-w-none ${
          msg.role !== 'ai' ? 'whitespace-pre-wrap' : ''
        }`}
      >
        {msg.content}
      </ReactMarkdown>

      {/* Loading indicator if needed */}
      {isLoading && msg.content === '' && <LoadingIndicator />}
    </div>
  </div>
);

export default ChatMessage;
