"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/app/_components/CartContext";
import { useAuth } from "@/app/_components/AuthContext";
import { CHECKOUT_EMAIL_KEY } from "@/lib/client-auth";

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");
  const defaultEmail = useMemo(() => user?.email || "", [user]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) {
      setMessage("Your cart is empty.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setPlacing(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.email || "guest-checkout",
          email: String(form.get("email") || user?.email || ""),
          items: lines.map((line) => ({
            id: line.id,
            title: line.title,
            unitPrice: line.unitPrice,
            quantity: line.quantity
          })),
          shippingAddress: {
            fullName: String(form.get("fullName") || ""),
            mobile: String(form.get("mobile") || ""),
            addressLine1: String(form.get("address") || ""),
            city: String(form.get("city") || ""),
            state: String(form.get("state") || ""),
            postalCode: String(form.get("postalCode") || ""),
            country: "IN"
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }

      localStorage.setItem(CHECKOUT_EMAIL_KEY, String(form.get("email") || user?.email || ""));
      clearCart();
      setMessage(`Order placed successfully: ${data.orderId}`);
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="container checkout-layout">
      <form className="card" onSubmit={onSubmit}>
        <h1>Checkout</h1>
        <div className="form-grid">
          <input className="input" name="fullName" placeholder="Full name" required />
          <input className="input" name="email" type="email" placeholder="Email" required defaultValue={defaultEmail} />
          <input className="input" name="mobile" placeholder="Mobile" required />
          <input className="input" name="postalCode" placeholder="Postal code" required />
          <input className="input" name="city" placeholder="City" required />
          <input className="input" name="state" placeholder="State" required />
          <input className="input" name="address" placeholder="Address line" required style={{ gridColumn: "1 / -1" }} />
        </div>
        <button className="btn btn-primary" disabled={placing} type="submit">
          {placing ? "Placing order..." : "Place order"}
        </button>
        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
      </form>

      <aside className="card summary-box">
        <h2>Order Summary</h2>
        {lines.map((line) => (
          <div className="summary-line" key={line.id}>
            <span>
              {line.title} x {line.quantity}
            </span>
            <strong>Rs {(line.unitPrice * line.quantity).toLocaleString("en-IN")}</strong>
          </div>
        ))}
        <div className="summary-line total-line">
          <span>Subtotal</span>
          <strong>Rs {subtotal.toLocaleString("en-IN")}</strong>
        </div>
      </aside>
    </main>
  );
}
