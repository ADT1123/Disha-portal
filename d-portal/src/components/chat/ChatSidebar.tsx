// src/components/chat/ChatSidebar.tsx
import React, { useState } from 'react';
import type { Conversation } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../shared/Avatar';
import { Search, Plus } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, selectedId, onSelect }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'personal' | 'team'>('all');

  const filteredConversations = conversations
    .filter(conv => filter === 'all' || conv.type === filter)
    .filter(conv => {
      if (!searchTerm) return true;
      const name = getConversationName(conv);
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getConversationName = (conv: Conversation) => {
    if (conv.type === 'team') return conv.name || 'Team Chat';
    const otherUser = conv.participants.find(p => p.userId._id !== user?._id);
    return otherUser?.userId.name || 'Unknown';
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.type === 'team') return conv.name || 'T';
    const otherUser = conv.participants.find(p => p.userId._id !== user?._id);
    return otherUser?.userId.name || 'U';
  };

  const getLastMessagePreview = (conv: Conversation) => {
    if (!conv.lastMessage) return 'No messages yet';
    return conv.lastMessage.text.slice(0, 40) + (conv.lastMessage.text.length > 40 ? '...' : '');
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-3">
          {['all', 'personal', 'team'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        ) : (
          filteredConversations.map(conv => (
            <div
              key={conv._id}
              onClick={() => onSelect(conv._id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedId === conv._id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={getConversationAvatar(conv)}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {getConversationName(conv)}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(conv.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getLastMessagePreview(conv)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
