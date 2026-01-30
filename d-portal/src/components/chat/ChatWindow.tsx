// src/components/chat/ChatWindow.tsx
import React, { useEffect, useState, useRef } from 'react';
import type { Conversation, Message } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext.tsx';
import MessageBubble from './MessageBubble.tsx';
import MessageInput from './MessageInput.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import Avatar from '../shared/Avatar.tsx';
import LoadingSpinner from '../shared/LoadingSpinner.tsx';
import api from '../../utils/api';
import { MoreVertical, Phone, Video } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
  conversation?: Conversation;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, conversation }) => {
  const { user } = useAuth();
  const { socket, sendMessage, joinConversation, markAsRead } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<{ userId: string; userName: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      joinConversation(conversationId);
      markAsRead(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    const handleTypingDisplay = ({ userId, userName, conversationId: typingConvId }: any) => {
      if (typingConvId === conversationId && userId !== user?._id) {
        setTyping({ userId, userName });
        setTimeout(() => setTyping(null), 3000);
      }
    };

    const handleTypingHide = ({ conversationId: typingConvId }: any) => {
      if (typingConvId === conversationId) {
        setTyping(null);
      }
    };

    socket.on('message:received', handleNewMessage);
    socket.on('typing:display', handleTypingDisplay);
    socket.on('typing:hide', handleTypingHide);

    return () => {
      socket.off('message:received', handleNewMessage);
      socket.off('typing:display', handleTypingDisplay);
      socket.off('typing:hide', handleTypingHide);
    };
  }, [socket, conversationId, user]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/chat/conversations/${conversationId}/messages`);
      setMessages(response.data.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(conversationId, text);
  };

  const getConversationName = () => {
    if (!conversation) return 'Chat';
    if (conversation.type === 'team') return conversation.name || 'Team Chat';
    const otherUser = conversation.participants.find(p => p.userId._id !== user?._id);
    return otherUser?.userId.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Avatar name={getConversationName()} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900">{getConversationName()}</h3>
            <p className="text-xs text-gray-500">
              {conversation?.type === 'team' 
                ? `${conversation.participants.length} members` 
                : 'Active now'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId._id === user?._id}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].senderId._id !== message.senderId._id
                }
              />
            ))}
            {typing && <TypingIndicator userName={typing.userName} />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} conversationId={conversationId} />
    </div>
  );
};

export default ChatWindow;
