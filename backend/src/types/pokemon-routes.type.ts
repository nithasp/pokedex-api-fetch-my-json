import type { z } from "zod";
import type { idParamSchema, listQuerySchema } from "../routes/pokemon-routes";

export type ListPokemonQuery = z.infer<typeof listQuerySchema>;
export type PokemonIdParams = z.infer<typeof idParamSchema>;
