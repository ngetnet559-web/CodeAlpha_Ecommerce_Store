import {
  getAllProducts,
  createProduct as createProductService,
  getProduct as getProductById,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/productService.js";
import { validateId } from "../utils/validateId.js";
import { uploadImage } from "../services/imageService.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error)
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const productId = validateId(req.params.id);

    if (!productId) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
export const createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const image = await uploadImage(req.file);

    const productData = {
      ...req.body,
      image: image.secure_url,
    };

    const product = await createProductService(productData);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = validateId(req.params.id);

    if (!productId) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const { name, type, price, description, image, stock } = req.body;

    const productData = {
      name,
      type,
      price,
      description,
      image,
      stock,
    };

    const product = await updateProductService(productId, productData);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res,next) => {
  try {
    const productId = validateId(req.params.id);

    if (!productId) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    await deleteProductService(productId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
