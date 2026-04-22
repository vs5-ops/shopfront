"use client";

import { useState, useEffect } from "react";
import { FirestoreReview } from "@/lib/firestore-models";

interface ReviewsDisplayProps {
  productId: string;
  onReviewCountChange?: (count: number) => void;
}

export default function ProductReviews({ productId, onReviewCountChange }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<FirestoreReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const REVIEWS_PER_PAGE = 5;

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating, offset]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        productId,
        limit: REVIEWS_PER_PAGE.toString(),
        offset: offset.toString(),
        sortBy,
        ...(filterRating && { filterRating: filterRating.toString() }),
      });

      const response = await fetch(`/api/products/reviews?${params}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setTotalReviews(data.pagination.total);
      onReviewCountChange?.(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#4caf50";
    if (rating >= 3) return "#fbc02d";
    return "#f44336";
  };

  const calculateRatingDistribution = () => {
    const distribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading && reviews.length === 0) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading reviews...</div>;
  }

  const distribution = calculateRatingDistribution();

  return (
    <div style={{ padding: "2rem", borderTop: "1px solid #ddd" }}>
      <h2>Customer Reviews</h2>
      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        {totalReviews} verified customer reviews
      </p>

      {/* Summary Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          gap: "2rem",
          marginBottom: "2rem",
          padding: "1.5rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            {totalReviews > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1)).toFixed(1)
              : "0.0"}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>out of 5</div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#999" }}>
            {distribution["5"] + distribution["4"]} helpful
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars as keyof typeof distribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ minWidth: "30px" }}>{stars} ★</span>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      backgroundColor: getRatingColor(stars),
                    }}
                  />
                </div>
                <span style={{ minWidth: "40px", textAlign: "right" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Sorting */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <label style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "recent" | "helpful" | "rating");
              setOffset(0);
            }}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>
            Filter by rating
          </label>
          <select
            value={filterRating || ""}
            onChange={(e) => {
              setFilterRating(e.target.value ? parseInt(e.target.value) : null);
              setOffset(0);
            }}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1 star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
          No reviews found with current filters
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                backgroundColor: "#fafafa",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    {review.userAvatar && (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 500 }}>{review.userName}</div>
                      {review.verified && (
                        <div style={{ fontSize: "0.8rem", color: "#4caf50" }}>✓ Verified Purchase</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", color: "#fbc02d" }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{review.title}</span>
                  </div>

                  <p style={{ margin: "0.5rem 0", color: "#333" }}>{review.content}</p>

                  {review.images && review.images.length > 0 && (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx}`}
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#999" }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {review.adminResponse && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      borderLeft: "3px solid #2196f3",
                    }}
                  >
                    <strong>Seller Response:</strong>
                    <p style={{ margin: "0.5rem 0 0" }}>{review.adminResponse}</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  👍 Helpful ({review.helpful})
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  👎 Not Helpful ({review.unhelpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalReviews > REVIEWS_PER_PAGE && (
        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - REVIEWS_PER_PAGE))}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background Color: "white",
              cursor: offset === 0 ? "not-allowed" : "pointer",
              opacity: offset === 0 ? 0.5 : 1,
            }}
          >
            Previous
          </button>
          <span style={{ alignSelf: "center", fontSize: "0.9rem" }}>
            {offset / REVIEWS_PER_PAGE + 1} of {Math.ceil(totalReviews / REVIEWS_PER_PAGE)}
          </span>
          <button
            disabled={offset + REVIEWS_PER_PAGE >= totalReviews}
            onClick={() => setOffset(offset + REVIEWS_PER_PAGE)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
              cursor: offset + REVIEWS_PER_PAGE >= totalReviews ? "not-allowed" : "pointer",
              opacity: offset + REVIEWS_PER_PAGE >= totalReviews ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
