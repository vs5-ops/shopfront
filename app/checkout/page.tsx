"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useCart } from "@/app/_components/CartContext";
import { useAuth } from "@/app/_components/AuthContext";
import { CHECKOUT_EMAIL_KEY } from "@/lib/client-auth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const defaultEmail = useMemo(() => user?.email || "", [user]);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function handlePayment(orderData: any, formData: FormData) {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "ShopFront",
      description: "Purchase from ShopFront",
      order_id: orderData.orderId,
      handler: async function (response: any) {
        try {
          // Verify payment
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyRes.ok) {
            throw new Error("Payment verification failed");
          }

          // Update order with payment info
          await fetch(`/api/orders/${orderData.orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              paymentStatus: "paid",
              status: "confirmed",
            }),
          });

          localStorage.setItem(
            CHECKOUT_EMAIL_KEY,
            String(formData.get("email") || user?.email || ""),
          );
          clearCart();
          setMessage(`Payment successful! Order ID: ${orderData.orderId}`);
        } catch (error) {
          console.error("Payment verification error:", error);
          setMessage("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: formData.get("fullName"),
        email: formData.get("email") || user?.email,
        contact: formData.get("mobile"),
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!razorpayLoaded) {
      setMessage("Payment system is loading. Please try again.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setPlacing(true);
    setMessage("");

    try {
      // First create the order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.email || "guest-checkout",
          email: String(form.get("email") || user?.email || ""),
          items: lines.map((line) => ({
            id: line.id,
            title: line.title,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
          })),
          shippingAddress: {
            fullName: String(form.get("fullName") || ""),
            mobile: String(form.get("mobile") || ""),
            addressLine1: String(form.get("address") || ""),
            city: String(form.get("city") || ""),
            state: String(form.get("state") || ""),
            postalCode: String(form.get("postalCode") || ""),
            country: "IN",
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Order creation failed");
      }

      // Create Razorpay payment order
      const paymentRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: subtotal,
          currency: "INR",
          receipt: orderData.orderId,
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.error || "Payment order creation failed");
      }

      // Open Razorpay payment modal
      await handlePayment(paymentData, form);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to process payment",
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="container checkout-layout">
      <form className="card" onSubmit={onSubmit}>
        <h1>Checkout</h1>
        <div className="form-grid">
          <input
            className="input"
            name="fullName"
            placeholder="Full name"
            required
          />
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            required
            defaultValue={defaultEmail}
          />
          <input
            className="input"
            name="mobile"
            placeholder="Mobile"
            required
          />
          <input
            className="input"
            name="postalCode"
            placeholder="Postal code"
            required
          />
          <input className="input" name="city" placeholder="City" required />
          <input className="input" name="state" placeholder="State" required />
          <input
            className="input"
            name="address"
            placeholder="Address line"
            required
            style={{ gridColumn: "1 / -1" }}
          />
        </div>
        <button
          className="btn btn-primary"
          disabled={placing || !razorpayLoaded}
          type="submit"
        >
          {placing
            ? "Processing payment..."
            : razorpayLoaded
              ? "Pay Now"
              : "Loading payment system..."}
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
            <strong>
              Rs {(line.unitPrice * line.quantity).toLocaleString("en-IN")}
            </strong>
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
