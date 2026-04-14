import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth-session";
import { getUserRepository } from "@/lib/server/user-repository";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const secure = process.env.NODE_ENV === "production";
    const body = schema.parse(await request.json());
    const repo = getUserRepository();
    const user = await repo.login(body.email, body.password);

    const token = createSessionToken(user.email, user.role);
    const res = NextResponse.json({ user }, { status: 200 });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    const status = message.toLowerCase().includes("too many failed attempts") ? 429 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
