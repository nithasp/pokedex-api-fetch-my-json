/**
 * Generic identifier accepted by API resources. Backends may expose IDs as
 * either numeric (e.g. Mongo `_id` cast to number) or string (slugs, ObjectId
 * strings), so callers can pass whichever form they have on hand.
 */
export type Id = string | number;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message?: string;
  error?: string;
  data?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
