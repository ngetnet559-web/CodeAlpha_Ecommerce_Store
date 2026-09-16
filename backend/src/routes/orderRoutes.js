import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder,getOrders } from "../controllers/orderController.js";

const router = e.Router()

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);

export default router