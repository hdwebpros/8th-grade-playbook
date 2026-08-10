/**
 * Self-study flashcards — deck builders.
 *
 * Bus mode: unlimited reps, instant reveal, nothing scored, nothing stored.
 * A deck is a shuffled card list; when the page runs off the end it
 * reshuffles and keeps going. Pure functions, no state — the page owns the
 * (in-memory, disposable) drill state.
 *
 * Deck lineup (HANDOFF §5 puts guess-the-play AND guess-the-formation in
 * this mode; each deck gets a builder here and a card face on the page):
 *  - name-that-play (BUILT): unlabeled diagram vs a random front → the call.
 *  - name-that-formation: alignment dots only → Red / Black / Split Wide.
 *  - route-numbers: "What's a 5?" ↔ the route shape, both directions.
 *  - whats-my-job: position + play + front → the rule, self-checked, no options.
 */
import type { FrontId, Play } from '~/types/football'
import { FRONT_ORDER } from '~/utils/playbook'

export interface PlayCard {
  kind: 'name-that-play'
  play: Play
  /** Random per shuffle so a re-lap shows a different picture of the same call. */
  front: FrontId
}

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/** One card per play in the book, each against a freshly rolled front. */
export function buildPlayDeck(playList: Play[]): PlayCard[] {
  return shuffle(
    playList.map((play) => ({
      kind: 'name-that-play' as const,
      play,
      front: pickOne(FRONT_ORDER),
    })),
  )
}

/**
 * Reshuffle for the next lap, re-rolling fronts and making sure the first
 * card up isn't the one the kid is looking at right now.
 */
export function relapPlayDeck(playList: Play[], lastPlayId: string): PlayCard[] {
  const deck = buildPlayDeck(playList)
  if (deck.length > 1 && deck[0]!.play.id === lastPlayId) {
    const j = 1 + Math.floor(Math.random() * (deck.length - 1))
    ;[deck[0], deck[j]] = [deck[j]!, deck[0]!]
  }
  return deck
}
