import { db } from "@/lib/firebase/database";



export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const jsonIds = id.replaceAll('9️⃣', '/').split('🔟')

    const res = await db.getByIdsWithPaths<'pre-operation'>(jsonIds)

    console.log(res)
    return Response.json(res.data)

}
