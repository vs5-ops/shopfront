import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserRepository } from "@/lib/server/user-repository";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  newPassword: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const repo = getUserRepository();
    const result = await repo.resetPassword(body.email, body.token, body.newPassword);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset password";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
