import { buildApp } from "./app";
import { config } from "./config";
import { connectDatabase, disconnectDatabase } from "./database";

async function start(): Promise<void> {
  await connectDatabase();

  const app = buildApp({
    corsOrigin: config.corsOrigin,
    enableLogging: true,
  });

  const server = app.listen(config.port, () => {
    console.log(
      `[server] Listening on http://localhost:${config.port} (${config.nodeEnv})`
    );
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[server] ${signal} received, shutting down...`);
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error("[server] Failed to start:", err);
  process.exit(1);
});
