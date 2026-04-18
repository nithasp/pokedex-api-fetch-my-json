import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
} from "react";

import { getPokemonList } from "../core/services/pokedex.service";
import { mapPokemon } from "../core/services/pokedex.mapper";

const PAGE_LIMIT = 12;

const PokedexContext = createContext();

const typesColor = {
  grass: "#66f609",
  fire: "#fb0b0a",
  water: "#35aef5",
  normal: "#cbc8a9",
  flying: "#075663",
  bug: "#90b92d",
  poison: "#60127f",
  electric: "#fef923",
  ground: "#beab20",
  fighting: "#7f0a10",
  psychic: "#890431",
  rock: "#93824e",
  ice: "#65d0e4",
  ghost: "#462a52",
  dragon: "#8954fc",
  dark: "#2c211b",
  steel: "#bac4c3",
  fairy: "#fe9fc1",
};

const emptyPagination = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};

const GlobalContext = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [pokemonName, setPokemonName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pokemon Data — same normalized shape used by list, search dropdown and detail page.
  const [pokemon, setPokemon] = useState([]);
  const [pokemonFilter, setPokemonFilter] = useState([]);
  const [pokemonSearchData, setPokemonSearchData] = useState([]);
  const [pokemonFullInformation, setPokemonFullInformation] = useState([]);

  // Pagination from the API — main grid (driven by initial load + submit search).
  const [pagination, setPagination] = useState(emptyPagination);

  // Pagination + loading flags for the search dropdown only. Kept separate so
  // typing in the search bar never affects the main grid.
  const [searchPagination, setSearchPagination] = useState(emptyPagination);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);

  // Scroll Top Position
  const [scrollTopPosition, setScrollTopPosition] = useState(0);

  // Track the current "view" so loadMore knows what query to continue.
  // Two separate refs: one for the main grid, one for the dropdown.
  const currentMainSearchRef = useRef("");
  const currentDropdownSearchRef = useRef("");

  // --- Main grid helpers ---------------------------------------------------
  const applyMainList = useCallback((mapped, pg) => {
    setPokemon(mapped);
    setPokemonFilter(mapped);
    setPokemonFullInformation(mapped);
    setPagination(pg || emptyPagination);
  }, []);

  const appendMainList = useCallback((mapped, pg) => {
    setPokemon((prev) => [...prev, ...mapped]);
    setPokemonFilter((prev) => [...(Array.isArray(prev) ? prev : []), ...mapped]);
    setPokemonFullInformation((prev) => [...prev, ...mapped]);
    if (pg) setPagination(pg);
  }, []);

  // --- Dropdown helpers ----------------------------------------------------
  const applySearchDropdown = useCallback((mapped, pg) => {
    setPokemonSearchData(mapped);
    setSearchPagination(pg || emptyPagination);
  }, []);

  const appendSearchDropdown = useCallback((mapped, pg) => {
    setPokemonSearchData((prev) => [...prev, ...mapped]);
    if (pg) setSearchPagination(pg);
  }, []);

  // Initial load: page 1, default 12 items. Seeds both the main grid and the
  // dropdown so the dropdown has something to show on first focus.
  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    currentMainSearchRef.current = "";
    currentDropdownSearchRef.current = "";
    try {
      const { data, pagination: pg } = await getPokemonList({
        page: 1,
        limit: PAGE_LIMIT,
      });
      const mapped = data.map(mapPokemon);
      applyMainList(mapped, pg);
      applySearchDropdown(mapped, pg);
    } catch (err) {
      setError(err.message || "Failed to load pokemon");
      setPokemon([]);
      setPokemonFilter(undefined);
      setPokemonSearchData([]);
      setPokemonFullInformation([]);
      setPagination(emptyPagination);
      setSearchPagination(emptyPagination);
    } finally {
      setLoading(false);
    }
  }, [applyMainList, applySearchDropdown]);

  // Load next page (12 more items) for the MAIN grid only (search-aware).
  const loadMorePokemon = useCallback(async () => {
    if (loadingMore) return;
    if (pagination.page >= pagination.totalPages) return;

    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = pagination.page + 1;
      const { data, pagination: pg } = await getPokemonList({
        page: nextPage,
        limit: PAGE_LIMIT,
        search: currentMainSearchRef.current,
      });
      appendMainList(data.map(mapPokemon), pg);
    } catch (err) {
      setError(err.message || "Failed to load more pokemon");
    } finally {
      setLoadingMore(false);
    }
  }, [appendMainList, loadingMore, pagination]);

  // Load next page for the DROPDOWN only.
  const loadMoreSearchDropdown = useCallback(async () => {
    if (searchLoadingMore) return;
    if (searchPagination.page >= searchPagination.totalPages) return;

    setSearchLoadingMore(true);
    try {
      const nextPage = searchPagination.page + 1;
      const { data, pagination: pg } = await getPokemonList({
        page: nextPage,
        limit: PAGE_LIMIT,
        search: currentDropdownSearchRef.current,
      });
      appendSearchDropdown(data.map(mapPokemon), pg);
    } catch (err) {
      // Dropdown errors are non-fatal; just stop the spinner.
      console.error("[PokedexContext] loadMoreSearchDropdown failed:", err);
    } finally {
      setSearchLoadingMore(false);
    }
  }, [appendSearchDropdown, searchLoadingMore, searchPagination]);

  // Debounced/typing search — updates ONLY the dropdown list. Never touches
  // the main grid or the global loading overlay.
  const searchPokemonDropdown = useCallback(
    async (term) => {
      const cleanTerm = (term || "").trim();
      currentDropdownSearchRef.current = cleanTerm;

      setSearchLoading(true);
      try {
        const { data, pagination: pg } = await getPokemonList({
          page: 1,
          limit: PAGE_LIMIT,
          search: cleanTerm,
        });
        applySearchDropdown(data.map(mapPokemon), pg);
      } catch (err) {
        console.error("[PokedexContext] searchPokemonDropdown failed:", err);
        setPokemonSearchData([]);
        setSearchPagination(emptyPagination);
      } finally {
        setSearchLoading(false);
      }
    },
    [applySearchDropdown]
  );

  // Submit search (Enter / magnifier click) — replaces the MAIN grid.
  // Resets pagination to page 1 for the new query.
  const searchPokemon = useCallback(
    async (term) => {
      const cleanTerm = (term || "").trim();
      setSearchTerm(cleanTerm);
      currentMainSearchRef.current = cleanTerm;

      setLoading(true);
      setError(null);
      try {
        const { data, pagination: pg } = await getPokemonList({
          page: 1,
          limit: PAGE_LIMIT,
          search: cleanTerm,
        });
        applyMainList(data.map(mapPokemon), pg);
      } catch (err) {
        setError(err.message || "Failed to search pokemon");
        setPokemonFilter([]);
        setPokemonFullInformation([]);
        setPagination(emptyPagination);
      } finally {
        setLoading(false);
      }
    },
    [applyMainList]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <PokedexContext.Provider
      value={{
        // Status
        loading,
        setLoading,
        loadingMore,
        error,

        // Data
        pokemon,
        setPokemon,
        pokemonSearchData,
        setPokemonSearchData,
        pokemonFilter,
        setPokemonFilter,
        pokemonFullInformation,

        // Search
        pokemonName,
        setPokemonName,
        searchTerm,
        searchPokemon,
        searchPokemonDropdown,
        searchLoading,

        // Pagination
        pagination,
        loadMorePokemon,
        searchPagination,
        loadMoreSearchDropdown,
        searchLoadingMore,

        // Misc UI
        typesColor,
        scrollTopPosition,
        setScrollTopPosition,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
};

export { PokedexContext, GlobalContext };
