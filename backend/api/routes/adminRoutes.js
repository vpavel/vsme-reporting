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
// User management routes
router.get("/users", adminController_1.getAllUsers);
router.put("/users/permissions", adminController_1.updateUserPermissions);
router.patch("/users/:userId/status", adminController_1.toggleUserStatus);
// Password management routes
router.put("/users/reset-password", adminController_1.resetUserPassword);
router.put("/users/reset-password-by-email", adminController_1.resetUserPasswordByEmail);
router.put("/users/force-password-change", adminController_1.forcePasswordChange);
// System routes
router.get("/permissions", adminController_1.getPermissionsAndRoles);
exports.default = router;
