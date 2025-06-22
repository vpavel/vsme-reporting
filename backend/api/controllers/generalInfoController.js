"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralInfoController = void 0;
const GeneralInfo_1 = require("../models/GeneralInfo");
const forms_1 = require("../types/forms");
const errorHandler_1 = require("../utils/errorHandler");
const asyncHandler_1 = require("../utils/asyncHandler");
const formItems_1 = require("../constants/formItems");
class GeneralInfoController {
}
exports.GeneralInfoController = GeneralInfoController;
_a = GeneralInfoController;
// GET /api/general-info/:userId/:formType
GeneralInfoController.getForm = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, formType: formTypeParam } = req.params;
    // Validate and cast formType
    if (!isValidFormType(formTypeParam)) {
        throw new errorHandler_1.AppError("Invalid form type", 400);
    }
    const formType = formTypeParam;
    const form = await GeneralInfo_1.GeneralInfo.findOne({
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
GeneralInfoController.createForm = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Data is already validated by middleware, including formType
    const { userId, data, status = forms_1.FormStatus.DRAFT, formType } = req.body;
    // Check if form already exists
    const existingForm = await GeneralInfo_1.GeneralInfo.findOne({ userId, formType });
    if (existingForm) {
        throw new errorHandler_1.AppError("Form already exists for this user and form type", 409);
    }
    // Create new form
    const newForm = new GeneralInfo_1.GeneralInfo({
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
GeneralInfoController.updateForm = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const form = await GeneralInfo_1.GeneralInfo.findById(id);
    if (!form) {
        throw new errorHandler_1.AppError("Form not found", 404);
    }
    // Update form
    const updatedForm = await GeneralInfo_1.GeneralInfo.findByIdAndUpdate(id, {
        ...updateData,
        updatedAt: new Date(),
    }, {
        new: true,
        runValidators: true,
    });
    if (!updatedForm) {
        throw new errorHandler_1.AppError("Failed to update form", 500);
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
GeneralInfoController.deleteForm = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const form = await GeneralInfo_1.GeneralInfo.findById(id);
    if (!form) {
        throw new errorHandler_1.AppError("Form not found", 404);
    }
    await GeneralInfo_1.GeneralInfo.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Form deleted successfully",
    });
});
// GET /api/general-info/user/:userId (Get all forms for a user)
GeneralInfoController.getUserForms = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const forms = await GeneralInfo_1.GeneralInfo.find({ userId }).skip(skip).limit(Number(limit)).sort({ updatedAt: -1 });
    const total = await GeneralInfo_1.GeneralInfo.countDocuments({ userId });
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
// Helper function to validate FormType
function isValidFormType(formType) {
    return Object.values(forms_1.FormType).includes(formType);
}
// Helper function to calculate completion status
function calculateCompletionStatus(data, formType) {
    let formItems;
    switch (formType) {
        case forms_1.FormType.GENERAL_INFO_B1:
            formItems = formItems_1.b1FormItems;
            break;
        case forms_1.FormType.GENERAL_INFO_B2:
            formItems = formItems_1.b2FormItems;
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
