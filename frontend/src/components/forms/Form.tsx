"use client";
import { useState, useEffect } from "react";
import styles from "./Form.module.css";

interface FormItem {
  id: string;
  indicator?: string;
  description: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  value?: string;
}

interface FormValidationError {
  field: string;
  message: string;
  code: string;
}

interface FormProps {
  title: string;
  subtitle?: string;
  items: FormItem[];
  onSubmit?: (data: Record<string, string>) => Promise<void> | void;
  submitButtonText?: string;
  loading?: boolean;
  errors?: FormValidationError[];
  onChange?: (data: Record<string, string>) => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export default function Form({
  title,
  subtitle,
  items,
  onSubmit,
  submitButtonText = "Submit",
  loading = false,
  errors = [],
  onChange,
  autoSave = false,
  autoSaveDelay = 2000,
}: FormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.value || "" }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update form data when items change (e.g., when API data loads)
  useEffect(() => {
    const newFormData = items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: item.value || "",
      }),
      {}
    );
    setFormData(newFormData);
  }, [items]);

  // Process validation errors
  useEffect(() => {
    const newFieldErrors: Record<string, string> = {};
    errors.forEach((error) => {
      newFieldErrors[error.field] = error.message;
    });
    setFieldErrors(newFieldErrors);
  }, [errors]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onChange) {
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        onChange(formData);
        setLastSaved(new Date());
      }, autoSaveDelay);

      setAutoSaveTimer(timer);

      // Cleanup
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [formData, autoSave, onChange, autoSaveDelay]);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[id]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // Call onChange if provided (for immediate updates)
    if (onChange && !autoSave) {
      onChange({ ...formData, [id]: value });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    items.forEach((item) => {
      if (item.required && (!formData[item.id] || formData[item.id].trim() === "")) {
        newErrors[item.id] = `${item.description} is required`;
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is managed by the parent component through the errors prop
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (itemId: string) => {
    return `${styles.input} ${fieldErrors[itemId] ? styles.inputError : ""}`;
  };

  const getTextareaClassName = (itemId: string) => {
    return `${styles.textarea} ${fieldErrors[itemId] ? styles.textareaError : ""}`;
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>{title}</h1>
        {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}

        {/* Auto-save indicator */}
        {autoSave && (
          <div className={styles.autoSaveIndicator}>
            {loading ? (
              <span className={styles.saving}>Saving...</span>
            ) : lastSaved ? (
              <span className={styles.saved}>Last saved: {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.formItem}>
              <div className={styles.itemHeader}>
                {item.indicator && <span className={styles.indicator}>{item.indicator}</span>}
                <p className={styles.description}>
                  {item.description}
                  {item.required && <span className={styles.required}>*</span>}
                </p>
              </div>

              <div className={styles.inputContainer}>
                {item.multiline ? (
                  <textarea
                    id={item.id}
                    name={item.id}
                    placeholder={item.placeholder}
                    value={formData[item.id] || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className={getTextareaClassName(item.id)}
                    rows={4}
                    required={item.required}
                    disabled={loading || isSubmitting}
                  />
                ) : (
                  <input
                    type="text"
                    id={item.id}
                    name={item.id}
                    placeholder={item.placeholder}
                    value={formData[item.id] || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className={getInputClassName(item.id)}
                    required={item.required}
                    disabled={loading || isSubmitting}
                  />
                )}

                {/* Field-specific error message */}
                {fieldErrors[item.id] && <span className={styles.fieldError}>{fieldErrors[item.id]}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* General form errors */}
        {errors.length > 0 && !Object.keys(fieldErrors).length && (
          <div className={styles.generalErrors}>
            {errors.map((error, index) => (
              <div key={index} className={styles.errorMessage}>
                {error.message}
              </div>
            ))}
          </div>
        )}

        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton} disabled={loading || isSubmitting}>
            {isSubmitting ? (
              <span className={styles.buttonContent}>
                <span className={styles.spinner}></span>
                Submitting...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
