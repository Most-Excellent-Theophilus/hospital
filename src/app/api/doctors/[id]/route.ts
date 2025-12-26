import { getDoctorById } from "@/features/users/users.actions";
import { db } from "@/lib/firebase/database";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const doctors = await db.getById({ path: 'users', id });

    console.log(doctors.data?.[0])
    return Response.json(doctors.data?.[0]);
}
