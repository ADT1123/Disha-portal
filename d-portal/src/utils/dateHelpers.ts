// src/utils/dateHelpers.ts
import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date, formatStr = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const getRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isToday = (date: string | Date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};
