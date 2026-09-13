import e from "express";
import { getProducts,createProduct, getProduct, updateProduct, deleteProduct} from "../controllers/productController.js";
import { validateProduct } from "../middleware/validateProduct.js";
import upload from "../middleware/uploadImage.js";

const router = e.Router();

router.get('/', getProducts).get('/:id', getProduct);
router.post("/", upload.single("image"), validateProduct, createProduct);
router.put('/:id',validateProduct, updateProduct)
router.delete('/:id', deleteProduct)

export default router;
