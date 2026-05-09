"use client";

import { useMemo } from "react";
import { useGetPokemonInfinite } from "@/shared/hooks/queries";
import { mapPokemon } from "@/services/pokedex.mapper";
import { useSearchTerm } from "@/stores";
import type { Pokemon } from "@/types/pokemon.types";
import { PokemonCardList } from "./pokemon-card";

export function PokemonList() {
  const searchTerm = useSearchTerm();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPokemonInfinite(searchTerm);

  const pokemon: Pokemon[] = useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page.data)
      .map(mapPokemon)
      .filter((p): p is Pokemon => p !== null);
  }, [data]);

  return (
    <div className="wrap-pokemon-list">
      <PokemonCardList
        pokemon={pokemon}
        hasMore={Boolean(hasNextPage)}
        isFetchingMore={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
    </div>
  );
}
