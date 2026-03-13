import { Router } from "express";
import { registerUser, loginUser, refreshTokens, logoutUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("refresh", refreshTokens);
router.post("/logout", logoutUser);


export default router;
