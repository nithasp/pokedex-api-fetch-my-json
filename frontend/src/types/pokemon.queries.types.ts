import type { Pokemon, PokemonSummary } from "@/types/pokemon.types";

export interface PokemonDetailResult {
  current: Pokemon | null;
  prev: PokemonSummary | null;
  next: PokemonSummary | null;
}
