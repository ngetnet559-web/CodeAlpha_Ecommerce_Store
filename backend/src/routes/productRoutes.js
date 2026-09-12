import e from "express";
import { getProducts,createProduct, getProduct, updateProduct, deleteProduct} from "../controllers/productController.js";

const router = e.Router();

router.get('/', getProducts).get('/:id', getProduct);
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;
