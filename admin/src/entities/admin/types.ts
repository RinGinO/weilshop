export interface Admin {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  roles: AdminRole[];
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  permissions: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: Admin;
}
