import z from "zod";

export const registerSchema = z.object({
    name: z.string({error: "Name is required"}).min(1,"Name can not be empty"),
    email: z.email("Invalid email address"),
    password: z.string({
        error:"password is required",
    }).min(6, "password must be at least 6 characters ")
})

export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z.string({
    error: "Password is required",
  }).min(1, "Password cannot be empty"),
});