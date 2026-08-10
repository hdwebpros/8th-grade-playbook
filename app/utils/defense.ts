/**
 * Defensive lettering — what the letters over the defenders actually mean.
 *
 * The letters we draw are the high-school ones the kids will hear from a
 * defensive coach:
 *
 *   E  end            T  tackle          N  nose
 *   B  linebacker (an inside backer, when we aren't naming him further)
 *   M  Mike           W  Will            S  Sam
 *      (middle)          (weak side)        (strong side)
 *   C  corner         F  free safety     $  strong safety
 *
 * Two of those pairs — W/S and F/$ — are not fixed to a side of the field.
 * They're named off the offense's STRENGTH, so the same defender is the Sam
 * against Red and the Will against Black. Fronts in app/data/fronts.ts are
 * therefore authored one way — STRENGTH TO THE RIGHT — and the strength letters
 * are flipped here when the formation sets strength left. Unsuffixed defenders
 * (the 4-4's lone `F`, the nose, the Mike) sit in the middle and never flip.
 *
 * Everything else about a front stays symmetric, so `mirrorPlay` is unaffected:
 * only the drawn letter changes, never an id or a coordinate.
 */

import type { Defender, Formation, Front } from '../types/football'

export type StrongSide = 'left' | 'right'

/** Letters that name a strength, not a side. Flipped as a set. */
const STRENGTH_FLIP: Record<string, string> = {
  S: 'W',
  W: 'S',
  F: '$',
  $: 'F',
}

/**
 * Strength is the tight end's side: whoever has the extra man on the line.
 * Red is strong LEFT (Y at −4.5), Black strong RIGHT. A balanced set with no
 * attached tight end — Split Wide — has no real strength; we declare it right,
 * the way a defense declares to the field, so the letters stay stable.
 */
export function strongSideOf(formation: Formation): StrongSide {
  const y = formation.players.find((p) => p.pos === 'Y')
  if (!y || Math.abs(y.at.x) > 6) return 'right'
  return y.at.x < 0 ? 'left' : 'right'
}

/** The letter this defender wears against a formation of the given strength. */
export function defenderLabel(defender: Defender, strong: StrongSide): string {
  const sided = defender.id.endsWith('-L') || defender.id.endsWith('-R')
  if (!sided || strong === 'right') return defender.label
  return STRENGTH_FLIP[defender.label] ?? defender.label
}

/** A front's defenders with their letters resolved against one formation. */
export function labelledDefenders(
  front: Front | undefined,
  formation: Formation | undefined,
): Defender[] {
  if (!front) return []
  const strong = formation ? strongSideOf(formation) : 'right'
  return front.defenders.map((d) => ({ ...d, label: defenderLabel(d, strong) }))
}

/** The drawn letter for one defender id — e.g. the read key on a play page. */
export function labelForId(
  front: Front | undefined,
  formation: Formation | undefined,
  id: string | undefined,
): string | null {
  if (!front || !id) return null
  const d = front.defenders.find((x) => x.id === id)
  if (!d) return null
  return defenderLabel(d, formation ? strongSideOf(formation) : 'right')
}
