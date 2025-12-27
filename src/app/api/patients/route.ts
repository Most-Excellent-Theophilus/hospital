import { getAllPatient as getAllDoctor } from "@/features/patient/patient.actions";

export async function GET() {
    const doctors = await getAllDoctor(); // Assume this function fetches the list of doctors
    console.log(doctors.data)
    return Response.json(doctors.data);
}
