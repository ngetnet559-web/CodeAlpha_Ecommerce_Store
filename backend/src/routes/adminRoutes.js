import e from "express";

import { getDashboard } from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = e.Router();

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboard
);

export default router;