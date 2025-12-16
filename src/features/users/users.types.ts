import z from "zod";

export const userSchema = z.object({
  firstName: z.string().min(3).max(50),
  middleName: z.string().min(3).max(50).optional(),
  lastName: z.string().min(3).max(50),
  email: z.email(),
  dateOfBirth: z.date(),
  gender: z.enum(["male", "female", "other"]),
  userType: z.enum(["admin", "inputer", "viewer"]),
  password: z.string().min(8).max(50),

});

export type User = z.infer<typeof userSchema>;