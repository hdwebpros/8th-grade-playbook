/**
 * Name That Formation — deck builder.
 *
 * Same bus-mode contract as useFlashcards.ts: pure functions, a deck is a
 * shuffled card list, the page owns all (in-memory, disposable) drill state.
 *
 * Deck size: ONE card per formation, so the lap is however many formations
 * we have. Mirroring was considered for visual variation and deliberately
 * rejected — Black IS Red's mirror (app/data/formations.ts generates it with
 * mirrorFormation), so a mirrored Red card would be a Black card with the
 * wrong answer on the back, and Split Wide and Tight are balanced sets that
 * mirror onto themselves. With every honest variation already in the
 * formation list, one card each it is; the endless relap keeps the reps
 * coming.
 *
 * Each card carries a `cue` — the recognition one-liner for the back of the
 * card. It lives here rather than reusing Formation.description because the
 * card back wants a "how you spot it" sentence, not the data file's "what it
 * is and when we're in it" sentence.
 */
import type { Formation, FormationId } from '~/types/football'

export interface FormationCard {
  kind: 'name-that-formation'
  formation: Formation
  /** Kid-facing recognition cue: how to spot this set from the dots alone. */
  cue: string
}

/** How to recognize each set from alignment alone — written off the varsity scans. */
const CUES: Record<FormationId, string> = {
  red: 'Tight end and a wing packed in on the LEFT, a lone wing outside the right tackle, split end wide right — our base set.',
  black:
    'Red flipped: the tight end and wing are packed in on the RIGHT, the split end is wide LEFT. Same jobs, other side of the ball.',
  'split-wide':
    'Nobody tight to the line: four receivers stretched across the field, both edges empty, one lone back deep behind the quarterback.',
  tight:
    'A tight end on BOTH ends of the line and a wing outside each of them — nobody split out, both sides look the same. If you cannot tell which way it is set, it is Tight.',
}

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

/** One card per formation, shuffled. */
export function buildFormationDeck(formationList: Formation[]): FormationCard[] {
  return shuffle(
    formationList.map((formation) => ({
      kind: 'name-that-formation' as const,
      formation,
      cue: CUES[formation.id],
    })),
  )
}

/**
 * Reshuffle for the next lap, making sure the first card up isn't the one
 * the kid is looking at right now.
 */
export function relapFormationDeck(
  formationList: Formation[],
  lastFormationId: FormationId,
): FormationCard[] {
  const deck = buildFormationDeck(formationList)
  if (deck.length > 1 && deck[0]!.formation.id === lastFormationId) {
    const j = 1 + Math.floor(Math.random() * (deck.length - 1))
    ;[deck[0], deck[j]] = [deck[j]!, deck[0]!]
  }
  return deck
}
