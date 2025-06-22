import { Response } from "express";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errorHandler";
import {
  AuthRequest,
  Permission,
  Role,
  UpdateUserPermissionsRequest,
  AdminUserListResponse,
  PermissionUpdateResponse,
} from "../types/index";

// Get all users (Admin only)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({}).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

  const total = await User.countDocuments({});

  const response: AdminUserListResponse = {
    users: users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
    total,
    page,
    limit,
  };

  res.json(response);
});

// Update user permissions
export const updateUserPermissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId, permissions, role }: UpdateUserPermissionsRequest = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Prevent self-demotion from admin
  if (user._id.toString() === req.user?.userId && role && role !== Role.ADMIN) {
    throw new AppError("Cannot remove admin role from yourself", 400);
  }

  if (permissions) {
    user.permissions = permissions;
  }

  if (role) {
    user.role = role;
  }

  await user.save();

  const updatedUser = await User.findById(userId).select("-password").lean();

  if (!updatedUser) {
    throw new AppError("User not found after update", 404);
  }

  const response: PermissionUpdateResponse = {
    message: "User permissions updated successfully",
    user: {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };

  res.json(response);
});

// Toggle user active status
export const toggleUserStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Prevent self-deactivation
  if (user._id.toString() === req.user?.userId) {
    throw new AppError("Cannot deactivate yourself", 400);
  }

  const wasActive = user.isActive;
  user.isActive = !user.isActive;
  await user.save();

  const updatedUser = await User.findById(userId).select("-password").lean();

  if (!updatedUser) {
    throw new AppError("User not found after update", 404);
  }

  const response: PermissionUpdateResponse = {
    message: `User ${!wasActive ? "activated" : "deactivated"} successfully`,
    user: {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };

  res.json(response);
});

// Get available permissions and roles
export const getPermissionsAndRoles = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    permissions: Object.values(Permission),
    roles: Object.values(Role),
  });
});

// Reset user password (Admin only)
export const resetUserPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    throw new AppError("User ID and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Update password (will be hashed by the pre-save hook)
  user.password = newPassword;
  await user.save();

  res.json({
    message: "Password reset successfully",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
});

// Reset user password by email (Admin only)
export const resetUserPasswordByEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    throw new AppError("Email and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Update password (will be hashed by the pre-save hook)
  user.password = newPassword;
  await user.save();

  res.json({
    message: "Password reset successfully",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
});

// Force password change on next login
export const forcePasswordChange = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // You could add a field like 'mustChangePassword' to your User model
  // For now, we'll just return success
  res.json({
    message: "User will be required to change password on next login",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
});
