import z from "zod";
import { userSchema } from "../users/users.types";
import { passwordSchema } from "./auth.constants";

export const loginSchema = userSchema.pick({ email: true, password: true });
export const verificationSchema = userSchema.pick({ email: true });

export type Login = z.infer<typeof loginSchema>;
export type Verification = z.infer<typeof verificationSchema>;

export const tokenSchema = z.object({
    email: z.email(),
    token: z.string(),
    expires: z.date(),
});
export type Token = z.infer<typeof tokenSchema>

export const passwordCreateSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    passwordRepeat: z.string(),
}).refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords do not match",
    path: ["passwordRepeat"],
});
