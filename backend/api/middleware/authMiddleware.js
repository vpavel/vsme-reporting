"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.requirePermission = exports.authenticateToken = exports.Role = exports.Permission = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
// Permission and Role enums (add these)
var Permission;
(function (Permission) {
    Permission["READ_USERS"] = "READ_USERS";
    Permission["WRITE_USERS"] = "WRITE_USERS";
    Permission["DELETE_USERS"] = "DELETE_USERS";
    Permission["EDIT_CONTENT"] = "EDIT_CONTENT";
    Permission["MANAGE_PERMISSIONS"] = "MANAGE_PERMISSIONS";
    Permission["ADMIN_ACCESS"] = "ADMIN_ACCESS";
})(Permission || (exports.Permission = Permission = {}));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["EDITOR"] = "editor";
    Role["ADMIN"] = "admin";
})(Role || (exports.Role = Role = {}));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    const decoded = (0, jwtUtils_1.verifyToken)(token);
    if (!decoded) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
    req.user = decoded;
    next();
};
exports.authenticateToken = authenticateToken;
// Check if user has required permission
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const hasPermission = req.user.permissions?.includes(permission) || req.user.role === Role.ADMIN;
        if (!hasPermission) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
// Check if user has required role
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (req.user.role !== role && req.user.role !== Role.ADMIN) {
            res.status(403).json({ message: "Insufficient role permissions" });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
// Admin only middleware
exports.requireAdmin = (0, exports.requireRole)(Role.ADMIN);
