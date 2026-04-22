/**
 * Admin Sellers Management Dashboard
 * Manage seller registrations, verify sellers, and oversee seller activities
 */

"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  website?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rating: number;
  reviewCount: number;
  productCount: number;
  totalSales: number;
  responseTime: number;
  returnRate: number;
  cancellationRate: number;
  registrationDate: string;
  isActive: boolean;
  documents: {
    panCard: string;
    gstCertificate: string;
    businessProof: string;
  };
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "verified" | "rejected"
  >("pending");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        fetchSellers();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSellers = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/sellers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      } else {
        setError("Failed to load sellers");
      }
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setError("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  const verifySeller = async (
    sellerId: string,
    action: "verify" | "reject",
    notes?: string,
  ) => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/sellers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellerId,
          action,
          notes,
        }),
      });

      if (res.ok) {
        alert(`Seller ${action}d successfully!`);
        fetchSellers();
        setSelectedSeller(null);
        setVerificationNotes("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || `Failed to ${action} seller`);
      }
    } catch (error) {
      console.error(`Error ${action}ing seller:`, error);
      setError(`Error: ${(error as Error).message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "rejected":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const filteredSellers =
    filterStatus === "all"
      ? sellers
      : sellers.filter((seller) => seller.verificationStatus === filterStatus);

  if (isAuthLoading) {
    return <div style={{ padding: "2rem" }}>Checking authentication...</div>;
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Seller Management</h1>
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
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h1>Seller Management Dashboard</h1>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
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
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}
          >
            {sellers.filter((s) => s.verificationStatus === "pending").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Pending Verification
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
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}
          >
            {sellers.filter((s) => s.verificationStatus === "verified").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Verified Sellers
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
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#f44336" }}
          >
            {sellers.filter((s) => s.verificationStatus === "rejected").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Rejected Applications
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
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}
          >
            {sellers.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Total Applications
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
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
          <option value="all">All Sellers</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Sellers Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
          Loading sellers...
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Seller Details
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Products
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Rating
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Registration Date
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    No sellers found
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr
                    key={seller.id}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                      >
                        {seller.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {seller.email} | {seller.phone}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {seller.description}
                      </div>
                      {seller.website && (
                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                          Website:{" "}
                          <a
                            href={seller.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0066c0" }}
                          >
                            {seller.website}
                          </a>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: getStatusColor(
                            seller.verificationStatus,
                          ),
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {seller.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {seller.productCount}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {seller.rating > 0 ? (
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                style={{
                                  color: i < seller.rating ? "#ffc107" : "#ddd",
                                  fontSize: "1rem",
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#666" }}>
                            {seller.rating.toFixed(1)} ({seller.reviewCount})
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#999", fontSize: "0.9rem" }}>
                          No ratings
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      {new Date(seller.registrationDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {seller.verificationStatus === "pending" ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => verifySeller(seller.id, "verify")}
                            style={{
                              padding: "0.4rem 0.8rem",
                              backgroundColor: "#4caf50",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                            }}
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => setSelectedSeller(seller)}
                            style={{
                              padding: "0.4rem 0.8rem",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "#666", fontSize: "0.9rem" }}>
                          {seller.verificationStatus === "verified"
                            ? "Verified"
                            : "Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedSeller && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
            }}
          >
            <h3>Reject Seller Application</h3>
            <div style={{ marginBottom: "1rem" }}>
              <h4>{selectedSeller.name}</h4>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                {selectedSeller.email}
              </p>
            </div>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              Provide a reason for rejecting this seller application (optional):
            </p>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Reason for rejection..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginBottom: "1rem",
                resize: "vertical",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setSelectedSeller(null);
                  setVerificationNotes("");
                }}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  verifySeller(selectedSeller.id, "reject", verificationNotes)
                }
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
