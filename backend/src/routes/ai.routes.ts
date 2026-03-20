import { Router } from "express";
import { askAssistant} from "../controllers/ai.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/chat", authenticate,  askAssistant);

export default router