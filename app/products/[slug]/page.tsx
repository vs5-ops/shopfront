import { notFound } from "next/navigation";
import AddToCartButton from "@/app/_components/AddToCartButton";
import { CATALOG, getProductBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATALOG.map((item) => ({ slug: item.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const product = getProductBySlug(resolved.slug);
  if (!product) {
    notFound();
  }

  return (
    <main className="container">
      <div className="product-detail card">
        <img src={product.image} alt={product.title} className="detail-image" />
        <div>
          <p className="product-brand">{product.brand}</p>
          <h1>{product.title}</h1>
          <p className="rating-line">
            {product.rating} rating • {product.reviews.toLocaleString("en-IN")} reviews
          </p>
          <div className="price-row detail-price">
            <strong>Rs {product.price.toLocaleString("en-IN")}</strong>
            <span>Rs {product.mrp.toLocaleString("en-IN")}</span>
          </div>
          <p className="delivery-text">{product.delivery}</p>

          <ul className="highlight-list">
            {product.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
