import {
  getAllProducts,
  createProduct as createProductService,
  getProduct as getProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/productService.js";

import { uploadImage, deleteImage } from "../services/imageService.js";

import { validateId } from "../utils/validateId.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.status(200).json(products);
  } catch (error) {
    next(error);
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

    const product = await getProductService(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
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
      const error = new Error("Product image is required");
      error.statusCode = 400;
      throw error;
    }

    const image = await uploadImage(req.file.buffer);

    const product = await createProductService({
      ...req.body,
      image: image.secure_url,
    });

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

    const existingProduct = await getProductService(productId);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let imageUrl = existingProduct.image;

    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer);
      imageUrl = uploadedImage.secure_url;
    }

    const updatedProduct = await updateProductService(productId, {
      ...req.body,
      image: imageUrl,
    });

    if (req.file && existingProduct.image) {
      try {
        const imageUrlParts = existingProduct.image.split("/");

        const fileName = imageUrlParts[imageUrlParts.length - 1];
        const publicIdWithoutExtension = fileName.split(".")[0];

        await deleteImage(`ecommerce/products/${publicIdWithoutExtension}`);
      } catch (imageError) {
        console.error("Failed to delete old Cloudinary image:", imageError);
      }
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
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
