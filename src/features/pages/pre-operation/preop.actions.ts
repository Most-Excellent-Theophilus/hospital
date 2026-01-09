"use server";
import "server-only";
import { createCacheActions } from "@/lib/firebase/cached.database";
import { PatientSchema } from "@/lib/firebase/firebase.types";






// 🔹 DOCTOR
const patientSchema = await createCacheActions("patients");
export const getAllPatient = async () =>
    await patientSchema.getAll({
        orderBy: [{ field: "updatedAt", direction: "desc" }],
    }, true);



export const getAllPatientCommad = async () => {

    type Data = {
        id: string,
        lastName: string,
        firstName: string,
        phoneNumber: string,
        email: string,
        createdAt: string,
        updatedAt: string
    }
    const data = await patientSchema.getAll({
        limit: 3000,
        select: ['lastName', "firstName", "email", 'phoneNumber'],
        orderBy: [{ field: "updatedAt", direction: "desc" }],
    }, true);

    return data.data as unknown as Data
}


export const createPatient = async (data: PatientSchema) => await patientSchema.create(data as PatientSchema);

export const getPatientById = async (id: string) => await patientSchema.getById(id);
export const updatePatient = async (
    id: string,
    data: PatientSchema
) => await patientSchema.update(id, data as PatientSchema);
export const deletePatient = async (id: string) => await patientSchema.remove(id);
export const searchPatient = async <T extends keyof PatientSchema>(
    f: T,
    v: PatientSchema[T]
) => await patientSchema.search(f, v);
export const countPatient = async () => await patientSchema.count();
