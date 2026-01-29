// src/components/chat/MessageBubble.tsx
import React from 'react';
import type { Message } from '../../types/index.ts';
import Avatar from '../shared/Avatar.tsx';
import { formatDateTime } from '../../utils/dateHelpers';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showAvatar }) => {
  return (
    <div className={`flex gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {showAvatar ? (
        <Avatar
          name={message.senderId.name}
          src={message.senderId.profilePic}
          size="sm"
        />
      ) : (
        <div className="w-8" />
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {showAvatar && !isOwn && (
          <span className="text-xs text-gray-600 mb-1 px-3">
            {message.senderId.name}
          </span>
        )}
        
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
          }`}
        >
          {message.isDeleted ? (
            <p className="italic text-sm opacity-70">This message was deleted</p>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          )}
        </div>

        <div className={`flex items-center gap-1 mt-1 px-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-500">
            {formatDateTime(message.timestamp)}
          </span>
          {isOwn && (
            message.readBy.length > 1 ? (
              <CheckCheck className="w-3 h-3 text-blue-600" />
            ) : (
              <Check className="w-3 h-3 text-gray-400" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
