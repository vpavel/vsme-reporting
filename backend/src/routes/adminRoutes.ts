import express from "express";
import {
  getAllUsers,
  updateUserPermissions,
  toggleUserStatus,
  getPermissionsAndRoles,
  resetUserPassword,
  resetUserPasswordByEmail,
  forcePasswordChange,
} from "../controllers/adminController";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management routes
router.get("/users", getAllUsers);
router.put("/users/permissions", updateUserPermissions);
router.patch("/users/:userId/status", toggleUserStatus);

// Password management routes
router.put("/users/reset-password", resetUserPassword);
router.put("/users/reset-password-by-email", resetUserPasswordByEmail);
router.put("/users/force-password-change", forcePasswordChange);

// System routes
router.get("/permissions", getPermissionsAndRoles);

export default router;
