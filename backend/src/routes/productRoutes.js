import e from "express";
import { getProducts,createProduct } from "../controllers/productController.js";

const router = e.Router();

router.get('/', getProducts);
router.post('/', createProduct)

export default router;
