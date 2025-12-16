
import { userSchema } from "@/features/users/users.types";
import type admin from "firebase-admin";
import z from "zod";
// 🔹 Collection & Subcollection
export interface EveryTableMustHave {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserSchema = z.infer<typeof userSchema> & EveryTableMustHave;

export type TableTypeMap = {
  users: UserSchema;
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
