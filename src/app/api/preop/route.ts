// async function getAllOrders() {
//   const snapshot = await getDocs(collectionGroup(db, "orders"));

import { db } from "@/lib/firebase/init";

//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// }


export async function GET() {

    const snapshot = await db
        .collectionGroup('pre-operation')
        .get();

    // console.log([snapshot.docs], ['pre-operation'])
    return Response.json(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        path: doc.ref.path, // useful to know parent user
    })));
}
