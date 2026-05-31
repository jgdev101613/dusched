import { Router } from "express";
import {
  createGroup,
  getGroups,
  updateGroup,
  getGroupById,
  getGroupByName,
} from "../controllers/groupController";
import { requireAdmin } from "../middleware/admin";

const router = Router();

router.post("/", requireAdmin, createGroup);
router.get("/", requireAdmin, getGroups);
router.get("/:id", requireAdmin, getGroupById);
router.get("/name/:name", requireAdmin, getGroupByName);
router.put("/:id", requireAdmin, updateGroup);

export default router;
