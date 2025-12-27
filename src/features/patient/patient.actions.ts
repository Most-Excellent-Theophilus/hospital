"use server";
import "server-only";
import { createCacheActions } from "@/lib/firebase/cached.database";
import { PatientSchema } from "./patient.types";
import { PatientSchema as UserSchema } from "@/lib/firebase/firebase.types"





// 🔹 DOCTOR
const patientSchema = await createCacheActions("patients");
export const getAllPatient = async () =>
    await patientSchema.getAll({
        orderBy: [{ field: "updatedAt", direction: "asc" }],
    });


export const createPatient = async (data: PatientSchema) => await patientSchema.create(data as UserSchema);

export const getPatientById = async (id: string) => await patientSchema.getById(id);
export const updatePatient = async (
    id: string,
    data: PatientSchema
) => await patientSchema.update(id, data as UserSchema);
export const deletePatient = async (id: string) => await patientSchema.remove(id);
export const searchPatient = async <T extends keyof PatientSchema>(
    f: T,
    v: UserSchema[T]
) => await patientSchema.search(f, v);
export const countPatient = async () => await patientSchema.count();
