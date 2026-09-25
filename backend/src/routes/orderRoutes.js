import e from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { validateOrder } from "../middleware/validateOrder.js";
import { validateOrderStatus } from "../middleware/validateOrderStatus.js";

const router = e.Router();

router.post(
  "/",
  authMiddleware,
  validateOrder,
  createOrder
);

router.get(
  "/",
  authMiddleware,
  getOrders
);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminOrders
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validateOrderStatus,
  updateOrderStatus
);

router.get(
  "/:id",
  authMiddleware,
  getOrder
);

export default router;