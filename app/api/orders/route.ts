import { NextResponse } from "next/server";
import { calculatePrice, validateCheckoutPayload } from "@/lib/pricing";
import { getOrderRepository } from "@/lib/server/order-repository";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = validateCheckoutPayload(payload);
    const pricing = calculatePrice(validated);
    const repo = getOrderRepository();
    const created = await repo.createOrder(validated, pricing);

    return NextResponse.json(
      {
        orderId: created.id,
        currency: "INR",
        ...pricing,
        status: created.status,
        createdAt: created.createdAt
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = (url.searchParams.get("email") || "").trim();
    if (!email) {
      return NextResponse.json({ error: "email query param is required" }, { status: 400 });
    }

    const repo = getOrderRepository();
    const orders = await repo.listOrdersByEmail(email);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
