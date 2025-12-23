"use server";
import  "server-only";
import { createCacheActions } from "@/lib/firebase/cached.database";
import { User } from "./users.types";
import { UserSchema } from "@/lib/firebase/firebase.types";



// 🔹 DOCTOR
const userDb = await createCacheActions("users");
export const getAllDoctor = async () =>
  await userDb.getAll({
    orderBy: [{ field: "updatedAt", direction: "asc" }],
  });

export const createDoctor = async (data: User) =>
  await userDb.create(data as UserSchema);
export const getDoctorById = async (id: string) => await userDb.getById(id);
export const updateDoctor = async (
  id: string,
  data: User
) => await userDb.update(id, data as UserSchema);
export const deleteDoctor = async (id: string) => await userDb.remove(id);
export const searchDoctor = async <T extends keyof UserSchema>(
  f: T,
  v: UserSchema[T]
) => await userDb.search(f, v);
export const countDoctor = async () => await userDb.count();
