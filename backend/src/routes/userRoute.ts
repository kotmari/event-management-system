import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getUserEvents } from "../controllers/user.controller";


const router = Router();

router.get("/me/events",authenticate, getUserEvents);

export default router;
