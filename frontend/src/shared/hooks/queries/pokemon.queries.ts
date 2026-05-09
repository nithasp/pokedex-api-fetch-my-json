import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { pokedexService } from "@/services";
import { getNextPageNumber } from "@/shared/selectors/pokemon.selectors";
import type { ApiResponse } from "@/types/api.types";
import type { RawPokemon } from "@/types/pokemon.types";
import type { QueryOpts } from "@/types/query.types";
import { queryKeys } from "./query-keys";
import { isValidId } from "./query.utils";

type Id = string | number;

const PAGE_LIMIT = 12;

export const useGetPokemonInfinite = (search = "", type = "") =>
  useInfiniteQuery<
    ApiResponse<RawPokemon[]>,
    Error,
    InfiniteData<ApiResponse<RawPokemon[]>>,
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
    getNextPageParam: getNextPageNumber,
  });

export const useGetPokemonSearchDropdownInfinite = (search: string) =>
  useInfiniteQuery<
    ApiResponse<RawPokemon[]>,
    Error,
    InfiniteData<ApiResponse<RawPokemon[]>>,
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
    getNextPageParam: getNextPageNumber,
  });

export const useGetPokemonById = (
  id: Id | null,
  options?: QueryOpts<
    ApiResponse<RawPokemon>,
    ReturnType<typeof queryKeys.pokemon.detail>
  >
) =>
  useQuery({
    queryKey: queryKeys.pokemon.detail(id ?? 0),
    queryFn: () => pokedexService.getPokemonById(id as Id),
    enabled: isValidId(id),
    ...options,
  });
