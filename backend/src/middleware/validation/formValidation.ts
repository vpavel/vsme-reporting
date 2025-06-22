import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { FormType } from "../../types/forms";
import { CreateB1FormSchema, CreateB2FormSchema, UpdateFormSchema } from "../../schemas/generalInfoSchema";
import { asyncHandler } from "../../utils/asyncHandler";

export const validateFormCreation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { formType } = req.body;

  let schema;
  switch (formType) {
    case FormType.GENERAL_INFO_B1:
      schema = CreateB1FormSchema;
      break;
    case FormType.GENERAL_INFO_B2:
      schema = CreateB2FormSchema;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: "Invalid form type",
        errors: [{ field: "formType", message: "Invalid form type", code: "INVALID_FORM_TYPE" }],
      });
  }

  // This will throw if validation fails, caught by asyncHandler
  const validatedData = schema.parse(req.body);
  req.body = validatedData;
  next();
});

export const validateFormUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // This will throw if validation fails, caught by asyncHandler
  const validatedData = UpdateFormSchema.parse(req.body);
  req.body = validatedData;
  next();
});
