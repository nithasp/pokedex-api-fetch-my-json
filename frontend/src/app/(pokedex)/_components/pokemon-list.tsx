"use client";

import { useMemo } from "react";
import { useGetPokemonList } from "@/shared/hooks/queries";
import { selectPokemonList } from "@/shared/selectors/pokemon.selectors";
import { useSearchTerm } from "@/stores";
import type { Pokemon } from "@/types/pokemon.types";
import { PokemonCardList } from "./pokemon-card";

export function PokemonList() {
  const searchTerm = useSearchTerm();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPokemonList({ search: searchTerm });

  const pokemon: Pokemon[] = useMemo(
    () => (data ? data.pages.flatMap(selectPokemonList) : []),
    [data]
  );

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
