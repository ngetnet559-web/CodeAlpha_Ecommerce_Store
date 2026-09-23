import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrders,
  getOrder,
} from "../controllers/orderController.js";
import { validateOrder } from "../middleware/validateOrder.js";

const router = e.Router();

router.post("/", authMiddleware, validateOrder, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrder);

export default router;
