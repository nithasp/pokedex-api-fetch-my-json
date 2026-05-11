export const queryKeys = {
  pokemon: {
    /**
     * Single key for the bulk `?all=true` fetch. The whole app reads from the
     * Zustand store after the response has been hydrated, so there is only
     * ever one pokemon-related query in the cache.
     */
    all: ["pokemon", "all"] as const,
  },
} as const;
