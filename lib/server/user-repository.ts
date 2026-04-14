import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { getDataMode, getLocalDbDir } from "@/lib/server/data-mode";
import { ADMIN_EMAIL, normalizeEmail } from "@/lib/client-auth";

export type UserRole = "admin" | "user";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  failedLoginAttempts: number;
  lockUntil: string | null;
  resetTokenHash: string | null;
  resetTokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

type UserRepository = {
  register: (email: string, password: string) => Promise<PublicUser>;
  login: (email: string, password: string) => Promise<PublicUser>;
  listUsers: () => Promise<PublicUser[]>;
  updateRole: (email: string, role: UserRole) => Promise<PublicUser>;
  requestPasswordReset: (email: string) => Promise<{ ok: true; tokenPreview?: string }>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<{ ok: true }>;
  changePassword: (email: string, currentPassword: string, newPassword: string) => Promise<{ ok: true }>;
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const RESET_TOKEN_MINUTES = 15;

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function toPublicUser(user: UserRecord): PublicUser {
  const { id, email, role, createdAt, updatedAt } = user;
  return { id, email, role, createdAt, updatedAt };
}

function bootstrapPassword(): string {
  return process.env.ADMIN_BOOTSTRAP_PASSWORD || "Admin@12345";
}

function normalizeRecord(
  input: Partial<UserRecord> & {
    id: string;
    email: string;
    passwordHash: string;
    salt: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  }
): UserRecord {
  return {
    ...input,
    failedLoginAttempts: input.failedLoginAttempts ?? 0,
    lockUntil: input.lockUntil ?? null,
    resetTokenHash: input.resetTokenHash ?? null,
    resetTokenExpiresAt: input.resetTokenExpiresAt ?? null
  };
}

async function usersDbFilePath() {
  const dir = path.join(process.cwd(), getLocalDbDir());
  await mkdir(dir, { recursive: true });
  return path.join(dir, "users.json");
}

async function readUsersFile(): Promise<UserRecord[]> {
  const file = await usersDbFilePath();
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<UserRecord>>;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (
          item
        ): item is Partial<UserRecord> & {
          id: string;
          email: string;
          passwordHash: string;
          salt: string;
          role: UserRole;
          createdAt: string;
          updatedAt: string;
        } => {
          return Boolean(
            item && item.id && item.email && item.passwordHash && item.salt && item.role && item.createdAt && item.updatedAt
          );
        }
      )
      .map((item) => normalizeRecord(item));
  } catch {
    return [];
  }
}

async function writeUsersFile(users: UserRecord[]) {
  const file = await usersDbFilePath();
  await writeFile(file, JSON.stringify(users, null, 2), "utf8");
}

async function ensurePrimaryAdmin(users: UserRecord[]): Promise<UserRecord[]> {
  const adminEmail = normalizeEmail(ADMIN_EMAIL);
  const existing = users.find((user) => normalizeEmail(user.email) === adminEmail);
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.updatedAt = new Date().toISOString();
    }
    return users;
  }

  const now = new Date().toISOString();
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(bootstrapPassword(), salt);
  users.unshift({
    id: `usr_${randomUUID()}`,
    email: adminEmail,
    passwordHash,
    salt,
    role: "admin",
    failedLoginAttempts: 0,
    lockUntil: null,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
    createdAt: now,
    updatedAt: now
  });

  return users;
}

function ensurePasswordStrength(password: string) {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
}

function isLocked(user: UserRecord): boolean {
  if (!user.lockUntil) {
    return false;
  }
  return new Date(user.lockUntil).getTime() > Date.now();
}

function clearLock(user: UserRecord) {
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
}

