import { firestore } from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { db as database } from "./init";
import { BatchOperation, BatchResult, BuildRefType, CollectionNames, CreateData, QueryOptions, TableTypeMap, TypeReturn } from "./firebase.types";

export class FirestoreDatabase {
  private db: Firestore;

  constructor() {
    this.db = database;
  }



  private buildRefOrCollection(
    def: BuildRefType
  ):
    | { type: "doc"; ref: FirebaseFirestore.DocumentReference }
    | { type: "col"; ref: FirebaseFirestore.CollectionReference } {
    let ref:
      | Firestore
      | FirebaseFirestore.DocumentReference
      | FirebaseFirestore.CollectionReference = this.db;
    let current: BuildRefType | undefined = def;

    while (current) {
      // Always go to collection first
      ref = (ref as Firestore | FirebaseFirestore.DocumentReference).collection(
        current.path
      );

      if (current.id) {
        // Doc ref
        ref = (ref as FirebaseFirestore.CollectionReference).doc(current.id);

        // If there's no sub, this is the final document
        if (!current.sub) {
          return {
            type: "doc",
            ref: ref as FirebaseFirestore.DocumentReference,
          };
        }
      } else {
        // Stop at collection if no ID provided
        return {
          type: "col",
          ref: ref as FirebaseFirestore.CollectionReference,
        };
      }

      current = current.sub;
    }

    return { type: "doc", ref: ref as FirebaseFirestore.DocumentReference };
  }

