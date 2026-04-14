"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await login(email, password);
      router.replace(redirectTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    setMessage("");
    try {
      const result = await forgotPassword(email);
      setResetUrl(result.resetUrl || "");
      setMessage("Reset link generated. Open it to set a new password.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to request password reset");
    }
  }

  return (
    <main className="container">
      <section className="hero" style={{ alignItems: "start" }}>
        <article className="card">
          <h1 style={{ marginTop: 0 }}>Login</h1>
          <p className="delivery-text">Access your orders, saved cart, and account settings.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ margin: "12px 0" }}>
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={{ gridColumn: "1 / -1" }}
              />
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                style={{ gridColumn: "1 / -1" }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </button>
              <button className="btn" type="button" onClick={handleForgotPassword}>
                Forgot Password
              </button>
              <Link className="btn" href="/register">
                Create Account
              </Link>
            </div>
          </form>

          {resetUrl ? (
            <p className="delivery-text" style={{ marginTop: 10 }}>
              Reset link: <a href={resetUrl} style={{ textDecoration: "underline" }}>Open reset page</a>
            </p>
          ) : null}
          {message ? <p style={{ marginTop: 10 }}>{message}</p> : null}
        </article>

        <aside className="card hero-metrics">
          <h3 style={{ marginTop: 0 }}>Why login?</h3>
          <ul>
            <li>Track orders and delivery status</li>
            <li>Manage returns and invoices faster</li>
            <li>Get personalized deals and alerts</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container"><p>Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
