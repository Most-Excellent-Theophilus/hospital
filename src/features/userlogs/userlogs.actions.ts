"use server"

import { createCacheActions } from "@/lib/firebase/cached.database"
import { LogsShema } from "@/lib/firebase/firebase.types";

const userLogDb = await createCacheActions('databaseLogs')

export const getAllLog = async () =>
    await userLogDb.getAll({
        orderBy: [{ field: "updatedAt", direction: "asc" }],
    });


export const createLog = async (data: LogsShema) => await userLogDb.create(data as LogsShema);

export const getLogById = async (id: string) => await userLogDb.getById(id);
export const updateLog = async (
    id: string,
    data: LogsShema
) => await userLogDb.update(id, data as LogsShema);
export const deleteLog = async (id: string) => await userLogDb.remove(id);
export const searchLog = async <T extends keyof LogsShema>(
    f: T,
    v: LogsShema[T]
) => await userLogDb.search(f, v);
export const countLog = async () => await userLogDb.count();
