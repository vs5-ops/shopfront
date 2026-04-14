"use client";

import { FormEvent, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const initialToken = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await resetPassword(email, token, newPassword);
      setMessage("Password reset successful. You can login from the header now.");
      setNewPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1>Reset Password</h1>
        <p className="delivery-text" style={{ marginBottom: 12 }}>
          Use your reset link or manually enter the reset token.
        </p>
        <form onSubmit={onSubmit}>
          <div className="form-grid" style={{ margin: 0 }}>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="input"
              type="text"
              placeholder="Reset token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="New password (min 8 chars)"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
              style={{ gridColumn: "1 / -1" }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container"><p>Loading...</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
