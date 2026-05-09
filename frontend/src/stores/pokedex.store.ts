import { create } from "zustand";
import type {
  PokedexUIActions,
  PokedexUIState,
} from "@/types/pokedex.store.types";

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
