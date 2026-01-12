import { db } from "@/lib/firebase/database";



export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const result = await db.listWithSearch({
        def: { path: "patients" },
        // q: searchParams.get("q") ?? "",
        cursor: searchParams.get("cursor"),
        limit: Number(searchParams.get("limit") ?? 25),
        filters: JSON.parse(searchParams.get("filters") ?? "[]"),
        sort: JSON.parse(searchParams.get("sort") ?? "[]"),
    });
console.log(result)
    // return Response.json(result);
    return Response.json({
        data: result.data?.data || [],
        nextCursor: result.data?.nextCursor || null, // null if no more
        count: result.data?.count || 0
    });
}

