import type { Id } from "@/types/api.types";

export const isValidId = (id: Id | undefined | null): boolean =>
  id !== undefined && id !== null && String(id).length > 0;
