export default function CareersPage() {
  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}
    >
      <h1>Careers at Shopfront</h1>

      <section style={{ marginTop: "2rem" }}>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Join our team and help us revolutionize e-commerce in India. We're
          looking for talented, passionate individuals to help us build the
          future of online shopping.
        </p>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Current Openings</h2>
        <p style={{ color: "#999", marginTop: "1rem" }}>
          We're currently not hiring, but we're always looking for great talent.
          Please check back soon or send your resume to{" "}
          <a href="mailto:careers@azcoglobal.com" style={{ color: "#0066c0" }}>
            careers@azcoglobal.com
          </a>
        </p>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Why Work With Us?</h2>
        <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
          <li>Be part of a fast-growing startup</li>
          <li>Work on challenging problems that impact millions</li>
          <li>Competitive compensation and benefits</li>
          <li>Learning and development opportunities</li>
          <li>Flexible work arrangements</li>
          <li>Inclusive and diverse work environment</li>
        </ul>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Our Values</h2>
        <div style={{ marginTop: "1rem" }}>
          <h3>Customer First</h3>
          <p>Everything we do is driven by what's best for our customers.</p>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Integrity</h3>
          <p>We operate with honesty and transparency in everything.</p>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Innovation</h3>
          <p>We constantly seek better ways to serve our customers.</p>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Teamwork</h3>
          <p>We believe in the power of collaboration and mutual support.</p>
        </div>
      </section>
    </main>
  );
}
