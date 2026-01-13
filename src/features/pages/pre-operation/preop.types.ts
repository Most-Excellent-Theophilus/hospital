import z from "zod";

export const preOpSchema = z.object({

    patientId: z.string().min(2),
    riskPriority: z.enum(["low", "mid", "high"]),
    diagnosis: z.string().min(2),
    patient: z.object({
        firstName: z.string().min(3).max(50),
        middleName: z.string().max(50).optional(),
        lastName: z.string().min(3).max(50),
        email: z.email(),
        gender: z.enum(["male", "female", "other"]),
        phoneNumber: z.string().min(3).max(50),
        dateOfBirth: z.date()
    }),
    supportingDocuments: z
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
    date: z.date(),
    sats: z.string().min(2).optional(),
    bsa: z.string().min(2),
    dentalHistory: z.string().min(2).max(51000),
    hospital: z.enum(["queens", "adventist"]),
    todo: z.string().min(2).max(55000),
    vitalSigns: z.array(z.object({ name: z.string().min(2) })),


    // Measurements
    hieght: z.number().min(0.1),
    weight: z.number().min(0.1),
    bloodPressure: z.number().min(0.1),
    heartRate: z.number().min(0.1),
    hF: z.number().min(0.1),
    wT: z.number().min(0.1),
    bmi: z.number().min(0.1),
    // ID for the user that made the preOp entries
    staffId: z.string().min(2),
});

export type PreopSchemaWithoutMeta = z.infer<typeof preOpSchema>