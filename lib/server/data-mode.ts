export type DataMode = "local" | "firebase";

export function getDataMode(): DataMode {
  const raw = (process.env.DATA_MODE || "local").toLowerCase();
  return raw === "firebase" ? "firebase" : "local";
}

export function getLocalDbDir(): string {
  // Check if running on Vercel (Lambda functions can't write to /var/task)
  if (process.env.VERCEL_ENV) {
    // Use /tmp which is writable on Vercel Lambda functions
    return process.env.LOCAL_DB_DIR || "/tmp/.localdb";
  }
  
  return process.env.LOCAL_DB_DIR || ".localdb";
}
