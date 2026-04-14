import Link from "next/link";

const helpLinks = [
  { href: "/faq", label: "Payments" },
  { href: "/shipping", label: "Shipping" },
  { href: "/refund", label: "Cancellation and Returns" },
  { href: "/contact", label: "Support" }
];

const policyLinks = [
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/seller-registration", label: "Become a Seller" },
  { href: "/about", label: "Corporate Information" }
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-grid">
          <div>
            <h4>ABOUT</h4>
            <div className="footer-link-stack">
              <Link href="/about">About Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/seller-dashboard">Seller Dashboard</Link>
            </div>
          </div>

          <div>
            <h4>HELP</h4>
            <div className="footer-link-stack">
              {helpLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>POLICIES</h4>
            <div className="footer-link-stack">
              {policyLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>REGISTERED OFFICE</h4>
            <p>
              AZCO VENTURES PRIVATE LIMITED
              <br />
              N Block, Okhla, New Delhi - 110025
              <br />
              CIN: U47912BR2024PTC067245
            </p>
            <p>
              Email: <a href="mailto:info@azcoglobal.com">info@azcoglobal.com</a>
              <br />
              Phone: <a href="tel:+915223134284">+91 52231 34284</a>
            </p>
          </div>
        </div>

        <div className="footer-feature-row" aria-label="Trust features">
          <span>Secure Payments</span>
          <span>Fast Delivery</span>
          <span>Easy Returns</span>
          <span>24x7 Customer Support</span>
        </div>

        <div className="footer-bottom">
          <p>Copyright {year} Shopfront Marketplace. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
