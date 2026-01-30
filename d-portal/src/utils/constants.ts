// src/utils/constants.ts
export const APP_NAME = 'DISHA Portal';

export const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export const TASK_PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
} as const;

export const LEAVE_TYPES = {
  SICK: 'Sick',
  CASUAL: 'Casual',
  EARNED: 'Earned',
  EMERGENCY: 'Emergency',
} as const;
