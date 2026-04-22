"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";

interface ReviewSubmitForm {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewSubmitForm({
  productId,
  onSuccess,
}: ReviewSubmitForm) {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <p>Please log in to submit a review</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("/api/products/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          title,
          content,
          images: [],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setTitle("");
      setContent("");
      setRating(5);
      onSuccess?.();

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        borderTop: "1px solid #ddd",
        marginTop: "2rem",
      }}
    >
      <h3>Share Your Experience</h3>

      {success && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#c8e6c9",
            color: "#2e7d32",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          ✓ Review submitted successfully!
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#ffcdd2",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Rating
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: star <= rating ? "#fbc02d" : "#ccc",
                  transition: "color 0.2s",
                }}
              >
                ★
              </button>
            ))}
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
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of your review"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
            required
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
            Detailed Review
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={5}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
            required
          />
          <small style={{ color: "#999" }}>
            {content.length} characters. Minimum 10 characters required.
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || title.length < 3 || content.length < 10}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor:
              loading || title.length < 3 || content.length < 10
                ? "#ccc"
                : "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              loading || title.length < 3 || content.length < 10
                ? "not-allowed"
                : "pointer",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
