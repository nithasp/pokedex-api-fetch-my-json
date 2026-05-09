export const queryKeys = {
  pokemon: {
    all: ["pokemon"] as const,
    /** Main grid (paginated by `page`, optionally filtered by `search`/`type`). */
    list: (params: { search?: string; type?: string } = {}) =>
      ["pokemon", "list", params] as const,
    /** Search dropdown (paginated by `page`, debounced search). */
    searchDropdown: (search: string) =>
      ["pokemon", "search-dropdown", search] as const,
    detail: (id: string | number) =>
      ["pokemon", "detail", String(id)] as const,
  },
} as const;
