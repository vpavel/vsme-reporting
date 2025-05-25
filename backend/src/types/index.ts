import { Request } from "express";
import { Document } from "mongoose";

// Permission types
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

// Updated User interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permission: Permission): boolean;
}

export interface IDecodedToken {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: IDecodedToken;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserResponse;
}

// Admin-specific interfaces
export interface UpdateUserPermissionsRequest {
  userId: string;
  permissions: Permission[];
  role?: Role;
}

export interface AdminUserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface PermissionUpdateResponse {
  message: string;
  user: UserResponse;
}
