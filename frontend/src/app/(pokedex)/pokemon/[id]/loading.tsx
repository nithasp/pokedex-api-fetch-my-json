/**
 * Per-route override of the global `app/loading.tsx` fallback.
 *
 * The detail page handles its own initial-load UI inside `<PokemonInfo>`
 * (see the "first-time entry" early return there). Letting the global
 * `loading250x250-2.gif` fallback fire during prev/next client-side
 * navigations would unmount `<PokemonInfo>` and visibly flash the global
 * loader over the page.
 *
 * Returning `null` here turns this route's Suspense fallback into a no-op,
 * which lets `<Link>`'s default `startTransition` keep the previous detail
 * page on screen until the new pokemon's data is ready (which is instant
 * because everything is read from the global pokedex store).
 */
export default function PokemonDetailLoading() {
  return null;
}
