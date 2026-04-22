import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { CheckoutRequest, PriceBreakdown } from "@/lib/types";
import { getDataMode, getLocalDbDir } from "@/lib/server/data-mode";
import { getFirestore } from "@/lib/server/firebase-admin";

export type OrderRecord = {
  id: string;
  email: string;
  userId: string;
  status:
    | "pending_payment"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  pricing: PriceBreakdown;
  payload: CheckoutRequest;
};

type OrderRepository = {
  createOrder: (
    payload: CheckoutRequest,
    pricing: PriceBreakdown,
  ) => Promise<OrderRecord>;
  listOrdersByEmail: (email: string) => Promise<OrderRecord[]>;
  updateOrder: (
    orderId: string,
    updates: Partial<OrderRecord>,
  ) => Promise<OrderRecord>;
};

const ORDERS_COLLECTION = "orders";

async function saveOrderRecord(order: OrderRecord) {
  await getFirestore().collection(ORDERS_COLLECTION).doc(order.id).set(order);
}

function mapFirestoreOrder(
  doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
): OrderRecord {
  return {
    ...(doc.data() as Omit<OrderRecord, "id">),
    id: doc.id,
  };
}

async function getOrdersByEmailFromFirestore(
  email: string,
): Promise<OrderRecord[]> {
  const normalized = email.toLowerCase();
  const snapshot = await getFirestore()
    .collection(ORDERS_COLLECTION)
    .where("email", "==", normalized)
    .get();
  return snapshot.docs.map(mapFirestoreOrder);
}

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
      payload,
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
  },

  async updateOrder(orderId, updates) {
    const all = await readOrdersFile();
    const index = all.findIndex((order) => order.id === orderId);
    if (index === -1) {
      throw new Error("Order not found");
    }

    all[index] = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeOrdersFile(all);
    return all[index];
  },
};

const firebaseRepo: OrderRepository = {
  async createOrder(payload, pricing) {
    const now = new Date().toISOString();
    const order: OrderRecord = {
      id: `ord_${randomUUID()}`,
      email: payload.email.toLowerCase(),
      userId: payload.userId,
      status: "pending_payment",
      createdAt: now,
      updatedAt: now,
      pricing,
      payload,
    };

    await saveOrderRecord(order);
    return order;
  },

  async listOrdersByEmail(email) {
    return getOrdersByEmailFromFirestore(email);
  },

  async updateOrder(orderId, updates) {
    const db = getFirestore();
    const docRef = db.collection(ORDERS_COLLECTION).doc(orderId);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error("Order not found");
    }

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updatedData);

    const updatedDoc = await docRef.get();
    return mapFirestoreOrder(updatedDoc as any);
  },
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
