"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "1200px", margin: "2rem auto" }}
    >
      <h1>Seller Dashboard</h1>

      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          backgroundColor: "#e3f2fd",
          borderLeft: "4px solid #2196f3",
          borderRadius: "4px",
        }}
      >
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>
          Welcome to Shopfront Seller Hub
        </h2>
        <p style={{ margin: "0 0 1rem 0" }}>
          We're excited to have you as part of our seller community. Complete
          your seller registration to start listing products.
        </p>
        <a
          href="/seller-registration"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2196f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "600",
          }}
        >
          Complete Registration
        </a>
      </div>

      <div
        style={{
          marginTop: "3rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3
            style={{ fontSize: "2rem", color: "#2196f3", margin: "0 0 1rem 0" }}
          >
            0
          </h3>
          <p style={{ margin: "0", color: "#666" }}>Active Products</p>
        </div>

        <div
          style={{
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3
            style={{ fontSize: "2rem", color: "#4caf50", margin: "0 0 1rem 0" }}
          >
            0
          </h3>
          <p style={{ margin: "0", color: "#666" }}>Total Orders</p>
        </div>

        <div
          style={{
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3
            style={{ fontSize: "2rem", color: "#ff9800", margin: "0 0 1rem 0" }}
          >
            4.5
          </h3>
          <p style={{ margin: "0", color: "#666" }}>Average Rating</p>
        </div>

        <div
          style={{
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3
            style={{ fontSize: "2rem", color: "#e91e63", margin: "0 0 1rem 0" }}
          >
            0
          </h3>
          <p style={{ margin: "0", color: "#666" }}>Revenue</p>
        </div>
      </div>

      <section style={{ marginTop: "3rem" }}>
        <h2>Quick Links</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <a
            href="/admin/products"
            style={{
              padding: "1.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#333",
              transition: "all 0.2s",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#2196f3" }}>
              📦 Manage Products
            </h3>
            <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
              Add, edit, and manage your product listings
            </p>
          </a>

          <a
            href="/admin/inventory"
            style={{
              padding: "1.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#333",
              transition: "all 0.2s",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#4caf50" }}>
              📊 Inventory
            </h3>
            <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
              Track stock levels and manage inventory
            </p>
          </a>

          <a
            href="/orders"
            style={{
              padding: "1.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#333",
              transition: "all 0.2s",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#ff9800" }}>
              📮 Orders
            </h3>
            <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
              View and manage customer orders
            </p>
          </a>

          <a
            href="/admin/sellers"
            style={{
              padding: "1.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#333",
              transition: "all 0.2s",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#e91e63" }}>
              👥 Account
            </h3>
            <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
              View your seller profile and settings
            </p>
          </a>
        </div>
      </section>

      <section
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #ddd",
        }}
      >
        <h2>Getting Started</h2>
        <ol style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
          <li>Complete your seller registration</li>
          <li>Add your first product with images and details</li>
          <li>Set competitive prices</li>
          <li>Manage inventory levels</li>
          <li>Monitor orders and customer feedback</li>
          <li>Grow your business with Shopfront</li>
        </ol>
      </section>
    </main>
  );
}
