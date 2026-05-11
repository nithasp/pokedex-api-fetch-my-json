"use client";

import { useMemo } from "react";
import {
  filterPokemonByName,
  mapPokemon,
} from "@/shared/selectors/pokemon.selectors";
import {
  useHomeVisibleCount,
  useIncrementHomeVisibleCount,
  usePokemonList,
  useSearchTerm,
} from "@/stores";
import type { Pokemon } from "@/types/pokemon.types";
import { PokemonCardList } from "./pokemon-card";

export function PokemonList() {
  const allPokemon = usePokemonList();
  const searchTerm = useSearchTerm();
  const visibleCount = useHomeVisibleCount();
  const incrementVisibleCount = useIncrementHomeVisibleCount();

  // Apply the submitted search filter against the cached `?all=true` list.
  // All work is local — no extra API calls, no React Query roundtrips.
  const filteredRaw = useMemo(
    () => filterPokemonByName(allPokemon, searchTerm),
    [allPokemon, searchTerm]
  );

  // Reveal `visibleCount` items at a time so the "Load More" UX matches the
  // old paginated behaviour without hitting the server.
  const visiblePokemon: Pokemon[] = useMemo(
    () =>
      filteredRaw
        .slice(0, visibleCount)
        .map(mapPokemon)
        .filter((item): item is Pokemon => item !== null),
    [filteredRaw, visibleCount]
  );

  const hasMore = visibleCount < filteredRaw.length;

  return (
    <div className="wrap-pokemon-list text-center">
      <PokemonCardList
        pokemon={visiblePokemon}
        hasMore={hasMore}
        onLoadMore={incrementVisibleCount}
      />
    </div>
  );
}
