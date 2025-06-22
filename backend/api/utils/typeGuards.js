"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormType = validateFormType;
exports.validateFormStatus = validateFormStatus;
// backend/src/utils/typeGuards.ts
const forms_1 = require("../types/forms");
function validateFormType(formType) {
    if (!Object.values(forms_1.FormType).includes(formType)) {
        throw new Error(`Invalid form type: ${formType}`);
    }
    return formType;
}
function validateFormStatus(status) {
    if (!Object.values(forms_1.FormStatus).includes(status)) {
        throw new Error(`Invalid form status: ${status}`);
    }
    return status;
}
