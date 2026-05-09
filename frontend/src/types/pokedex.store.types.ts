export interface PokedexUIState {
  /** Submitted search term — drives the main grid query. */
  searchTerm: string;
  /** Saved scroll position for returning to the home page from a detail page. */
  scrollTopPosition: number;
}

export interface PokedexUIActions {
  setSearchTerm: (term: string) => void;
  setScrollTopPosition: (y: number) => void;
  reset: () => void;
}
