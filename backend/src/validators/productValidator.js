import { z } from "zod";

export const productSchema = z.object({
  name: z.string({
    error: "Name is required",
  }).min(1, "Name cannot be empty"),

  type: z.string({
    error: "Type is required",
  }).min(1, "Type cannot be empty"),

  price: z.number({
    error: "Price is required",
  }).positive("Price must be greater than 0"),

  description: z.string({
    error: "Description is required",
  }).min(1, "Description cannot be empty"),

  image: z.string({
    error: "Image is required",
  }).min(1, "Image cannot be empty"),

  stock: z.number({
    error: "Stock is required",
  }).int("Stock must be an integer").nonnegative("Stock cannot be negative"),
});