import z from "zod";

export const userSchema = z.object({
  firstName: z.string().min(3).max(50),
  middleName: z.string().min(3).max(50).optional(),
  lastName: z.string().min(3).max(50),
  doctorId: z.string().min(3).max(50),
  email: z.email(),
  dateOfBirth: z.date(),
  gender: z.enum(["male", "female", "other"]),
  customGender: z.string().max(50).optional(),
  userType: z.enum(["admin", "inputer", "viewer"]),
  password: z.string().min(8).max(50),
  verified: z.optional(z.boolean())
});

export const registrationSchema = userSchema.omit({ password: true, verified: true }).extend({
  verified: z.optional(z.boolean())
});

export type User = z.infer<typeof userSchema>;