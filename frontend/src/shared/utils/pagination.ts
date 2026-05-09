import type { PaginationMeta } from "@/types/api.types";

/**
 * Project-wide default page size for paginated list queries. Every domain
 * builder (pokemon, future moves/abilities/etc.) imports from here so the
 * API payload, the React Query cache, and any UI that mirrors page size
 * all agree on a single source of truth.
 */
export const DEFAULT_PAGE_LIMIT = 12;

/**
 * Fallback `PaginationMeta` used when an API response is missing its
 * `pagination` field or hasn't loaded yet. Reusable across every list view
 * in the project — consumers that need a different `limit` can spread to
 * override:
 *
 *   const overridden: PaginationMeta = { ...DEFAULT_PAGINATION, limit: 50 };
 *
 * The `limit` value is largely cosmetic here: callers typically inspect
 * `total` / `totalPages` first to decide whether the response is empty,
 * but we initialise it with the project's default page size so any UI that
 * renders the field while loading still shows a sensible number.
 */
export const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: DEFAULT_PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};
