"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/pdfRoutes.ts
const express_1 = require("express");
const pdfContoller_1 = require("../controllers/pdfContoller");
// import { authenticateToken } from '../middleware/authMiddleware'; // Uncomment when ready
const router = (0, express_1.Router)();
// Apply auth middleware if needed
// router.use(authenticateToken);
// Generate PDF report for general information
router.get("/general-info/:userId", pdfContoller_1.PdfController.generateGeneralInfoReport);
exports.default = router;
