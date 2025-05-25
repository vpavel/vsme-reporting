import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { verifyToken } from "../utils/jwtUtils";

// Permission and Role enums (add these)
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

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }

  req.user = decoded;
  next();
};

// Check if user has required permission
export const requirePermission = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
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

// Check if user has required role
export const requireRole = (role: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
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

// Admin only middleware
export const requireAdmin = requireRole(Role.ADMIN);
