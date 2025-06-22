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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralInfo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const forms_1 = require("../types/forms");
// User info sub-schema
const UserInfoSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
}, { _id: false }); // Don't create separate _id for sub-documents
// Main GeneralInfo schema
const GeneralInfoSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        index: true, // Index for faster queries
    },
    formType: {
        type: String,
        enum: Object.values(forms_1.FormType),
        required: [true, "Form type is required"],
        index: true, // Index for faster queries
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed, // Flexible object to store form data
        required: [true, "Form data is required"],
        default: {},
    },
    status: {
        type: String,
        enum: Object.values(forms_1.FormStatus),
        default: forms_1.FormStatus.DRAFT,
        required: true,
    },
    createdBy: {
        type: UserInfoSchema,
        required: false,
    },
    updatedBy: {
        type: UserInfoSchema,
        required: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "general_info", // Explicit collection name
    // Transform the output when converting to JSON
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    // Transform the output when converting to Object
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Compound index for unique form per user per type
GeneralInfoSchema.index({ userId: 1, formType: 1 }, { unique: true });
// Index for better query performance
GeneralInfoSchema.index({ status: 1 });
GeneralInfoSchema.index({ updatedAt: -1 });
// Pre-save middleware to validate form data based on type
GeneralInfoSchema.pre("save", function (next) {
    if (this.formType === forms_1.FormType.GENERAL_INFO_B1) {
        if (!this.data || typeof this.data !== "object") {
            return next(new Error("B1 form data is required"));
        }
    }
    if (this.formType === forms_1.FormType.GENERAL_INFO_B2) {
        if (!this.data || typeof this.data !== "object") {
            return next(new Error("B2 form data is required"));
        }
    }
    next();
});
// Static methods
GeneralInfoSchema.statics.findByUserAndType = function (userId, formType) {
    return this.findOne({ userId, formType });
};
GeneralInfoSchema.statics.findByUser = async function (userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const forms = await this.find({ userId }).skip(skip).limit(limit).sort({ updatedAt: -1 });
    const total = await this.countDocuments({ userId });
    return {
        forms,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
GeneralInfoSchema.statics.findByStatus = function (status, userId) {
    const query = userId ? { status, userId } : { status };
    return this.find(query).sort({ updatedAt: -1 });
};
// Instance methods
GeneralInfoSchema.methods.isComplete = function () {
    return this.status === forms_1.FormStatus.SUBMITTED || this.status === forms_1.FormStatus.APPROVED;
};
GeneralInfoSchema.methods.updateFormData = function (newData) {
    this.data = { ...this.data, ...newData };
    this.updatedAt = new Date();
    return this.save();
};
// Create and export the model
exports.GeneralInfo = mongoose_1.default.model("GeneralInfo", GeneralInfoSchema);
