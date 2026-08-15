/**
 * Formations — transcribed from varsity page 1 (BLACK/RED).
 *
 * Yards, per docs/SEAM.md §1: x = 0 is the ball, +x is the offense's right;
 * y = 0 is the line of scrimmage, −y is the backfield.
 *
 * Read off the scan's geometry, then rounded to honest 8th-grade splits:
 *  - 1.5 yd from one lineman's helmet to the next (about a foot of daylight
 *    between bodies — tight splits, which is what inside veer wants),
 *  - the tight end another 1.5 yd outside his tackle,
 *  - each wing 1.2 yd outside the last man on the line and 1 yd behind it,
 *  - the split end out near the numbers,
 *  - Super 4.5 yd deep, directly behind the quarterback.
 *
 * Page 1 draws Black as an exact mirror of Red — including Y and X changing
 * sides while keeping their letters — so Black is generated, not re-measured.
 */

import type { Formation, FormationId } from '../types/football'
import { splitWide } from './split-wide-formation'
import { tight } from './tight-formation'
import { mirrorFormation } from '../utils/mirror'

export const red: Formation = {
  id: 'red',
  name: 'Red',
  description:
    'Our base set. Tight end and a wing to the LEFT, a wing outside the right tackle, X split out right, Super 4½ yards behind the quarterback.',
  players: [
    { pos: 'X', at: { x: 12, y: 0 } },
    { pos: 'Y', at: { x: -4.5, y: 0 } },
    { pos: 'LT', at: { x: -3, y: 0 } },
    { pos: 'LG', at: { x: -1.5, y: 0 } },
    { pos: 'C', at: { x: 0, y: 0 } },
    { pos: 'RG', at: { x: 1.5, y: 0 } },
    { pos: 'RT', at: { x: 3, y: 0 } },
    { pos: 'L', at: { x: -5.7, y: -1 } },
    { pos: 'R', at: { x: 4.2, y: -1 } },
    { pos: 'Q', at: { x: 0, y: -1.3 } },
    { pos: 'S', at: { x: 0, y: -4.5 } },
  ],
}

export const black: Formation = mirrorFormation(red, {
  id: 'black',
  name: 'Black',
  description:
    'Red flipped. Tight end and a wing to the RIGHT, a wing outside the left tackle, X split out left. Same jobs, other side of the ball.',
})

/** Keyed by FormationId. */
export const formations: Partial<Record<FormationId, Formation>> = {
  red,
  black,
  'split-wide': splitWide,
  // Tight has a tight end on BOTH sides, so unlike Red/Black it has no
  // side to declare and no mirrored twin — it is its own mirror.
  tight,
}
