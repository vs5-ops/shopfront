import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/server/auth-session";
import { getUserRepository } from "@/lib/server/user-repository";

const patchSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "user"])
});

function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const repo = getUserRepository();
  const users = await repo.listUsers();
  return NextResponse.json({ users }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = patchSchema.parse(await request.json());
    const repo = getUserRepository();
    const user = await repo.updateRole(body.email, body.role);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Role update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
