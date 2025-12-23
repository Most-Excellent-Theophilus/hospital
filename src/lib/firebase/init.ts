import "server-only";
import * as admin from "firebase-admin";

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY ?? ""),
    }),
 
  });
}

// ✅ Export already-initialized services
export const db = admin.firestore();

