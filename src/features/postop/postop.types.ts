import z from "zod";

export const postOpSchema = z.object({
    id: z.string(),
    preOpId: z.string(),
    name: z.string(),
    operationDate: z.date(),
    procedure: z.string(),
    targetINR: z.string(),

    dosage: z.string(),
    labResults: z.string(),
    instructions: z.string(),

    echoDate: z.date(),
    //

});
