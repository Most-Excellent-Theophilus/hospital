import { api } from "@/lib/api";

import { createDoctor, deleteDoctor, updateDoctor } from "./users.actions";
import { UserSchema } from "@/lib/firebase/firebase.types";

export const usersRepository = {
  getAll: async (): Promise<UserSchema[]> => {
    const { data } = await api.get("/doctors");
    return data as UserSchema[];
  },

  getById: async ({  id }: { id: string,  }): Promise<UserSchema> => {
    const { data } = await api.get(`/doctors/${id}`,);
    return data as UserSchema;
  },

  create: async (payload: Partial<UserSchema>) => await createDoctor(payload as UserSchema),


  update: async (id: string, payload: Partial<UserSchema>) => await updateDoctor(id, payload as UserSchema),

  remove: async (id: string) => await deleteDoctor(id),
};
