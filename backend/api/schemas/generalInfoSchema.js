"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFormSchema = exports.CreateB2FormSchema = exports.CreateB1FormSchema = exports.GeneralInfoB2FormSchema = exports.GeneralInfoB1FormSchema = exports.BaseFormSchema = exports.UserInfoSchema = exports.B2DataSchema = exports.B1DataSchema = void 0;
const zod_1 = require("zod");
const forms_1 = require("../types/forms");
// Zod schema for B1 form data
exports.B1DataSchema = zod_1.z.object({
    "b1.1": zod_1.z.string().optional(),
    "b1.2": zod_1.z.string().min(1, "Reporting basis is required"),
    "b1.3": zod_1.z.string().optional(),
    "b1.4": zod_1.z.string().min(1, "Legal form is required"),
    "b1.5": zod_1.z.string().min(1, "NACE code is required"),
    "b1.6": zod_1.z.string().min(1, "Balance sheet size is required"),
    "b1.7": zod_1.z.string().min(1, "Turnover is required"),
    "b1.8": zod_1.z.string().min(1, "Employee count is required"),
    "b1.9": zod_1.z.string().min(1, "Primary operation country is required"),
    "b1.10": zod_1.z.string().min(1, "Asset locations are required"),
    "b1.11": zod_1.z.string().optional(),
    "b1.12": zod_1.z.string().optional(),
});
// Zod schema for B2 form data
exports.B2DataSchema = zod_1.z.object({
    "b2.1": zod_1.z.string().min(1, "Sustainability practices are required"),
    "b2.2": zod_1.z.string().optional(),
    "b2.3": zod_1.z.string().optional(),
    "b2.4": zod_1.z.string().min(1, "Future initiatives are required"),
    "b2.5": zod_1.z.string().optional(),
    "b2.6": zod_1.z.string().optional(),
});
// User info schema
exports.UserInfoSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
});
// Base form schema that matches your existing interface
exports.BaseFormSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    formType: zod_1.z.nativeEnum(forms_1.FormType),
    data: zod_1.z.record(zod_1.z.any()), // Flexible data object
    status: zod_1.z.nativeEnum(forms_1.FormStatus),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
    createdBy: exports.UserInfoSchema.optional(),
    updatedBy: exports.UserInfoSchema.optional(),
});
// Specific schemas for each form type
exports.GeneralInfoB1FormSchema = exports.BaseFormSchema.extend({
    formType: zod_1.z.literal(forms_1.FormType.GENERAL_INFO_B1),
    data: exports.B1DataSchema,
});
exports.GeneralInfoB2FormSchema = exports.BaseFormSchema.extend({
    formType: zod_1.z.literal(forms_1.FormType.GENERAL_INFO_B2),
    data: exports.B2DataSchema,
});
// Create request schemas (for API endpoints)
exports.CreateB1FormSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    data: exports.B1DataSchema,
    status: zod_1.z.nativeEnum(forms_1.FormStatus).default(forms_1.FormStatus.DRAFT),
});
exports.CreateB2FormSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    data: exports.B2DataSchema,
    status: zod_1.z.nativeEnum(forms_1.FormStatus).default(forms_1.FormStatus.DRAFT),
});
exports.UpdateFormSchema = zod_1.z.object({
    data: zod_1.z.record(zod_1.z.any()).optional(),
    status: zod_1.z.nativeEnum(forms_1.FormStatus).optional(),
});
