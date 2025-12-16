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
