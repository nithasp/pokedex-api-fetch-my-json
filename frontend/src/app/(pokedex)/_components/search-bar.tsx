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
import { selectPokemonList } from "@/shared/selectors/pokemon.selectors";
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

  const dropdownItems: Pokemon[] = useMemo(
    () => (data ? data.pages.flatMap(selectPokemonList) : []),
    [data]
  );

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
    <div
      ref={containerRef}
      className="searchbar-container relative w-[90%] max-w-[500px] mx-auto"
    >
      <input
        type="text"
        value={pokemonName}
        placeholder="Search for Pokemon"
        className="w-full max-h-[40px] outline-none p-2.5 text-[21px] capitalize tracking-[0.5px] text-black bg-white max-[450px]:text-[5vw]"
        onClick={() => setShowSearchBar(pokemonName.length > 0)}
        onChange={(event) => handleInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div
        className="absolute right-0 top-1/2 w-[70px] h-[97%] -translate-y-1/2 bg-[#b4ebff] cursor-pointer transition-all duration-300 hover:bg-[#b2ecff]"
        onClick={handleSubmitSearch}
        role="button"
        aria-label="Submit search"
      >
        <img
          src="/images/icon_magnifying_glass.png"
          alt="search-icon"
          className="h-[25px] w-[25px] absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        />
      </div>

      {pokemonName && showSearchBar && (
        <div
          className="pokemon-search-list bg-[#0d1117] w-full absolute z-[1] max-h-[389px] overflow-y-auto"
          onScroll={handleListScroll}
        >
          {isSearching ? (
            <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 text-[#c9d1d9] text-sm tracking-[0.5px] bg-[#0d1117] min-h-[120px]">
              <img
                src="/images/loading-img/Spin-1s-200px.gif"
                alt="searching"
                className="w-[40px] h-[40px]"
              />
              <span>Searching...</span>
            </div>
          ) : showNoResults ? (
            <div className="flex justify-between items-center px-[30px] cursor-pointer border-[1.2px] border-[#8b949e] border-t-0">
              <div className="py-5">
                <h3 className="m-0">No results</h3>
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
                    className="flex justify-between items-center px-[30px] cursor-pointer border-[1.2px] border-[#8b949e] border-t-0"
                    onClick={() => {
                      setPokemonName(value.name);
                      setShowSearchBar(false);
                    }}
                    key={value.id}
                  >
                    <div className="pokemon-thumbnail w-[100px] h-[100px]">
                      <LazyImage
                        src={thumbnail}
                        alt={displayName}
                        placeholderSrc="/images/loading-img/Spin-1s-200px.gif"
                      />
                    </div>
                    <div className="py-5">
                      <h3 className="m-0">{displayName}</h3>
                    </div>
                  </div>
                );
              })}

              {isFetchingNextPage && (
                <div className="flex items-center justify-center gap-2.5 px-4 py-3 text-[#c9d1d9] text-sm tracking-[0.5px] border-t border-[#8b949e] bg-[#0d1117]">
                  <img
                    src="/images/loading-img/Spin-1s-200px.gif"
                    alt="loading-more"
                    className="w-[22px] h-[22px]"
                  />
                  <span>Loading more...</span>
                </div>
              )}
              {!isFetchingNextPage && !hasNextPage && (
                <div className="flex items-center justify-center gap-2.5 px-4 py-3 text-[#8b949e] italic text-sm tracking-[0.5px] border-t border-[#8b949e] bg-[#0d1117]">
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
