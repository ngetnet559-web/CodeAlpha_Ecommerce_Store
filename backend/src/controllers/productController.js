import { getAllProducts, createProduct as createProductService } from "../services/productService.js";

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts()
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "could not get products" });
  }
};

export const createProduct = async(req,res) => {
  try {
    const {name, type,price, description, image, stock} = req.body;

    const productData = {
      name,
      type,
      price,
      description,
      image,
      stock
    }

    const product = await createProductService(productData)
    res.status(201).json(product)
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Could not create product"})
  }
}
