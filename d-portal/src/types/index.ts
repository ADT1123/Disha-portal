// src/types/index.ts
export type UserRole = 'admin' | 'manager' | 'member';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  designation?: string;
  profilePic?: string;
  status?: 'Available' | 'Busy' | 'On Leave' | 'Offline';
  phone?: string;
  joiningDate?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: User;
  assignedBy: User;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  deadline: string;
  isRecurring: boolean;
  recurrence?: RecurrencePattern;
  parentTaskId?: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: string;
  cronExpression?: string;
}

export interface TaskComment {
  _id?: string;
  userId: User;
  text: string;
  timestamp: string;
}

export interface Conversation {
  _id: string;
  type: 'personal' | 'team' | 'group';
  participants: ConversationParticipant[];
  teamId?: string;
  name?: string;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: User;
  joinedAt: string;
  lastRead: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: User;
  text: string;
  attachments?: MessageAttachment[];
  readBy: ReadReceipt[];
  isEdited: boolean;
  isDeleted: boolean;
  timestamp: string;
}

export interface MessageAttachment {
  type: string;
  url: string;
  name: string;
  size: number;
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
}

export interface Attendance {
  _id: string;
  userId: string;
  date: string;
  checkIn?: {
    time: string;
    location?: string;
  };
  checkOut?: {
    time: string;
    location?: string;
  };
  status: 'Present' | 'Absent' | 'Half-Day' | 'Leave';
  workHours?: number;
  notes?: string;
}

export interface Leave {
  _id: string;
  userId: User;
  leaveType: 'Sick' | 'Casual' | 'Earned' | 'Emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: User;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Performance {
  _id: string;
  userId: User;
  month: string;
  metrics: {
    tasksCompleted: number;
    onTimeDeliveryPercentage: number;
    averageCompletionTime?: number;
    totalWorkHours: number;
  };
  managerNotes: ManagerNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ManagerNote {
  managerId: User;
  note: string;
  timestamp: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'company-wide' | 'team-specific' | 'department';
  createdBy: User;
  isPinned: boolean;
  priority: 'Low' | 'Medium' | 'High';
  expiresAt?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Socket Event Types
export interface SocketMessage {
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface UserStatusEvent {
  userId: string;
  status: 'online' | 'offline' | 'busy' | 'away';
}

// Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  isRecurring: boolean;
  recurrence?: RecurrencePattern;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  type: 'company-wide' | 'team-specific' | 'department';
  priority: 'Low' | 'Medium' | 'High';
  isPinned: boolean;
}

export interface LeaveFormData {
  leaveType: 'Sick' | 'Casual' | 'Earned' | 'Emergency';
  startDate: string;
  endDate: string;
  reason: string;
}
