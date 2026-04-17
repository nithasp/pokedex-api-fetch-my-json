import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { pokemonRouter } from "./handlers/pokemon";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export interface BuildAppOptions {
  corsOrigin?: string;
  enableLogging?: boolean;
}

export function buildApp(options: BuildAppOptions = {}): Express {
  const { corsOrigin = "*", enableLogging = false } = options;

  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: "1mb" }));
  if (enableLogging) {
    app.use(morgan("dev"));
  }

  app.get("/", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "pokedex-backend" });
  });

  app.use("/api/pokemon", pokemonRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
