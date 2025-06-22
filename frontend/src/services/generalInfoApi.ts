import axios, { AxiosResponse } from "axios";
import { FormType, FormStatus, BaseForm, FormResponse } from "@/types/forms";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token"); // Adjust based on your auth implementation
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login or refresh token
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export interface CreateFormRequest {
  userId: string;
  formType: FormType;
  data: Record<string, string>;
  status?: FormStatus;
}

export interface UpdateFormRequest {
  data?: Record<string, string>;
  status?: FormStatus;
}

export class GeneralInfoApi {
  // Get form data
  static async getForm(userId: string, formType: FormType): Promise<FormResponse<BaseForm>> {
    try {
      const response: AxiosResponse<FormResponse<BaseForm>> = await apiClient.get(
        `/general-info/${userId}/${formType}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching form:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Create new form
  static async createForm(formData: CreateFormRequest): Promise<FormResponse<BaseForm>> {
    try {
      console.log("Sending form data:", JSON.stringify(formData, null, 2));
      const response: AxiosResponse<FormResponse<BaseForm>> = await apiClient.post("/general-info", formData);
      return response.data;
    } catch (error) {
      console.error("Error creating form:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Update existing form
  static async updateForm(formId: string, updateData: UpdateFormRequest): Promise<FormResponse<BaseForm>> {
    try {
      const response: AxiosResponse<FormResponse<BaseForm>> = await apiClient.put(
        `/general-info/${formId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating form:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Get all forms for a user
  static async getUserForms(userId: string, page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/general-info/user/${userId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user forms:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  // Delete form
  static async deleteForm(formId: string): Promise<FormResponse> {
    try {
      const response: AxiosResponse<FormResponse> = await apiClient.delete(`/general-info/${formId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting form:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }
}
