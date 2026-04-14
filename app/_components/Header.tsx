"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/app/_components/CartContext";
import { useAuth } from "@/app/_components/AuthContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/notifications", label: "Alerts" },
  { href: "/orders", label: "Orders" },
  { href: "/admin", label: "Admin" }
];

const quickLinks = [
  { href: "/seller-dashboard", label: "Seller Hub" },
  { href: "/shipping", label: "Shipping" },
  { href: "/faq", label: "Help" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";
  const visibleNavItems = useMemo(() => (isAdmin ? navItems : navItems.filter((item) => item.href !== "/admin")), [isAdmin]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
  }

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="topbar">
      <div className="topbar-strip">
        <div className="container topbar-strip-inner">
          <p>Fast delivery across India | Trusted checkout | Seller marketplace</p>
          <div className="strip-links" aria-label="Quick links">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container topbar-inner">
        <Link href="/" className="logo-mark" aria-label="Go to homepage">
          <span>SHOPFRONT</span>
          <small>Marketplace</small>
        </Link>

        <form className="header-search" onSubmit={handleSearch} role="search" aria-label="Search products">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for products, brands and categories"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <nav className="main-nav" aria-label="Main">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link nav-link-active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <details className="account-menu">
              <summary className="btn">Account</summary>
              <div className="account-dropdown" role="menu" aria-label="Account menu">
                {isAdmin ? <p className="account-admin-line">Admin: {user.email}</p> : null}
                <Link href="/orders" className="account-menu-link" role="menuitem">
                  Orders
                </Link>
                <Link href="/cart" className="account-menu-link" role="menuitem">
                  Cart
                </Link>
                <button className="account-menu-link account-menu-button" type="button" onClick={handleLogout} role="menuitem">
                  Logout
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link className="btn" href="/login">
                Login
              </Link>
              <Link className="btn btn-primary" href="/register">
                Register
              </Link>
            </>
          )}
          <Link href="/cart" className="cart-pill" aria-label="Open cart">
            Cart
            <span>{itemCount}</span>
          </Link>
        </div>
      </div>

      <div className="mobile-nav-wrap">
        <div className="container mobile-nav" aria-label="Mobile primary navigation">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "mobile-nav-link mobile-nav-link-active" : "mobile-nav-link"}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/cart" className="mobile-nav-link" aria-label="Cart">
            Cart ({itemCount})
          </Link>
        </div>
      </div>
    </header>
  );
}
