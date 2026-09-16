import { z } from "zod";

export const orderSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});