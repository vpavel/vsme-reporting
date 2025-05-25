// services/adminApi.ts
import axios from "axios";

// Types matching backend
export enum Permission {
  READ_USERS = "READ_USERS",
  WRITE_USERS = "WRITE_USERS",
  DELETE_USERS = "DELETE_USERS",
  EDIT_CONTENT = "EDIT_CONTENT",
  MANAGE_PERMISSIONS = "MANAGE_PERMISSIONS",
  ADMIN_ACCESS = "ADMIN_ACCESS",
}

export enum Role {
  USER = "user",
  EDITOR = "editor",
  ADMIN = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserPermissionsRequest {
  userId: string;
  permissions: Permission[];
  role?: Role;
}

export interface PermissionUpdateResponse {
  message: string;
  user: User;
}

export interface PermissionsAndRolesResponse {
  permissions: Permission[];
  roles: Role[];
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Get all users with pagination
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<AdminUserListResponse> => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Update user permissions
  updateUserPermissions: async (data: UpdateUserPermissionsRequest): Promise<PermissionUpdateResponse> => {
    const response = await api.put("/admin/users/permissions", data);
    return response.data;
  },

  // Toggle user active status
  toggleUserStatus: async (userId: string): Promise<PermissionUpdateResponse> => {
    const response = await api.patch(`/admin/users/${userId}/status`);
    return response.data;
  },

  // Get available permissions and roles
  getPermissionsAndRoles: async (): Promise<PermissionsAndRolesResponse> => {
    const response = await api.get("/admin/permissions");
    return response.data;
  },
};
