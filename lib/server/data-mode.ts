export type DataMode = "local" | "firebase";

export function getDataMode(): DataMode {
  const raw = (process.env.DATA_MODE || "local").toLowerCase();
  return raw === "firebase" ? "firebase" : "local";
}

export function getLocalDbDir(): string {
  return process.env.LOCAL_DB_DIR || ".localdb";
}
