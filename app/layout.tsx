import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/_components/CartContext";
import { AuthProvider } from "@/app/_components/AuthContext";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "AZCO Global | Online Shopping Platform for Electronics, Fashion & More",
  description: "Shop premium electronics, fashion, home appliances and more on AZCO Global. Fast delivery, secure checkout, 10k+ verified sellers, same-day dispatch available.",
  keywords: "online shopping, electronics, fashion, appliances, marketplace, fast delivery, India",
  openGraph: {
    title: "AZCO Global | Shop Everything You Need",
    description: "Browse thousands of products with verified sellers, secure payments, and fast delivery.",
    url: "https://www.azcoglobal.com",
    siteName: "AZCO Global",
    images: [
      {
        url: "https://www.azcoglobal.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AZCO Global Shopping Platform"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AZCO Global | Online Shopping",
    description: "Shop verified products with fast shipping and secure checkout.",
    images: ["https://www.azcoglobal.com/og-image.jpg"]
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://www.azcoglobal.com"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.azcoglobal.com" />
        <meta name="google-site-verification" content="" />
        <meta name="msvalidate.01" content="" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              "name": "AZCO Global",
              "url": "https://www.azcoglobal.com",
              "description": "Online shopping platform for electronics, fashion, home appliances and more",
              "image": "https://www.azcoglobal.com/og-image.jpg",
              "telephone": "+91-XXXXXXXXXX",
              "sameAs": [
                "https://facebook.com/azcoglobal",
                "https://instagram.com/azcoglobal",
                "https://twitter.com/azcoglobal"
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.azcoglobal.com/products?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <div className="app-content">{children}</div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
