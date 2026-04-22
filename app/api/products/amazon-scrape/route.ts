import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import { verifyAdminToken } from "@/lib/server/verify-token";
import { getFirestore } from "@/lib/server/firebase-admin";
import { FirestoreProduct } from "@/lib/firestore-schema";

/**
 * POST /api/products/amazon-scrape
 * Scrape product data from Amazon URL and create product
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const { url, category = "electronics" } = await request.json();

    if (!url || !url.includes("amazon")) {
      return NextResponse.json(
        { error: "Valid Amazon URL is required" },
        { status: 400 },
      );
    }

    // Scrape product data from Amazon
    const productData = await scrapeAmazonProduct(url);

    if (!productData.title || !productData.price) {
      return NextResponse.json(
        { error: "Could not extract product data from the URL" },
        { status: 400 },
      );
    }

    // Create slug from title
    const slug = productData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Prepare product data
    const newProduct: Omit<FirestoreProduct, "id"> = {
      slug,
      title: productData.title,
      brand: productData.brand || "Unknown Brand",
      category: category as FirestoreProduct["category"],
      price: productData.price,
      mrp: productData.mrp || productData.price,
      rating: productData.rating || 0,
      reviews: productData.reviews || 0,
      stock: 100, // Default stock
      image: productData.image || "",
      delivery: "Free delivery by tomorrow",
      highlights: productData.highlights || [],
      description: productData.description || productData.title,
      specifications: productData.specifications || {},
      materials: productData.materials,
      dimensions: productData.dimensions,
      weight: productData.weight,
      warranty: productData.warranty,
      seller: "AZCO Global",
      returnPolicy: "30 days return policy",
      returnDays: 30,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const db = getFirestore();
    const docRef = await db.collection("products").add(newProduct);

    return NextResponse.json(
      {
        id: docRef.id,
        ...newProduct,
        message: "Product imported successfully from Amazon",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error scraping Amazon product:", error);
    const errorMessage = (error as Error).message;

    if (
      errorMessage.includes("Unauthorized") ||
      errorMessage.includes("Invalid")
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to import product from Amazon" },
      { status: 500 },
    );
  }
}

async function scrapeAmazonProduct(url: string) {
  try {
    // Add user agent to avoid blocking
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Extract product title
    const title =
      $("#productTitle").text().trim() ||
      $("#title").text().trim() ||
      $("h1").first().text().trim();

    // Extract price
    const priceText =
      $("#priceblock_ourprice").text().trim() ||
      $("#priceblock_dealprice").text().trim() ||
      $(".a-price .a-offscreen").first().text().trim() ||
      $("#corePrice_feature_div .a-price .a-offscreen").first().text().trim();

    const price = extractPrice(priceText);

    // Extract MRP/strike price
    const mrpText =
      $("#priceblock_strikethrough_price").text().trim() ||
      $(".a-price.a-text-price .a-offscreen").first().text().trim();

    const mrp = extractPrice(mrpText) || price;

    // Extract brand
    const brand =
      $("#bylineInfo").text().trim() ||
      $("#brand").text().trim() ||
      $("a#bylineInfo").text().trim();

    // Extract rating
    const ratingText =
      $("#averageCustomerReviews .a-icon-star .a-icon-alt").text().trim() ||
      $("#acrPopover .a-icon-star .a-icon-alt").text().trim();

    const rating = extractRating(ratingText);

    // Extract review count
    const reviewsText =
      $("#averageCustomerReviews #acrCustomerReviewText").text().trim() ||
      $("#acrCustomerReviewText").text().trim();

    const reviews = extractReviewCount(reviewsText);

    // Extract main image
    const image =
      $("#landingImage").attr("src") ||
      $("#imgBlkFront").attr("src") ||
      $(".a-dynamic-image").first().attr("src") ||
      $("#main-image").attr("src");

    // Extract highlights/bullets
    const highlights: string[] = [];
    $("#feature-bullets ul li, #feature-bullets .a-list-item").each((_, el) => {
      const text = $(el).text().trim();
      if (text) highlights.push(text);
    });

    // Extract description
    const description =
      $("#productDescription p").text().trim() ||
      $("#productDescription").text().trim() ||
      $("#descriptionAndDetails").text().trim() ||
      highlights.join(". ") ||
      title;

    // Extract specifications
    const specifications: Record<string, string> = {};
    $(
      "#productDetails_techSpec_section_1 tr, #technicalSpecifications_section_1 tr",
    ).each((_, el) => {
      const key = $(el).find("th, td:first-child").text().trim();
      const value = $(el).find("td:last-child").text().trim();
      if (key && value) {
        specifications[key] = value;
      }
    });

    // Extract additional details from specifications
    const materials = specifications["Material"] || specifications["Materials"];
    const dimensions =
      specifications["Product Dimensions"] || specifications["Dimensions"];
    const weight = specifications["Item Weight"] || specifications["Weight"];
    const warranty =
      specifications["Warranty"] || specifications["Manufacturer Warranty"];

    return {
      title,
      price,
      mrp,
      brand,
      rating,
      reviews,
      image,
      highlights,
      description,
      specifications,
      materials,
      dimensions,
      weight,
      warranty,
    };
  } catch (error) {
    console.error("Error scraping Amazon:", error);
    throw new Error("Failed to scrape product data from Amazon");
  }
}

function extractPrice(priceText: string): number {
  if (!priceText) return 0;

  // Remove currency symbols and extract numbers
  const match = priceText.replace(/[₹$£€,]/g, "").match(/[\d,]+\.?\d*/);
  if (!match) return 0;

  const price = parseFloat(match[0].replace(/,/g, ""));
  return isNaN(price) ? 0 : Math.round(price);
}

function extractRating(ratingText: string): number {
  if (!ratingText) return 0;

  const match = ratingText.match(/(\d+\.?\d*)/);
  if (!match) return 0;

  const rating = parseFloat(match[1]);
  return isNaN(rating) ? 0 : Math.min(5, Math.max(0, rating));
}

function extractReviewCount(reviewsText: string): number {
  if (!reviewsText) return 0;

  const match = reviewsText.match(/(\d+(?:,\d+)*)/);
  if (!match) return 0;

  const count = parseInt(match[1].replace(/,/g, ""));
  return isNaN(count) ? 0 : count;
}
