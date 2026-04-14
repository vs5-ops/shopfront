"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";

export type CartLine = {
  id: string;
  slug: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  stock: number;
};

type CartContextType = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (product: CatalogProduct, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "shopfront_next_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setLines(parsed);
        }
      }
    } catch {
      setLines([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextType>(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

    function addItem(product: CatalogProduct, quantity = 1) {
      setLines((prev) => {
        const found = prev.find((line) => line.id === product.id);
        if (found) {
          return prev.map((line) =>
            line.id === product.id
              ? { ...line, quantity: Math.min(line.stock, line.quantity + quantity) }
              : line
          );
        }

        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            title: product.title,
            image: product.image,
            unitPrice: product.price,
            quantity: Math.min(product.stock, quantity),
            stock: product.stock
          }
        ];
      });
    }

    function setQuantity(id: string, quantity: number) {
      setLines((prev) =>
        prev
          .map((line) =>
            line.id === id
              ? { ...line, quantity: Math.max(1, Math.min(line.stock, quantity)) }
              : line
          )
          .filter((line) => line.quantity > 0)
      );
    }

    function removeItem(id: string) {
      setLines((prev) => prev.filter((line) => line.id !== id));
    }

    function clearCart() {
      setLines([]);
    }

    return { lines, itemCount, subtotal, addItem, setQuantity, removeItem, clearCart };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
