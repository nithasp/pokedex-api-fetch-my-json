/**
 * Bulk-writes image paths (not full URLs) for all 898 Pokemon documents.
 *
 * The DB stores only the relative path, e.g.:
 *   image.full   → "images/pokemon/full/004.png"
 *   image.detail → "images/pokemon/detail/004.png"
 *
 * The full URL is assembled at response time by the controller using
 * the R2_PUBLIC_URL environment variable — so you never need to re-run
 * this script just because your CDN domain changed.
 *
 * You only need to re-run this script if you move to a completely
 * different image naming convention.
 *
 * Usage:
 *   node backend/scripts/update-image-urls.js
 */

const dns = require("dns");
const path = require("path");
const { MongoClient } = require("mongodb");

// Windows IPv6 link-local DNS can cause ECONNREFUSED on SRV lookups
if (process.platform === "win32") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const TOTAL = 898;

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("\nError: MONGO_URI is not set in backend/.env\n");
  process.exit(1);
}

/** Zero-pad dex id to 3 digits: 4 → "004", 10 → "010", 100 → "100" */
const pad = (id) => String(id).padStart(3, "0");

async function main() {
  console.log(`\nConnecting to MongoDB...`);
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log(`Connected.\n`);

  const dbName = MONGO_URI.split("/").pop().split("?")[0] || "pokemon";
  const collection = client.db(dbName).collection("pokemonList");

  console.log(`Database   : ${dbName}`);
  console.log(`Collection : pokemonList`);
  console.log(`Updating ${TOTAL} documents with image paths...\n`);

  const ops = [];
  for (let id = 1; id <= TOTAL; id++) {
    const file = `${pad(id)}.png`;
    ops.push({
      updateOne: {
        filter: { _id: id },
        update: {
          $set: {
            // Store path only — full URL is built in the controller via R2_PUBLIC_URL
            "image.full": `images/pokemon/full/${file}`,
            "image.detail": `images/pokemon/detail/${file}`,
          },
        },
        upsert: false,
      },
    });
  }

  const result = await collection.bulkWrite(ops, { ordered: false });

  console.log("─── Summary ────────────────────────────────────────");
  console.log(`  Matched   : ${result.matchedCount}`);
  console.log(`  Modified  : ${result.modifiedCount}`);
  console.log(`  Upserted  : ${result.upsertedCount}`);
  console.log("────────────────────────────────────────────────────\n");

  if (result.modifiedCount === 0) {
    console.log("⚠  No documents were modified. Check your collection has _id 1–898.\n");
  } else {
    console.log("✓  Image paths stored in DB (relative, no domain).");
    console.log("   Full URL is built at runtime using R2_PUBLIC_URL env var.\n");
    console.log("   Example in API response:");
    console.log("     R2_PUBLIC_URL=https://pub-XXXX.r2.dev");
    console.log('     → "full": "https://pub-XXXX.r2.dev/images/pokemon/full/001.png"\n');
  }

  await client.close();
  console.log("Disconnected. Done.\n");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
