
import { getPatientById } from "@/features/pages/patients/patient.actions";
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
console.log({id})
    const doctors = await getPatientById(id);

    console.log(doctors.data?.[0])
    return Response.json(doctors.data?.[0]);
}
