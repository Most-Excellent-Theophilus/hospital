"use server";

import { db } from "@/lib/firebase/database";
import { PreopSchema } from "@/lib/firebase/firebase.types";
// import { PreopSchemaWithoutMeta } from "./preop.types";

export const createPreOpPatient = async (id: string, data: Omit<PreopSchema, 'id' | 'createAt' | 'updatedAt'>) => db.create<'pre-operation'>({
    path: 'patients', id, sub: {
        path: 'pre-operation'
    },


}, data as PreopSchema)
