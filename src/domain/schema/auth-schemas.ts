import { z } from "zod";

// Schema for user creation
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  fullName: z.string(),
});

// Schema for user response
export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for login request
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for login response
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Schema for refresh token request
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Schema for refresh token response
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

// Types inferred from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
