import { getAllPatientCommad } from "@/features/pages/patients/patient.actions";


export async function GET() {
    const doctors = await getAllPatientCommad(); // Assume this function fetches the list of doctors
    // console.log(doctors)
    return Response.json(doctors);
}
