import { Router } from "express";
import { createGroup } from "../controllers/groupController";
import { requireAdmin } from "../middleware/admin";

const router = Router();

router.post("/", requireAdmin, createGroup);

export default router;
