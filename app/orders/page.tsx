"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/AuthContext";
import { CHECKOUT_EMAIL_KEY } from "@/lib/client-auth";

type OrderItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("Loading orders...");

  useEffect(() => {
    async function load() {
      if (loading) {
        return;
      }

      const email = user?.email || localStorage.getItem(CHECKOUT_EMAIL_KEY) || "";
      if (!email) {
        setStatus("Login or place an order to see history.");
        return;
      }

      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }
        setOrders(data.orders || []);
        setStatus((data.orders || []).length ? "" : "No orders found for this email.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Failed to load orders");
      }
    }

    load();
  }, [loading, user]);

  return (
    <main className="container">
      <h1>Your Orders</h1>
      {!orders.length ? <div className="card">{status}</div> : null}
      <div className="stack-list">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <div className="section-head">
              <strong>Order {order.id}</strong>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <p>Status: {order.status}</p>
            <p>Total: Rs {Number(order.total).toLocaleString("en-IN")}</p>
            {order.items.map((item) => (
              <p key={item.id} className="delivery-text">
                {item.title} x {item.quantity}
              </p>
            ))}
          </article>
        ))}
      </div>
    </main>
  );
}
