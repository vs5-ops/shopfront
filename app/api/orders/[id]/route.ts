import { NextRequest, NextResponse } from "next/server";
import { getOrderRepository } from "@/lib/server/order-repository";

/**
 * PATCH /api/orders/[id]
 * Update order status and payment information
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const orderId = params.id;
    const updates = await request.json();

    const repo = getOrderRepository();
    const updated = await repo.updateOrder(orderId, updates);

    return NextResponse.json({
      orderId: updated.id,
      status: updated.status,
      paymentStatus: updated.paymentStatus,
      paymentId: updated.paymentId,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Order update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
