import { Schema, model } from "mongoose";
import type { PokemonAttributes } from "../types/pokemon.type";

export const pokemonSchema = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true, index: true },
    abilities: { type: [String], default: [] },
    height: { type: Number },
    weight: { type: Number },
    stats: {
      hp: Number,
      attack: Number,
      defense: Number,
      specialAttack: Number,
      specialDefense: Number,
      speed: Number,
    },
    types: { type: [String], default: [], index: true },
    captureRate: { type: Number },
    eggGroups: { type: [String], default: [] },
    flavorTextEntries: { type: [String], default: [] },
    hatchCounter: { type: Number },
    genderRate: { type: Number },
    eVs: { type: [String], default: [] },
    image: {
      full: String,
      detail: String,
    },
  },
  { timestamps: true, collection: "pokemonList", versionKey: false }
);

export const Pokemon = model<PokemonAttributes>("Pokemon", pokemonSchema);
