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
  description: string;
  specifications: Record<string, string>;
  materials?: string;
  dimensions?: string;
  weight?: string;
  warranty?: string;
  seller?: string;
  returnPolicy?: string;
  returnDays?: number;
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
    highlights: ["42h battery", "Active noise cancellation", "Dual device pairing"],
    description: "Experience premium audio with Nova SoundCore Pro Earbuds. Featuring industry-leading active noise cancellation (ANC), these wireless earbuds deliver crystal-clear sound for music, calls, and gaming. With 42 hours of total battery life (6 hours per charge + 36 hours with case), dual device pairing capability, and premium noise isolation, these earbuds are perfect for professionals and audiophiles alike. The ergonomic design ensures comfort during extended wear.",
    specifications: {
      "Driver Size": "10mm",
      "Frequency Response": "20Hz-20kHz",
      "Impedance": "32Ω",
      "Bluetooth Version": "5.3",
      "Codec": "LDAC, AAC",
      "Earpiece Battery": "6 hours",
      "Case Battery": "36 hours",
      "Charging Time": "1.5 hours",
      "Water Resistance": "IPX5"
    },
    materials: "Premium plastic with silicone ear tips",
    dimensions: "5.2 x 4.1 x 2.8 cm",
    weight: "6.2g per earbud",
    warranty: "2 years manufacturer warranty",
    seller: "Nova Electronics",
    returnPolicy: "30-day money-back guarantee",
    returnDays: 30
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
    highlights: ["PPS + PD support", "Compact GaN design", "Overheat protection"],
    description: "The Helios TurboCharge 67W USB-C adapter features cutting-edge GaN (Gallium Nitride) technology for fast, efficient charging. With dual port support (USB-C + USB-A), it can charge multiple devices simultaneously. Perfect for laptops, tablets, smartphones, and gaming devices. The compact design makes it travel-friendly while delivering up to 67W of power through USB-C.",
    specifications: {
      "Total Power": "67W",
      "USB-C Output": "65W (max)",
      "USB-A Output": "18W (max)",
      "Input Voltage": "100-240V AC",
      "Technology": "GaN (Gallium Nitride)",
      "Certifications": "CE, FCC, RoHS",
      "Temperature Protection": "Yes",
      "Charging Protocols": "PD 3.0, PPS, QC 3.0"
    },
    dimensions: "7.2 x 7.0 x 3.5 cm",
    weight: "195g",
    warranty: "1 year manufacturer warranty",
    seller: "Helios Official",
    returnPolicy: "14-day return policy",
    returnDays: 14
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
    highlights: ["Breathable mesh", "Lightweight sole", "Road + gym ready"],
    description: "Experience comfort and performance with Maverick Run Lite shoes. Designed for both road running and gym workouts, these shoes feature advanced cushioning technology, breathable mesh upper for ventilation, and a lightweight sole that reduces fatigue. The ergonomic design provides excellent arch support, making them suitable for marathon training, casual jogging, and everyday wear.",
    specifications: {
      "Material": "Breathable mesh + synthetic overlay",
      "Sole Material": "Rubber with cushioning",
      "Heel Drop": "10mm",
      "Weight per shoe": "245g",
      "Cushioning": "EVA foam",
      "Arch Support": "High",
      "Suitable Surface": "Road, track, treadmill",
      "Closure Type": "Lace-up"
    },
    materials: "100% Polyester mesh, Rubber sole",
    dimensions: "31 x 12 x 12 cm",
    weight: "490g (pair)",
    warranty: "6 months defect warranty",
    seller: "Maverick Sports",
    returnPolicy: "7-day return (unused condition)",
    returnDays: 7
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
    highlights: ["240 GSM cotton", "Relaxed fit", "Fade resistant print"],
    description: "Elevate your casual wardrobe with the Aurora Cotton Oversized Graphic T-Shirt. Made from premium 240 GSM cotton, this tee offers exceptional durability and comfort. The relaxed oversized fit is perfect for a laid-back aesthetic, while the fade-resistant print ensures your design stays vibrant after multiple washes. Available in multiple eye-catching designs.",
    specifications: {
      "Fabric Weight": "240 GSM",
      "Material Composition": "100% Cotton",
      "Fit": "Oversized",
      "Sleeve Type": "Short sleeves",
      "Neck Type": "Crew neck",
      "Print Type": "Direct-to-garment (DTG)",
      "Care Instructions": "Wash in cold water, tumble dry low",
      "Shrinkage": "Minimal (<5%)"
    },
    materials: "100% premium cotton",
    dimensions: "L: 82cm, W: 68cm (for medium size)",
    weight: "180g",
    warranty: "No warranty (apparel)",
    seller: "Aurora Apparel",
    returnPolicy: "30-day return if unworn/tagged",
    returnDays: 30
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
    highlights: ["Double wall insulation", "Rust resistant", "Fine mesh filter"],
    description: "Brew the perfect cup of coffee with ZenBrew's premium stainless steel French press. Double-wall insulation keeps your coffee hot for up to 4 hours, reducing the need for frequent reheating. The rust-resistant construction ensures durability, while the fine mesh filter system extracts optimal flavor without sediment. Perfect for coffee enthusiasts and office use.",
    specifications: {
      "Capacity": "1L (8 cups)",
      "Outer Material": "Borosilicate glass",
      "Inner Material": "Stainless steel",
      "Filter Type": "Fine mesh stainless steel",
      "Insulation": "Double-wall air gap",
      "Temperature Retention": "4 hours hot",
      "Brewing Time": "4 minutes",
      "Dishwasher Safe": "Filter only"
    },
    materials: "Borosilicate glass, 304 stainless steel",
    dimensions: "22 x 12 x 12 cm",
    weight: "640g",
    warranty: "Lifetime against manufacturing defects",
    seller: "ZenBrew Home",
    returnPolicy: "30-day satisfaction guarantee",
    returnDays: 30
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
    highlights: ["Soft-washed linen", "2 pillow covers", "All-season comfort"],
    description: "Transform your bedroom with pure, luxurious linen bedding from Habitat. Crafted from 100% high-quality linen, these sheets are naturally breathable, temperature-regulating, and hypoallergenic. The soft-washed finish enhances comfort year-round. Perfect for hot summers and cozy winters. Each set includes 1 fitted sheet, 1 flat sheet, and 2 pillow covers.",
    specifications: {
      "Material": "100% Pure linen",
      "Weave": "Plain weave",
      "Thread Count": "280 TC",
      "Pieces Included": "4 (1 fitted + 1 flat + 2 pillows)",
      "Size": "Queen (152cm x 203cm)",
      "Care": "Cold wash, tumble dry low",
      "Shrinkage": "Pre-washed (minimal)",
      "Certifications": "OEKO-TEX certified"
    },
    materials: "100% European linen",
    dimensions: "Queen size: 152cm x 203cm",
    weight: "2.5kg",
    warranty: "1 year defect warranty",
    seller: "Habitat Home",
    returnPolicy: "14-day return (unwashed)",
    returnDays: 14
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
    highlights: ["Anti-slip texture", "Sweat resistant", "Carry strap included"],
    description: "Master your yoga practice with the StormGrip Pro Yoga Mat. Featuring premium non-slip texture and sweat-resistant surface, this mat provides stability during intense sessions. The 6mm thickness offers excellent cushioning for joints while maintaining balance. Complete with an included carry strap for convenient transport. Perfect for yoga, pilates, and floor exercises.",
    specifications: {
      "Thickness": "6mm",
      "Length": "183cm",
      "Width": "61cm",
      "Surface": "Non-slip TPE",
      "Base": "Textured rubber",
      "Weight": "1.89kg",
      "Material": "Closed-cell foam",
      "Non-toxic": "Phthalate-free"
    },
    materials: "Premium TPE (Thermoplastic Elastomer) with rubber base",
    dimensions: "183cm x 61cm x 0.6cm",
    weight: "1.89kg",
    warranty: "1 year manufacturer warranty",
    seller: "StormGrip Sports",
    returnPolicy: "30-day return (for factory defects)",
    returnDays: 30
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
