import React, { useState, useEffect } from 'react';

const TerminalLoader = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const fullText = 'INITIALIZING CYBERPUNK MEME MATRIX... LOADING NEON CHAOS...';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 50);

    // Cursor blink effect
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [fullText, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-green-400 text-xl md:text-2xl font-mono mb-8">
          {text}
          <span className={`inline-block w-2 h-6 bg-green-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TerminalLoader;