/**
 * Route Numbers flashcards — deck builder.
 *
 * Drills the Centennial numbered route tree (app/data/routes.ts, transcribed
 * from varsity page 14) in BOTH directions:
 *  - number-to-route: front shows the big number, back reveals name + shape.
 *  - route-to-number: front shows the drawn shape, back reveals the number.
 *
 * Direction policy: the deck carries one card EACH WAY per route (2 × routes),
 * shuffled together, so every lap guarantees both directions get reps rather
 * than leaving a direction to the luck of a coin flip. Same bus-mode contract
 * as useFlashcards.ts: pure functions, nothing scored, nothing stored — the
 * page owns the disposable drill state.
 */
import type { RouteDef } from '~/types/football'

export type RouteCardDirection = 'number-to-route' | 'route-to-number'

export interface RouteCard {
  kind: 'route-numbers'
  route: RouteDef
  /** Which side of the pairing the front of the card asks about. */
  direction: RouteCardDirection
}

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

/** One card per route per direction — both ways every lap, shuffled. */
export function buildRouteDeck(routes: RouteDef[]): RouteCard[] {
  return shuffle(
    routes.flatMap((route): RouteCard[] => [
      { kind: 'route-numbers', route, direction: 'number-to-route' },
      { kind: 'route-numbers', route, direction: 'route-to-number' },
    ]),
  )
}

/**
 * Reshuffle for the next lap. The relap guard is on the ROUTE, not just the
 * exact card: the new lap never opens on the route the kid is looking at
 * right now, even flipped the other way — a back-to-back "5 again" teaches
 * nothing.
 */
export function relapRouteDeck(routes: RouteDef[], lastRouteNum: number): RouteCard[] {
  const deck = buildRouteDeck(routes)
  if (deck.length > 1 && deck[0]!.route.num === lastRouteNum) {
    const others = deck
      .map((card, i) => ({ card, i }))
      .filter(({ card }) => card.route.num !== lastRouteNum)
    if (others.length) {
      const pick = others[Math.floor(Math.random() * others.length)]!
      ;[deck[0], deck[pick.i]] = [deck[pick.i]!, deck[0]!]
    }
  }
  return deck
}
