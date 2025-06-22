import { Router } from "express";
import { GeneralInfoController } from "../controllers/generalInfoController";
import { validateFormCreation, validateFormUpdate } from "../middleware/validation/formValidation";
import { authenticateToken } from "../middleware/authMiddleware";
// Import your auth middleware if you want to protect these routes
// import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
// Apply auth middleware to all routes (optional - uncomment if needed)
// router.use(authenticateToken);

// Routes
router.get("/user/:userId", GeneralInfoController.getUserForms);
router.get("/:userId/:formType", GeneralInfoController.getForm);
router.post("/", validateFormCreation, GeneralInfoController.createForm);
router.put("/:id", validateFormUpdate, GeneralInfoController.updateForm);
router.delete("/:id", GeneralInfoController.deleteForm);
export default router;
