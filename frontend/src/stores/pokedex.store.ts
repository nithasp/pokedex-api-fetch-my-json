import { create } from "zustand";

interface PokedexUIState {
  /** Submitted search term — drives the main grid query. */
  searchTerm: string;
  /** Saved scroll position for returning to the home page from a detail page. */
  scrollTopPosition: number;
}

interface PokedexUIActions {
  setSearchTerm: (term: string) => void;
  setScrollTopPosition: (y: number) => void;
  reset: () => void;
}

const INITIAL_STATE: PokedexUIState = {
  searchTerm: "",
  scrollTopPosition: 0,
};

export const usePokedexStore = create<PokedexUIState & PokedexUIActions>(
  (set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (term: string) => set({ searchTerm: term }),
    setScrollTopPosition: (y: number) => set({ scrollTopPosition: y }),
    reset: () => set({ ...INITIAL_STATE }),
  })
);

export const useSearchTerm = () =>
  usePokedexStore((state) => state.searchTerm);

export const useSetSearchTerm = () =>
  usePokedexStore((state) => state.setSearchTerm);

export const useScrollTopPosition = () =>
  usePokedexStore((state) => state.scrollTopPosition);

export const useSetScrollTopPosition = () =>
  usePokedexStore((state) => state.setScrollTopPosition);
