"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../types/index");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "editor", "admin"],
        default: "user", // Default role for new users
    },
    permissions: {
        type: [String],
        enum: ["READ_USERS", "WRITE_USERS", "DELETE_USERS", "EDIT_CONTENT", "MANAGE_PERMISSIONS", "ADMIN_ACCESS"],
        default: [], // Default empty permissions for new users
    },
    isActive: {
        type: Boolean,
        default: true, // Default active for new users
    },
}, { timestamps: true });
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Check if user has specific permission
userSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission) || this.role === index_1.Role.ADMIN;
};
// Set default permissions based on role
userSchema.pre("save", function (next) {
    if (this.isModified("role")) {
        switch (this.role) {
            case index_1.Role.ADMIN:
                this.permissions = Object.values(index_1.Permission);
                break;
            case index_1.Role.EDITOR:
                this.permissions = [index_1.Permission.EDIT_CONTENT, index_1.Permission.READ_USERS];
                break;
            case index_1.Role.USER:
                this.permissions = [];
                break;
        }
    }
    next();
});
exports.User = mongoose_1.default.model("User", userSchema);