  private applySelect<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
    fields?: (keyof T)[]
  ) {
    if (!fields || fields.length === 0) return data;

    return Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        fields.includes(key as keyof T)
      )
    );
  }

  // 🔹 Enhanced query builder - Remove generic constraint
  private buildQuery<T extends keyof TableTypeMap = CollectionNames>(
    ref: FirebaseFirestore.CollectionReference,
    options?: QueryOptions<T>
  ): FirebaseFirestore.Query {
    let query: FirebaseFirestore.Query = ref;

    if (options) {
      // Add where clauses
      if (options.where) {
        options.where.forEach((w) => {
          query = query.where(w.field as string, w.operator, w.value);
        });
      }

      // Add orderBy clauses
      if (options.orderBy) {
        options.orderBy.forEach((o) => {
          query = query.orderBy(o.field as string, o.direction || "asc");
        });
      }
      if (options.select && options.select.length > 0) {
        query = query.select(...options.select.map(String));
      }

      // Add pagination cursors
      if (options.startAfter) {
        query = query.startAfter(options.startAfter);
      }
      if (options.startAt) {
        query = query.startAt(options.startAt);
      }
      if (options.endBefore) {
        query = query.endBefore(options.endBefore);
      }
      if (options.endAt) {
        query = query.endAt(options.endAt);
      }

      // Add limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
    }

    return query;
  }

  // 🔹 GET operations - Made more flexible with proper typing
  async get<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    options?: QueryOptions<T>,
    skipTimeStap?: boolean,
  ): Promise<TypeReturn<TableTypeMap[T][] | null>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      const withTimestamps = (
        snap: FirebaseFirestore.DocumentSnapshot,
      ) =>
        skipTimeStap
          ? {}
          : {
            createdAt: snap.createTime?.toDate(),
            updatedAt: snap.updateTime?.toDate(),
          };

      if (type === "doc") {
        const snap = await ref.get();

        return {
          status: "success",
          message: "",
          data: snap.exists
            ? ([
              {
                id: snap.id,
                ...this.applySelect<TableTypeMap[T]>(
                  snap.data() ?? {},
                  options?.select as (keyof TableTypeMap[T])[]
                ),
                ...withTimestamps(snap),
              },
            ] as TableTypeMap[T][])
            : null,
        };
      }


      const query = this.buildQuery(ref, options);
      const snap = await query.get();

      return {
        status: "success",
        message: "",
        data: snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          ...withTimestamps(d),
        })) as TableTypeMap[T][],
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }


  // 🔹 GET single document by ID
  async getById<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType & Required<Pick<BuildRefType, "id">>
  ): Promise<TypeReturn<TableTypeMap[T][] | null>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "doc") {
        return {
          status: "error",
          data: null,
          message: "getById() requires a document path with ID",
        };
      }

      const snap = await ref.get();
      return {
        status: "success",
        message: "",
        data: snap.exists
          ? ([
            {
              id: snap.id,
              ...snap.data(),
              createdAt: snap.createTime?.toDate(),
              updatedAt: snap.updateTime?.toDate(),
            },
          ] as TableTypeMap[T][])
          : null,
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // 🔹 GET with real-time listener
  // onSnapshot<T extends keyof TableTypeMap = CollectionNames>(
  //   def: BuildRefType,
  //   callback: (data: any) => void,
  //   options?: QueryOptions<T>
  // ) {
  //   const { type, ref } = this.buildRefOrCollection(def);

  //   if (type === "doc") {
  //     return ref.onSnapshot((snap) => {
  //       const data = snap.exists
  //         ? {
  //             id: snap.id,
  //             ...snap.data(),
  //             createdAt: snap.createTime?.toDate(),
  //             updatedAt: snap.updateTime?.toDate(),
  //           }
  //         : null;
  //       callback(data);
  //     });
  //   } else {
  //     const query = this.buildQuery(ref, options);
  //     return query.onSnapshot((snap) => {
  //       const data = snap.docs.map((d) => ({
  //         id: d.id,
  //         ...d.data(),
  //         createdAt: d.createTime?.toDate(),
  //         updatedAt: d.updateTime?.toDate(),
  //       }));
  //       callback(data);
  //     });
  //   }
  // }

  // 🔹 CREATE operations
  async create<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    data: TableTypeMap[T] // Made more flexible since subcollections won't match TableTypeMap
  ): Promise<TypeReturn<{ id: string }>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "col") {
        return {
          status: "error",
          data: null,
          message: "create() requires a collection path without ID",
        };
      }

      const timestamp = firestore.FieldValue.serverTimestamp();
      const docData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const docRef = await ref.add(docData);
      return {
        status: "success",
        message: "Document created successfully",
        data: { id: docRef.id },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Failed to create document",
      };
    }
  }

  async createWithId<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    data: CreateData<TableTypeMap[T]>
  ): Promise<TypeReturn<{ id: string }>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "doc") {
        return {
          status: "error",
          data: null,
          message: "createWithId() requires a document path with ID",
        };
      }

      const timestamp = firestore.FieldValue.serverTimestamp();
      const docData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await ref.set(docData);
      return {
        status: "success",
        message: "Document created successfully",
        data: { id: ref.id },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Failed to create document",
      };
    }
  }

  // 🔹 UPDATE operations
  async update<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    data: Partial<CreateData<TableTypeMap[T]>>
  ): Promise<TypeReturn<{ id: string }>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "doc") {
        return {
          status: "error",
          data: null,
          message: "update() requires a document path with ID",
        };
      }

      const updateData = {
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await ref.update(updateData);
      return {
        status: "success",
        message: "Document updated successfully",
        data: { id: ref.id },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Failed to update document",
      };
    }
  }

  async upsert<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    data: TableTypeMap[T]
  ): Promise<TypeReturn<{ id: string }>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "doc") {
        return {
          status: "error",
          data: null,
          message: "upsert() requires a document path with ID",
        };
      }

      const timestamp = firestore.FieldValue.serverTimestamp();
      const upsertData = {
        ...data,
        updatedAt: timestamp,
        createdAt: timestamp, // Will only be set if document doesn't exist
      };

      await ref.set(upsertData, { merge: true });
      return {
        status: "success",
        message: "Document upserted successfully",
        data: { id: ref.id },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Failed to upsert document",
      };
    }
  }

  // 🔹 DELETE operations
  async delete(def: BuildRefType): Promise<TypeReturn<{ id: string }>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "doc") {
        return {
          status: "error",
          data: null,
          message: "delete() requires a document path with ID",
        };
      }

      await ref.delete();
      return {
        status: "success",
        message: "Document deleted successfully",
        data: { id: ref.id },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Failed to delete document",
      };
    }
  }

  async softDelete(def: BuildRefType): Promise<TypeReturn<{ id: string }>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "doc") {
        return {
          status: "error",
          data: null,
          message: "softDelete() requires a document path with ID",
        };
      }

      const softDeleteData = {
        deleted: true,
        deletedAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await ref.update(softDeleteData);
      return {
        status: "success",
        message: "Document soft deleted successfully",
        data: { id: ref.id },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "Failed to soft delete document",
      };
    }
  }

  // 🔹 DELETE entire subcollection (recursive)
  async deleteCollection(
    def: BuildRefType,
    batchSize: number = 500
  ): Promise<BatchResult> {
    const { type, ref } = this.buildRefOrCollection(def);

    if (type !== "col") {
      throw new Error("deleteCollection() requires a collection path");
    }

    let processedCount = 0;
    const errors: string[] = [];

    try {
      const query = ref.limit(batchSize);

      return new Promise((resolve) => {
        const deleteQueryBatch = async () => {
          const snapshot = await query.get();

          if (snapshot.size === 0) {
            resolve({ success: true, processedCount, errors });
            return;
          }

          const batch = this.db.batch();
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });

          await batch.commit();
          processedCount += snapshot.size;

          // Continue deleting until all documents are removed
          setImmediate(deleteQueryBatch);
        };

        deleteQueryBatch().catch((error) => {
          errors.push(error.message);
          resolve({ success: false, processedCount, errors });
        });
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { success: false, processedCount, errors };
    }
  }

  // 🔹 BATCH operations
  async batchWrite<T extends keyof TableTypeMap = CollectionNames>(
    operations: BatchOperation<T>[]
  ): Promise<BatchResult> {
    const batch = this.db.batch();

    let processedCount = 0;
    const errors: string[] = [];

    try {
      for (const operation of operations) {
        const { type: refType, ref } =
          this.buildRefOrCollection(operation.ref);

        if (refType !== "doc") {
          errors.push(
            `Invalid ${operation.type} operation for ${operation.ref.path}`
          );
          continue;
        }

        switch (operation.type) {
          case "create": {
            batch.set(ref, {
              ...operation.data,
              createdAt: firestore.FieldValue.serverTimestamp(),
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });
            break;
          }

          case "update": {
            batch.update(ref, {
              ...operation.data,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });
            break;
          }

          case "delete": {
            batch.delete(ref);
            break;
          }
        }

        processedCount++;
      }

      await batch.commit();
      return { success: true, processedCount, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return { success: false, processedCount, errors };
    }
  }

  // 🔹 TRANSACTION operations
  async runTransaction<T>(
    callback: (transaction: FirebaseFirestore.Transaction) => Promise<T>
  ): Promise<T> {
    return await this.db.runTransaction(callback);
  }

  // 🔹 COUNT operations
  async count<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    options?: Omit<
      QueryOptions<T>,
      "limit" | "startAfter" | "startAt" | "endBefore" | "endAt"
    >
  ): Promise<number> {
    const { type, ref } = this.buildRefOrCollection(def);

    if (type !== "col") {
      throw new Error("count() requires a collection path");
    }

    const query = this.buildQuery(ref, options);
    const snapshot = await query.count().get();
    return snapshot.data().count;
  }

  // 🔹 EXISTS check
  async exists(def: BuildRefType): Promise<boolean> {
    const { type, ref } = this.buildRefOrCollection(def);

    if (type !== "doc") {
      throw new Error("exists() requires a document path with ID");
    }

    const doc = await ref.get();
    return doc.exists;
  }

  // 🔹 SEARCH operations
  async search<
    T extends keyof TableTypeMap = CollectionNames,
    K extends keyof TableTypeMap[T] = keyof TableTypeMap[T]
  >(
    def: BuildRefType,
    field: K,
    searchTerm: TableTypeMap[T][K],
    options?: Omit<QueryOptions<T>, "orderBy">
  ): Promise<TypeReturn<TableTypeMap[T][] | null>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);

      if (type !== "col") {
        return {
          status: "error",
          data: null,
          message: "search() requires a collection path",
        };
      }

      // 🔹 Special handling if the field is a string
      if (typeof searchTerm === "string") {
        if (!searchTerm.trim().length) {
          return {
            status: "error",
            data: null,
            message: "Search term cannot be empty",
          };
        }

        const trimmedSearchTerm = searchTerm.trim();
        const endTerm = trimmedSearchTerm.replace(/.$/, (c) =>
          String.fromCharCode(c.charCodeAt(0) + 1)
        );

        let searchQuery: FirebaseFirestore.Query = ref
          .where(field as string, ">=", trimmedSearchTerm)
          .where(field as string, "<", endTerm)
          .orderBy(field as string);

        // Apply query options (no orderBy override allowed)
        if (options) {
          if (options.where) {
            options.where.forEach((w) => {
              searchQuery = searchQuery.where(
                w.field as string,
                w.operator,
                w.value
              );
            });
          }
          if (options.startAfter)
            searchQuery = searchQuery.startAfter(options.startAfter);
          if (options.startAt)
            searchQuery = searchQuery.startAt(options.startAt);
          if (options.endBefore)
            searchQuery = searchQuery.endBefore(options.endBefore);
          if (options.endAt) searchQuery = searchQuery.endAt(options.endAt);

          searchQuery = searchQuery.limit(options.limit || 50);
        } else {
          searchQuery = searchQuery.limit(50);
        }

        const snapshot = await searchQuery.get();

        const results = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.createTime?.toDate(),
          updatedAt: d.updateTime?.toDate(),
        }));

        return {
          status: "success",
          message: `Found ${results.length} results`,
          data: results as TableTypeMap[T][],
        };
      }

      // 🔹 Fallback for non-string fields (exact match only)
      let exactQuery: FirebaseFirestore.Query = ref.where(
        field as string,
        "==",
        searchTerm
      );

      if (options) {
        if (options.where) {
          options.where.forEach((w) => {
            exactQuery = exactQuery.where(
              w.field as string,
              w.operator,
              w.value
            );
          });
        }
        if (options.startAfter)
          exactQuery = exactQuery.startAfter(options.startAfter);
        if (options.startAt) exactQuery = exactQuery.startAt(options.startAt);
        if (options.endBefore)
          exactQuery = exactQuery.endBefore(options.endBefore);
        if (options.endAt) exactQuery = exactQuery.endAt(options.endAt);

        exactQuery = exactQuery.limit(options.limit || 50);
      } else {
        exactQuery = exactQuery.limit(50);
      }

      const snapshot = await exactQuery.get();

      const results = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.createTime?.toDate(),
        updatedAt: d.updateTime?.toDate(),
      }));

      return {
        status: "success",
        message: `Found ${results.length} results`,
        data: results as TableTypeMap[T][],
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "Search failed",
      };
    }
  }

  // 🔹 Legacy methods (for backward compatibility)
  async set<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    data: TableTypeMap[T]
  ) {
    return this.upsert(def, data);
  }

  async add<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType,
    data: TableTypeMap[T]
  ) {
    return this.create(def, data);
  }

  // 🔹 Helper method to get document reference
  getDocumentRef(def: BuildRefType): FirebaseFirestore.DocumentReference {
    const { type, ref } = this.buildRefOrCollection(def);
    if (type !== "doc") {
      throw new Error("getDocumentRef() requires a document path with ID");
    }
    return ref;
  }

  // 🔹 Helper method to get collection reference
  getCollectionRef(def: BuildRefType): FirebaseFirestore.CollectionReference {
    const { type, ref } = this.buildRefOrCollection(def);
    if (type !== "col") {
      throw new Error(
        "getCollectionRef() requires a collection path without ID"
      );
    }
    return ref;
  }
  async listWithSearch<T extends keyof TableTypeMap = CollectionNames>(params: {
    def: BuildRefType;
    q?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters?: Array<{ id: string; value: any }>;
    sort?: Array<{ id: string; desc?: boolean }>;
    cursor?: string | null;
    limit?: number;
  }): Promise<
    TypeReturn<{
      data: TableTypeMap[T][];
      nextCursor: string | null;
      count: number;
    }>
  > {
    try {
      const { def, q, filters = [], sort = [], cursor, limit = 25 } = params;

      const { type, ref } = this.buildRefOrCollection(def);
      if (type !== "col") {
        return {
          status: "error",
          message: "listWithSearch() requires a collection path",
          data: null,
        };
      }

      let query: FirebaseFirestore.Query = ref;

      // -------- GLOBAL SEARCH (array-contains keywords) -----------
      if (q && q.trim()) {
        query = query.where("keywords", "array-contains", q.trim().toLowerCase());
      }

      // -------- FILTERS ----------
      filters.forEach((f) => {
        if (Array.isArray(f.value)) {
          query = query.where(f.id, "in", f.value);
        } else {
          query = query.where(f.id, "==", f.value);
        }
      });

      // -------- SORTING ----------
      if (sort.length > 0) {
        sort.forEach((s) => {
          query = query.orderBy(s.id, s.desc ? "desc" : "asc");
        });
      } else {
        query = query.orderBy("createdAt", "desc");
      }

      // -------- CURSOR PAGINATION ----------
      if (cursor) {
        const snap = await ref.doc(cursor).get();
        if (snap.exists) query = query.startAfter(snap);
      }

      query = query.limit(limit);

      // -------- EXECUTE ----------
      const snap = await query.get();

      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.createTime?.toMillis?.() ?? null,
        updatedAt: d.updateTime?.toMillis?.() ?? null,
      })) as unknown as TableTypeMap[T][];

      // COUNT (without limit)
      const countSnap = await ref.count().get();
      const nextCursor =
        snap.docs.length === limit ? snap.docs[snap.docs.length - 1].id : null;

      return {
        status: "success",
        message: "",
        data: {
          data: docs,
          nextCursor,
          count: countSnap.data().count,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Failed listWithSearch()",
      };
    }
  }

  async getByIds<T extends keyof TableTypeMap = CollectionNames>(
    def: BuildRefType
    ,
    ids: string[]

  ): Promise<TypeReturn<TableTypeMap[T][] | null>> {
    try {
      const { type, ref } = this.buildRefOrCollection(def);



      if (type !== "col") {
        return {
          status: "error",
          message: "getByIds() requires a collection path",
          data: null,
        };
      }

      // Build doc refs
      const docRefs = ids.map((id) => ref.doc(id));

      // 🔥 Admin SDK batch read (VERY fast)
      const snaps = await this.db.getAll(...docRefs);

      const data = snaps
        .filter((s) => s.exists)
        .map((snap) => ({
          id: snap.id,

          ...snap.data(),
          createdAt: snap.createTime?.toDate(),
          updatedAt: snap.updateTime?.toDate(),


        })) as TableTypeMap[T][];


      return {
        status: "success",
        message: "",
        data: data as TableTypeMap[T][] || null,
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
  async getByIdsWithPaths<T extends keyof TableTypeMap = CollectionNames>(
    paths: string[]
  ): Promise<TypeReturn<TableTypeMap[T][] | null>> {
    try {
      if (!paths.length) {
        return { status: "success", data: [], message: "" }
      }

      const refs = paths.map((path) => this.db.doc(path))

      const snaps = await this.db.getAll(...refs)

      const data = snaps
        .filter((s) => s.exists)
        .map((snap) => ({
          id: snap.id,
          ...snap.data(),
          createdAt: snap.createTime?.toDate(),
          updatedAt: snap.updateTime?.toDate(),
        })) as TableTypeMap[T][]

      return {
        status: "success",
        data: data.length ? data : null,
        message: "",
      }
    } catch (error) {
      return {
        status: "error",
        data: null,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

}

export const db = new FirestoreDatabase();