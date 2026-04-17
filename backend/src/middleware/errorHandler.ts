import { ErrorRequestHandler, Request, Response } from "express";
import { HttpError, fail } from "../utils/response";

export function notFoundHandler(req: Request, res: Response): void {
  fail(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
    "NOT_FOUND"
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    fail(res, err.status, err.message, err.code, err.details);
    return;
  }

  console.error("[error]", err);
  const status =
    typeof (err as { status?: number }).status === "number"
      ? (err as { status: number }).status
      : 500;
  const message =
    err instanceof Error && err.message ? err.message : "Internal server error";

  fail(res, status, message, "INTERNAL_ERROR");
};
