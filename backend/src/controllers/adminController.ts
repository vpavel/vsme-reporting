import { Response } from "express";
import { User } from "../models/User";
import {
  AuthRequest,
  Permission,
  Role,
  UpdateUserPermissionsRequest,
  AdminUserListResponse,
  PermissionUpdateResponse,
  UserResponse,
} from "../types/index";

// Get all users (Admin only)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Update user permissions
export const updateUserPermissions = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, permissions, role }: UpdateUserPermissionsRequest = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-demotion from admin
    if (user._id.toString() === req.user?.userId && role && role !== Role.ADMIN) {
      return res.status(400).json({ message: "Cannot remove admin role from yourself" });
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
      return res.status(404).json({ message: "User not found after update" });
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
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user permissions", error: error.message });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-deactivation
    if (user._id.toString() === req.user?.userId) {
      return res.status(400).json({ message: "Cannot deactivate yourself" });
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password").lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found after update" });
    }

    const response: PermissionUpdateResponse = {
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
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
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user status", error: error.message });
  }
};

// Get available permissions and roles
export const getPermissionsAndRoles = async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      permissions: Object.values(Permission),
      roles: Object.values(Role),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching permissions and roles", error: error.message });
  }
};
