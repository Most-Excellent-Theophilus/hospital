// async function getAllOrders() {
//   const snapshot = await getDocs(collectionGroup(db, "orders"));

import { db } from "@/lib/firebase/database";



//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// }


export async function GET() {

    const data = await db.get<'databaseLogs'>({ path: 'databaseLogs' })
    return Response.json(data.data)
}
