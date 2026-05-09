export const siteConfig = {
  name: "Pokedex",
  shortName: "Pokedex",
  description:
    "This is pokedex, you can search your favorite pokemon with name in searchbar for see the informations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/public_images/pokemon-3418266_1280.png",
  locale: "en-US",
  authors: [{ name: "N Sp" }],
} as const;
