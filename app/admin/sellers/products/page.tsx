/**
 * Admin Dashboard for Product Management
 * Allows sellers to manage their products, images, and inventory
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/app/_components/AuthContext";

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "add" | "analytics">(
    "list",
  );
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  if (!user || user.role !== "seller") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>Only sellers can access this page.</p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1>Seller Dashboard</h1>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveTab("list")}
          style={{
            padding: "1rem",
            border: "none",
            backgroundColor: activeTab === "list" ? "#2196f3" : "transparent",
            color: activeTab === "list" ? "white" : "#666",
            cursor: "pointer",
            fontWeight: activeTab === "list" ? "bold" : "normal",
          }}
        >
          My Products
        </button>
        <button
          onClick={() => setActiveTab("add")}
          style={{
            padding: "1rem",
            border: "none",
            backgroundColor: activeTab === "add" ? "#2196f3" : "transparent",
            color: activeTab === "add" ? "white" : "#666",
            cursor: "pointer",
            fontWeight: activeTab === "add" ? "bold" : "normal",
          }}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          style={{
            padding: "1rem",
            border: "none",
            backgroundColor:
              activeTab === "analytics" ? "#2196f3" : "transparent",
            color: activeTab === "analytics" ? "white" : "#666",
            cursor: "pointer",
            fontWeight: activeTab === "analytics" ? "bold" : "normal",
          }}
        >
          Analytics
        </button>
      </div>

      {/* Products List Tab */}
      {activeTab === "list" && (
        <div>
          <h2>My Products</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {products.length === 0 ? (
              <div
                style={{ padding: "2rem", textAlign: "center", color: "#999" }}
              >
                No products yet.{" "}
                <a href="#" onClick={() => setActiveTab("add")}>
                  Add your first product
                </a>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 150px",
                    gap: "1.5rem",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem" }}>{product.title}</h3>
                    <p style={{ margin: "0.5rem 0", color: "#666" }}>
                      Rs. {product.price}{" "}
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                        }}
                      >
                        Rs. {product.mrp}
                      </span>
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                      Stock: <strong>{product.stock}</strong> | Rating:{" "}
                      <strong>{product.rating} ★</strong>
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === "add" && (
        <div>
          <h2>Add New Product</h2>
          <form style={{ display: "grid", gap: "1.5rem", maxWidth: "600px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Product Title
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  MRP (Original Price)
                </label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Selling Price
                </label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Description
              </label>
              <textarea
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Stock Quantity
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Product Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <small style={{ color: "#999" }}>
                Upload up to 10 images (JPEG, PNG, GIF max 5MB each)
              </small>
            </div>

            <button
              type="submit"
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div>
          <h2>Sales Analytics</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#4caf50",
                }}
              >
                0
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Total Sales
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#2196f3",
                }}
              >
                Rs. 0
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Total Revenue
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#ff9800",
                }}
              >
                4.5 ★
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Average Rating
              </div>
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#f44336",
                }}
              >
                0
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>Returns</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