const localRepo: UserRepository = {
  async register(email, password) {
    ensurePasswordStrength(password);

    const normalized = normalizeEmail(email);
    const users = await ensurePrimaryAdmin(await readUsersFile());
    const found = users.find((user) => normalizeEmail(user.email) === normalized);
    if (found) {
      throw new Error("User already exists");
    }

    const now = new Date().toISOString();
    const salt = randomBytes(16).toString("hex");
    const user: UserRecord = {
      id: `usr_${randomUUID()}`,
      email: normalized,
      salt,
      passwordHash: hashPassword(password, salt),
      role: normalized === normalizeEmail(ADMIN_EMAIL) ? "admin" : "user",
      failedLoginAttempts: 0,
      lockUntil: null,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      createdAt: now,
      updatedAt: now
    };

    users.unshift(user);
    await writeUsersFile(users);
    return toPublicUser(user);
  },

  async login(email, password) {
    const normalized = normalizeEmail(email);
    const users = await ensurePrimaryAdmin(await readUsersFile());

    const found = users.find((user) => normalizeEmail(user.email) === normalized);
    if (!found) {
      await writeUsersFile(users);
      throw new Error("Invalid email or password");
    }

    if (isLocked(found)) {
      const lockEnd = new Date(found.lockUntil as string);
      const minutes = Math.max(1, Math.ceil((lockEnd.getTime() - Date.now()) / 60000));
      await writeUsersFile(users);
      throw new Error(`Too many failed attempts. Try again in ${minutes} minute(s).`);
    }

    const candidate = Buffer.from(hashPassword(password, found.salt), "hex");
    const expected = Buffer.from(found.passwordHash, "hex");

    if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) {
      found.failedLoginAttempts += 1;
      if (found.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        found.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString();
        found.failedLoginAttempts = 0;
      }
      found.updatedAt = new Date().toISOString();
      await writeUsersFile(users);
      throw new Error("Invalid email or password");
    }

    clearLock(found);
    found.updatedAt = new Date().toISOString();
    await writeUsersFile(users);
    return toPublicUser(found);
  },

  async listUsers() {
    const users = await ensurePrimaryAdmin(await readUsersFile());
    await writeUsersFile(users);
    return users.map(toPublicUser);
  },

  async updateRole(email, role) {
    const normalized = normalizeEmail(email);
    const users = await ensurePrimaryAdmin(await readUsersFile());
    const found = users.find((user) => normalizeEmail(user.email) === normalized);

    if (!found) {
      throw new Error("User not found");
    }

    if (normalized === normalizeEmail(ADMIN_EMAIL) && role !== "admin") {
      throw new Error("Primary admin role cannot be changed");
    }

    found.role = role;
    found.updatedAt = new Date().toISOString();
    await writeUsersFile(users);

    return toPublicUser(found);
  },

  async requestPasswordReset(email) {
    const normalized = normalizeEmail(email);
    const users = await ensurePrimaryAdmin(await readUsersFile());
    const found = users.find((user) => normalizeEmail(user.email) === normalized);

    if (!found) {
      await writeUsersFile(users);
      return { ok: true };
    }

    const token = randomBytes(24).toString("hex");
    found.resetTokenHash = hashResetToken(token);
    found.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60_000).toISOString();
    found.updatedAt = new Date().toISOString();
    await writeUsersFile(users);

    const isDev = process.env.NODE_ENV !== "production";
    return isDev ? { ok: true, tokenPreview: token } : { ok: true };
  },

  async resetPassword(email, token, newPassword) {
    ensurePasswordStrength(newPassword);

    const normalized = normalizeEmail(email);
    const users = await ensurePrimaryAdmin(await readUsersFile());
    const found = users.find((user) => normalizeEmail(user.email) === normalized);

    if (!found || !found.resetTokenHash || !found.resetTokenExpiresAt) {
      await writeUsersFile(users);
      throw new Error("Invalid or expired reset token");
    }

    if (new Date(found.resetTokenExpiresAt).getTime() < Date.now()) {
      found.resetTokenHash = null;
      found.resetTokenExpiresAt = null;
      found.updatedAt = new Date().toISOString();
      await writeUsersFile(users);
      throw new Error("Invalid or expired reset token");
    }

    const providedHash = Buffer.from(hashResetToken(token), "hex");
    const expectedHash = Buffer.from(found.resetTokenHash, "hex");
    if (providedHash.length !== expectedHash.length || !timingSafeEqual(providedHash, expectedHash)) {
      await writeUsersFile(users);
      throw new Error("Invalid or expired reset token");
    }

    const newSalt = randomBytes(16).toString("hex");
    found.salt = newSalt;
    found.passwordHash = hashPassword(newPassword, newSalt);
    found.resetTokenHash = null;
    found.resetTokenExpiresAt = null;
    clearLock(found);
    found.updatedAt = new Date().toISOString();
    await writeUsersFile(users);

    return { ok: true };
  },

  async changePassword(email, currentPassword, newPassword) {
    ensurePasswordStrength(newPassword);

    const normalized = normalizeEmail(email);
    const users = await ensurePrimaryAdmin(await readUsersFile());
    const found = users.find((user) => normalizeEmail(user.email) === normalized);

    if (!found) {
      await writeUsersFile(users);
      throw new Error("User not found");
    }

    const currentCandidate = Buffer.from(hashPassword(currentPassword, found.salt), "hex");
    const expected = Buffer.from(found.passwordHash, "hex");
    if (currentCandidate.length !== expected.length || !timingSafeEqual(currentCandidate, expected)) {
      await writeUsersFile(users);
      throw new Error("Current password is incorrect");
    }

    const newSalt = randomBytes(16).toString("hex");
    found.salt = newSalt;
    found.passwordHash = hashPassword(newPassword, newSalt);
    clearLock(found);
    found.updatedAt = new Date().toISOString();
    await writeUsersFile(users);

    return { ok: true };
  }
};

const firebaseRepo: UserRepository = {
  async register() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async login() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async listUsers() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async updateRole() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async requestPasswordReset() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async resetPassword() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  },
  async changePassword() {
    throw new Error("Firebase mode is not wired yet. Set DATA_MODE=local for now.");
  }
};

export function getUserRepository(): UserRepository {
  return getDataMode() === "firebase" ? firebaseRepo : localRepo;
}
