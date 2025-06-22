"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormStatus = exports.FormType = void 0;
var FormType;
(function (FormType) {
    FormType["GENERAL_INFO_B1"] = "general_info_b1";
    FormType["GENERAL_INFO_B2"] = "general_info_b2";
})(FormType || (exports.FormType = FormType = {}));
var FormStatus;
(function (FormStatus) {
    FormStatus["DRAFT"] = "draft";
    FormStatus["SUBMITTED"] = "submitted";
    FormStatus["APPROVED"] = "approved";
    FormStatus["REJECTED"] = "rejected";
})(FormStatus || (exports.FormStatus = FormStatus = {}));
