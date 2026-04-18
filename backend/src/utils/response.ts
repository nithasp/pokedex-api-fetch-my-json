import { Response } from "express";
import type { ApiError, ApiSuccess, Pagination } from "../types/api-response.type";

export const ok = <T>(res: Response, data: T, pagination?: Pagination): Response =>
  res.status(200).json({ success: true, data, ...(pagination && { pagination }) } as ApiSuccess<T>);

export const buildPagination = (page: number, limit: number, total: number): Pagination => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export const fail = (
  res: Response,
  status: number,
  message: string,
  code?: string,
  details?: unknown
): Response =>
  res.status(status).json({
    success: false,
    error: { message, ...(code !== undefined && { code }), ...(details !== undefined && { details }) },
  } as ApiError);

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
