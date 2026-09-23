import { z } from "zod";

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Cart cannot be empty"),

  fullName: z
    .string({
      error: "Full name is required",
    })
    .trim()
    .min(1, "Full name cannot be empty"),

  phone: z
    .string({
      error: "Phone is required",
    })
    .trim()
    .min(1, "Phone cannot be empty"),

  address: z
    .string({
      error: "Address is required",
    })
    .trim()
    .min(1, "Address cannot be empty"),

  city: z
    .string({
      error: "City is required",
    })
    .trim()
    .min(1, "City cannot be empty"),

  paymentMethod: z.enum(["cash"], {
    error: "Invalid payment method",
  }),
});