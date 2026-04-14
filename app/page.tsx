import Link from "next/link";
import { CATALOG, CATEGORY_LABELS } from "@/lib/catalog";
import AddToCartButton from "@/app/_components/AddToCartButton";

function discountPercent(mrp: number, price: number) {
  return Math.max(0, Math.round(((mrp - price) / mrp) * 100));
}

export default function HomePage() {
  const featured = CATALOG.slice(0, 6);

  return (
    <main className="container">
      <section className="hero">
        <div>
          <p className="badge">Mega Savings Week</p>
          <h1>Everything You Need, Delivered Faster</h1>
          <p>
            Marketplace-grade shopping experience with smart discovery, trusted payments,
            and transparent delivery promises.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/products">
              Shop Deals
            </Link>
            <Link className="btn" href="/admin">
              Open Admin Console
            </Link>
          </div>
        </div>
        <div className="hero-metrics card">
          <h3>Why customers switch to us</h3>
          <ul>
            <li>10k+ verified ratings and reviews</li>
            <li>Same-day dispatch on top categories</li>
            <li>Secure checkout with clear order tracking</li>
          </ul>
        </div>
      </section>

      <section className="category-strip">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Link key={key} href={`/products?category=${key}`} className="category-chip">
            {label}
          </Link>
        ))}
      </section>

      <section>
        <div className="section-head">
          <h2>Trending Products</h2>
          <Link href="/products">View all</Link>
        </div>

        <div className="product-grid">
          {featured.map((product) => (
            <article key={product.id} className="product-card">
              <Link href={`/products/${product.slug}`}>
                <img src={product.image} alt={product.title} className="product-image" />
              </Link>
              <div className="product-body">
                <p className="product-brand">{product.brand}</p>
                <Link href={`/products/${product.slug}`} className="product-title">
                  {product.title}
                </Link>
                <div className="price-row">
                  <strong>Rs {product.price.toLocaleString("en-IN")}</strong>
                  <span>Rs {product.mrp.toLocaleString("en-IN")}</span>
                  <em>{discountPercent(product.mrp, product.price)}% off</em>
                </div>
                <p className="delivery-text">{product.delivery}</p>
                <AddToCartButton product={product} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
