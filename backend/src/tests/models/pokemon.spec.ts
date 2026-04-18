import { describe, expect, it } from "vitest";
import { Pokemon } from "../../models/pokemon";

const bulbasaur = {
  _id: 1,
  name: "bulbasaur",
  abilities: ["Overgrow", "Chlorophyll"],
  height: 7,
  weight: 69,
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45,
  },
  types: ["Grass", "Poison"],
  captureRate: 45,
  eggGroups: ["Monster", "Plant"],
  flavorTextEntries: ["A test entry"],
  hatchCounter: 20,
  genderRate: 1,
  eVs: ["1 Special-attack"],
  image: {
    full: "https://example.com/full/001.png",
    detail: "https://example.com/detail/001.png",
  },
};

describe("Pokemon model", () => {
  it("uses dex number as _id", async () => {
    const created = await Pokemon.create(bulbasaur);

    expect(created._id).toBe(1);
    expect(created.name).toBe("bulbasaur");
  });

  it("requires a name", async () => {
    await expect(
      Pokemon.create({ _id: 999, name: undefined as unknown as string })
    ).rejects.toThrow();
  });

  it("rejects duplicate _id", async () => {
    await Pokemon.create(bulbasaur);
    await expect(Pokemon.create(bulbasaur)).rejects.toThrow();
  });

  it("adds timestamps automatically", async () => {
    const created = await Pokemon.create(bulbasaur);

    expect(created.createdAt).toBeInstanceOf(Date);
    expect(created.updatedAt).toBeInstanceOf(Date);
  });

  it("does not add a __v versionKey", async () => {
    const created = await Pokemon.create(bulbasaur);
    const raw = created.toObject();

    expect(raw).not.toHaveProperty("__v");
  });

  it("uses the pokemonList collection", () => {
    expect(Pokemon.collection.collectionName).toBe("pokemonList");
  });

  it("findById works with the dex number", async () => {
    await Pokemon.create(bulbasaur);

    const found = await Pokemon.findById(1).lean();

    expect(found).not.toBeNull();
    expect(found?.name).toBe("bulbasaur");
  });
});
