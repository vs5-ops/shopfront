"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AddToCartButton from "@/app/_components/AddToCartButton";
import { CATALOG, CATEGORY_LABELS, type CatalogProduct } from "@/lib/catalog";

type SortType = "popular" | "price_low" | "price_high" | "rating";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortType>("popular");

  const products = useMemo(() => {
    let list = CATALOG.filter((item) => {
      const text = `${item.title} ${item.brand}`.toLowerCase();
      const searchOk = text.includes(query.toLowerCase());
      const categoryOk = category === "all" ? true : item.category === category;
      return searchOk && categoryOk;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price_low") return a.price - b.price;
      if (sort === "price_high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

    return list;
  }, [query, category, sort]);

  return (
    <main className="container">
      <div className="section-head">
        <h1>All Products</h1>
        <p>{products.length} items</p>
      </div>

      <div className="toolbar card">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands..."
          className="input"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortType)} className="input">
          <option value="popular">Most Popular</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="product-grid" style={{ marginTop: 16 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="product-card">
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
        </div>
        <p className="delivery-text">{product.delivery}</p>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
