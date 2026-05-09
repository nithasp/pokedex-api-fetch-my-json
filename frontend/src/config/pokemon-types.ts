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

/**
 * Background color for each pokemon type badge.
 * Mirrors the palette defined in the original Pokedex Context.
 */
export const TYPES_COLOR: Record<PokemonTypeName, string> = {
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

export const getTypeColor = (type: string): string =>
  TYPES_COLOR[type.toLowerCase() as PokemonTypeName] ?? "#666";
