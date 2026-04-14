import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserRepository } from "@/lib/server/user-repository";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const repo = getUserRepository();
    const result = await repo.requestPasswordReset(body.email);
    const resetUrl = result.tokenPreview
      ? `${new URL(request.url).origin}/reset-password?email=${encodeURIComponent(body.email)}&token=${encodeURIComponent(result.tokenPreview)}`
      : undefined;
    return NextResponse.json({ ...result, resetUrl }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to request password reset";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
