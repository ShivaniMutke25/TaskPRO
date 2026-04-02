import api from './axiosConfig';
import type { Task, TaskRequest, PageResponse } from '../types';

export const taskApi = {
  getAll: (page = 0, size = 10, status?: string) =>
    api.get<PageResponse<Task>>('/tasks', { params: { page, size, status } }).then(r => r.data),

  getById: (id: number) =>
    api.get<Task>(`/tasks/${id}`).then(r => r.data),

  create: (data: TaskRequest) =>
    api.post<Task>('/tasks', data).then(r => r.data),

  update: (id: number, data: TaskRequest) =>
    api.put<Task>(`/tasks/${id}`, data).then(r => r.data),

  updateStatus: (id: number, status: string) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }).then(r => r.data),

  assign: (id: number, assignedTo: string) =>
    api.patch<Task>(`/tasks/${id}/assign`, { assignedTo }).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`),
};
