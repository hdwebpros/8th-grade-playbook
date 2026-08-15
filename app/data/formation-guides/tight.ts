/**
 * Tight — the 2-tight-end set. Everything here is app/data/tight-formation.ts
 * said out loud: Y tight on the LEFT, X tight on the RIGHT, a wing outside
 * each of them and one step back, Super 4½ deep behind the quarterback.
 * Balanced, so it has no twin — it is its own mirror.
 */
import type { FormationGuide } from './types'

export const tightGuide: FormationGuide = {
  id: 'tight',
  tagline: 'Two tight ends, no strong side',
  spotIt: [
    'A tight end on BOTH ends of the line — nobody split out.',
    'A wing just outside each tight end, one step back.',
    'Both sides look the same. If you cannot tell which way it is set, it is Tight.',
  ],
  why: 'It puts an extra blocker on both edges, so we can run at either side and the defense has to guess which one.',
  strength: {
    side: 'balanced',
    note: 'There is no strong side. Count the bodies: a tight end and a wing on the left, a tight end and a wing on the right. Same on both sides, so nobody has to declare.',
  },
  lineup: {
    Y: {
      where: 'On the line, a foot outside the left tackle. Same spot as Red — you are the last man on the line on the left.',
      check: 'Hand down, foot on the line. You are one of the seven on the ball.',
    },
    X: {
      where: 'On the line, a foot outside the RIGHT tackle. You are not split out here — you are the last man on the line on the right.',
      check: 'You are a tight end in this set: hand down, on the line, tight to the tackle. Do not drift wide.',
    },
    L: {
      where: 'Just outside Y and one step back. About a yard outside his shoulder, a yard off the ball.',
      check: 'Stay off the line — you are a back here, not a lineman.',
    },
    R: {
      where: 'Just outside X and one step back. About a yard outside his shoulder, a yard off the ball. Same spot as L, other side.',
      check: 'Stay off the line so X can be the man on the ball on your side.',
    },
    S: {
      where: 'Straight behind the quarterback, 4½ yards deep — about four and a half big steps back from the ball.',
      check: 'Line your nose up on the center so you are dead center.',
    },
    Q: {
      where: 'Under center, hands under the center, feet set.',
      check: 'Look both ways before the snap: tight end and wing on the left, tight end and wing on the right. It should look the same each way.',
    },
    C: {
      where: 'On the ball.',
      check: 'Set the line — everyone splits off you.',
    },
    LG: {
      where: 'On the line, left of the center — about a foot of daylight between you and him.',
      check: 'Hand down, foot on the line.',
    },
    RG: {
      where: 'On the line, right of the center — about a foot of daylight between you and him.',
      check: 'Hand down, foot on the line.',
    },
    LT: {
      where: 'On the line, left of the left guard — about a foot of daylight between you and him. Y is right outside you.',
      check: 'Hand down, foot on the line.',
    },
    RT: {
      where: 'On the line, right of the right guard — about a foot of daylight between you and him. X is right outside you, tight, and the wing is behind and outside him.',
      check: 'Hand down, foot on the line.',
    },
  },
  remember: [
    'Seven on the ball: Y, LT, LG, C, RG, RT, X. Wings, QB, and Super are off the ball.',
    'Both sides match — a tight end and a wing on each edge. There is no Tight Black; this set is its own mirror.',
    'Line splits are about a foot of daylight; wings a yard outside, a yard back.',
  ],
  vsRed:
    'Red with X brought in from the numbers to a foot outside the right tackle, and the right wing slid out to sit outside him. Everything on the left is exactly Red.',
}
