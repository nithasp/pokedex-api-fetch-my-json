import { Response } from "express";

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
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export function ok<T>(
  res: Response,
  data: T,
  pagination?: Pagination
): Response {
  const body: ApiSuccess<T> = { success: true, data };
  if (pagination) body.pagination = pagination;
  return res.status(200).json(body);
}

export function buildPagination(
  page: number,
  limit: number,
  total: number
): Pagination {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function created<T>(res: Response, data: T): Response {
  const body: ApiSuccess<T> = { success: true, data };
  return res.status(201).json(body);
}

export function noContent(res: Response): Response {
  return res.status(204).send();
}

export function fail(
  res: Response,
  status: number,
  message: string,
  code?: string,
  details?: unknown
): Response {
  const body: ApiError = {
    success: false,
    error: {
      message,
      ...(code !== undefined && { code }),
      ...(details !== undefined && { details }),
    },
  };
  return res.status(status).json(body);
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}
