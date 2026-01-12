// // lib/firebase/firestore.repository.ts
// import {
//   CollectionReference,
//   Query,
//   DocumentData,
//   Firestore,
//   Timestamp,
// } from "firebase-admin/firestore";

// export interface PaginatedQuery<T> {
//   data: T[];
//   nextCursor?: string;
// }

// export abstract class FirestoreRepository<T extends { id?: string }> {
//   constructor(
//     protected readonly db: Firestore,
//     protected readonly collection: CollectionReference<DocumentData>
//   ) {}

//   /**
//    * Base pagination fetch (no filters)
//    */
//   async list(limit: number, cursor?: string): Promise<PaginatedQuery<T>> {
//     let q: Query = this.collection.orderBy("createdAt", "desc").limit(limit);

//     if (cursor) {
//       const snap = await this.collection.doc(cursor).get();
//       if (snap.exists) q = q.startAfter(snap);
//     }

//     const docs = await q.get();
//     const data = docs.docs.map((d) => ({ id: d.id, ...d.data() })) as T[];

//     return {
//       data,
//       nextCursor: docs.docs.length === limit ? docs.docs.at(-1)!.id : undefined,
//     };
//   }

//   /**
//    * 🔎 Global search (cross-field)
//    */
//   async search({
//     term,
//     fields,
//     limit = 20,
//     cursor,
//   }: {
//     term: string;
//     fields: (keyof T)[];
//     limit?: number;
//     cursor?: string;
//   }): Promise<PaginatedQuery<T>> {
//     if (!term || term.length < 2) return { data: [] };

//     const lowerTerm = term.toLowerCase();

//     // One query per searchable field
//     const queries = await Promise.all(
//       fields.map(async (field) => {
//         let q: Query = this.collection
//           .orderBy(field as string)
//           .startAt(lowerTerm)
//           .endAt(lowerTerm + "\uf8ff")
//           .limit(limit);

//         return q.get();
//       })
//     );

//     // Merge + dedupe docs
//     const seen = new Set();
//     const merged: T[] = [];

//     queries.forEach((snap) => {
//       snap.forEach((doc) => {
//         if (!seen.has(doc.id)) {
//           seen.add(doc.id);
//           merged.push({ id: doc.id, ...doc.data() } as T);
//         }
//       });
//     });

//     return {
//       data: merged.slice(0, limit),
//       nextCursor: merged.length >= limit ? merged.at(-1)!.id : undefined,
//     };
//   }
// }




// // // lib/patients/patient.repository.ts
// // import { FirestoreRepository } from "../firebase/firestore.repository";
// // import { firestore } from "../firebase/server";
// // import { PatientSchema } from "@/lib/firebase/firebase.types";

// // export class PatientRepository extends FirestoreRepository<PatientSchema> {
// //   constructor() {
// //     super(firestore, firestore.collection("patients"));
// //   }

// //   findWithSearch(term: string, limit: number, cursor?: string) {
// //     return this.search({
// //       term,
// //       fields: ["firstName", "lastName", "doctorEmail"],
// //       limit,
// //       cursor,
// //     });
// //   }
// // }

// // // app/api/patients/route.ts
// // import { PatientRepository } from "@/lib/patients/patient.repository";

// // export async function GET(req: Request) {
// //   const { search, limit = 20, cursor } = Object.fromEntries(
// //     new URL(req.url).searchParams.entries()
// //   );

// //   const repo = new PatientRepository();

// //   const result = search
// //     ? await repo.findWithSearch(search, Number(limit), cursor)
// //     : await repo.list(Number(limit), cursor);

// //   return Response.json(result);
// // }
