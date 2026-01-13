import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";




const contactTypeSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("email"),
        contact: z.email(),
    }),
    z.object({
        type: z.literal("phone"),
        contact: z
            .string()
            .refine((val) => isValidPhoneNumber(val), "Invalid phone number"),
    }),
]);

export const patientSchema = z.object({
    firstName: z.string().min(3).max(50),
    middleName: z.string().max(50).optional(),
    lastName: z.string().min(3).max(50),
    email: z.email(),
    gender: z.enum(["male", "female", "other"]),
    phoneNumber: z.string().min(3).max(50),
    address: z.string().min(3).max(550),
    otherContacts: z.array(
        z.object({
            fullName: z.string(),
            relationship: z.string(),
        })
            .and(contactTypeSchema)
    ),
    documents: z
        .array(z.instanceof(File))
        .min(1, "Please upload at least one file")
        .max(10, "Maximum 10 files allowed")
        .refine(
            (files) => files.every((file) => file.size <= 1 * 1024 * 1024),
            "Each file must be less than 1MB"
        )
        .refine(
            (files) =>
                files.every((file) => {
                    const validTypes = [
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                        "image/gif",
                        "image/webp",
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ];
                    return validTypes.includes(file.type);
                }),
            "Only images, PDF, Word, and Excel files are allowed"
        ),
    dateOfBirth: z.date(),
    doctorEmail: z.email(),
    doctorId: z.string()

});


export type PatientSchema = z.infer<typeof patientSchema>
