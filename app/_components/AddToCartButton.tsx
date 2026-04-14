"use client";

import { useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { useCart } from "@/app/_components/CartContext";

export default function AddToCartButton({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [done, setDone] = useState(false);

  function handleAdd() {
    addItem(product, 1);
    setDone(true);
    window.setTimeout(() => setDone(false), 1200);
  }

  return (
    <button className="btn btn-primary" onClick={handleAdd}>
      {done ? "Added" : "Add to cart"}
    </button>
  );
}
