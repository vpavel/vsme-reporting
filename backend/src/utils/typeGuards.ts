// backend/src/utils/typeGuards.ts
import { FormType, FormStatus } from "../types/forms";

export function validateFormType(formType: string): FormType {
  if (!Object.values(FormType).includes(formType as FormType)) {
    throw new Error(`Invalid form type: ${formType}`);
  }
  return formType as FormType;
}

export function validateFormStatus(status: string): FormStatus {
  if (!Object.values(FormStatus).includes(status as FormStatus)) {
    throw new Error(`Invalid form status: ${status}`);
  }
  return status as FormStatus;
}
