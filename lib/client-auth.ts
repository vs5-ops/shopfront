export const ADMIN_EMAIL = "info@azcoglobal.com";
export const CHECKOUT_EMAIL_KEY = "shopfront_next_customer_email";

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isAdminEmail(value: string): boolean {
  return normalizeEmail(value) === ADMIN_EMAIL;
}
