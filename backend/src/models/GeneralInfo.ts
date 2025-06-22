import mongoose, { Schema, Document } from "mongoose";
import { FormType, FormStatus, FormData, UserInfo, BaseForm } from "../types/forms";

// Interface for the MongoDB document (renamed to avoid conflict)
interface GeneralInfoDocument extends Document, BaseForm {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// User info sub-schema
const UserInfoSchema = new Schema<UserInfo>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
); // Don't create separate _id for sub-documents

// Main GeneralInfo schema
const GeneralInfoSchema = new Schema<GeneralInfoDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true, // Index for faster queries
    },

    formType: {
      type: String,
      enum: Object.values(FormType),
      required: [true, "Form type is required"],
      index: true, // Index for faster queries
    },

    data: {
      type: Schema.Types.Mixed, // Flexible object to store form data
      required: [true, "Form data is required"],
      default: {},
    },

    status: {
      type: String,
      enum: Object.values(FormStatus),
      default: FormStatus.DRAFT,
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
  },
  {
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
  }
);

// Compound index for unique form per user per type
GeneralInfoSchema.index({ userId: 1, formType: 1 }, { unique: true });

// Index for better query performance
GeneralInfoSchema.index({ status: 1 });
GeneralInfoSchema.index({ updatedAt: -1 });

// Pre-save middleware to validate form data based on type
GeneralInfoSchema.pre("save", function (next) {
  if (this.formType === FormType.GENERAL_INFO_B1) {
    if (!this.data || typeof this.data !== "object") {
      return next(new Error("B1 form data is required"));
    }
  }

  if (this.formType === FormType.GENERAL_INFO_B2) {
    if (!this.data || typeof this.data !== "object") {
      return next(new Error("B2 form data is required"));
    }
  }

  next();
});

// Define static methods interface
interface GeneralInfoModel extends mongoose.Model<GeneralInfoDocument> {
  findByUserAndType(userId: string, formType: FormType): Promise<GeneralInfoDocument | null>;
  findByUser(
    userId: string,
    options?: { page?: number; limit?: number }
  ): Promise<{
    forms: GeneralInfoDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  findByStatus(status: FormStatus, userId?: string): Promise<GeneralInfoDocument[]>;
}

// Static methods
GeneralInfoSchema.statics.findByUserAndType = function (userId: string, formType: FormType) {
  return this.findOne({ userId, formType });
};

GeneralInfoSchema.statics.findByUser = async function (
  userId: string,
  options: { page?: number; limit?: number } = {}
) {
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

GeneralInfoSchema.statics.findByStatus = function (status: FormStatus, userId?: string) {
  const query = userId ? { status, userId } : { status };
  return this.find(query).sort({ updatedAt: -1 });
};

// Instance methods
GeneralInfoSchema.methods.isComplete = function () {
  return this.status === FormStatus.SUBMITTED || this.status === FormStatus.APPROVED;
};

GeneralInfoSchema.methods.updateFormData = function (newData: Partial<FormData>) {
  this.data = { ...this.data, ...newData };
  this.updatedAt = new Date();
  return this.save();
};

// Create and export the model
export const GeneralInfo = mongoose.model<GeneralInfoDocument, GeneralInfoModel>("GeneralInfo", GeneralInfoSchema);

// Export the document interface for use in controllers
export type { GeneralInfoDocument };
