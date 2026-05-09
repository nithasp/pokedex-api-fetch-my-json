import { DEFAULT_PAGE_LIMIT } from "@/shared/utils/pagination";
import type {
  GetPokemonListParams,
  PokemonListFilters,
} from "@/types/pokemon.types";

/**
 * Build the params object that `pokedexService.getPokemonList` expects from
 * the consumer's static filters plus the dynamic `page` value.
 *
 * Reusable across hooks, prefetchers, and any other call site that needs to
 * hit the list endpoint with consistent defaulting:
 *   - `limit: DEFAULT_PAGE_LIMIT` is placed first so any caller-supplied
 *     `limit` inside `input` overrides it.
 *   - `page` is appended last because it's the only field that changes
 *     per-fetch (e.g. React Query's `pageParam` for infinite queries).
 */
export const buildPokemonListParams = (
  input: PokemonListFilters = {},
  page = 1
): GetPokemonListParams => ({
  limit: DEFAULT_PAGE_LIMIT,
  ...input,
  page,
});
