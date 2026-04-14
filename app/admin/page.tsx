"use client";

import { useEffect, useState } from "react";
import { CATALOG } from "@/lib/catalog";
import { useAuth } from "@/app/_components/AuthContext";

type ManagedUser = {
  id: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export default function AdminPage() {
  const { user, loading, refreshSession } = useAuth();
  const totalProducts = CATALOG.length;
  const lowStock = CATALOG.filter((p) => p.stock < 50).length;
  const inventoryValue = CATALOG.reduce((sum, p) => sum + p.price * p.stock, 0);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [message, setMessage] = useState("Loading...");
  const [savingFor, setSavingFor] = useState("");

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    async function loadUsers() {
      if (loading) {
        return;
      }

      if (!user || user.role !== "admin") {
        setUsers([]);
        setMessage("Admin access required. Login with an admin account.");
        return;
      }

      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load users");
        }
        setUsers(data.users || []);
        setMessage((data.users || []).length ? "" : "No users found.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to load users");
      }
    }

    loadUsers();
  }, [loading, user]);

  async function changeRole(targetEmail: string, role: "admin" | "user") {
    setSavingFor(targetEmail);
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, role })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Role update failed");
      }

      setUsers((current) =>
        current.map((entry) => (entry.email === targetEmail ? { ...entry, role: data.user.role, updatedAt: data.user.updatedAt } : entry))
      );
      setMessage(`Updated ${targetEmail} to ${role}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Role update failed");
    } finally {
      setSavingFor("");
    }
  }

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <p className="delivery-text" style={{ marginBottom: 12 }}>
        {loading ? "Checking session..." : user ? `Logged in as ${user.email} (${user.role})` : "Not logged in"}
      </p>

      {message ? <section className="card">{message}</section> : null}

      {user?.role === "admin" ? (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>User Management</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.email}</td>
                    <td>{entry.role}</td>
                    <td>{new Date(entry.createdAt).toLocaleString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          className="btn"
                          type="button"
                          disabled={savingFor === entry.email || entry.role === "user"}
                          onClick={() => changeRole(entry.email, "user")}
                        >
                          Set User
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled={savingFor === entry.email || entry.role === "admin"}
                          onClick={() => changeRole(entry.email, "admin")}
                        >
                          Set Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <div className="stats-grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Total Products</h3>
          <p className="big-number">{totalProducts}</p>
        </div>
        <div className="card">
          <h3>Low Stock SKUs</h3>
          <p className="big-number">{lowStock}</p>
        </div>
        <div className="card">
          <h3>Inventory Value</h3>
          <p className="big-number">Rs {inventoryValue.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </main>
  );
}
