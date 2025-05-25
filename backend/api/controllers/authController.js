"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jwtUtils_1 = require("../utils/jwtUtils");
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Create new user
        const user = new User_1.User({
            email,
            password,
            name,
        });
        await user.save();
        // Generate token
        const token = (0, jwtUtils_1.generateToken)(user);
        const userResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.status(201).json({
            message: "User created successfully",
            token,
            user: userResponse,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Check if user is active
        if (!user.isActive) {
            res.status(403).json({ message: "Account is deactivated. Please contact administrator." });
            return;
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate token
        const token = (0, jwtUtils_1.generateToken)(user);
        const userResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.json({
            message: "Login successful",
            token,
            user: userResponse,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const user = await User_1.User.findById(req.user.userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.json({
            user: userResponse,
        });
    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ message: "Failed to get user data" });
    }
};
exports.getCurrentUser = getCurrentUser;
