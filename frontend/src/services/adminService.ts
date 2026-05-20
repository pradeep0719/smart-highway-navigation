import api from './api';
import type { AdminStats, User } from '../types';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } = await api.get<AdminStats>('/admin/stats');
    return data;
  },

  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/admin/users');
    return data;
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    const { data } = await api.patch<User>(`/admin/users/${userId}/role`, { role });
    return data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },
};
