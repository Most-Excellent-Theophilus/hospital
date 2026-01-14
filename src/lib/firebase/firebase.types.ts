
import { tokenSchema } from "@/features/auth/auth.types";
import { userSchema } from "@/features/pages/doctors/users.types";
import { patientSchema } from "@/features/pages/patients/patient.types";
import { postOpSchema } from "@/features/pages/post-operation/postop.types";
import { preOpSchema } from "@/features/pages/pre-operation/preop.types";
import { logsSchema } from "@/features/userlogs/userlogs.types";

import type admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import z from "zod";


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
  path: z.string(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate,
});
export const logSchema = logsSchema.and(mustHave.extend({ dataString: z.string().optional(), action: z.enum(['login', "reset", "logout", 'inhouse', 'create-password']).optional(), worked: z.boolean() }))
export type LogsShema = z.infer<typeof logSchema>
export const tokenWithMetaSchema = mustHave.and(tokenSchema)
export type TokenSchema = z.infer<typeof tokenWithMetaSchema>
export const userWithMetaSchema = mustHave.and(userSchema.omit({ dateOfBirth: true }).extend({ dateOfBirth: z.string() }));
export type UserSchema = z.infer<typeof userWithMetaSchema>;
// export const patientWithMetaSchema = patientSchema.and(mustHave)
export const patientWithMetaSchema = mustHave.and(patientSchema.omit({ documents: true, dateOfBirth: true }).extend({
  dateOfBirth: z.string(),
  documents: z.array(z.object({
    customId: z.string().nullable(),
    fileHash: z.string(),
    key: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    ufsUrl: z.string(),
    lastModified: z.number().optional(),
    serverData: z.object({ uploadedBy: z.string() }),
    url: z.string(),
    appUrl: z.string()
  }))
}))

export const preOpwithMetaSchema = mustHave.and(preOpSchema.omit({ supportingDocuments: true, dateOfBirth: true }).extend({

  supportingDocuments: z.array(z.object({
    customId: z.string().nullable(),
    fileHash: z.string(),
    key: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    ufsUrl: z.string(),
    lastModified: z.number().optional(),
    serverData: z.object({ uploadedBy: z.string() }),
    url: z.string(),
    appUrl: z.string()
  }))
}))
export type PreopSchema = z.infer<typeof preOpwithMetaSchema>
export type PostopSchema = z.infer<typeof postOpSchema>
export type PatientSchema = z.infer<typeof patientWithMetaSchema>
export type TableTypeMap = {
  databaseLogs: LogsShema;
  users: UserSchema;
  tokens: TokenSchema;
  patients: PatientSchema;
  'pre-operation': PreopSchema
  'post-operation': PostopSchema
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
  select?: (keyof TableTypeMap[T])[];
}
export type WriteType = "create" | "update" | "delete";

export type BatchOperation<T extends keyof TableTypeMap> =
  | {
    type: "delete";
    ref: BuildRefType;
  }
  | {
    type: "create" | "update";
    ref: BuildRefType;
    data: CreateData<TableTypeMap[T]>;
  };

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
