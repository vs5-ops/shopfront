"use client";

import { useState, useEffect } from "react";
import {
  PLACEHOLDERS,
  Placeholder,
  PriorityLevel,
  PlaceholderCategory,
  getPlaceholdersByPriority,
  getStatusSummary,
  estimateTimeToLaunch,
  getBlockingItems,
} from "./config";

interface FilterState {
  category?: PlaceholderCategory;
  priority?: PriorityLevel;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "TESTING" | "COMPLETED";
}

export default function PlaceholdersPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [filteredPlaceholders, setFilteredPlaceholders] =
    useState<Placeholder[]>(PLACEHOLDERS);

  const summary = getStatusSummary();
  const estimatedDays = estimateTimeToLaunch();
  const blockingItems = getBlockingItems();

  useEffect(() => {
    let result = PLACEHOLDERS;

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.priority) {
      result = result.filter((p) => p.priority === filters.priority);
    }
    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    setFilteredPlaceholders(result);
  }, [filters]);

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case "CRITICAL":
        return "#d32f2f";
      case "HIGH":
        return "#ff9800";
      case "MEDIUM":
        return "#fbc02d";
      case "LOW":
        return "#4caf50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "#9e9e9e";
      case "IN_PROGRESS":
        return "#2196f3";
      case "TESTING":
        return "#9c27b0";
      case "COMPLETED":
        return "#4caf50";
    }
  };

  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <h1>Placeholder Management Dashboard</h1>
      <p style={{ fontSize: "0.95rem", color: "#666" }}>
        Track migration from mock data to real ecommerce features
      </p>

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
            style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2196f3" }}
          >
            {summary.overallProgress}%
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Overall Progress
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1.5rem",
          }}
        >
          <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            <strong>Status Breakdown</strong>
          </div>
          <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
            <div>
              🔴 Critical Remaining:{" "}
              <strong>{summary.criticalRemaining}</strong>
            </div>
            <div>
              ⏳ In Progress: <strong>{summary.inProgress}</strong>
            </div>
            <div>
              ✅ Completed: <strong>{summary.completed}</strong>
            </div>
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
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}
          >
            {estimatedDays}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Est. Days to Launch
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
            style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#d32f2f" }}
          >
            {summary.total}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Total Placeholders
          </div>
        </div>
      </div>

      {blockingItems.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <strong>⚠️ Blocking Items (Others depend on these):</strong>
          <ul
            style={{
              marginLeft: "1.5rem",
              marginTop: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            {blockingItems.map((item) => (
              <li key={item.id}>
                {item.id}: {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "0.85rem",
              color: "#666",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Category
          </label>
          <select
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            value={filters.category || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                category: (e.target.value as PlaceholderCategory) || undefined,
              })
            }
          >
            <option value="">All Categories</option>
            <option value="IMAGES">Images</option>
            <option value="REVIEWS">Reviews</option>
            <option value="INVENTORY">Inventory</option>
            <option value="PRICING">Pricing</option>
            <option value="SELLERS">Sellers</option>
            <option value="LOGISTICS">Logistics</option>
            <option value="DESCRIPTIONS">Descriptions</option>
          </select>
        </div>

        <div>
          <label
            style={{
              fontSize: "0.85rem",
              color: "#666",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Priority
          </label>
          <select
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            value={filters.priority || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                priority: (e.target.value as PriorityLevel) || undefined,
              })
            }
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label
            style={{
              fontSize: "0.85rem",
              color: "#666",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Status
          </label>
          <select
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            value={filters.status || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: (e.target.value as any) || undefined,
              })
            }
          >
            <option value="">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="TESTING">Testing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={() => setFilters({})}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Placeholders List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filteredPlaceholders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            No placeholders match your filters
          </div>
        ) : (
          filteredPlaceholders.map((placeholder) => (
            <div
              key={placeholder.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                backgroundColor: "#fafafa",
                borderLeft: `4px solid ${getPriorityColor(placeholder.priority)}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      {placeholder.id}: {placeholder.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: getPriorityColor(placeholder.priority),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {placeholder.priority}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: getStatusColor(placeholder.status),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {placeholder.status}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "0.5rem 0",
                      fontSize: "0.95rem",
                      color: "#333",
                    }}
                  >
                    {placeholder.description}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                      marginTop: "1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div>
                      <strong>Current:</strong>
                      <div style={{ color: "#999", marginTop: "0.25rem" }}>
                        {placeholder.currentImplementation}
                      </div>
                    </div>
                    <div>
                      <strong>Target:</strong>
                      <div style={{ color: "#999", marginTop: "0.25rem" }}>
                        {placeholder.targetImplementation}
                      </div>
                    </div>
                    <div>
                      <strong>Data Source:</strong>
                      <div style={{ color: "#999", marginTop: "0.25rem" }}>
                        {placeholder.firebaseCollection ||
                          placeholder.dataSource}
                      </div>
                    </div>
                  </div>

                  {placeholder.dependsOn.length > 0 && (
                    <div style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
                      <strong>Depends on:</strong>{" "}
                      {placeholder.dependsOn.join(", ")}
                    </div>
                  )}

                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}
                    >
                      Progress: {placeholder.completionPercentage}%
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${placeholder.completionPercentage}%`,
                          backgroundColor: "#2196f3",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    minWidth: "120px",
                    padding: "1rem",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#2196f3",
                    }}
                  >
                    {placeholder.estimatedCompletionDays}
                  </div>
                  <div style={{ color: "#666" }}>Est. Days</div>
                  <button
                    style={{
                      width: "100%",
                      marginTop: "0.75rem",
                      padding: "0.5rem",
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
