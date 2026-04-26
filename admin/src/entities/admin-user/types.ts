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

export interface CreateAdminDto {
  email: string;
  password: string;
  name: string;
  roleIds: string[];
  isActive?: boolean;
}

export interface UpdateAdminDto extends Partial<CreateAdminDto> {
  id: string;
}

export interface CreateRoleDto {
  name: string;
  slug: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  id: string;
}
