import { apiClient } from './api-client';
import { getToken } from './auth';

export interface Notification {
  _id: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export async function fetchNotifications() {
  return apiClient<Notification[]>('/notifications', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function fetchUnreadCount() {
  return apiClient<{ count: number }>('/notifications/unread-count', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function markAsRead(id: string) {
  return apiClient(`/notifications/${id}/read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function markAllAsRead() {
  return apiClient('/notifications/read-all', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}