import { api } from "@/lib/api";
import { PatientSchema as User } from "./patient.types";
import { createPatient as createDoctor, deletePatient as deleteDoctor, updatePatient as updateDoctor } from "./patient.actions";
import { PatientSchema as UserSchema } from "@/lib/firebase/firebase.types";

export const patirntRepository = {
  getAll: async (): Promise<UserSchema[]> => {
    const { data } = await api.get("/patients");
    return data as UserSchema[];
  },

  getById: async (id: string): Promise<UserSchema> => {
    const { data } = await api.get(`/patients/${id}`);
    return data as UserSchema;
  },

  create: async (payload: Partial<User>) => await createDoctor(payload as User),


  update: async (id: string, payload: Partial<User>) => await updateDoctor(id, payload as User),

  remove: async (id: string) => await deleteDoctor(id),
};
