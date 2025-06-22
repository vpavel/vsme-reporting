"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalInfoController_1 = require("../controllers/generalInfoController");
const formValidation_1 = require("@/middleware/validation/formValidation");
const authMiddleware_1 = require("@/middleware/authMiddleware");
// Import your auth middleware if you want to protect these routes
// import { authMiddleware } from '../middleware/authMiddleware';
const router = (0, express_1.Router)();
// Apply auth middleware to all routes (optional - uncomment if needed)
router.use(authMiddleware_1.authenticateToken);
// Routes
router.get("/user/:userId", generalInfoController_1.GeneralInfoController.getUserForms);
router.get("/:userId/:formType", generalInfoController_1.GeneralInfoController.getForm);
router.post("/", formValidation_1.validateFormCreation, generalInfoController_1.GeneralInfoController.createForm);
router.put("/:id", formValidation_1.validateFormUpdate, generalInfoController_1.GeneralInfoController.updateForm);
router.delete("/:id", generalInfoController_1.GeneralInfoController.deleteForm);
exports.default = router;
