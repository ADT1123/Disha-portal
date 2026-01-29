// src/types/socket.ts
export interface SocketEvents {
  // Connection events
  connect: () => void;
  disconnect: () => void;
  authenticate: (userId: string) => void;

  // Message events
  'message:send': (data: { conversationId: string; text: string; senderId: string }) => void;
  'message:received': (message: any) => void;

  // Typing events
  'typing:start': (data: { conversationId: string; userId: string; userName: string }) => void;
  'typing:stop': (data: { conversationId: string; userId: string }) => void;
  'typing:display': (data: { conversationId: string; userId: string; userName: string }) => void;
  'typing:hide': (data: { conversationId: string; userId: string }) => void;

  // Conversation events
  'join:conversation': (conversationId: string) => void;
  'leave:conversation': (conversationId: string) => void;

  // Read receipts
  'messages:read': (data: { conversationId: string; userId: string }) => void;

  // User status
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  'user:status': (data: { userId: string; status: string }) => void;

  // Notifications
  'notification:new': (notification: any) => void;
}
