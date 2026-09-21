/**
 * SHOTGUN — a variation, not a formation. Coach Ryan, 2026-09-21.
 *
 * Any of Red, Black, or Split Wide can be run from the gun; Tight cannot. It
 * is called by adding one word after the formation: "Red Gun Veer Right".
 * The line never moves. Only the backfield changes, and the rule is the same
 * in every set so a kid learns it once:
 *
 *   - the quarterback backs up to 3 yards behind the ball,
 *   - Super lines up a yard LEFT of the quarterback and a yard behind him,
 *   - a wing lines up a yard RIGHT of the quarterback and a yard behind him,
 *   - the other wing goes out to the open receiver slot on his side of the
 *     field — the Split Wide slot spot, 8½ yards out and a yard off the ball.
 *
 * Which wing does which depends on the set. In Red the tight end and the
 * left wing (L) are on the left and X is wide right, so the open slot is on
 * the LEFT: L goes out to it and R (the lone wing) steps in beside the
 * quarterback. Black is the flip — Y and R on the right, X wide left — so the
 * open slot is on the RIGHT: R goes out to it and L steps in beside the
 * quarterback. Super is on the quarterback's left and the wing on his right
 * in BOTH sets, which is why Black Gun is NOT a pure mirror of Red Gun: the
 * backfield stays put, only the slot changes sides.
 *
 * Split Wide has no wings and one back, so only the quarterback and Super
 * move — Super to the same spot he has in every gun set.
 *
 * Coordinates are yards, per docs/SEAM.md §1.
 */

import type { Formation, FormationId, OffPosId, Play, Pt } from '../types/football'
import { black, formations, red } from './formations'
import { splitWide } from './split-wide-formation'

/** The quarterback in the gun: 3 yards behind the ball. */
export const GUN_QB: Pt = { x: 0, y: -3 }
/** Super: a yard left of the quarterback, a yard behind him. */
export const GUN_SUPER: Pt = { x: -1, y: -4 }
/** The wing beside the quarterback: a yard right of him, a yard behind him. */
export const GUN_WING: Pt = { x: 1, y: -4 }
/** The open receiver slot: Split Wide's slot spot, on whichever side is open. */
export const GUN_SLOT_LEFT: Pt = { x: -8.5, y: -1 }
export const GUN_SLOT_RIGHT: Pt = { x: 8.5, y: -1 }

/** Where each kid who moves ends up, per base set. Tight has no gun. */
const GUN_MOVES: Partial<Record<FormationId, Partial<Record<OffPosId, Pt>>>> = {
  red: { Q: GUN_QB, S: GUN_SUPER, R: GUN_WING, L: GUN_SLOT_LEFT },
  black: { Q: GUN_QB, S: GUN_SUPER, L: GUN_WING, R: GUN_SLOT_RIGHT },
  'split-wide': { Q: GUN_QB, S: GUN_SUPER },
}

const GUN_DESCRIPTIONS: Partial<Record<FormationId, string>> = {
  red: 'Red, with the quarterback 3 yards back. Super a yard left of him and a yard behind, the right wing a yard right of him and a yard behind, and the left wing out in the left slot. The line and X do not move.',
  black:
    'Black, with the quarterback 3 yards back. Super a yard left of him and a yard behind, the left wing a yard right of him and a yard behind, and the right wing out in the right slot. The line and X do not move.',
  'split-wide':
    'Split Wide, with the quarterback 3 yards back and Super a yard left of him and a yard behind. Nobody else moves.',
}

/** One kid's shift from his under-center spot to his gun spot. */
export interface GunMove {
  pos: OffPosId
  from: Pt
  to: Pt
}

/** Can this set be run from the gun? Tight cannot. */
export function hasGun(formation: Formation): boolean {
  return !formation.variant && formation.id in GUN_MOVES
}

/**
 * The kids who move, and where — in the base set's player order. Empty for a
 * set with no gun.
 */
export function gunMoves(formation: Formation): GunMove[] {
  const moves = GUN_MOVES[formation.id]
  if (!moves || formation.variant) return []
  return formation.players.flatMap((p) => {
    const to = moves[p.pos]
    return to ? [{ pos: p.pos, from: p.at, to }] : []
  })
}

/**
 * The gun version of a set: same id, `variant: 'gun'`, name with "Gun" after
 * it, and the moved kids at their gun spots. `null` for Tight (or for a set
 * that is already the gun).
 */
export function gunOf(formation: Formation): Formation | null {
  const moves = GUN_MOVES[formation.id]
  if (!moves || formation.variant) return null
  return {
    ...formation,
    variant: 'gun',
    name: `${formation.name} Gun`,
    description: GUN_DESCRIPTIONS[formation.id] ?? formation.description,
    players: formation.players.map((p) => ({ pos: p.pos, at: moves[p.pos] ?? p.at })),
  }
}

export const redGun = gunOf(red)!
export const blackGun = gunOf(black)!
export const splitWideGun = gunOf(splitWide)!

/** Keyed by the BASE FormationId. No entry for Tight. */
export const gunFormations: Partial<Record<FormationId, Formation>> = {
  red: redGun,
  black: blackGun,
  'split-wide': splitWideGun,
}

/**
 * The set a play is actually drawn from: the gun variation when the play is
 * tagged `variant: 'gun'`, otherwise the base set. Use this instead of
 * `formations[play.formation]` anywhere a play meets a diagram.
 */
export function formationFor(play: Pick<Play, 'formation' | 'variant'>): Formation {
  const base = formations[play.formation]!
  return play.variant === 'gun' ? (gunFormations[play.formation] ?? base) : base
}
