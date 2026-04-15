import { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToCartButton from "@/app/_components/AddToCartButton";
import { CATALOG, getProductBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATALOG.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const product = getProductBySlug(resolved.slug);
  
  if (!product) {
    return {
      title: "Product Not Found | AZCO Global",
      description: "The product you're looking for is not available."
    };
  }

  const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));

  return {
    title: `${product.title} | Buy Online at AZCO Global`,
    description: `Buy ${product.title} from ${product.brand} at Rs ${product.price.toLocaleString("en-IN")} on AZCO Global. ${discount}% discount. Rating: ${product.rating}⭐ with ${product.reviews.toLocaleString("en-IN")} reviews.`,
    keywords: `${product.title}, ${product.brand}, ${product.category}, buy online, best price`,
    openGraph: {
      title: `${product.title} - AZCO Global`,
      description: `Buy at Rs ${product.price.toLocaleString("en-IN")} with ${discount}% discount`,
      type: "website",
      images: [
        {
          url: product.image,
          width: 500,
          height: 500,
          alt: product.title
        }
      ]
    },
    alternates: {
      canonical: `https://www.azcoglobal.com/products/${product.slug}`
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const product = getProductBySlug(resolved.slug);
  if (!product) {
    notFound();
  }

  const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));

  return (
    <main className="container">
      {/* Product Header */}
      <div className="product-detail card">
        <img src={product.image} alt={product.title} className="detail-image" />
        
        {/* Right Side - Key Info Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>
          <div>
            <p className="product-brand">{product.brand}</p>
            <h1>{product.title}</h1>
            <p className="rating-line">
              ⭐ {product.rating} ({product.reviews.toLocaleString("en-IN")} verified reviews)
            </p>
          </div>

          {/* Price Section */}
          <div style={{ borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
            <div className="price-row detail-price">
              <strong style={{ fontSize: "1.5rem" }}>Rs {product.price.toLocaleString("en-IN")}</strong>
              <span style={{ textDecoration: "line-through", color: "#666" }}>Rs {product.mrp.toLocaleString("en-IN")}</span>
              <span style={{ color: "#d32f2f", fontWeight: "bold" }}>{discount}% off</span>
            </div>
            <p className="delivery-text">✓ {product.delivery}</p>
          </div>

          {/* Stock Status */}
          <div style={{ color: product.stock > 0 ? "#188038" : "#d32f2f", fontWeight: "bold" }}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </div>

          {/* Warranty & Return Policy */}
          {(product.warranty || product.returnPolicy) && (
            <div style={{ fontSize: "0.9rem", color: "#555", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
              {product.warranty && <p>✓ {product.warranty}</p>}
              {product.returnPolicy && <p>✓ {product.returnPolicy}</p>}
            </div>
          )}

          {/* Key Highlights */}
          <div>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Key features</h3>
            <ul className="highlight-list">
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Seller Info */}
          {product.seller && (
            <p style={{ fontSize: "0.85rem", color: "#0066c0" }}>
              Sold by: <strong>{product.seller}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Product Description Section */}
      {product.description && (
        <section style={{ marginTop: "2rem" }} className="card">
          <h2>About this product</h2>
          <p style={{ lineHeight: "1.6", color: "#333" }}>{product.description}</p>
        </section>
      )}

      {/* Technical Specifications Section */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section style={{ marginTop: "2rem" }} className="card">
          <h2>Technical Specifications</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "600", width: "35%", backgroundColor: "#f5f5f5" }}>
                    {key}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#333" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Additional Information Section */}
      {(product.materials || product.dimensions || product.weight) && (
        <section style={{ marginTop: "2rem" }} className="card">
          <h2>Additional Information</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {product.materials && (
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "600", width: "35%", backgroundColor: "#f5f5f5" }}>
                    Materials
                  </td>
                  <td style={{ padding: "0.75rem" }}>{product.materials}</td>
                </tr>
              )}
              {product.dimensions && (
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "600", backgroundColor: "#f5f5f5" }}>
                    Dimensions
                  </td>
                  <td style={{ padding: "0.75rem" }}>{product.dimensions}</td>
                </tr>
              )}
              {product.weight && (
                <tr>
                  <td style={{ padding: "0.75rem", fontWeight: "600", backgroundColor: "#f5f5f5" }}>
                    Weight
                  </td>
                  <td style={{ padding: "0.75rem" }}>{product.weight}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section style={{ marginTop: "2rem" }} className="card">
        <h2>Customer Feedback</h2>
        <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          <span style={{ color: "#d32f2f" }}>⭐ {product.rating}</span>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>Based on {product.reviews.toLocaleString("en-IN")} verified reviews</p>
        </div>
        <button style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#ff9900",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: "600"
        }}>
          Share your feedback
        </button>
      </section>
    </main>
  );
}
