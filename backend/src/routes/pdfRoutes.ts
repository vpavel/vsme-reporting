// backend/src/routes/pdfRoutes.ts
import { Router } from "express";
import { PdfController } from "../controllers/pdfContoller";
// import { authenticateToken } from '../middleware/authMiddleware'; // Uncomment when ready

const router = Router();

// Apply auth middleware if needed
// router.use(authenticateToken);

// Generate PDF report for general information
router.get("/general-info/:userId", PdfController.generateGeneralInfoReport);

export default router;
