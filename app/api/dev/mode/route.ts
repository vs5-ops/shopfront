import { NextResponse } from "next/server";
import { getDataMode, getLocalDbDir } from "@/lib/server/data-mode";

export async function GET() {
  return NextResponse.json(
    {
      mode: getDataMode(),
      localDbDir: getLocalDbDir()
    },
    { status: 200 }
  );
}
