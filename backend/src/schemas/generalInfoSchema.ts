import { z } from "zod";
import { FormType, FormStatus } from "../types/forms";

// Zod schema for B1 form data
export const B1DataSchema = z.object({
  "b1.1": z.string().optional(),
  "b1.2": z.string().min(1, "Reporting basis is required"),
  "b1.3": z.string().optional(),
  "b1.4": z.string().min(1, "Legal form is required"),
  "b1.5": z.string().min(1, "NACE code is required"),
  "b1.6": z.string().min(1, "Balance sheet size is required"),
  "b1.7": z.string().min(1, "Turnover is required"),
  "b1.8": z.string().min(1, "Employee count is required"),
  "b1.9": z.string().min(1, "Primary operation country is required"),
  "b1.10": z.string().min(1, "Asset locations are required"),
  "b1.11": z.string().optional(),
  "b1.12": z.string().optional(),
});

// Zod schema for B2 form data
export const B2DataSchema = z.object({
  "b2.1": z.string().min(1, "Sustainability practices are required"),
  "b2.2": z.string().optional(),
  "b2.3": z.string().optional(),
  "b2.4": z.string().min(1, "Future initiatives are required"),
  "b2.5": z.string().optional(),
  "b2.6": z.string().optional(),
});

// User info schema
export const UserInfoSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

// Base form schema that matches your existing interface
export const BaseFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  formType: z.nativeEnum(FormType),
  data: z.record(z.any()), // Flexible data object
  status: z.nativeEnum(FormStatus),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: UserInfoSchema.optional(),
  updatedBy: UserInfoSchema.optional(),
});

// Specific schemas for each form type
export const GeneralInfoB1FormSchema = BaseFormSchema.extend({
  formType: z.literal(FormType.GENERAL_INFO_B1),
  data: B1DataSchema,
});

export const GeneralInfoB2FormSchema = BaseFormSchema.extend({
  formType: z.literal(FormType.GENERAL_INFO_B2),
  data: B2DataSchema,
});

// Create request schemas (for API endpoints)
export const CreateB1FormSchema = z.object({
  userId: z.string().min(1),
  formType: z.literal(FormType.GENERAL_INFO_B1), // Add this line
  data: B1DataSchema,
  status: z.nativeEnum(FormStatus).default(FormStatus.DRAFT),
});

export const CreateB2FormSchema = z.object({
  userId: z.string().min(1),
  formType: z.literal(FormType.GENERAL_INFO_B2), // Add this line
  data: B2DataSchema,
  status: z.nativeEnum(FormStatus).default(FormStatus.DRAFT),
});

export const UpdateFormSchema = z.object({
  data: z.record(z.any()).optional(),
  status: z.nativeEnum(FormStatus).optional(),
});

// Type inference from schemas
export type B1FormData = z.infer<typeof B1DataSchema>;
export type B2FormData = z.infer<typeof B2DataSchema>;
export type CreateB1FormRequest = z.infer<typeof CreateB1FormSchema>;
export type CreateB2FormRequest = z.infer<typeof CreateB2FormSchema>;
export type UpdateFormRequest = z.infer<typeof UpdateFormSchema>;
