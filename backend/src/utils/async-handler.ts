import { RequestHandler } from "express";
import type { AsyncHandler } from "../types/async-handler.type";

export const asyncHandler =
  (fn: AsyncHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
