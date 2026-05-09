import type {
  Pokemon,
  PokemonSummary,
  RawPokemon,
} from "@/types/pokemon.types";

/**
 * Normalize a raw API pokemon object into the shape the UI expects.
 * Shared by the list view and the detail view so both pages apply the
 * exact same transformation.
 */
export const mapPokemon = (item: RawPokemon | null | undefined): Pokemon | null => {
  if (!item) return null;

  const heightDecimetres = Number(item.height) || 0;
  const weightHectograms = Number(item.weight) || 0;
  const genderRate =
    typeof item.genderRate === "number" ? item.genderRate : -1;

  return {
    id: item._id,
    name: item.name,
    height: {
      decimetres: heightDecimetres,
      centimeter: heightDecimetres * 10,
      feet: Number(heightDecimetres * 0.328084).toFixed(2),
    },
    weight: {
      killogram: Math.round(weightHectograms * 0.1),
      pound: Number(weightHectograms * 0.220462).toFixed(2),
    },
    captureRate: Math.round((100 / 255) * (item.captureRate || 0)),
    genderRatio: {
      originalRate: genderRate,
      femaleRate: genderRate >= 0 ? genderRate * 12.5 : 0,
      maleRate: genderRate >= 0 ? (8 - genderRate) * 12.5 : 0,
    },
    hatchSteps: 255 * ((item.hatchCounter || 0) + 1),
    description:
      Array.isArray(item.flavorTextEntries) &&
      item.flavorTextEntries.length > 0
        ? item.flavorTextEntries[0]
        : "",
    evs: Array.isArray(item.eVs) ? item.eVs : [],
    abilities: Array.isArray(item.abilities) ? item.abilities : [],
    eggGroups: Array.isArray(item.eggGroups) ? item.eggGroups : [],
    stats: item.stats || {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    },
    types: Array.isArray(item.types) ? item.types : [],
    image: item.image || { full: "", detail: "" },
  };
};

/**
 * Lightweight projection used for the prev/next navigator on the detail page.
 * Keeps only what the navigator renders.
 */
export const mapPokemonSummary = (
  item: RawPokemon | null | undefined
): PokemonSummary | null => {
  if (!item) return null;
  return {
    id: item._id,
    name: item.name,
    image: item.image || { full: "", detail: "" },
  };
};
