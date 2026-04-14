import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/server/auth-session";
import { getUserRepository } from "@/lib/server/user-repository";

const schema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = schema.parse(await request.json());
    const repo = getUserRepository();
    const result = await repo.changePassword(session.email, body.currentPassword, body.newPassword);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change password";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
