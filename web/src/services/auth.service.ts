import { api } from '@/lib/api-client';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CLIENT' | 'MERCHANT' | 'DISTRIBUTOR' | 'DIASPORA';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Service
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    // Store token
    if (response.accessToken) {
      api.setAuthToken(response.accessToken);
    }

    return response;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);

    // Store token
    if (response.accessToken) {
      api.setAuthToken(response.accessToken);
    }

    return response;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear token regardless of API response
      api.clearAuthToken();
    }
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    return api.get<User>('/auth/profile');
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });

    if (response.accessToken) {
      api.setAuthToken(response.accessToken);
    }

    return response;
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return api.post('/auth/password-reset/request', { email });
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return api.post('/auth/password-reset/confirm', { token, newPassword });
  },

  // Verify email
  async verifyEmail(token: string): Promise<{ message: string }> {
    return api.post('/auth/verify-email', { token });
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!api.getAuthToken();
  },
};
