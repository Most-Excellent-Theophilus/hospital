import z from "zod";
import { userSchema } from "../pages/doctors/users.types";

const nullableString = (fallback = "unknown") =>
  z.string().nullable().transform(v => v ?? fallback);

export const logsSchema = userSchema.and(
  z.object({
    os: z.string(),
    osVersion: z.string(),
    browser: z.string(),
    browserVersion: z.string(),
    deviceType: z.string(),
    model: z.string().optional(),
    vendor: nullableString(),
    screenWidth: z.number(),
    screenHeight: z.number(),
    isTouch: z.boolean(),
    ip: z.string(),
    country: nullableString(),
    region: nullableString(),
    city: nullableString(),
    lat: z.number().nullable().transform(v => v ?? 0),
    lon: z.number().nullable().transform(v => v ?? 0),
    timezone: nullableString(),
    continent: nullableString(),
    host: z.string(),
  })
);
