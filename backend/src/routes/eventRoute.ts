import { Router } from "express";
import { createEvent, publicEvents, getEventById, updateEvent, deleteEvent, joinEvent, leaveEvent } from "../controllers/events.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate,  createEvent);
router.get("/",authenticate,  publicEvents);
router.get("/:id",  getEventById);
router.patch("/:id", authenticate,  updateEvent);
router.delete("/:id", authenticate,  deleteEvent);
router.post("/:id/join", authenticate,  joinEvent);
router.post("/:id/leave", authenticate,  leaveEvent);


export default router;
