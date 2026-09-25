import { z } from "zod";

const orderStatusSchema = z.object({
  status: z.enum(
    ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    {
      error: "Invalid order status",
    }
  ),
});

export const validateOrderStatus = (req, res, next) => {
  const result = orderStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;
  next();
};