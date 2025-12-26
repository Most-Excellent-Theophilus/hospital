import z from "zod";

export const preOpSchema = z.object({
    id: z.string(),
    patientId: z.string(),
    riskPriority: z.enum(["red", "yellow", "grey"]),
    diagnosis: z.string(),
    hieght: z.number(),
    weight: z.number(),
    //   treatment: z.string(),
    supportingDocuments: z
        .array(
            z.object({
                documentTitle: z.string(),
                file: z.file(),
                type: z.enum([
                    "ecg",
                    "echoImg",
                    "echoReport",
                    "cXr",
                    "lab",
                    "echoData",
                ]),
                description: z.string().max(1000),
            })
        )
        .optional(),
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
    vitalSigns: z.array(z.string()),

    // ID for the user that made the preOp entries
    staffId: z.string(),
});
