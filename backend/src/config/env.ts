import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Parse a comma-separated `CORS_ORIGIN` env value into a normalized allowlist.
 * Returns `"*"` for full wildcard mode (empty or literal `*`), otherwise an
 * array with trailing slashes stripped and entries trimmed.
 */
function parseCorsOrigin(raw: string | undefined): "*" | string[] {
  const value = (raw ?? "*").trim();
  if (value === "" || value === "*") return "*";
  return value
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: required("MONGO_URI"),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  // Public base URL for Cloudflare R2 bucket (no trailing slash)
  // e.g. https://pub-XXXX.r2.dev  or  https://images.yourdomain.com
  r2PublicUrl: (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, ""),
  // File extension of pokemon images in the R2 bucket. Defaults to `webp`.
  // Switch all images to a new format → just change this (and re-upload).
  imageExtension: (process.env.IMAGE_EXTENSION ?? "webp").replace(/^\.+/, ""),
} as const;
