# Pokedex Frontend

A modern Pokedex web application built with the latest web technologies.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI**: [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Fetching**: [Axios](https://axios-http.com/) + [TanStack Query v5](https://tanstack.com/query)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## Project Structure

```
src/
  app/                       # Next.js App Router pages
    _components/             # Home page-scoped components
    pokemon/[id]/            # Pokemon detail page
      _components/           # Detail page-scoped components
    layout.tsx
    page.tsx
    globals.css
  config/                    # Site/route configuration + pokemon types color map
  lib/                       # Axios client
  providers/                 # App-level providers (TanStack Query)
  services/                  # API services + mappers
  shared/
    components/              # Cross-cutting UI components (LazyImage)
    hooks/queries/           # TanStack Query hooks
    utils/                   # Utility functions (smooth scroll)
  stores/                    # Zustand stores
  types/                     # TypeScript types
  env.ts                     # Validated env vars
public/
  fonts/                     # Self-hosted webfonts
  images/                    # App images
  public_images/             # Public assets (favicon, OG images)
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   NEXT_PUBLIC_API_URL=https://pokedex-api-fetch-my-json-production.up.railway.app/api/pokemon
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script              | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Start the dev server with Turbopack      |
| `npm run build`     | Build the app for production             |
| `npm run start`     | Start the production server              |
| `npm run typecheck` | Run TypeScript type checking             |
