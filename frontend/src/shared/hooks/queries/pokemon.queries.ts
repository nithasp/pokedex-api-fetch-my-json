import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { pokedexService } from "@/services";
import { selectRawPokemonList } from "@/shared/selectors/pokemon.selectors";
import { useSetPokemonList } from "@/stores";
import { queryKeys } from "./query-keys";

/**
 * Fetch every pokemon exactly once via `?all=true` and hydrate the global
 * pokedex store. Safe to call from multiple components — React Query dedupes
 * by `queryKey`, `staleTime: Infinity` keeps the cache fresh for the lifetime
 * of the session, and the store update is idempotent.
 */
export const useGetAllPokemon = () => {
  const setPokemonList = useSetPokemonList();

  const query = useQuery({
    queryKey: queryKeys.pokemon.all,
    queryFn: pokedexService.getAllPokemon,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // Mirror the response into Zustand so the rest of the UI can read pokemon
  // data synchronously without going through React Query selectors. We sync
  // on any successful response (including an empty array) so the store's
  // `isPokemonListLoaded` flag flips and the home/detail loaders dismiss.
  useEffect(() => {
    if (!query.data || !query.data.success) return;
    const list = selectRawPokemonList(query.data);
    setPokemonList(list);
  }, [query.data, setPokemonList]);

  return query;
};
