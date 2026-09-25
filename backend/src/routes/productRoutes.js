import e from "express";

import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { validateProduct } from "../middleware/validateProduct.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadImage.js";

const router = e.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateProduct,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default router;