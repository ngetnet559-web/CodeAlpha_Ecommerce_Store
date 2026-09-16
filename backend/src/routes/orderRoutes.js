import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { validateOrder } from "../middleware/validateOrder.js";

const router = e.Router();

router.post("/", authMiddleware,validateOrder, createOrder);
router.get("/", authMiddleware, getOrders);

export default router;
