// CodeBlock.js
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1em' }}>
      {/* Language Title */}
      {language && (
        <div style={{ 
          backgroundColor: '#2d2d2d', 
          color: '#fff', 
          padding: '0.2em 0.5em', 
          borderTopLeftRadius: '5px', 
          borderTopRightRadius: '5px',
          fontSize: '0.9em',
          fontFamily: 'sans-serif',
        }}>
          {language.toUpperCase()}
        </div>
      )}
      {/* Code Block */}
      <SyntaxHighlighter language={language} style={atomDark} customStyle={{ 
        padding: '1em', 
        borderRadius: '0 0 5px 5px',
        margin: 0,
      }}>
        {value}
      </SyntaxHighlighter>
      {/* Copy Button */}
      <button 
        onClick={handleCopy} 
        style={{ 
          position: 'absolute', 
          top: '0.5em', 
          right: '0.5em', 
          background: 'none', 
          border: 'none', 
          color: '#fff', 
          cursor: 'pointer',
        }}
        aria-label="Copy code"
      >
        {isCopied ? <FaCheck /> : <FaRegCopy />}
      </button>
    </div>
  );
};

export default CodeBlock;
