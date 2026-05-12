import type { CorsOptions } from "cors";

/**
 * Build the `origin` option for the `cors` middleware from a parsed config value.
 *
 * Behaviour:
 * - `"*"` → reflect any origin (no allowlist).
 * - `string | string[]` → exact-match against the list. Trailing slashes are
 *   ignored so `https://foo.com/` and `https://foo.com` both match.
 * - Requests without an `Origin` header (curl, server-to-server, same-origin)
 *   are always allowed.
 * - Rejected origins are logged so Railway/Vercel logs reveal the exact value
 *   the browser sent — quick to spot env-var typos.
 */
export function buildCorsOriginHandler(
  corsOrigin: "*" | string | string[]
): CorsOptions["origin"] {
  if (corsOrigin === "*") return "*";

  const allowList = (Array.isArray(corsOrigin) ? corsOrigin : [corsOrigin]).map((o) =>
    o.replace(/\/$/, "")
  );

  return (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (allowList.includes(normalized)) return callback(null, true);
    console.warn(`[cors] Blocked origin: ${origin}. Allowed: ${allowList.join(", ")}`);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  };
}
