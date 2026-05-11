import { create } from "zustand";
import { DEFAULT_PAGE_LIMIT } from "@/shared/utils/pagination";
import type {
  PokedexUIActions,
  PokedexUIState,
} from "@/types/pokedex.store.types";
import type { RawPokemon } from "@/types/pokemon.types";

const INITIAL_STATE: PokedexUIState = {
  searchTerm: "",
  scrollTopPosition: 0,
  pokemonList: [],
  isPokemonListLoaded: false,
  homeVisibleCount: DEFAULT_PAGE_LIMIT,
};

export const usePokedexStore = create<PokedexUIState & PokedexUIActions>(
  (set) => ({
    ...INITIAL_STATE,

    setSearchTerm: (term: string) =>
      set((state) =>
        state.searchTerm === term
          ? state
          : {
              searchTerm: term,
              homeVisibleCount: DEFAULT_PAGE_LIMIT,
              scrollTopPosition: 0,
            }
      ),
    setScrollTopPosition: (y: number) => set({ scrollTopPosition: y }),
    setPokemonList: (list: RawPokemon[]) =>
      set({ pokemonList: list, isPokemonListLoaded: true }),
    incrementHomeVisibleCount: () =>
      set((state) => ({
        homeVisibleCount: state.homeVisibleCount + DEFAULT_PAGE_LIMIT,
      })),
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

export const usePokemonList = () =>
  usePokedexStore((state) => state.pokemonList);

export const useSetPokemonList = () =>
  usePokedexStore((state) => state.setPokemonList);

export const useIsPokemonListLoaded = () =>
  usePokedexStore((state) => state.isPokemonListLoaded);

export const useHomeVisibleCount = () =>
  usePokedexStore((state) => state.homeVisibleCount);

export const useIncrementHomeVisibleCount = () =>
  usePokedexStore((state) => state.incrementHomeVisibleCount);
