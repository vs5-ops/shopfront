const updates = [
  {
    id: "n1",
    title: "Price Drop Alert",
    description: "3 items in your wishlist dropped by up to 22% today.",
    time: "2h ago"
  },
  {
    id: "n2",
    title: "Delivery Update",
    description: "Your last order has moved to out-for-delivery.",
    time: "5h ago"
  },
  {
    id: "n3",
    title: "Seller Offer",
    description: "Top electronics seller unlocked extra card cashback.",
    time: "Yesterday"
  }
];

export default function NotificationsPage() {
  return (
    <main className="container">
      <h1>Notifications</h1>
      <div className="stack-list">
        {updates.map((item) => (
          <article className="card" key={item.id}>
            <div className="section-head">
              <strong>{item.title}</strong>
              <span>{item.time}</span>
            </div>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
