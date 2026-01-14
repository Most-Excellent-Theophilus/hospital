

import { db } from "@/lib/firebase/init";



export async function GET() {

    const snapshot = await db
        .collectionGroup('pre-operation')
        .get();
    return Response.json(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        path: doc.ref.path, // useful to know parent user
    })));
}
