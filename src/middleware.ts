// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";




export async function middleware(req: NextRequest): Promise<NextResponse> {
    const token = req.cookies.get("token")?.value;
    console.log({ token });

    if (!token) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });

    }

    try {
        await verifyToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}

export const config = {
    matcher: ["/api/:path*"],
};
