import { z } from "zod";
import type { CheckoutRequest, PriceBreakdown } from "@/lib/types";

const ItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().max(20)
});

const CheckoutSchema = z.object({
  userId: z.string().min(3),
  email: z.string().email(),
  items: z.array(ItemSchema).min(1).max(50),
  couponCode: z.string().trim().min(3).max(32).nullable().optional(),
  giftCardCode: z.string().trim().min(3).max(32).nullable().optional(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    mobile: z.string().min(8).max(20),
    addressLine1: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4).max(12),
    country: z.string().length(2)
  })
});

export function validateCheckoutPayload(payload: unknown): CheckoutRequest {
  const parsed = CheckoutSchema.safeParse(payload);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid checkout payload: ${details}`);
  }
  return parsed.data;
}

export function calculatePrice(payload: CheckoutRequest): PriceBreakdown {
  const subtotal = payload.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Placeholder policy for migration phase: replace with DB-backed coupon/gift card engines.
  const couponDiscount = 0;
  const giftCardAmount = 0;

  const shipping = subtotal >= 499 ? 0 : 49;
  const taxable = Math.max(0, subtotal - couponDiscount);
  const tax = Number((taxable * 0.18).toFixed(2));
  const total = Math.max(0, Number((taxable + shipping + tax - giftCardAmount).toFixed(2)));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    couponDiscount,
    giftCardAmount,
    shipping,
    tax,
    total
  };
}
