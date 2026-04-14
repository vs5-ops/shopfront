import { NextResponse } from "next/server";
import { calculatePrice, validateCheckoutPayload } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = validateCheckoutPayload(payload);
    const pricing = calculatePrice(validated);
    return NextResponse.json(pricing, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to calculate price";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
