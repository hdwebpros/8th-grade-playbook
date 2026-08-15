/**
 * Red — our base set. Everything here is app/data/formations.ts `red`, said
 * out loud: Y and the left wing packed on the LEFT, the right wing outside
 * the right tackle, X split out right, Super 4½ deep behind the quarterback.
 */
import type { FormationGuide } from './types'

export const redGuide: FormationGuide = {
  id: 'red',
  tagline: 'Our base set',
  spotIt: [
    'Tight end and a wing packed in on the LEFT.',
    'One wing by himself just outside the right tackle.',
    'Split end way out to the RIGHT, near the numbers.',
  ],
  why: 'It puts three blockers on the left side of the line and still keeps a wing and a wide receiver on the right, so we can run either way and throw it.',
  strength: {
    side: 'left',
    note: 'The tight end (Y) is on the left, and the wing next to him makes it two extra bodies. Wherever Y is, that is the strong side.',
  },
  lineup: {
    Y: {
      where: 'On the line, a foot outside the left tackle. You are the last man on the line on the left.',
      check: 'Hand down, foot on the line. You are one of the seven on the ball.',
    },
    L: {
      where: 'Just outside the tight end and one step back. About a yard outside his shoulder, a yard off the ball.',
      check: 'Stay off the line — you are a back here, not a lineman.',
    },
    R: {
      where: 'Just outside the right tackle and one step back. About a yard outside his shoulder, a yard off the ball.',
      check: 'Stay off the line so X can be the man on the ball on your side.',
    },
    X: {
      where: 'Split out to the right, on the line, about 12 yards from the ball — close to the numbers.',
      check: 'Foot on the line. You are the seventh man on the ball, so do not drift back.',
    },
    S: {
      where: 'Straight behind the quarterback, 4½ yards deep — about four and a half big steps back from the ball.',
      check: 'Line your nose up on the center so you are dead center.',
    },
    Q: {
      where: 'Under center, hands under the center, feet set.',
      check: 'Look both ways before the snap: three bodies left, wing and X to the right.',
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
      where: 'On the line, left of the left guard — about a foot of daylight between you and him. The tight end is right outside you.',
      check: 'Hand down, foot on the line.',
    },
    RT: {
      where: 'On the line, right of the right guard — about a foot of daylight between you and him. You are the last lineman on the right; the wing is behind and outside you.',
      check: 'Hand down, foot on the line.',
    },
  },
  remember: [
    'Seven on the ball: Y, LT, LG, C, RG, RT, X. Wings, QB, and Super are off the ball.',
    'Line splits are about a foot of daylight — no wider.',
    'Wings: a yard outside, a yard back. Off the line, every time.',
  ],
  twinId: 'black',
}
