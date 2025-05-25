"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// All admin routes require authentication and admin role
router.use(authMiddleware_1.authenticateToken);
router.use(authMiddleware_1.requireAdmin);
// GET /api/admin/users - Get all users
router.get("/users", adminController_1.getAllUsers);
// PUT /api/admin/users/permissions - Update user permissions
router.put("/users/permissions", adminController_1.updateUserPermissions);
// PATCH /api/admin/users/:userId/status - Toggle user active status
router.patch("/users/:userId/status", adminController_1.toggleUserStatus);
// GET /api/admin/permissions - Get available permissions and roles
router.get("/permissions", adminController_1.getPermissionsAndRoles);
exports.default = router;
