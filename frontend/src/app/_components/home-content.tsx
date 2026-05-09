"use client";

import { useEffect } from "react";
import { useSearchTerm } from "@/stores";
import { useGetPokemonInfinite } from "@/shared/hooks/queries";
import { useScrollTopPosition } from "@/stores";
import { PokemonList } from "./pokemon-list";
import { SearchBar } from "./search-bar";

export function HomeContent() {
  const searchTerm = useSearchTerm();
  const scrollTopPosition = useScrollTopPosition();

  // Drive the global loader from the main grid query — typing in the search
  // bar updates the dropdown via a separate query, so this loader only flips
  // on the initial fetch and on submitted searches.
  const { isLoading } = useGetPokemonInfinite(searchTerm);

  // Restore the saved scroll position when returning from the detail page.
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, scrollTopPosition);
    }
  }, [isLoading, scrollTopPosition]);

  return (
    <section className="home-section">
      <h1 className="pokemon-header-title">Pokedex</h1>
      {isLoading ? (
        <div className="home-loading">
          <img
            src="/images/loading-img/loading250x250-2.gif"
            alt="loading-img"
          />
        </div>
      ) : (
        <div className="pokemon-container">
          <SearchBar />
          <PokemonList />
        </div>
      )}
    </section>
  );
}
