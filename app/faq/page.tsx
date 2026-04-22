export default function FAQPage() {
  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}
    >
      <h1>Frequently Asked Questions</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Payments & Refunds</h2>

        <div style={{ marginBottom: "2rem" }}>
          <h3>What payment methods do you accept?</h3>
          <p>
            We accept all major credit cards, debit cards, and digital wallets
            through Razorpay. UPI payments are also supported for faster
            transactions.
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3>Is my payment information secure?</h3>
          <p>
            Yes, all payments are processed through Razorpay, a PCI-DSS
            compliant payment gateway. Your payment information is encrypted and
            never stored on our servers.
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3>How long does it take to process a refund?</h3>
          <p>
            Refunds are typically processed within 7-10 business days after we
            receive your return. However, it may take an additional 2-3 days for
            the amount to reflect in your bank account.
          </p>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Orders & Shipping</h2>

        <div style={{ marginBottom: "2rem" }}>
          <h3>How can I track my order?</h3>
          <p>
            You can track your order in real-time from your account dashboard.
            Go to "Orders" and click on the order to view its current status and
            tracking details.
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3>Do you ship internationally?</h3>
          <p>
            Currently, we ship within India. International shipping is coming
            soon. Please check back for updates.
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3>What if my item arrives damaged?</h3>
          <p>
            If your item arrives damaged, please contact our customer support
            within 48 hours with photos. We'll arrange a replacement or refund
            immediately.
          </p>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Accounts & Profile</h2>

        <div style={{ marginBottom: "2rem" }}>
          <h3>How do I create an account?</h3>
          <p>
            Click the "Register" button in the top-right corner and fill in your
            email and password. You'll need to provide a strong password
            (minimum 8 characters).
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h3>Can I change my registered email?</h3>
          <p>
            Currently, you can't change your registered email directly. Please
            contact customer support to request an email change.
          </p>
        </div>
      </section>

      <section
        style={{
          marginTop: "3rem",
          paddingBottom: "2rem",
          borderTop: "1px solid #ddd",
        }}
      >
        <p style={{ color: "#666" }}>
          Didn't find your answer?{" "}
          <a href="/contact" style={{ color: "#0066c0" }}>
            Contact our support team
          </a>
        </p>
      </section>
    </main>
  );
}
