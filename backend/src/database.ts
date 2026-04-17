import dns from "dns";
import mongoose from "mongoose";
import { config } from "./config";

// Windows IPv6 link-local DNS (fe80::1) can cause ECONNREFUSED on SRV lookups
// when using mongodb+srv:// URIs. Force public resolvers to avoid it.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
  console.log("[db] Connected to MongoDB");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log("[db] Disconnected from MongoDB");
}
