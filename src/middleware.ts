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
        return NextResponse.json({ message: `You Do Not Have Access To This Page: Try ${path.host}/login` }, { status: 401 });

    }

    try {
        await verifyToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.json({ message:` Invalid or expired token : Try ${path.host}/login` }, { status: 401 });
    }
}

export const config = {
    matcher: ["/api/:path*", '/dashboard/:path*'],
};
