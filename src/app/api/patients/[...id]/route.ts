import { db } from "@/lib/firebase/database";


export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string[] }> }
) {
    const { id } = await params;
    console.log({ id })
    const doctors = await db.getByIds<'patients'>({ path: 'patients' }, id);


    // console.log(doctors.data)
    return Response.json(doctors.data);
}
