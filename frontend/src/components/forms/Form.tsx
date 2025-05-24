"use client";
import { useState } from "react";
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

interface FormProps {
  title: string;
  subtitle?: string;
  items: FormItem[];
  onSubmit?: (data: Record<string, string>) => void;
  submitButtonText?: string;
}

export default function Form({ title, subtitle, items, onSubmit, submitButtonText = "Submit" }: FormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.value || "" }), {})
  );

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>{title}</h1>
        {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formItems}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.formItem}>
              <div className={styles.itemHeader}>
                {item.indicator ? (
                  <span className={styles.indicator}>
                    {item.indicator}
                    {item.required && <span className={styles.required}>*</span>}
                  </span>
                ) : (
                  <span className={styles.questionNumber}>
                    {index + 1}
                    {item.required && <span className={styles.required}>*</span>}
                  </span>
                )}
                <p className={styles.description}>{item.description}</p>
              </div>

              <div className={styles.inputContainer}>
                {item.multiline ? (
                  <textarea
                    id={item.id}
                    name={item.id}
                    placeholder={item.placeholder}
                    value={formData[item.id] || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className={styles.textarea}
                    rows={4}
                    required={item.required}
                  />
                ) : (
                  <input
                    type="text"
                    id={item.id}
                    name={item.id}
                    placeholder={item.placeholder}
                    value={formData[item.id] || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className={styles.input}
                    required={item.required}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
