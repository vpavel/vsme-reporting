import { useState, useEffect, useCallback } from "react";
import { GeneralInfoApi } from "@/services/generalInfoApi";
import { FormType, FormStatus, BaseForm } from "@/types/forms";

export function useGeneralInfoApi(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [b1Form, setB1Form] = useState<BaseForm | null>(null);
  const [b2Form, setB2Form] = useState<BaseForm | null>(null);

  // Load existing forms
  const loadForms = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Load both forms in parallel
      const [b1Result, b2Result] = await Promise.allSettled([
        GeneralInfoApi.getForm(userId, FormType.GENERAL_INFO_B1),
        GeneralInfoApi.getForm(userId, FormType.GENERAL_INFO_B2),
      ]);

      // Handle B1 form
      if (b1Result.status === "fulfilled" && b1Result.value.success) {
        setB1Form(b1Result.value.data!);
      } else if (b1Result.status === "rejected") {
        // This is expected when no form exists yet - don't log as error
        console.log("B1 form not found (this is normal for new users)");
      }

      // Handle B2 form
      if (b2Result.status === "fulfilled" && b2Result.value.success) {
        setB2Form(b2Result.value.data!);
      } else if (b2Result.status === "rejected") {
        // This is expected when no form exists yet - don't log as error
        console.log("B2 form not found (this is normal for new users)");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load forms";
      setError(errorMessage);
      console.error("Error loading forms:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Save or update form
  const saveForm = useCallback(
    async (formType: FormType, data: Record<string, string>, status: FormStatus = FormStatus.DRAFT) => {
      setLoading(true);
      setError(null);

      try {
        const existingForm = formType === FormType.GENERAL_INFO_B1 ? b1Form : b2Form;

        let response;
        if (existingForm) {
          // Update existing form
          response = await GeneralInfoApi.updateForm(existingForm.id || existingForm._id!, {
            data,
            status,
          });
        } else {
          // Create new form
          response = await GeneralInfoApi.createForm({
            userId,
            formType,
            data,
            status,
          });
        }

        if (response.success && response.data) {
          // Update local state
          if (formType === FormType.GENERAL_INFO_B1) {
            setB1Form(response.data);
          } else {
            setB2Form(response.data);
          }
          return response;
        } else {
          throw new Error(response.message || "Failed to save form");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to save form";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [userId, b1Form, b2Form]
  );

  // Load forms on mount
  useEffect(() => {
    loadForms();
  }, [loadForms]);

  return {
    loading,
    error,
    b1Form,
    b2Form,
    saveForm,
    reloadForms: loadForms,
    clearError: () => setError(null),
  };
}
