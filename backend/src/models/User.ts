import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, Role, Permission } from "../types/index";

const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user has specific permission
userSchema.methods.hasPermission = function (permission: Permission): boolean {
  return this.permissions.includes(permission) || this.role === Role.ADMIN;
};

// Set default permissions based on role
userSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    switch (this.role) {
      case Role.ADMIN:
        this.permissions = Object.values(Permission);
        break;
      case Role.EDITOR:
        this.permissions = [Permission.EDIT_CONTENT, Permission.READ_USERS];
        break;
      case Role.USER:
        this.permissions = [];
        break;
    }
  }
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);
