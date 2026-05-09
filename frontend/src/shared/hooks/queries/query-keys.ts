import type { Id } from "@/types/api.types";
import type { GetPokemonListParams } from "@/types/pokemon.types";

export const queryKeys = {
  pokemon: {
    all: ["pokemon"] as const,
    /**
     * Main grid (paginated by `page` via `useInfiniteQuery`'s `pageParam`).
     * The key intentionally accepts every filter on `GetPokemonListParams`
     * except `page`, so new filter fields automatically get their own cache
     * bucket without touching this file.
     */
    list: (params: Omit<GetPokemonListParams, "page"> = {}) =>
      ["pokemon", "list", params] as const,
    /** Search dropdown (paginated by `page`, debounced search). */
    searchDropdown: (search: string) =>
      ["pokemon", "search-dropdown", search] as const,
    detail: (id: Id) => ["pokemon", "detail", String(id)] as const,
  },
} as const;
