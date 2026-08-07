import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Invalid email address")),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits")
});
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});