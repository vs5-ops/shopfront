import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/payment-signature";

const VerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = VerifySchema.parse(payload);

    const isValid = verifyRazorpaySignature({
      orderId: parsed.razorpay_order_id,
      paymentId: parsed.razorpay_payment_id,
      signature: parsed.razorpay_signature
    });

    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // TODO: mark order paid in DB transaction once order table is integrated.
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
