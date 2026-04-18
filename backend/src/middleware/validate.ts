import { RequestHandler } from "express";
import { ZodType } from "zod";
import { fail } from "../utils/response";

type ValidatedSource = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodType<T>, source: ValidatedSource = "body"): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      fail(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.error.issues
      );
      return;
    }
    // Stash parsed + coerced data for the handler to pick up.
    (req as unknown as Record<string, unknown>)[`validated_${source}`] =
      result.data;
    next();
  };

export function validated<T>(
  req: { [key: string]: unknown },
  source: ValidatedSource
): T {
  return req[`validated_${source}`] as T;
}
