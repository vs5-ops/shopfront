/**
 * Inventory Management Dashboard
 * Track stock levels, movements, and reorder alerts
 */

"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface InventoryItem {
  productId: string;
  productTitle?: string;
  availableStock: number;
  reservedStock: number;
  reorderLevel: number;
  lastUpdated: string;
  status?: "ok" | "low" | "critical";
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "ok" | "low" | "critical">("all");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        fetchInventory();
        fetchProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchInventory = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/inventory", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      } else {
        setError("Failed to load inventory");
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const updateInventory = async (productId: string, availableStock: number, reorderLevel: number) => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          availableStock,
          reorderLevel,
        }),
      });

      if (res.ok) {
        alert("Inventory updated successfully!");
        fetchInventory();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update inventory");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      setError("Error: " + (error as Error).message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "#4caf50";
      case "low":
        return "#ff9800";
      case "critical":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getStatusLabel = (available: number, reorderLevel: number) => {
    if (available <= 0) return "critical";
    if (available <= reorderLevel) return "low";
    return "ok";
  };

  // Combine inventory with product data
  const inventoryWithProducts = inventory.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      productTitle: product?.title || `Product ${item.productId}`,
      status: getStatusLabel(item.availableStock, item.reorderLevel),
    };
  });

  const filteredInventory = filterStatus === "all"
    ? inventoryWithProducts
    : inventoryWithProducts.filter((item) => item.status === filterStatus);

  if (isAuthLoading) {
    return <div style={{ padding: "2rem" }}>Checking authentication...</div>;
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Inventory Management</h1>
        <p style={{ color: "#d32f2f", fontSize: "1.1rem" }}>
          You must be logged in as an admin to access this page.
        </p>
        <p>
          <a href="/login" style={{ color: "#0066c0", textDecoration: "none" }}>
            Go to login page
          </a>
        </p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1>Inventory Management</h1>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>
            {inventory.reduce((sum, item) => sum + item.availableStock, 0)}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Total Stock Units</div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>
            {filteredInventory.filter((i) => i.status === "ok").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Products in Stock</div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>
            {filteredInventory.filter((i) => i.status === "low").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Low Stock Alert</div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f44336" }}>
            {filteredInventory.filter((i) => i.status === "critical").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Out of Stock</div>
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#d32f2f", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ marginRight: "1rem", fontWeight: "500" }}>
          Filter by status:
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <option value="all">All</option>
          <option value="ok">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="critical">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
          Loading inventory...
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                  Product
                </th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                  Available Stock
                </th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                  Reserved Stock
                </th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                  Reorder Level
                </th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                  Status
                </th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    No inventory data available
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.productId} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "1rem" }}>{item.productTitle}</td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <input
                        type="number"
                        defaultValue={item.availableStock}
                        min="0"
                        style={{
                          width: "80px",
                          padding: "0.25rem",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          borderRadius: "4px"
                        }}
                        onBlur={(e) => {
                          const newStock = parseInt((e.target as HTMLInputElement).value) || 0;
                          if (newStock !== item.availableStock) {
                            updateInventory(item.productId, newStock, item.reorderLevel);
                          }
                        }}
                      />
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {item.reservedStock}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <input
                        type="number"
                        defaultValue={item.reorderLevel}
                        min="0"
                        style={{
                          width: "80px",
                          padding: "0.25rem",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          borderRadius: "4px"
                        }}
                        onBlur={(e) => {
                          const newReorderLevel = parseInt((e.target as HTMLInputElement).value) || 10;
                          if (newReorderLevel !== item.reorderLevel) {
                            updateInventory(item.productId, item.availableStock, newReorderLevel);
                          }
                        }}
                      />
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: getStatusColor(item.status!),
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.status!.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button
                        onClick={() => {
                          const newStock = prompt(`Update stock for ${item.productTitle}:`, item.availableStock.toString());
                          if (newStock !== null) {
                            const stock = parseInt(newStock) || 0;
                            updateInventory(item.productId, stock, item.reorderLevel);
                          }
                        }}
                        style={{
                          padding: "0.4rem 0.8rem",
                          backgroundColor: "#2196f3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Movement Log */}
      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #ddd",
        }}
      >
        <h2>Recent Stock Movements</h2>
        <div style={{ color: "#999", paddingTop: "1rem", textAlign: "center" }}>
          No recent movements to display
        </div>
      </div>
    </main>
  );
}