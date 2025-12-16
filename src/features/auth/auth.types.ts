import z from "zod";
import { userSchema } from "../users/users.types";

export const loginSchema = userSchema.pick({ email: true, password: true });
export const verificationSchema = userSchema.pick({ email: true });

export type Login = z.infer<typeof loginSchema>;
export type Verification = z.infer<typeof verificationSchema>;