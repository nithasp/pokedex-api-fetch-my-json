export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  error: { message: string; code?: string; details?: unknown };
}
