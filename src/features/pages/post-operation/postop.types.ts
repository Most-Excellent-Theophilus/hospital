import z from "zod";

export const postOpSchema = z.object({
    preOpId: z.string().min(3),
    name: z.string().min(3),
    doctor: z.object({
        firstName: z.string().min(3).max(50),
        middleName: z.string().min(3).max(50).optional(),
        lastName: z.string().min(3).max(50),
        doctorId: z.string().min(3).max(50),
        email: z.email(),
    }),
    patient: z.object({
        firstName: z.string().min(3).max(50),
        middleName: z.string().max(50).optional(),
        lastName: z.string().min(3).max(50),
        email: z.email(),
        gender: z.enum(["male", "female", "other"]),
        phoneNumber: z.string().min(3).max(50),
        dateOfBirth: z.date()
    }),
    operationDate: z.date().refine(
        (arg) => arg <= new Date(),
        {
            message: "Operation date cannot be in the future",
        }
    ),
    procedure: z.string().min(3),
    targetINR: z.string().min(3),
    dosage: z.string().min(3),
    labResults: z.string().min(3),
    instructions: z.string().min(3),
    echoDate: z.date().refine(
        (arg) => arg <= new Date(),
        {
            message: "Echo date cannot be in the future",
        }
    ),
});

export type PostOpSchema = z.infer<typeof postOpSchema>