"use client";

import Link from "next/link";
import { useCart } from "@/app/_components/CartContext";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, clearCart } = useCart();

  if (!lines.length) {
    return (
      <main className="container">
        <div className="card empty-state">
          <h1>Your cart is empty</h1>
          <p>Add products and unlock smart offers.</p>
          <Link className="btn btn-primary" href="/products">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-layout">
      <section className="card">
        <h1>Shopping Cart</h1>
        {lines.map((line) => (
          <article key={line.id} className="cart-line">
            <img src={line.image} alt={line.title} className="cart-thumb" />
            <div className="cart-line-body">
              <h3>{line.title}</h3>
              <p>Rs {line.unitPrice.toLocaleString("en-IN")}</p>
            </div>
            <div className="qty-box">
              <button onClick={() => setQuantity(line.id, line.quantity - 1)}>-</button>
              <span>{line.quantity}</span>
              <button onClick={() => setQuantity(line.id, line.quantity + 1)}>+</button>
            </div>
            <button className="link-btn" onClick={() => removeItem(line.id)}>
              Remove
            </button>
          </article>
        ))}
      </section>

      <aside className="card summary-box">
        <h2>Price Details</h2>
        <div className="summary-line">
          <span>Subtotal</span>
          <strong>Rs {subtotal.toLocaleString("en-IN")}</strong>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <strong>{subtotal >= 499 ? "Free" : "Rs 49"}</strong>
        </div>
        <div className="summary-line total-line">
          <span>Total</span>
          <strong>Rs {(subtotal >= 499 ? subtotal : subtotal + 49).toLocaleString("en-IN")}</strong>
        </div>
        <Link href="/checkout" className="btn btn-primary">
          Proceed to checkout
        </Link>
        <button className="btn" onClick={clearCart}>
          Clear cart
        </button>
      </aside>
    </main>
  );
}
