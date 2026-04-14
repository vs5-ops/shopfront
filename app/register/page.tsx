"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      router.replace(redirectTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <section className="hero" style={{ alignItems: "start" }}>
        <article className="card">
          <h1 style={{ marginTop: 0 }}>Create Account</h1>
          <p className="delivery-text">Join Shopfront for faster checkout and better order tracking.</p>

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
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                style={{ gridColumn: "1 / -1" }}
              />
              <input
                className="input"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
                style={{ gridColumn: "1 / -1" }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Creating account..." : "Create Account"}
              </button>
              <Link className="btn" href="/login">
                Already have an account?
              </Link>
            </div>
          </form>

          {message ? <p style={{ marginTop: 10 }}>{message}</p> : null}
        </article>

        <aside className="card hero-metrics">
          <h3 style={{ marginTop: 0 }}>Member Benefits</h3>
          <ul>
            <li>Order timeline and shipping updates</li>
            <li>Faster reorders from account history</li>
            <li>Early access to mega sale drops</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container"><p>Loading...</p></div>}>
      <RegisterContent />
    </Suspense>
  );
}
