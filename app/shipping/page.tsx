export default function ShippingPage() {
  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}
    >
      <h1>Shipping & Delivery</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Delivery Areas</h2>
        <p>
          We currently deliver to all major cities and towns across India. Check
          your pincode during checkout to confirm delivery availability.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Delivery Timeline</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Location Type
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Delivery Time
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "1rem" }}>Metro Cities</td>
              <td style={{ padding: "1rem" }}>1-2 business days</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "1rem" }}>Tier 1 Cities</td>
              <td style={{ padding: "1rem" }}>2-3 business days</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "1rem" }}>Tier 2 Cities</td>
              <td style={{ padding: "1rem" }}>3-5 business days</td>
            </tr>
            <tr>
              <td style={{ padding: "1rem" }}>Remote Areas</td>
              <td style={{ padding: "1rem" }}>5-7 business days</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Shipping Charges</h2>
        <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
          <li>Free shipping on orders above ₹500</li>
          <li>Flat ₹40 shipping for orders below ₹500</li>
          <li>Express shipping available at checkout for faster delivery</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Track Your Order</h2>
        <p>
          Once your order is shipped, you'll receive an email with a tracking
          number. You can track your package in real-time on your account
          dashboard.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Damaged or Lost Items</h2>
        <p>
          If your item arrives damaged or doesn't arrive within the expected
          timeframe, please report it within 24 hours. We'll investigate and
          provide a replacement or refund.
        </p>
      </section>
    </main>
  );
}
