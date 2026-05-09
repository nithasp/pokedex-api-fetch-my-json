import type { HydratedDocument, InferSchemaType } from "mongoose";
import type { pokemonSchema } from "../models/pokemon";

export type PokemonAttributes = InferSchemaType<typeof pokemonSchema>;
export type PokemonDocument = HydratedDocument<PokemonAttributes>;
