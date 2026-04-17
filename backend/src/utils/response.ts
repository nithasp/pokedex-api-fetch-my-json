import { Response } from "express";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
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
  meta?: Record<string, unknown>
): Response {
  const body: ApiSuccess<T> = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(200).json(body);
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
