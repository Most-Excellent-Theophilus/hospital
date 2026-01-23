import { db } from "@/lib/firebase/database";


export async function GET() {
    const doctors = await db.get({ path: 'patients' }) // Assume this function fetches the list of doctors
    // console.log(doctors.data)
    return Response.json(doctors.data);
}
