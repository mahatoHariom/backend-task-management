import { z } from "zod";

// Base schema for user
export const userBaseSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for user response (extending the base schema)
export const userResponseSchema = userBaseSchema.extend({
  id: z.string(),
});

// Types inferred from schemas
export type UserBase = z.infer<typeof userBaseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
