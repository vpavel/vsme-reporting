/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/types/forms.ts
export enum FormType {
  GENERAL_INFO_B1 = "general_info_b1",
  GENERAL_INFO_B2 = "general_info_b2",
}

export enum FormStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface CompletionStatus {
  isCompleted: boolean;
  requiredFields: number;
  completedFields: number;
  missingFields: string[];
  completionPercentage: number;
}

export interface FormValidationError {
  field: string;
  message: string;
  code: string;
}

export interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

export interface BaseForm {
  id?: string;
  _id?: string;
  userId: string;
  formType: FormType;
  data: FormData;
  status: FormStatus;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: UserInfo;
  updatedBy?: UserInfo;
}

export interface FormData {
  [key: string]: any;
}

export interface FormListResponse {
  forms: BaseForm[];
  total: number;
  page: number;
  limit: number;
}

export interface FormResponse<T = any> {
  success: boolean;
  data?: T;
  completionStatus?: CompletionStatus | null;
  errors?: FormValidationError[];
  message?: string;
}

export interface FormItem {
  id: string;
  description: string;
  placeholder: string;
  multiline?: boolean;
  required: boolean;
}
