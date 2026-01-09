import z from "zod";

export const preOpSchema = z.object({

    patientId: z.string(),
    riskPriority: z.enum(["row", "mid", "high"]),
    diagnosis: z.string(),
    hieght: z.number(),
    weight: z.number(),
    //   treatment: z.string(),
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
    sats: z.string().optional(),
    bloodPressure: z.number(),
    heartRate: z.number(),
    hF: z.number(),
    wT: z.number(),
    bsa: z.string(),
    bmi: z.number(),
    dentalHistory: z.string().max(1000),
    hospital: z.enum(["queens", "adventist"]),
    todo: z.string().max(5000),
    vitalSigns: z.array(z.object({ name: z.string() })),

    // ID for the user that made the preOp entries
    staffId: z.string(),
});

export type PreopSchemaWithoutMeta = z.infer<typeof preOpSchema>