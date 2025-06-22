export enum FormType {
  GENERAL_INFO_B1 = "general_info_b1",
  GENERAL_INFO_B2 = "general_info_b2",
}

export interface FormItem {
  id: string;
  description: string;
  placeholder: string;
  multiline?: boolean;
  required: boolean;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface FormListResponse {
  forms: BaseForm[];
  total: number;
  page: number;
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormResponse<T = any> {
  success: boolean;
  data?: T;
  completionStatus?: CompletionStatus | null;
  errors?: FormValidationError[];
  message?: string;
}
