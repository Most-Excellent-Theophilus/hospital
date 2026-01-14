"use server";

import { db } from "@/lib/firebase/database";
import { PreopSchema } from "@/lib/firebase/firebase.types";
// import { PreopSchemaWithoutMeta } from "./preop.types";

export const createPreOpPatient = async (id: string, data: Omit<PreopSchema, 'id' | 'createAt' | 'updatedAt'>) => db.create<'pre-operation'>({
    path: 'patients', id, sub: {
        path: 'pre-operation'
    },


}, data as PreopSchema)


export const deletePreopPatient = async (id1: string, id2: string) => db.delete({
    path: 'patients', id: id1, sub: {
        path: 'pre-operation',
        id: id2
    }
})