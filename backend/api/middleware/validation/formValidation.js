"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormUpdate = exports.validateFormCreation = void 0;
const forms_1 = require("../../types/forms");
const generalInfoSchema_1 = require("../../schemas/generalInfoSchema");
const asyncHandler_1 = require("@/utils/asyncHandler");
exports.validateFormCreation = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { formType } = req.body;
    let schema;
    switch (formType) {
        case forms_1.FormType.GENERAL_INFO_B1:
            schema = generalInfoSchema_1.CreateB1FormSchema;
            break;
        case forms_1.FormType.GENERAL_INFO_B2:
            schema = generalInfoSchema_1.CreateB2FormSchema;
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
exports.validateFormUpdate = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    // This will throw if validation fails, caught by asyncHandler
    const validatedData = generalInfoSchema_1.UpdateFormSchema.parse(req.body);
    req.body = validatedData;
    next();
});
