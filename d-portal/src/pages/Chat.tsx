// src/pages/Chat.tsx
import React, { useState, useEffect } from 'react';
import type { Conversation } from '../types';
import api from '../utils/api';
import ChatSidebar from '../components/chat/ChatSidebar.tsx';
import ChatWindow from '../components/chat/ChatWindow.tsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import { MessageSquare } from 'lucide-react';

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/chat/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading chats..." />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg border border-gray-200 overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        selectedId={selectedConversation}
        onSelect={setSelectedConversation}
      />

      {selectedConversation ? (
        <ChatWindow
          conversationId={selectedConversation}
          conversation={conversations.find(c => c._id === selectedConversation)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-400">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
