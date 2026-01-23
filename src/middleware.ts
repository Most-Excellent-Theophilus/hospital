// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";
import clientDataServer from "./features/auth/client.locale";




export async function middleware(req: NextRequest): Promise<NextResponse> {
    const token = req.cookies.get("token")?.value;
    console.log({ token });

    const path = await clientDataServer()
    if (!token) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.rewrite(url)

    }

    try {
        await verifyToken(token);
        return NextResponse.next();
    } catch {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.rewrite(url)
    }
}

export const config = {
    matcher: ["/api/:path*", '/dashboard/:path*'],
};
