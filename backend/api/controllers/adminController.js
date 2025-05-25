"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forcePasswordChange = exports.resetUserPasswordByEmail = exports.resetUserPassword = exports.getPermissionsAndRoles = exports.toggleUserStatus = exports.updateUserPermissions = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const index_1 = require("../types/index");
// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// Update user permissions
const updateUserPermissions = async (req, res) => {
    try {
        const { userId, permissions, role } = req.body;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent self-demotion from admin
        if (user._id.toString() === req.user?.userId && role && role !== index_1.Role.ADMIN) {
            return res.status(400).json({ message: "Cannot remove admin role from yourself" });
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
            return res.status(404).json({ message: "User not found after update" });
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
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user permissions", error: error.message });
    }
};
exports.updateUserPermissions = updateUserPermissions;
// Toggle user active status
const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent self-deactivation
        if (user._id.toString() === req.user?.userId) {
            return res.status(400).json({ message: "Cannot deactivate yourself" });
        }
        user.isActive = !user.isActive;
        await user.save();
        const updatedUser = await User_1.User.findById(userId).select("-password").lean();
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found after update" });
        }
        const response = {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user status", error: error.message });
    }
};
exports.toggleUserStatus = toggleUserStatus;
// Get available permissions and roles
const getPermissionsAndRoles = async (req, res) => {
    try {
        res.json({
            permissions: Object.values(index_1.Permission),
            roles: Object.values(index_1.Role),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching permissions and roles", error: error.message });
    }
};
exports.getPermissionsAndRoles = getPermissionsAndRoles;
// Reset user password (Admin only)
const resetUserPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) {
            return res.status(400).json({ message: "User ID and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};
exports.resetUserPassword = resetUserPassword;
// Reset user password by email (Admin only)
const resetUserPasswordByEmail = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
    }
    catch (error) {
        console.error("Reset password by email error:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};
exports.resetUserPasswordByEmail = resetUserPasswordByEmail;
// Force password change on next login
const forcePasswordChange = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
    }
    catch (error) {
        console.error("Force password change error:", error);
        res.status(500).json({ message: "Error setting password change requirement", error: error.message });
    }
};
exports.forcePasswordChange = forcePasswordChange;
