import e from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  getAdminOrders,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { validateOrder } from "../middleware/validateOrder.js";

const router = e.Router();

router.post("/", authMiddleware, validateOrder, createOrder);

router.get("/", authMiddleware, getOrders);

router.get("/admin", authMiddleware, adminMiddleware, getAdminOrders);

router.get("/:id", authMiddleware, getOrder);

export default router;
