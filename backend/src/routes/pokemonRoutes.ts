import { Router } from "express";
import { z } from "zod";
import { getPokemon, getPokemons } from "../controllers/pokemonController";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";

export const pokemonRouter = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(25),
  type: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

pokemonRouter.get(
  "/",
  validate(listQuerySchema, "query"),
  asyncHandler(getPokemons)
);

pokemonRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(getPokemon)
);
