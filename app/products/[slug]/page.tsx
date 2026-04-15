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
