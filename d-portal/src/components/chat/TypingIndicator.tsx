// src/components/chat/TypingIndicator.tsx
import React from 'react';

interface TypingIndicatorProps {
  userName: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userName }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-600 mb-1 px-3">{userName}</span>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
