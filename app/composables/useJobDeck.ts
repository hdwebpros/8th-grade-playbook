/**
 * "What's My Job" flashcards — deck builder.
 *
 * Bus mode: unlimited reps, instant reveal, nothing scored, nothing stored.
 * Pure functions, no state — the page owns the (in-memory, disposable)
 * drill state. Sibling of useFlashcards.ts (same shuffle/relap idiom).
 *
 * DECK DESIGN — the full cross-product (20 plays × 11 positions × 3 fronts)
 * is ~660 cards, far too big for one lap. Instead a lap is ONE CARD PER PLAY
 * (~20 cards), and each card rolls a random front and a random position that
 * actually has a job on that play/front. Every relap reshuffles the plays and
 * re-rolls both dice, so a kid riding the bus accumulates coverage across
 * laps without ever facing a 660-card grind.
 *
 * Skipping: a position is only eligible for a card when mergedAssignments
 * gives it an Assignment with a non-empty rule for the rolled front (base
 * assignments are complete in the data today, so in practice nothing is
 * skipped — the guard is for future plays that leave a position out). If a
 * play somehow had no eligible position at all, the play is dropped from
 * the lap rather than shown with an empty back.
 */
import type { Assignment, FrontId, OffPosId, Play } from '~/types/football'
import { FRONT_ORDER, mergedAssignments } from '~/utils/playbook'

export interface JobCard {
  kind: 'whats-my-job'
  play: Play
  /** The position the kid is playing on this card. */
  pos: OffPosId
  /** Random per shuffle — the picture (and possibly the rule) changes each lap. */
  front: FrontId
  /** The resolved job for `pos` on `play` vs `front` (rule + optional detail). */
  answer: Assignment
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

/** Roll a front + a position that has a real job on this play vs that front. */
function rollCard(play: Play): JobCard | null {
  for (const front of shuffle(FRONT_ORDER)) {
    const merged = mergedAssignments(play, front)
    const eligible = (Object.entries(merged) as [OffPosId, Assignment][]).filter(
      ([, a]) => a && a.rule.trim().length > 0,
    )
    if (eligible.length === 0) continue
    const [pos, answer] = pickOne(eligible)
    return { kind: 'whats-my-job', play, pos, front, answer }
  }
  return null
}

/** One card per play, each with a freshly rolled position and front. */
export function buildJobDeck(playList: Play[]): JobCard[] {
  return shuffle(
    playList
      .map((play) => rollCard(play))
      .filter((card): card is JobCard => card !== null),
  )
}

/**
 * Reshuffle for the next lap, re-rolling positions and fronts and making
 * sure the first card up isn't the play the kid is looking at right now.
 */
export function relapJobDeck(playList: Play[], lastPlayId: string): JobCard[] {
  const deck = buildJobDeck(playList)
  if (deck.length > 1 && deck[0]!.play.id === lastPlayId) {
    const j = 1 + Math.floor(Math.random() * (deck.length - 1))
    ;[deck[0], deck[j]] = [deck[j]!, deck[0]!]
  }
  return deck
}
