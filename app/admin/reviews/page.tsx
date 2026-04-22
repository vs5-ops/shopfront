/**
 * Admin Reviews Moderation Dashboard
 * Manage review submissions, approve/reject reviews, and respond to customer feedback
 */

"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface Review {
  id: string;
  productId: string;
  productTitle?: string;
  userId: string;
  userName: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  unhelpful: number;
  verified: boolean;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  adminResponse?: string;
  adminResponseDate?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        fetchReviews();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReviews = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        setError("Failed to load reviews");
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (
    reviewId: string,
    action: "approve" | "reject",
    response?: string,
  ) => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId,
          action,
          response,
        }),
      });

      if (res.ok) {
        alert(`Review ${action}d successfully!`);
        fetchReviews();
        setSelectedReview(null);
        setAdminResponse("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || `Failed to ${action} review`);
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      setError(`Error: ${(error as Error).message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "rejected":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const filteredReviews =
    filterStatus === "all"
      ? reviews
      : reviews.filter((review) => review.status === filterStatus);

  if (isAuthLoading) {
    return <div style={{ padding: "2rem" }}>Checking authentication...</div>;
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Review Moderation</h1>
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
      <h1>Review Moderation Dashboard</h1>

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
            {reviews.filter((r) => r.status === "pending").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Pending Reviews
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
            {reviews.filter((r) => r.status === "approved").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Approved Reviews
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
            {reviews.filter((r) => r.status === "rejected").length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Rejected Reviews
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
            {reviews.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Total Reviews</div>
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
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
          Loading reviews...
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
                  Review Details
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
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Date
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
              {filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    No reviews found
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                      >
                        {review.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        By {review.userName} ({review.email})
                        {review.verified && (
                          <span
                            style={{ color: "#4caf50", marginLeft: "0.5rem" }}
                          >
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        Product ID: {review.productId}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {review.content}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < review.rating ? "#ffc107" : "#ddd",
                              fontSize: "1.2rem",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {review.rating}/5
                      </div>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: getStatusColor(review.status),
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {review.status.toUpperCase()}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {review.status === "pending" ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => moderateReview(review.id, "approve")}
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
                            Approve
                          </button>
                          <button
                            onClick={() => setSelectedReview(review)}
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
                          {review.status === "approved"
                            ? "Approved"
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
      {selectedReview && (
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
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h3>Reject Review</h3>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              Provide a reason for rejecting this review (optional):
            </p>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
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
                  setSelectedReview(null);
                  setAdminResponse("");
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
                  moderateReview(selectedReview.id, "reject", adminResponse)
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
                Reject Review
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
