import { RequestHandler } from "express";
import { ZodType } from "zod";
import { fail } from "../utils/response";

type Source = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodType<T>, source: Source = "body"): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      fail(
        res,
        400,
        "Validation failed",
        "VALIDATION_ERROR",
        result.error.issues,
      );
      return;
    }
    (req.valid ??= {})[source] = result.data;
    next();
  };
