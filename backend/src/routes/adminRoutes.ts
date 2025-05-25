import express from "express";
import {
  getAllUsers,
  updateUserPermissions,
  toggleUserStatus,
  getPermissionsAndRoles,
} from "../controllers/adminController";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get("/users", getAllUsers);

// PUT /api/admin/users/permissions - Update user permissions
router.put("/users/permissions", updateUserPermissions);

// PATCH /api/admin/users/:userId/status - Toggle user active status
router.patch("/users/:userId/status", toggleUserStatus);

// GET /api/admin/permissions - Get available permissions and roles
router.get("/permissions", getPermissionsAndRoles);

export default router;
