/**
 * FormationGuide — the kid-facing half of a formation.
 *
 * `Formation` (app/types/football.ts) is the geometry: eleven positions in
 * yards. This is what the /formations page SAYS about that geometry — how to
 * spot the set, why we get in it, and where each kid stands, in words a
 * 14-year-old can act on at the line. Nothing here is football that isn't
 * already in the formation's yard data; it's that data, said out loud.
 *
 * Every string is read on a phone. Short sentences. Coach voice. No jargon
 * without an in-line gloss (say "on the ball" and "off the ball", not
 * "covered/uncovered"). Fractions the way kids say them: 1½, not 1.5.
 */
import type { FormationId, OffPosId } from '~/types/football'

export interface LineupSpot {
  /**
   * Where you stand, said to a kid — one sentence, landmarks not numbers first:
   * "On the line, a foot outside the left tackle."
   */
  where: string
  /**
   * The one thing to check before the snap, if there is one:
   * "Hand down, foot on the line — you're a lineman in this set."
   */
  check?: string
}

export type Strength = 'left' | 'right' | 'balanced'

export interface FormationGuide {
  id: FormationId
  /** 2–5 word hook that sits under the name: "Our base set". */
  tagline: string
  /** How to spot it in one glance. 2–3 bullets, each one short line. */
  spotIt: string[]
  /** Why we get in it. One sentence. */
  why: string
  /** Which side is the strong side and how a kid tells. */
  strength: { side: Strength; note: string }
  /** Where every kid stands. All eleven positions, no gaps. */
  lineup: Record<OffPosId, LineupSpot>
  /** Coach reminders. One short line each, THREE at most. */
  remember: string[]
  /** The set this one is a mirror of (Red ⇄ Black). */
  twinId?: FormationId
  /**
   * For anything that isn't Red: one line on how it differs from Red, so a
   * kid who already knows Red only has to learn the change.
   */
  vsRed?: string
}
