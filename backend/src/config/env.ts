import type { CorsOptions } from "cors";
import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Returns "*" for full wildcard, otherwise a normalized list of allowed origins.
// Strips trailing slashes so "https://foo.com/" and "https://foo.com" both work.
function parseCorsOrigin(raw: string | undefined): "*" | string[] {
  const value = (raw ?? "*").trim();
  if (value === "" || value === "*") return "*";
  return value
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export function buildCorsOriginHandler(
  corsOrigin: "*" | string | string[]
): CorsOptions["origin"] {
  if (corsOrigin === "*") return "*";

  const allowList = (Array.isArray(corsOrigin) ? corsOrigin : [corsOrigin]).map((o) =>
    o.replace(/\/$/, "")
  );

  return (origin, callback) => {
    // Allow non-browser clients (curl, server-to-server, same-origin) that send no Origin header.
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (allowList.includes(normalized)) return callback(null, true);
    console.warn(`[cors] Blocked origin: ${origin}. Allowed: ${allowList.join(", ")}`);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  };
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: required("MONGO_URI"),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  // Public base URL for Cloudflare R2 bucket (no trailing slash)
  // e.g. https://pub-XXXX.r2.dev  or  https://images.yourdomain.com
  r2PublicUrl: (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, ""),
} as const;

// One-time startup log so Railway logs show exactly what CORS allowlist was parsed
// from the env var. Helps catch invisible whitespace / quoting issues quickly.
// JSON.stringify keeps it on one line even when the array has many entries.
console.log(`[cors] Allowed origins: ${JSON.stringify(config.corsOrigin)}`);
