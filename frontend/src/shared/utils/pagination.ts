/**
 * Project-wide default page size for paginated list queries. The home grid
 * and the search dropdown both slice the cached `?all=true` list in chunks
 * of this size, so changing it here updates every paginated UI in one place.
 */
export const DEFAULT_PAGE_LIMIT = 12;
