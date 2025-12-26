import { userSchema } from "@/features/users/users.types";
import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import z from "zod";


export const sessionOptions: SessionOptions = {
  cookieName: "staff",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    // maxAge: 60 * 60 * 24 * 7, // 7 days (in seconds) ⏳
    maxAge: process.env.NODE_ENV === "production" ? 60 * 60 : 60 * 60 * 24,  // 1 hour (in seconds) ⏳
    secure: process.env.NODE_ENV === "production",
    httpOnly: true, // 🔒 prevent access via JavaScript
    sameSite: "lax",
    path: "/",
  },
};

export const sessionSchema = userSchema.omit({ password: true })
type SessionUser = z.infer<typeof sessionSchema>
export const getSession = async () => {
  const session = await getIronSession<SessionUser>(
    await cookies(),
    sessionOptions
  );
  return session;
}
export const createSession = async (params: SessionUser) => {
  try {
    const session = await getIronSession<SessionUser>(
      await cookies(),
      sessionOptions
    );
    Object.assign(session, params);
    await session.save();
    return { status: "success", message: "Session Created" } as const;
  } catch (error) {
    console.log({ error })
    return {

      status: "error",
      message: "Unable to create Session"
    } as const;
  }
}
export const deleteSession = async () => {
  try {
    const session = await getIronSession<SessionUser>(
      await cookies(),
      sessionOptions
    );
    session.destroy();

  } catch (error) {
    return { error: "Unable to log Perform action" + JSON.stringify(error) };
  }
}