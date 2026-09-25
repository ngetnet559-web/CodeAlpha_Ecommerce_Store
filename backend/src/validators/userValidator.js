import z from "zod";

export const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty"),

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string({ error: "Password is required" })
    .min(1, "Password cannot be empty"),
});
