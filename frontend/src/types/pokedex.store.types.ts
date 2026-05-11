import type { DisplayedPokemon } from "./pokemon.types";

export interface PokedexUIState {
  /** Submitted search term — drives the main grid query. */
  searchTerm: string;
  /** Saved scroll position for returning to the home page from a detail page. */
  scrollTopPosition: number;
  /**
   * Currently-rendered pokemon detail snapshot. Held outside the React
   * tree so it survives unmount/remount of `<PokemonInfo>` during route
   * transitions, which keeps prev/next navigation flicker-free.
   */
  displayedPokemon: DisplayedPokemon | null;
}

export interface PokedexUIActions {
  setSearchTerm: (term: string) => void;
  setScrollTopPosition: (y: number) => void;
  setDisplayedPokemon: (snapshot: DisplayedPokemon | null) => void;
  reset: () => void;
}
