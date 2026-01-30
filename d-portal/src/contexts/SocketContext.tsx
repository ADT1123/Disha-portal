// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (conversationId: string, text: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  joinConversation: () => {},
  leaveConversation: () => {},
  markAsRead: () => {},
  startTyping: () => {},
  stopTyping: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      newSocket.emit('authenticate', user._id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for user status updates
    newSocket.on('user:online', (userId) => {
      console.log('User online:', userId);
    });

    newSocket.on('user:offline', (userId) => {
      console.log('User offline:', userId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  const sendMessage = (conversationId: string, text: string) => {
    if (!socket || !user) return;
    
    socket.emit('message:send', {
      conversationId,
      text,
      senderId: user._id,
    });
  };

  const joinConversation = (conversationId: string) => {
    if (!socket) return;
    socket.emit('join:conversation', conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    if (!socket) return;
    socket.emit('leave:conversation', conversationId);
  };

  const markAsRead = (conversationId: string) => {
    if (!socket || !user) return;
    socket.emit('messages:read', { conversationId, userId: user._id });
  };

  const startTyping = (conversationId: string) => {
    if (!socket || !user) return;
    socket.emit('typing:start', { 
      conversationId, 
      userId: user._id, 
      userName: user.name 
    });
  };

  const stopTyping = (conversationId: string) => {
    if (!socket || !user) return;
    socket.emit('typing:stop', { conversationId, userId: user._id });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        joinConversation,
        leaveConversation,
        markAsRead,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
