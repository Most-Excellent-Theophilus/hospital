import z from "zod";
import { logsSchema } from "../userlogs/userlogs.types";

export const patientSchema = z.object({
    firstName: z.string().min(3).max(50),
    middleName: z.string().min(3).max(50).optional(),
    lastName: z.string().min(3).max(50),
    email: z.email(),
    otherNumber: z.array(
        z.object({
            number: z.string(),
            type: z.enum(["home", "work", "mobile", "other"]),
            owner: z.string(),
        })
    ),
    supportingDocuments: z.array(
        z.object({
            documentTitle: z.string(),
            file: z.any(),
            description: z.string().max(1000),
        })
    ),
    dateOfBirth: z.date(),
    gender: z.enum(["male", "female", "other"]),
    address: z.string().min(3).max(550),
    phoneNumber: z.string().min(3).max(50),
    userSession: logsSchema
});

