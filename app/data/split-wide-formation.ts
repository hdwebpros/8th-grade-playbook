/**
 * SPLIT WIDE — transcribed from varsity page 4 ("0 TE & 2 TE SETS", bottom-left
 * panel). Same yard system and the same honest-splits rounding style as
 * app/data/formations.ts.
 *
 * What the scan actually shows, measured off page-04.jpg at 150 DPI:
 *   five linemen at even spacing, the quarterback under center, ONE back
 *   directly behind him at Super depth, and FOUR detached receivers — two of
 *   them at roughly 5½ line-splits outside the tackles and two more about 8½
 *   splits out, near the numbers. Nothing is on the wing at 1.2 yards any more;
 *   this is Red with the tight end and both wings pulled off the formation.
 *
 * Measured, then rounded to honest 8th-grade numbers:
 *   - line splits stay 1.5 yd, same as Red (page 1),
 *   - the inside pair measured −8.4 / +8.2 yd  → 8.5 yd both sides,
 *   - the outside pair measured −13.0 / +12.7 yd → 13 yd both sides,
 *   - the inside pair sits about a yard off the ball (they measure the same
 *     yard behind the LOS our wings do in Red) → y = −1,
 *   - the quarterback is under center (−1.3, as in Red),
 *   - the lone back measured 4.6 yd deep → 4.5, exactly Super's Red depth.
 * The scan is very close to symmetric; it is drawn as an exactly balanced set
 * because a balanced set is what makes it a *split wide* look and because it
 * lets a whole play mirror with no hand correction.
 *
 * Position mapping — see reviewNotes on the plays. Split Wide is Red with
 * everybody widened, so every kid keeps the letter he already owns:
 *   Y  — the tight end, now split wide LEFT   (Red: −4.5 on the line)
 *   L  — the left wing, now a slot at −8.5    (Red: −5.7)
 *   R  — the right wing, now a slot at +8.5   (Red: +4.2)
 *   X  — the split end, still wide RIGHT      (Red: +12)
 *   S  — Super, the only back: our HALFBACK in the Split Wide plays.
 *
 * Legality: seven men on the line — Y, LT, LG, C, RG, RT, X. L and R are off
 * the ball at y = −1, which makes them backs and keeps five eligibles legal.
 */

import type { Formation } from '../types/football'

export const splitWide: Formation = {
  id: 'split-wide',
  name: 'Split Wide',
  description:
    'Four receivers, no tight end, one back. Red with everybody stretched out — Y and X wide, L and R in the slots, Super alone behind the quarterback. We get in it to spread them thin and make them cover the whole field.',
  players: [
    { pos: 'Y', at: { x: -13, y: 0 } },
    { pos: 'LT', at: { x: -3, y: 0 } },
    { pos: 'LG', at: { x: -1.5, y: 0 } },
    { pos: 'C', at: { x: 0, y: 0 } },
    { pos: 'RG', at: { x: 1.5, y: 0 } },
    { pos: 'RT', at: { x: 3, y: 0 } },
    { pos: 'X', at: { x: 13, y: 0 } },
    { pos: 'L', at: { x: -8.5, y: -1 } },
    { pos: 'R', at: { x: 8.5, y: -1 } },
    { pos: 'Q', at: { x: 0, y: -1.3 } },
    { pos: 'S', at: { x: 0, y: -4.5 } },
  ],
}
