export default function ContactPage() {
  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}
    >
      <h1>Contact Us</h1>

      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        <section>
          <h2 style={{ fontSize: "1.2rem" }}>Get in Touch</h2>

          <form
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Message
              </label>
              <textarea
                placeholder="Your message..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Send Message
            </button>
          </form>
        </section>

        <section>
          <h2 style={{ fontSize: "1.2rem" }}>Contact Information</h2>

          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Email</h3>
            <a
              href="mailto:support@azcoglobal.com"
              style={{ color: "#0066c0", textDecoration: "none" }}
            >
              support@azcoglobal.com
            </a>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Phone</h3>
            <a
              href="tel:+915223134284"
              style={{ color: "#0066c0", textDecoration: "none" }}
            >
              +91 52231 34284
            </a>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              Address
            </h3>
            <p style={{ margin: "0", color: "#666" }}>
              AZCO Ventures Private Limited
              <br />
              N Block, Okhla
              <br />
              New Delhi - 110025
              <br />
              India
            </p>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              Business Hours
            </h3>
            <p style={{ margin: "0", color: "#666" }}>
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday - Sunday: 10:00 AM - 4:00 PM
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
