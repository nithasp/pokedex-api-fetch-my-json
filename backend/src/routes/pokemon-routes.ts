import { Router } from "express";
import { z } from "zod";
import { getPokemon, getPokemons } from "../controllers/pokemon-controller";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/async-handler";

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(25),
  type: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  all: z.enum(["true", "false"]).default("false").transform((v) => v === "true"),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const pokemonRouter = Router();

pokemonRouter.get(
  "/",
  validate(listQuerySchema, "query"),
  asyncHandler(getPokemons),
);

pokemonRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(getPokemon),
);
