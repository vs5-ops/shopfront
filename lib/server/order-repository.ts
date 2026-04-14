import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { CheckoutRequest, PriceBreakdown } from "@/lib/types";
import { getDataMode, getLocalDbDir } from "@/lib/server/data-mode";

export type OrderRecord = {
  id: string;
  email: string;
  userId: string;
  status: "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  pricing: PriceBreakdown;
  payload: CheckoutRequest;
};

type OrderRepository = {
  createOrder: (payload: CheckoutRequest, pricing: PriceBreakdown) => Promise<OrderRecord>;
  listOrdersByEmail: (email: string) => Promise<OrderRecord[]>;
};

const localRepo: OrderRepository = {
  async createOrder(payload, pricing) {
    const now = new Date().toISOString();
    const order: OrderRecord = {
      id: `ord_${randomUUID()}`,
      email: payload.email,
      userId: payload.userId,
      status: "pending_payment",
      createdAt: now,
      updatedAt: now,
      pricing,
      payload
    };

    const all = await readOrdersFile();
    all.unshift(order);
    await writeOrdersFile(all);
    return order;
  },

  async listOrdersByEmail(email) {
    const all = await readOrdersFile();
    const target = email.toLowerCase();
    return all.filter((item) => item.email.toLowerCase() === target);
  }
};

const firebaseRepo: OrderRepository = {
  async createOrder() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async listOrdersByEmail() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  }
};

export function getOrderRepository(): OrderRepository {
  return getDataMode() === "firebase" ? firebaseRepo : localRepo;
}

async function dbFilePath() {
  const dir = path.join(process.cwd(), getLocalDbDir());
  await mkdir(dir, { recursive: true });
  return path.join(dir, "orders.json");
}

async function readOrdersFile(): Promise<OrderRecord[]> {
  const file = await dbFilePath();
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOrdersFile(orders: OrderRecord[]) {
  const file = await dbFilePath();
  await writeFile(file, JSON.stringify(orders, null, 2), "utf8");
}
