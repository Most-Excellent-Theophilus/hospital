import z from "zod";

export const patientSchema = z.object({
    firstName: z.string().min(3).max(50),
    middleName: z.string().min(3).max(50).optional(),
    lastName: z.string().min(3).max(50),
    email: z.email(),
    phoneNUmber: z.array(
        z.object({
            number: z.string(),
            type: z.enum(["home", "work", "mobile", "other"]),
            owner: z.string(),
        })
    ),
    supportingDocuments: z.array(
        z.object({
            documentTitle: z.string(),
            file: z.file(),
            description: z.string().max(1000),
        })
    ),
    dateOfBirth: z.date(),
    gender: z.enum(["male", "female", "other"]),
    address: z.string().min(3).max(50),
    phoneNumber: z.string().min(3).max(50),

});

