import { api } from "@/lib/api";
;
import { createPatient as createDoctor, deletePatient as deleteDoctor, updatePatient as updateDoctor } from "./patient.actions";
import { PatientSchema, PatientSchema as UserSchema } from "@/lib/firebase/firebase.types";

export const patirntRepository = {
  getAll: async (): Promise<UserSchema[]> => {
    const { data } = await api.get("/patients");
    return data as UserSchema[];
  },

  getById: async (id: string): Promise<UserSchema> => {
    const { data } = await api.get(`/patients/${id}`);
    return data as UserSchema;
  },

  create: async (payload: PatientSchema) => await createDoctor(payload as PatientSchema),


  update: async (id: string, payload: Partial<PatientSchema>) => await updateDoctor(id, payload as PatientSchema),

  remove: async (id: string) => await deleteDoctor(id),
};
