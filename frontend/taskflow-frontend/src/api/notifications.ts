import api from './axiosConfig';
import type { Notification } from '../types';

export const notificationApi = {
  getForUser: (userId: string) =>
    api.get<Notification[]>(`/notifications/user/${userId}`).then(r => r.data),
};
