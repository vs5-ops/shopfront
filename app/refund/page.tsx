export default function RefundPage() {
  return (
    <main
      className="container"
      style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}
    >
      <h1>Cancellation & Returns Policy</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Return Eligibility</h2>
        <p>
          You can return products within <strong>7 days of delivery</strong> if:
        </p>
        <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
          <li>The product is unused and in original condition</li>
          <li>All original packaging and tags are intact</li>
          <li>The product has no signs of use or damage</li>
          <li>You have the invoice/receipt</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Non-Returnable Items</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Perishable items</li>
          <li>Items marked as non-returnable</li>
          <li>Products with tampered packaging</li>
          <li>Items used or damaged by the customer</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>How to Request a Return</h2>
        <ol style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
          <li>Log in to your account and go to "Orders"</li>
          <li>Click on the order you want to return</li>
          <li>Select "Return / Refund" and choose your reason</li>
          <li>Schedule a pickup from your address</li>
          <li>Our courier will collect the item at no extra cost</li>
        </ol>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Refund Process</h2>
        <p>Once we receive and verify your returned item:</p>
        <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
          <li>Refund is initiated within 2-3 business days</li>
          <li>Amount is credited to your original payment method</li>
          <li>
            It may take 5-7 business days for the amount to appear in your
            account
          </li>
          <li>For cash payments, a refund via check/transfer</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Cancellations</h2>
        <p>
          You can cancel an order <strong>before it's shipped</strong>:
        </p>
        <ol style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
          <li>Go to your Orders page</li>
          <li>Click on the order to view details</li>
          <li>If "Cancel Order" is available, click it</li>
          <li>Confirm the cancellation</li>
          <li>Your refund will be processed immediately</li>
        </ol>
      </section>
    </main>
  );
}
