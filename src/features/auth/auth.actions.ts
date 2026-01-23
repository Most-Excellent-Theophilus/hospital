"use server";
import "server-only";
import bcrypt from "bcryptjs";
import { createCacheActions } from "@/lib/firebase/cached.database";
import { Login, loginSchema, passwordCreateSchema, Token } from "./auth.types";

import { v4 as tokenGen } from "uuid";

import clientDataServer from "./client.locale";
import { LogsShema, TokenSchema } from "@/lib/firebase/firebase.types";
import sendMail from "../mail/sendmail";
import { db } from "@/lib/firebase/database";
import z from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession, SessionUser } from "./auth.session";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";



// 🔹 DOCTOR
const userDb = await createCacheActions("users");

export const checkEmail = async (email: Login["email"]) => {
    const result = await db.search<'users'>({ path: 'users' }, "email", email, { limit: 1 });

    if (result.status === "error") {
        return {
            status: "error",
            message: "something-wrong",
        } as const;
    }

    const user = result.data?.[0];

    if (!user) {
        return {
            status: "error",
            message: "email-not-found",
        } as const;
    }

    console.log({ user })
    if (!user.verified) {
        sendLink(email)
        return {
            status: "info",
            message: "verify",
        } as const;
    }

    return {
        status: "info",
        message: "password",
    } as const;
};

export const login = async (data: Login, device: ReturnType<typeof useDeviceInfo>) => {
    const clientInfo = await clientDataServer()


    const res = await loginSchema.safeParseAsync(data)
    if (!res.success) {
        return {
            status: "error",
            message: "invalid-fields",
        } as const;
    }
    const { data: { email, password } } = res
    const findEmail = await db.search<'users'>({ path: 'users' }, 'email', email, { limit: 1 })
    const user = findEmail.data?.[0];
    if (!user) {
        return {
            status: "error",
            message: "email-not-found",
        } as const;
    }
    console.log({ user })
    console.log({ data })

    const comparePassword = await bcrypt.compare(password, user.password)

    if (!comparePassword) {
        return {
            status: "error",
            message: "email-or-password",
        } as const;


    }
    const token = await signToken({
        sub: user.id,
        email: user.email,
        role: user.password,
    });
    await createSession({ ...user, ...clientInfo, ...device, password: token } as unknown as SessionUser)
    await db.create<'databaseLogs'>({ path: 'databaseLogs' }, { ...user, ...clientInfo, ...device, worked: false, action: 'login', dataString: 'unable-to-verify' } as unknown as LogsShema);

    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    return {
        status: "success",
        message: "redirecting",
    } as const
}

export const setResetPassword = async (email: Login["email"],) => {


    const result = await userDb.search('email', email)
    const user = result.data?.[0];

    if (!user) {
        return {
            status: "error",
            message: "email-not-found",
        } as const;
    }

    const res = await db.update<'users'>({ path: 'users', id: user.id }, {
        verified: false
    })

    if (res.data == null) {
        return {
            status: "error",
            message: "something-wrong",
        } as const;
    }

    return await sendLink(email)

}

export const sendLink = async (data: Login['email'],) => {
    const { host } = await clientDataServer()
    const token = tokenGen()
    const tokenLink = host + '/verification/' + token
    const tokenData: Token = {
        email: data,
        expires: new Date(Date.now() + 15 * 60 * 1000), // ✅ 15 minutes from now
        token
    }

    const result = await db.create({ path: 'tokens' }, tokenData as TokenSchema)
    if (result.data == null) {

        return {
            status: "error",
            message: "unable-to-set",
        } as const;
    }
    console.log({ tokenLink })
    if (process.env.NODE_ENV === "production") {
        const mailsend = await sendMail(data, tokenLink, host!);

        if (!mailsend?.accepted) {
            return {
                status: "error",
                message: "unable-to-send",
            } as const;
        }
    }

    return {
        status: "success",
        message: "email-sent",
    } as const;

}

export const createPassword = async (data: z.infer<typeof passwordCreateSchema>, device: ReturnType<typeof useDeviceInfo>) => {
    const clientInfo = await clientDataServer()
    const verified = await passwordCreateSchema.safeParseAsync(data)

    if (!verified.success) {
        return {
            status: "error",
            message: "unable-to-verify",
        } as const;
    }

    const result = await db.search<'users'>({ path: "users" }, "email", verified.data.email, {
        limit: 1
    })

    const user = result.data?.[0];

    if (!user) {
        return {
            status: "error",
            message: "email-not-found",
        } as const;
    }
    const hashedPassword = await bcrypt.hash(verified.data.password, 10)

    const res = await db.update<'users'>({ path: 'users', id: user.id }, { password: hashedPassword, verified: true })
    if (res.data == null) {
        await db.create<'databaseLogs'>({ path: 'databaseLogs' }, { ...user, ...clientInfo, ...device, worked: false, action: 'login', dataString: 'unable-to-verify' } as unknown as LogsShema)

        return {
            status: "error",
            message: "unable-to-verify",
        } as const;
    }

    // create session and redirect 
    const session = await createSession({ ...user, ...clientInfo, ...device } as unknown as SessionUser)
    if (session.status == 'error') {
        await db.create<'databaseLogs'>({ path: 'databaseLogs' }, { ...user, ...clientInfo, ...device, worked: false, action: 'login', dataString: 'unable-to-verify' } as unknown as LogsShema)

        return {
            status: "error",
            message: "unable-to-verify",
        } as const;
    }
    await db.create<'databaseLogs'>({ path: 'databaseLogs' }, { ...user, ...clientInfo, ...device, worked: true, action: 'login' } as unknown as LogsShema)
    redirect('/dashboard')
}


export const logoutNow = async () => {
    await deleteSession()
    redirect('/login')
}