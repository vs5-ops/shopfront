export default function AboutPage() {
  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}
    >
      <h1>About Shopfront Marketplace</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Our Mission</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#333" }}>
          To revolutionize online shopping in India by connecting buyers with
          trusted sellers, offering a curated selection of quality products, and
          delivering exceptional service at every step of the journey.
        </p>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Who We Are</h2>
        <p>
          Shopfront Marketplace is a modern e-commerce platform that brings
          together buyers, sellers, and brands on a single unified marketplace.
          We've built a transparent, customer-first platform where quality and
          trust are paramount.
        </p>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Why Choose Shopfront?</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginTop: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ color: "#2196f3" }}>🚚 Fast Delivery</h3>
            <p>
              We deliver to every corner of India with 1-7 day delivery windows
              depending on your location.
            </p>
          </div>
          <div>
            <h3 style={{ color: "#4caf50" }}>🔒 Secure Payments</h3>
            <p>
              All payments are processed through secure, PCI-compliant gateways.
              Your data is always safe.
            </p>
          </div>
          <div>
            <h3 style={{ color: "#ff9800" }}>✓ Verified Sellers</h3>
            <p>
              Every seller is verified and rated. Shop with confidence knowing
              you're dealing with trusted merchants.
            </p>
          </div>
          <div>
            <h3 style={{ color: "#e91e63" }}>💯 Quality Assured</h3>
            <p>
              We ensure every product meets quality standards and offer easy
              returns if you're not satisfied.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Our Promise</h2>
        <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
          <li>Transparent pricing with no hidden charges</li>
          <li>Easy returns and hassle-free refunds</li>
          <li>24/7 customer support</li>
          <li>Curated product selection</li>
          <li>Fair policies for both buyers and sellers</li>
          <li>Continuous innovation and improvement</li>
        </ul>
      </section>

      <section
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #ddd",
        }}
      >
        <h2>Contact Information</h2>
        <p>
          AZCO Ventures Private Limited
          <br />
          N Block, Okhla
          <br />
          New Delhi - 110025
          <br />
          <br />
          Email:{" "}
          <a href="mailto:info@azcoglobal.com" style={{ color: "#0066c0" }}>
            info@azcoglobal.com
          </a>
          <br />
          Phone:{" "}
          <a href="tel:+915223134284" style={{ color: "#0066c0" }}>
            +91 52231 34284
          </a>
        </p>
      </section>
    </main>
  );
}
