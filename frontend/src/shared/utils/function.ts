export type QueryParamValue = string | number | boolean | null | undefined;

/**
 * Strip null/undefined/empty-string values from a params object so callers
 * (typically axios `params:`) don't serialize keys we don't want to send.
 *
 * Pass any flat object (pagination + optional filters) and only the
 * meaningful entries come back.
 */
export const buildListParams = <T extends object>(
  input: T
): Record<string, string | number | boolean> => {
  const result: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input)) {
    if (
      (typeof value === "string" && value !== "") ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      result[key] = value;
    }
  }
  return result;
};
