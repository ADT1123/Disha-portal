// src/components/chat/MessageInput.tsx
import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext.tsx';

interface MessageInputProps {
  onSend: (text: string) => void;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, conversationId }) => {
  const [message, setMessage] = useState('');
  const { startTyping, stopTyping } = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      startTyping(conversationId);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      stopTyping(conversationId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    onSend(message);
    setMessage('');
    setIsTyping(false);
    stopTyping(conversationId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ maxHeight: '120px' }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
