import { z } from "zod";

export const productSchema = z.object({
  name: z.string({
    error: "Name is required",
  }).min(1, "Name cannot be empty"),

  type: z.string({
    error: "Type is required",
  }).min(1, "Type cannot be empty"),

  price: z.coerce.number({
    error: "Price is required",
  }).positive("Price must be greater than 0"),

  description: z.string({
    error: "Description is required",
  }).min(1, "Description cannot be empty"),

  stock: z.coerce.number({
    error: "Stock is required",
  }).int("Stock must be an integer").nonnegative("Stock cannot be negative"),
});