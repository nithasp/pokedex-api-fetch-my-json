/**
 * One-time migration: removes the now-redundant `image` field from every
 * pokemon document in the `pokemonList` collection.
 *
 * Background
 * ----------
 * The DB used to store relative image paths like:
 *   image.full   → "images/pokemon/full/004.png"
 *   image.detail → "images/pokemon/detail/004.png"
 *
 * Those paths are 100% derivable from `_id` + env vars, so the controller
 * now derives them at response time via `buildImageUrls`. Storing them in
 * the DB is just stale data that has to be migrated every time the format
 * (png → webp), folder layout, or CDN changes.
 *
 * After running this once, the database stays format-agnostic forever —
 * future format changes only require flipping `IMAGE_EXTENSION` in .env.
 *
 * Safe to delete this script after running it once.
 *
 * Usage:
 *   node backend/scripts/remove-image-field.js
 *   node backend/scripts/remove-image-field.js --dry-run   (preview only)
 */

const dns = require("dns");
const path = require("path");
const { MongoClient } = require("mongodb");

// Windows IPv6 link-local DNS can cause ECONNREFUSED on SRV lookups
if (process.platform === "win32") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const DRY_RUN = process.argv.includes("--dry-run");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("\nError: MONGO_URI is not set in backend/.env\n");
  process.exit(1);
}

async function main() {
  if (DRY_RUN) console.log("\n[DRY RUN] No documents will be modified.\n");

  console.log(`Connecting to MongoDB...`);
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log(`Connected.\n`);

  const dbName = MONGO_URI.split("/").pop().split("?")[0] || "pokemon";
  const collection = client.db(dbName).collection("pokemonList");

  console.log(`Database   : ${dbName}`);
  console.log(`Collection : pokemonList`);

  const matchCount = await collection.countDocuments({ image: { $exists: true } });
  console.log(`Documents with an 'image' field: ${matchCount}\n`);

  if (matchCount === 0) {
    console.log("Nothing to do — no documents have an 'image' field.\n");
    await client.close();
    return;
  }

  if (DRY_RUN) {
    console.log(`Would unset 'image' on ${matchCount} document(s).\n`);
    await client.close();
    return;
  }

  console.log(`Removing 'image' field from ${matchCount} document(s)...\n`);
  const result = await collection.updateMany(
    { image: { $exists: true } },
    { $unset: { image: "" } }
  );

  console.log("─── Summary ────────────────────────────────────────");
  console.log(`  Matched   : ${result.matchedCount}`);
  console.log(`  Modified  : ${result.modifiedCount}`);
  console.log("────────────────────────────────────────────────────\n");

  if (result.modifiedCount > 0) {
    console.log("✓  'image' field removed from all documents.");
    console.log("   API responses still include `image: { full, detail }` —");
    console.log("   those URLs are now derived from `_id` in the controller.\n");
  }

  await client.close();
  console.log("Disconnected. Done.\n");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
