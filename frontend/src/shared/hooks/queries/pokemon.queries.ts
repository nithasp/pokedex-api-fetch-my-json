import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { pokedexService } from "@/services";
import { buildPokemonListParams } from "@/shared/builders/pokemon.builders";
import { getNextPageNumber } from "@/shared/selectors/pokemon.selectors";
import type { ApiResponse, Id } from "@/types/api.types";
import type { PokemonListFilters, RawPokemon } from "@/types/pokemon.types";
import type { QueryOpts } from "@/types/query.types";
import { queryKeys } from "./query-keys";
import { isValidId } from "./query.utils";

export const useGetPokemonList = (input: PokemonListFilters = {}) =>
  useInfiniteQuery<
    ApiResponse<RawPokemon[]>,
    Error,
    InfiniteData<ApiResponse<RawPokemon[]>>,
    ReturnType<typeof queryKeys.pokemon.list>,
    number
  >({
    queryKey: queryKeys.pokemon.list(input),
    queryFn: ({ pageParam }) => {
      const filters = buildPokemonListParams(input, pageParam);
      return pokedexService.getPokemonList(filters);
    },
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
    queryFn: ({ pageParam }) => {
      const filters = buildPokemonListParams({ search }, pageParam);
      return pokedexService.getPokemonList(filters);
    },
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
