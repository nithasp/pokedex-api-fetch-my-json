import type { RawPokemon } from "./pokemon.types";

export interface PokedexUIState {
  /** Submitted search term — drives the main grid filter. */
  searchTerm: string;
  /** Saved scroll position for returning to the home page from a detail page. */
  scrollTopPosition: number;
  /**
   * Global pokemon list, populated once via a single `?all=true` request and
   * reused everywhere (home grid, search dropdown, detail page) so the app
   * never hits the API again for list/detail data.
   */
  pokemonList: RawPokemon[];
  /**
   * Flips to `true` after the bulk list has been fetched successfully. The
   * pages use it to differentiate "still loading the very first time" from
   * "loaded and the list is genuinely empty".
   */
  isPokemonListLoaded: boolean;
  /**
   * How many cards the home grid is currently revealing. Persisted in the
   * store (not local component state) so that returning from the detail page
   * shows the same number of cards the user had loaded — otherwise the saved
   * `scrollTopPosition` would land in empty space.
   */
  homeVisibleCount: number;
}

export interface PokedexUIActions {
  /**
   * Apply a new submitted search term. Resets the home grid back to the first
   * page and to the top of the viewport so search results aren't shown
   * mid-scroll under a stale offset.
   */
  setSearchTerm: (term: string) => void;
  setScrollTopPosition: (y: number) => void;
  setPokemonList: (list: RawPokemon[]) => void;
  /** Reveal the next chunk of cards in the home grid. */
  incrementHomeVisibleCount: () => void;
  reset: () => void;
}
