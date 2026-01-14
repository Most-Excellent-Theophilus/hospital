"use server"

import { db } from "@/lib/firebase/database"
import { PostOpSchema } from "./postop.types"

export const createPostOp = async (path: string, data: PostOpSchema) => await db.addByPathnames<'post-operation'>(`${path}/post-operation`, data)