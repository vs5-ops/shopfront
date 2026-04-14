export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: "electronics" | "fashion" | "home" | "sports" | "books";
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  delivery: string;
  highlights: string[];
};

export const CATALOG: CatalogProduct[] = [
  {
    id: "p1",
    slug: "nova-soundcore-pro-buds",
    title: "Nova SoundCore Pro Earbuds with ANC",
    brand: "Nova",
    category: "electronics",
    price: 2999,
    mrp: 4999,
    rating: 4.4,
    reviews: 3241,
    stock: 94,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery by tomorrow",
    highlights: ["42h battery", "Active noise cancellation", "Dual device pairing"]
  },
  {
    id: "p2",
    slug: "helios-fastcharge-67w-adapter",
    title: "Helios TurboCharge 67W USB-C Adapter",
    brand: "Helios",
    category: "electronics",
    price: 1499,
    mrp: 2299,
    rating: 4.3,
    reviews: 1187,
    stock: 212,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery in 2 days",
    highlights: ["PPS + PD support", "Compact GaN design", "Overheat protection"]
  },
  {
    id: "p3",
    slug: "maverick-run-lite-shoes",
    title: "Maverick Run Lite Men's Running Shoes",
    brand: "Maverick",
    category: "fashion",
    price: 2199,
    mrp: 3999,
    rating: 4.1,
    reviews: 901,
    stock: 160,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery by tomorrow",
    highlights: ["Breathable mesh", "Lightweight sole", "Road + gym ready"]
  },
  {
    id: "p4",
    slug: "aurora-cotton-oversized-tee",
    title: "Aurora Cotton Oversized Graphic T-Shirt",
    brand: "Aurora",
    category: "fashion",
    price: 799,
    mrp: 1499,
    rating: 4.2,
    reviews: 703,
    stock: 341,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery in 2 days",
    highlights: ["240 GSM cotton", "Relaxed fit", "Fade resistant print"]
  },
  {
    id: "p5",
    slug: "zenbrew-french-press-steel",
    title: "ZenBrew Stainless Steel French Press 1L",
    brand: "ZenBrew",
    category: "home",
    price: 1799,
    mrp: 2899,
    rating: 4.5,
    reviews: 542,
    stock: 69,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery by tomorrow",
    highlights: ["Double wall insulation", "Rust resistant", "Fine mesh filter"]
  },
  {
    id: "p6",
    slug: "habitat-linen-bedset-queen",
    title: "Habitat Pure Linen Bed Sheet Set Queen",
    brand: "Habitat",
    category: "home",
    price: 2699,
    mrp: 4299,
    rating: 4.0,
    reviews: 318,
    stock: 47,
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery in 3 days",
    highlights: ["Soft-washed linen", "2 pillow covers", "All-season comfort"]
  },
  {
    id: "p7",
    slug: "stormgrip-yoga-mat-pro",
    title: "StormGrip Pro Yoga Mat 6mm",
    brand: "StormGrip",
    category: "sports",
    price: 999,
    mrp: 1799,
    rating: 4.3,
    reviews: 774,
    stock: 188,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery by tomorrow",
    highlights: ["Anti-slip texture", "Sweat resistant", "Carry strap included"]
  },
  {
    id: "p8",
    slug: "blaze-cricket-kit-beginner",
    title: "Blaze Beginner Cricket Kit Combo",
    brand: "Blaze",
    category: "sports",
    price: 3499,
    mrp: 5499,
    rating: 4.1,
    reviews: 286,
    stock: 36,
    image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery in 4 days",
    highlights: ["Bat + pads + gloves", "Lightweight guard", "School tournament ready"]
  },
  {
    id: "p9",
    slug: "deepwork-atomic-habits-hardcover",
    title: "Atomic Habits Hardcover Edition",
    brand: "Penguin",
    category: "books",
    price: 499,
    mrp: 899,
    rating: 4.8,
    reviews: 9321,
    stock: 440,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery by tomorrow",
    highlights: ["Bestseller", "Premium paper", "Author interview bonus chapter"]
  },
  {
    id: "p10",
    slug: "clean-code-illustrated",
    title: "Clean Code Illustrated Developer Edition",
    brand: "Prentice",
    category: "books",
    price: 799,
    mrp: 1299,
    rating: 4.7,
    reviews: 1643,
    stock: 122,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
    delivery: "Free delivery in 2 days",
    highlights: ["Case-study format", "Refactoring patterns", "Interview prep notes"]
  }
];

export const CATEGORY_LABELS: Record<CatalogProduct["category"], string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  home: "Home & Living",
  sports: "Sports",
  books: "Books"
};

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG.find((item) => item.slug === slug);
}
