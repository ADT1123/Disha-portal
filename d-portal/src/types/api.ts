// src/types/api.ts
export interface LoginResponse {
  success: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'member';
    department?: string;
    designation?: string;
    profilePic?: string;
  };
  token: string;
}

export interface TasksResponse {
  success: boolean;
  tasks: any[];
  total: number;
}

export interface StatsResponse {
  success: boolean;
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
}

export interface AttendanceResponse {
  success: boolean;
  attendance: {
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
    status: string;
    workHours?: number;
  };
}

export interface UsersResponse {
  success: boolean;
  users: any[];
}

export interface ConversationsResponse {
  success: boolean;
  conversations: any[];
}

export interface MessagesResponse {
  success: boolean;
  messages: any[];
}

export interface PerformanceResponse {
  success: boolean;
  performance: {
    _id: string;
    userId: string;
    month: string;
    metrics: {
      tasksCompleted: number;
      onTimeDeliveryPercentage: number;
      averageCompletionTime?: number;
      totalWorkHours: number;
    };
    managerNotes: any[];
  };
}

export interface AnnouncementsResponse {
  success: boolean;
  announcements: any[];
}
