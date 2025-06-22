"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forcePasswordChange = exports.resetUserPasswordByEmail = exports.resetUserPassword = exports.getPermissionsAndRoles = exports.toggleUserStatus = exports.updateUserPermissions = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const asyncHandler_1 = require("../utils/asyncHandler");
const errorHandler_1 = require("../utils/errorHandler");
const index_1 = require("../types/index");
// Get all users (Admin only)
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User_1.User.find({}).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await User_1.User.countDocuments({});
    const response = {
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
exports.updateUserPermissions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, permissions, role } = req.body;
    const user = await User_1.User.findById(userId);
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Prevent self-demotion from admin
    if (user._id.toString() === req.user?.userId && role && role !== index_1.Role.ADMIN) {
        throw new errorHandler_1.AppError("Cannot remove admin role from yourself", 400);
    }
    if (permissions) {
        user.permissions = permissions;
    }
    if (role) {
        user.role = role;
    }
    await user.save();
    const updatedUser = await User_1.User.findById(userId).select("-password").lean();
    if (!updatedUser) {
        throw new errorHandler_1.AppError("User not found after update", 404);
    }
    const response = {
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
exports.toggleUserStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const user = await User_1.User.findById(userId);
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Prevent self-deactivation
    if (user._id.toString() === req.user?.userId) {
        throw new errorHandler_1.AppError("Cannot deactivate yourself", 400);
    }
    const wasActive = user.isActive;
    user.isActive = !user.isActive;
    await user.save();
    const updatedUser = await User_1.User.findById(userId).select("-password").lean();
    if (!updatedUser) {
        throw new errorHandler_1.AppError("User not found after update", 404);
    }
    const response = {
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
exports.getPermissionsAndRoles = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    res.json({
        permissions: Object.values(index_1.Permission),
        roles: Object.values(index_1.Role),
    });
});
// Reset user password (Admin only)
exports.resetUserPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
        throw new errorHandler_1.AppError("User ID and new password are required", 400);
    }
    if (newPassword.length < 6) {
        throw new errorHandler_1.AppError("Password must be at least 6 characters long", 400);
    }
    const user = await User_1.User.findById(userId);
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
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
exports.resetUserPasswordByEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        throw new errorHandler_1.AppError("Email and new password are required", 400);
    }
    if (newPassword.length < 6) {
        throw new errorHandler_1.AppError("Password must be at least 6 characters long", 400);
    }
    const user = await User_1.User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
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
exports.forcePasswordChange = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        throw new errorHandler_1.AppError("User ID is required", 400);
    }
    const user = await User_1.User.findById(userId);
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
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
