import { api } from "@/lib/api";
import { User } from "./users.types";
import { createDoctor, deleteDoctor, updateDoctor } from "./users.actions";
import { UserSchema } from "@/lib/firebase/firebase.types";

export const usersRepository = {
  getAll: async (): Promise<UserSchema[]> => {
    const { data } = await api.get("/doctors");
    return data as UserSchema[];
  },

  getById: async (id: string): Promise<UserSchema> => {
    const { data } = await api.get(`/doctors/${id}`);
    return data as UserSchema;
  },

  create: async (payload: Partial<User>) =>  await createDoctor(payload as User),
  

  update: async (id: string, payload: Partial<User>) => await updateDoctor(id, payload as User),

  remove: async (id: string)=> await deleteDoctor(id),
};
