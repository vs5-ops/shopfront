import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/_components/CartContext";
import { AuthProvider } from "@/app/_components/AuthContext";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Shopfront Next Store",
  description: "Modern Flipkart-style commerce foundation on Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
