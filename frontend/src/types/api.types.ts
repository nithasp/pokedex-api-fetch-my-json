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
