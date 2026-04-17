export interface PokemonStats {
  hp?: number;
  attack?: number;
  defense?: number;
  specialAttack?: number;
  specialDefense?: number;
  speed?: number;
}

export interface PokemonImage {
  full?: string;
  detail?: string;
}

export interface Pokemon {
  _id: number;
  name: string;
  abilities: string[];
  height?: number;
  weight?: number;
  stats?: PokemonStats;
  types: string[];
  captureRate?: number;
  eggGroups: string[];
  flavorTextEntries: string[];
  hatchCounter?: number;
  genderRate?: number;
  eVs: string[];
  image?: PokemonImage;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPokemonQuery {
  page: number;
  limit: number;
  type?: string;
  search?: string;
}

export interface PokemonIdParams {
  id: number;
}
