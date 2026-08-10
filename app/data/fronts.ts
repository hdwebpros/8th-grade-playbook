/**
 * Defensive fronts — 4-4, 4-3, 5-2.
 *
 * The varsity book only ever draws "Even" and "Odd" (page 6). These are three
 * concrete middle-school fronts built to sit under that same rule set:
 *   - 4-4 and 4-3 are EVEN — nobody on the center's nose.
 *   - 5-2 is ODD — a nose right on the center.
 * The veer rules key off `scheme`: Even → Rip, Odd → Scoop.
 *
 * Every front is left/right symmetric and every mirrored defender is
 * side-suffixed (`E-L` / `E-R`), so `mirrorPlay` can flip a whole play without
 * stranding a block on a defender that doesn't exist.
 *
 * Yards, per docs/SEAM.md §1. Down linemen are drawn a yard into the defensive
 * backfield so they don't sit on top of the offensive line.
 */

import type { Defender, Front, FrontId } from '../types/football'

const CORNERS: Defender[] = [
  { id: 'C-L', label: 'C', at: { x: -11, y: 7 } },
  { id: 'C-R', label: 'C', at: { x: 11, y: 7 } },
]

/** Two-high safeties, used by the 4-3 and the 5-2. */
const TWO_HIGH: Defender[] = [
  { id: 'F-L', label: 'F', at: { x: -6, y: 11 } },
  { id: 'F-R', label: 'F', at: { x: 6, y: 11 } },
]

export const four4: Front = {
  id: '44',
  name: '4-4',
  scheme: 'even',
  description:
    "Four down linemen and four linebackers. Nobody is head-up on the center — that's how you know it's an even front. The two tackles sit on our guards, the ends outside our tackles, and two backers walk up on the edges. Lots of bodies close to the ball.",
  defenders: [
    { id: 'E-L', label: 'E', at: { x: -4.8, y: 1 } },
    { id: 'T-L', label: 'T', at: { x: -1.6, y: 1 } },
    { id: 'T-R', label: 'T', at: { x: 1.6, y: 1 } },
    { id: 'E-R', label: 'E', at: { x: 4.8, y: 1 } },
    { id: 'B-L', label: 'B', at: { x: -1.6, y: 4 } },
    { id: 'B-R', label: 'B', at: { x: 1.6, y: 4 } },
    { id: 'S-L', label: 'S', at: { x: -6.5, y: 3.5 } },
    { id: 'S-R', label: 'S', at: { x: 6.5, y: 3.5 } },
    ...CORNERS,
    { id: 'F', label: 'F', at: { x: 0, y: 10 } },
  ],
}

export const four3: Front = {
  id: '43',
  name: '4-3',
  scheme: 'even',
  description:
    "Same four down linemen, but only three linebackers and two safeties over the top. Still nobody on the center's nose, so it's even — the difference is the Mike, stacked right over the ball, and the edges are softer.",
  defenders: [
    { id: 'E-L', label: 'E', at: { x: -4.8, y: 1 } },
    { id: 'T-L', label: 'T', at: { x: -1.6, y: 1 } },
    { id: 'T-R', label: 'T', at: { x: 1.6, y: 1 } },
    { id: 'E-R', label: 'E', at: { x: 4.8, y: 1 } },
    { id: 'B-L', label: 'B', at: { x: -4, y: 4.5 } },
    { id: 'M', label: 'B', at: { x: 0, y: 4.5 } },
    { id: 'B-R', label: 'B', at: { x: 4, y: 4.5 } },
    ...CORNERS,
    ...TWO_HIGH,
  ],
}

export const five2: Front = {
  id: '52',
  name: '5-2',
  scheme: 'odd',
  description:
    "Five down linemen with a nose guard right on the center — a man on the center's nose means it's an ODD front, and odd means we Scoop instead of Rip. Their tackles are head-up on our tackles and there are only two linebackers behind them.",
  defenders: [
    { id: 'E-L', label: 'E', at: { x: -5.2, y: 1 } },
    { id: 'T-L', label: 'T', at: { x: -3, y: 1 } },
    { id: 'N', label: 'N', at: { x: 0, y: 1 } },
    { id: 'T-R', label: 'T', at: { x: 3, y: 1 } },
    { id: 'E-R', label: 'E', at: { x: 5.2, y: 1 } },
    { id: 'B-L', label: 'B', at: { x: -2, y: 4 } },
    { id: 'B-R', label: 'B', at: { x: 2, y: 4 } },
    ...CORNERS,
    ...TWO_HIGH,
  ],
}

export const fronts: Record<FrontId, Front> = {
  '44': four4,
  '43': four3,
  '52': five2,
}
