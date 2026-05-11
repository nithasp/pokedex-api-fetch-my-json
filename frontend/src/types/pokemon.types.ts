export type PokemonTypeName =
  | "grass"
  | "fire"
  | "water"
  | "normal"
  | "flying"
  | "bug"
  | "poison"
  | "electric"
  | "ground"
  | "fighting"
  | "psychic"
  | "rock"
  | "ice"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface PokemonImage {
  full?: string;
  detail?: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

/**
 * Raw pokemon item returned by the Pokedex API.
 * MongoDB-style with `_id` and a few raw numeric fields that need post-processing.
 */
export interface RawPokemon {
  _id: number;
  name: string;
  height: number;
  weight: number;
  captureRate?: number;
  genderRate?: number;
  hatchCounter?: number;
  flavorTextEntries?: string[];
  eVs?: string[];
  abilities?: string[];
  eggGroups?: string[];
  stats?: PokemonStats;
  types?: string[];
  image?: PokemonImage;
}

/**
 * Normalised pokemon object consumed by the UI.
 * Produced by `mapPokemon` in `shared/selectors/pokemon.selectors.ts`.
 */
export interface Pokemon {
  id: number;
  name: string;
  height: {
    decimetres: number;
    centimeter: number;
    feet: string;
  };
  weight: {
    killogram: number;
    pound: string;
  };
  captureRate: number;
  genderRatio: {
    originalRate: number;
    femaleRate: number;
    maleRate: number;
  };
  hatchSteps: number;
  description: string;
  evs: string[];
  abilities: string[];
  eggGroups: string[];
  stats: PokemonStats;
  types: string[];
  image: PokemonImage;
}

export interface PokemonSummary {
  id: number;
  name: string;
  image: PokemonImage;
}

export interface PokemonCardListProps {
  pokemon: Pokemon[];
  hasMore: boolean;
  onLoadMore: () => void;
}

export interface PokemonInfoProps {
  numericId: number;
  routeId: string;
}

export interface PokemonInfoNavigatorProps {
  currentId: number;
  prevPokemon: PokemonSummary | null;
  nextPokemon: PokemonSummary | null;
}

export interface PokemonStatsSectionProps {
  stats: PokemonStats;
}
