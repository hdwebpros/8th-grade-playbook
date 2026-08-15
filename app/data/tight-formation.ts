/**
 * TIGHT — the 2-tight-end set. Same yard system and the same honest-splits
 * rounding style as app/data/formations.ts.
 *
 * This is Red with the split end brought all the way home: a tight end
 * directly outside EACH tackle, both wings on the wing, Super at his usual
 * depth. Nobody is detached, so there is no strong side to declare — which is
 * the whole point of it. Red and Black exist as a pair because Red has one
 * tight end and the defense can set to him; Tight is a balanced set, so it
 * mirrors onto itself and needs no twin. There is no "Tight Black".
 *
 * Geometry, borrowed straight from Red (page 1) so the spacing a kid already
 * learned still holds:
 *   - line splits 1.5 yd, helmet to helmet,
 *   - each tight end another 1.5 yd outside his tackle → ±4.5,
 *   - each wing 1.2 yd outside the last man on the line and 1 yd behind it
 *     → ±5.7 at y = −1,
 *   - the quarterback under center at −1.3,
 *   - Super 4.5 yd deep, directly behind him.
 *
 * Position mapping — every kid keeps the letter he already owns, exactly the
 * way Split Wide handles it:
 *   Y  — the tight end, LEFT, where he lines up in Red   (Red: −4.5)
 *   X  — the split end, now the RIGHT tight end          (Red: +12 → +4.5)
 *   L  — the left wing                                   (Red: −5.7)
 *   R  — the right wing                                  (Red: +4.2 → +5.7)
 *   S  — Super, the deep back
 * So the second tight end is X. A play author writing out of Tight gives X a
 * tight end's job, not a split end's. (Ryan, 2026-08-15: "X" is wide-receiver
 * vernacular — when he aligns tight like this he is technically a tight end;
 * we keep the letter so every kid keeps his letter, but coach him as a TE.)
 *
 * Legality: seven men on the line — Y, LT, LG, C, RG, RT, X. L and R are off
 * the ball at y = −1, which makes them backs and keeps five eligibles legal.
 */

import type { Formation } from '../types/football'

export const tight: Formation = {
  id: 'tight',
  name: 'Tight',
  description:
    'Two tight ends, one on each side, both wings on the wing. Nobody split out — a balanced set with an extra blocker on both edges. We get in it to run at either side and make them guess which one.',
  players: [
    { pos: 'Y', at: { x: -4.5, y: 0 } },
    { pos: 'LT', at: { x: -3, y: 0 } },
    { pos: 'LG', at: { x: -1.5, y: 0 } },
    { pos: 'C', at: { x: 0, y: 0 } },
    { pos: 'RG', at: { x: 1.5, y: 0 } },
    { pos: 'RT', at: { x: 3, y: 0 } },
    { pos: 'X', at: { x: 4.5, y: 0 } },
    { pos: 'L', at: { x: -5.7, y: -1 } },
    { pos: 'R', at: { x: 5.7, y: -1 } },
    { pos: 'Q', at: { x: 0, y: -1.3 } },
    { pos: 'S', at: { x: 0, y: -4.5 } },
  ],
}
