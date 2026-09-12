import { productSchema } from "../validators/productValidator.js";

export const validateProduct = (req, res, next) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;

  next();
};