
import { tokenSchema } from "@/features/auth/auth.types";
import { userSchema } from "@/features/users/users.types";
import type admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import z from "zod";
// 🔹 Collection & Subcollection


export type TypeReturn<T> = { message: string } & {
  status: "success" | "warning" | "error" | "info" | "loading";
  data: T | null;
};
export const timestampToDate = z.union([
  z.instanceof(Timestamp),
  z.date(),
]).transform((v) =>
  v instanceof Timestamp ? v.toDate() : v
);
const mustHave = z.object({
  id: z.string(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate,
});
export const tokenWithMetaSchema = mustHave.and(tokenSchema)
export type TokenSchema = z.infer<typeof tokenWithMetaSchema>
export const userWithMetaSchema = mustHave.and(userSchema);
export type UserSchema = z.infer<typeof userWithMetaSchema>;

export type TableTypeMap = {
  users: UserSchema;
  tokens: TokenSchema
};

export type CollectionNames = keyof TableTypeMap;

// Utility types for creating and updating documents
export type CreateData<T> = Omit<T, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
};


export interface QueryOptions<T extends keyof TableTypeMap = CollectionNames> {
  where?: {
    [K in keyof TableTypeMap[T]]: {
      field: K;
      operator: FirebaseFirestore.WhereFilterOp;
      value: TableTypeMap[T][K]; // ✅ same type as the field
    };
  }[keyof TableTypeMap[T]][];
  orderBy?: {
    field: keyof TableTypeMap[T];
    direction?: "asc" | "desc";
  }[];
  limit?: number;
  startAfter?: FirebaseFirestore.DocumentSnapshot;
  startAt?: FirebaseFirestore.DocumentSnapshot;
  endBefore?: FirebaseFirestore.DocumentSnapshot;
  endAt?: FirebaseFirestore.DocumentSnapshot;
}

// 🔹 Batch operation result
export interface BatchResult {
  success: boolean;
  processedCount: number;
  errors?: string[];
}

// 🔹 Recursive ref type
export type BuildRefType = {
  path: CollectionNames;
  id?: string;
  sub?: BuildRefType;
};
