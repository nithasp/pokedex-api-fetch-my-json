"use client";

import {
  KeyboardEvent,
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LazyImage } from "@/shared/components/lazy-image/lazy-image";
import { useGetPokemonSearchDropdownInfinite } from "@/shared/hooks/queries";
import { mapPokemon } from "@/services/pokedex.mapper";
import { useSearchTerm, useSetSearchTerm } from "@/stores";
import type { Pokemon } from "@/types/pokemon.types";

const SEARCH_DEBOUNCE_MS = 400;
const SCROLL_BOTTOM_THRESHOLD_PX = 60;

const capitalizeWords = (value: string): string =>
  value
    .split(" ")
    .map((char) => char.charAt(0).toUpperCase() + char.substring(1))
    .join(" ");

export function SearchBar() {
  const submittedSearchTerm = useSearchTerm();
  const setSubmittedSearchTerm = useSetSearchTerm();

  const [pokemonName, setPokemonName] = useState(submittedSearchTerm);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetPokemonSearchDropdownInfinite(debouncedTerm);

  const dropdownItems: Pokemon[] = useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page.data)
      .map(mapPokemon)
      .filter((p): p is Pokemon => p !== null);
  }, [data]);

  // A search is still "in flight" when:
  //  - the user typed something but the debounced term hasn't caught up yet
  //    (i.e. we're still inside the debounce window), OR
  //  - the query for the current term is actively loading.
  // Showing the loader during BOTH phases prevents a flash of "No results"
  // before the request even starts.
  const trimmedName = pokemonName.trim();
  const isSearching =
    trimmedName.length > 0 && (isLoading || trimmedName !== debouncedTerm);
  const showNoResults =
    !isSearching && trimmedName.length > 0 && dropdownItems.length === 0;

  const handleInputChange = (value: string) => {
    setPokemonName(value);
    setShowSearchBar(value.length > 0);
  };

  const handleSubmitSearch = useCallback(() => {
    const term = pokemonName.trim();
    if (term !== submittedSearchTerm) {
      setSubmittedSearchTerm(term);
    }
    setShowSearchBar(false);
  }, [pokemonName, setSubmittedSearchTerm, submittedSearchTerm]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSubmitSearch();
  };

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = event.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD_PX) {
      void fetchNextPage();
    }
  };

  // Debounce the typed name so the dropdown only fetches after the user stops
  // typing. The main grid is unaffected — it only updates on submit.
  useEffect(() => {
    const trimmed = pokemonName.trim();
    if (!trimmed) {
      setDebouncedTerm("");
      return;
    }
    const handle = window.setTimeout(() => {
      setDebouncedTerm(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [pokemonName]);

  // Close the dropdown when clicking outside the search container.
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const node = containerRef.current;
      if (node && !node.contains(event.target as Node)) {
        setShowSearchBar(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="searchbar-container">
      <input
        type="text"
        value={pokemonName}
        placeholder="Search for Pokemon"
        className="searchbar"
        onClick={() => setShowSearchBar(pokemonName.length > 0)}
        onChange={(event) => handleInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div
        className="wrap-search-image"
        onClick={handleSubmitSearch}
        role="button"
        aria-label="Submit search"
      >
        <img src="/images/icon_magnifying_glass.png" alt="search-icon" />
      </div>

      {pokemonName && showSearchBar && (
        <div className="pokemon-search-list" onScroll={handleListScroll}>
          {isSearching ? (
            <div className="search-list-status loading center">
              <img
                src="/images/loading-img/Spin-1s-200px.gif"
                alt="searching"
              />
              <span>Searching...</span>
            </div>
          ) : showNoResults ? (
            <div className="pokemon-item no-results">
              <div className="pokemon-name">
                <h3>No results</h3>
              </div>
            </div>
          ) : (
            <>
              {dropdownItems.map((value) => {
                const displayName = capitalizeWords(value.name);
                const thumbnail =
                  value.image.detail ||
                  value.image.full ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value.id}.png`;

                return (
                  <div
                    className="pokemon-item"
                    onClick={() => {
                      setPokemonName(value.name);
                      setShowSearchBar(false);
                    }}
                    key={value.id}
                  >
                    <div className="pokemon-thumbnail">
                      <LazyImage
                        src={thumbnail}
                        alt={displayName}
                        className="pokemon-sprite"
                        placeholderSrc="/images/loading-img/Spin-1s-200px.gif"
                      />
                    </div>
                    <div className="pokemon-name">
                      <h3>{displayName}</h3>
                    </div>
                  </div>
                );
              })}

              {isFetchingNextPage && (
                <div className="search-list-status loading">
                  <img
                    src="/images/loading-img/Spin-1s-200px.gif"
                    alt="loading-more"
                  />
                  <span>Loading more...</span>
                </div>
              )}
              {!isFetchingNextPage && !hasNextPage && (
                <div className="search-list-status end">
                  <span>No more results</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
