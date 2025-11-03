import { api } from '@/lib/api-client';

// Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  language?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePinData {
  currentPin: string;
  newPin: string;
}

// User Service
export const userService = {
  // Get current user
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/users/me');
  },

  // Get user by ID
  async getUser(userId: string): Promise<User> {
    return api.get<User>(`/users/${userId}`);
  },

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<User> {
    return api.patch<User>('/users/me', data);
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return api.post('/users/me/change-password', data);
  },

  // Change PIN
  async changePin(data: ChangePinData): Promise<{ message: string }> {
    return api.post('/users/me/change-pin', data);
  },

  // Enable 2FA
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    return api.post('/users/me/2fa/enable');
  },

  // Disable 2FA
  async disable2FA(code: string): Promise<{ message: string }> {
    return api.post('/users/me/2fa/disable', { code });
  },

  // Verify 2FA code
  async verify2FA(code: string): Promise<{ verified: boolean }> {
    return api.post('/users/me/2fa/verify', { code });
  },

  // Get user notifications
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<any> {
    return api.get('/users/me/notifications', { params });
  },

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    return api.patch(`/users/me/notifications/${notificationId}/read`);
  },

  // Get user activity log
  async getActivityLog(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<any> {
    return api.get('/users/me/activity', { params });
  },

  // Delete account
  async deleteAccount(password: string): Promise<{ message: string }> {
    return api.post('/users/me/delete', { password });
  },
};
