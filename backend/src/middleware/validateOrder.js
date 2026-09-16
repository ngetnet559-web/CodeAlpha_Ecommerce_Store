import { orderSchema } from "../validators/orderValidator.js";

export const validateOrder = (req, res, next) => {
  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;

  next();
};