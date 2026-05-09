import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { pokedexService } from "@/services";
import { mapPokemon, mapPokemonSummary } from "@/services/pokedex.mapper";
import type {
  Pokemon,
  PokemonListResult,
  PokemonSummary,
  RawPokemon,
} from "@/types/pokemon.types";
import { queryKeys } from "./query-keys";

const PAGE_LIMIT = 12;

/**
 * Pokemon main grid — uses `useInfiniteQuery` for "load more" behavior.
 * Reflects the original PokedexContext.loadMorePokemon flow.
 */
export const useGetPokemonInfinite = (
  search = "",
  type = ""
) =>
  useInfiniteQuery<
    PokemonListResult,
    Error,
    InfiniteData<PokemonListResult>,
    ReturnType<typeof queryKeys.pokemon.list>,
    number
  >({
    queryKey: queryKeys.pokemon.list({ search, type }),
    queryFn: ({ pageParam = 1 }) =>
      pokedexService.getPokemonList({
        page: pageParam,
        limit: PAGE_LIMIT,
        search,
        type,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      if (totalPages > 0 && page < totalPages) return page + 1;
      return undefined;
    },
  });

/**
 * Search dropdown — same endpoint, different cache key. Refetches when the
 * (debounced) search term changes. Disabled while the term is empty.
 */
export const useGetPokemonSearchDropdownInfinite = (search: string) =>
  useInfiniteQuery<
    PokemonListResult,
    Error,
    InfiniteData<PokemonListResult>,
    ReturnType<typeof queryKeys.pokemon.searchDropdown>,
    number
  >({
    queryKey: queryKeys.pokemon.searchDropdown(search),
    queryFn: ({ pageParam = 1 }) =>
      pokedexService.getPokemonList({
        page: pageParam,
        limit: PAGE_LIMIT,
        search,
      }),
    enabled: search.length > 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      if (totalPages > 0 && page < totalPages) return page + 1;
      return undefined;
    },
  });

interface PokemonDetailResult {
  current: Pokemon | null;
  prev: PokemonSummary | null;
  next: PokemonSummary | null;
}

/**
 * Single pokemon detail + prev/next neighbours. Mirrors the `PokemonInfo`
 * component effect that fetched all three in parallel.
 *
 * Prev/next failures (e.g. boundaries like id=1 or last id) are silently
 * ignored so the navigator simply hides those buttons.
 */
export const useGetPokemonDetail = (id: number | null) =>
  useQuery<PokemonDetailResult, Error>({
    queryKey: queryKeys.pokemon.detail(id ?? 0),
    enabled: id !== null && Number.isFinite(id),
    queryFn: async () => {
      const numericId = id as number;
      const current = mapPokemon(await pokedexService.getPokemonById(numericId));

      const safeFetch = async (
        targetId: number
      ): Promise<RawPokemon | null> => {
        try {
          return await pokedexService.getPokemonById(targetId);
        } catch {
          return null;
        }
      };

      const [prev, next] = await Promise.all([
        numericId > 1 ? safeFetch(numericId - 1) : Promise.resolve(null),
        safeFetch(numericId + 1),
      ]);

      return {
        current,
        prev: mapPokemonSummary(prev),
        next: mapPokemonSummary(next),
      };
    },
  });
