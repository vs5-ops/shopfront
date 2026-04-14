import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/server/auth-session";

export async function GET(request: NextRequest) {
  const secure = process.env.NODE_ENV === "production";
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    const res = NextResponse.json({ user: null }, { status: 200 });
    res.cookies.set(SESSION_COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", secure, maxAge: 0, path: "/" });
    return res;
  }

  return NextResponse.json({ user: { email: payload.email, role: payload.role } }, { status: 200 });
}
