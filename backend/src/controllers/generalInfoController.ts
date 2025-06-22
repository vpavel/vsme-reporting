import { Request, Response } from "express";
import { GeneralInfo } from "../models/GeneralInfo";
import { FormType, FormStatus, FormData, CompletionStatus, FormItem } from "../types/forms";
import { AppError } from "../utils/errorHandler";

import { asyncHandler } from "../utils/asyncHandler";
import { b1FormItems, b2FormItems } from "../constants/formItems";

export class GeneralInfoController {
  // GET /api/general-info/:userId/:formType
  static getForm = asyncHandler(async (req: Request, res: Response) => {
    const { userId, formType: formTypeParam } = req.params;

    // Validate and cast formType
    if (!isValidFormType(formTypeParam)) {
      throw new AppError("Invalid form type", 400);
    }

    const formType = formTypeParam as FormType;

    const form = await GeneralInfo.findOne({
      userId,
      formType,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // Calculate completion status
    const completionStatus = calculateCompletionStatus(form.data, formType);

    res.status(200).json({
      success: true,
      data: form,
      completionStatus,
    });
  });

  // POST /api/general-info (Create new form)
  static createForm = asyncHandler(async (req: Request, res: Response) => {
    // Data is already validated by middleware, including formType
    const { userId, data, status = FormStatus.DRAFT, formType } = req.body;

    // Check if form already exists
    const existingForm = await GeneralInfo.findOne({ userId, formType });

    if (existingForm) {
      throw new AppError("Form already exists for this user and form type", 409);
    }

    // Create new form
    const newForm = new GeneralInfo({
      userId,
      formType,
      data,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedForm = await newForm.save();

    // Calculate completion status
    const completionStatus = calculateCompletionStatus(savedForm.data, formType);

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: savedForm,
      completionStatus,
    });
  });

  // PUT /api/general-info/:id (Update existing form)
  static updateForm = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const form = await GeneralInfo.findById(id);

    if (!form) {
      throw new AppError("Form not found", 404);
    }

    // Update form
    const updatedForm = await GeneralInfo.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedForm) {
      throw new AppError("Failed to update form", 500);
    }

    // Calculate completion status
    const completionStatus = calculateCompletionStatus(updatedForm.data, updatedForm.formType);

    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
      completionStatus,
    });
  });

  // DELETE /api/general-info/:id (Optional - delete form)
  static deleteForm = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const form = await GeneralInfo.findById(id);

    if (!form) {
      throw new AppError("Form not found", 404);
    }

    await GeneralInfo.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  });

  // GET /api/general-info/user/:userId (Get all forms for a user)
  static getUserForms = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const forms = await GeneralInfo.find({ userId }).skip(skip).limit(Number(limit)).sort({ updatedAt: -1 });

    const total = await GeneralInfo.countDocuments({ userId });

    // Add completion status to each form
    const formsWithCompletion = forms.map((form) => ({
      ...form.toObject(),
      completionStatus: calculateCompletionStatus(form.data, form.formType),
    }));

    res.status(200).json({
      success: true,
      data: {
        forms: formsWithCompletion,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  });
}

// Helper function to validate FormType
function isValidFormType(formType: string): formType is FormType {
  return Object.values(FormType).includes(formType as FormType);
}

// Helper function to calculate completion status
function calculateCompletionStatus(data: FormData, formType: FormType): CompletionStatus | null {
  let formItems: FormItem[];
  switch (formType) {
    case FormType.GENERAL_INFO_B1:
      formItems = b1FormItems;
      break;
    case FormType.GENERAL_INFO_B2:
      formItems = b2FormItems;
      break;
    default:
      return null;
  }

  const requiredFields = formItems.filter((item) => item.required);

  const totalFields = formItems.length;
  const completedFields = formItems.filter((item) => {
    const fieldValue = data[item.id];
    return fieldValue && typeof fieldValue === "string" && fieldValue.trim() !== "";
  });

  const missingFields = requiredFields
    .filter((item) => {
      const fieldValue = data[item.id];
      return !fieldValue || typeof fieldValue !== "string" || fieldValue.trim() === "";
    })
    .map((item) => item.id);

  return {
    isCompleted: missingFields.length === 0,
    requiredFields: requiredFields.length,
    completedFields: completedFields.length,
    missingFields,
    completionPercentage: Math.round((completedFields.length / totalFields) * 100),
  };
}
