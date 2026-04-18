import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { pokemonRouter } from "./routes/pokemon-routes";
import type { BuildAppOptions } from "./types/build-app-options.type";

export function buildApp({ corsOrigin = "*", enableLogging = false }: BuildAppOptions = {}): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: "1mb" }));
  if (enableLogging) app.use(morgan("dev"));

  app.get("/", (_req, res) => {
    res.json({ status: "ok", service: "pokedex-backend" });
  });

  app.use("/api/pokemon", pokemonRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
