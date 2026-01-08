import { getAllDoctor } from "@/features/pages/doctors/users.actions";


export async function GET() {
  const doctors = await getAllDoctor(); // Assume this function fetches the list of doctors

  return Response.json(doctors.data);
}
