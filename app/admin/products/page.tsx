"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { FirestoreProduct } from "@/lib/firestore-schema";

const defaultFormData = {
  slug: "",
  title: "",
  brand: "",
  category: "electronics",
  price: 0,
  mrp: 0,
  rating: 4,
  reviews: 0,
  stock: 0,
  image: "",
  delivery: "Free delivery by tomorrow",
  highlights: [],
  description: "",
  specifications: {},
  materials: "",
  dimensions: "",
  weight: "",
  warranty: "",
  seller: "AZCO Global",
  returnPolicy: "30-day return",
  returnDays: 30,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<(FirestoreProduct & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(defaultFormData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        fetchProducts();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError("You must be logged in to perform this action");
      return;
    }

    try {
      const token = await currentUser.getIdToken();

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingId ? "Product updated!" : "Product added!");
        setShowForm(false);
        setEditingId(null);
        setFormData(defaultFormData);
        fetchProducts();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error: " + (error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    if (!currentUser) {
      setError("You must be logged in to perform this action");
      return;
    }

    try {
      setError(null);
      const token = await currentUser.getIdToken();

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Error: " + (error as Error).message);
    }
  };

  const handleEdit = (product: any) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  if (isAuthLoading) {
    return <div style={{ padding: "2rem" }}>Checking authentication...</div>;
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Admin Dashboard</h1>
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
    <div style={{ padding: "2rem" }}>
      <h1>Product Management</h1>
      <p>Welcome, {currentUser.email}</p>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#d32f2f", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData(defaultFormData);
          setError(null);
        }}
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#ff9900",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        {showForm ? "Cancel" : "+ Add New Product"}
      </button>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#f5f5f5",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          <div>
            <label>Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Brand *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
              <option value="sports">Sports</option>
              <option value="books">Books</option>
            </select>
          </div>

          <div>
            <label>Price (Rs) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>MRP (Rs) *</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Materials</label>
            <input
              type="text"
              name="materials"
              value={formData.materials}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#0066c0",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {isLoading && <p>Loading products...</p>}

      {/* Products Table */}
      {!isLoading && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "2rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                Title
              </th>
              <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                Brand
              </th>
              <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                Price
              </th>
              <th style={{ padding: "1rem", textAlign: "left", borderBottom: "2px solid #ddd" }}>
                Stock
              </th>
              <th style={{ padding: "1rem", textAlign: "center", borderBottom: "2px solid #ddd" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "1rem" }}>{product.title}</td>
                <td style={{ padding: "1rem" }}>{product.brand}</td>
                <td style={{ padding: "1rem" }}>Rs {product.price.toLocaleString("en-IN")}</td>
                <td style={{ padding: "1rem" }}>{product.stock}</td>
                <td
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#0066c0",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && products.length === 0 && (
        <p>No products found. Add your first product!</p>
      )}
    </div>
  );
}
