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
  gun: {
    tagline: 'Same set, QB backs up',
    spotIt: [
      'Quarterback standing three yards back, not under center.',
      'Two backs stacked behind him — Super on his left, the wing on his right.',
      'Nobody packed next to the tight end — that wing is out wide in the left slot.',
    ],
    why: 'The quarterback catches the snap already three yards deep, so he has time and a clear look at the defense with a back on each hip.',
    moves: {
      Q: {
        where: 'Three big steps straight back from the ball — 3 yards deep, hands out in front of you, ready. You are not under center.',
        check: 'Eyes on the ball for the snap. You cannot feel it come up any more, so watch it all the way into your hands.',
      },
      S: {
        where: 'Off the quarterback\'s LEFT hip: a yard to his left and a yard behind him.',
        check: 'Stay a yard back so you are behind the quarterback, not even with him.',
      },
      R: {
        where: 'Leave your wing spot and step in beside the quarterback: a yard to his RIGHT and a yard behind him — off his right hip.',
        check: 'Stay a yard back so you are not even with the quarterback. Super is on his left, you are on his right.',
      },
      L: {
        where: 'Out to the left slot: about 8½ yards from the ball — halfway to the numbers — and a yard back off the ball. Nobody on the line outside you.',
        check: 'Stay a yard OFF the line — you are a back out there. If you creep up onto the line, Y is not eligible any more.',
      },
    },
    remember: [
      'Gun changes the backfield, never the line.',
      'Super left, wing right, every time. In Red that wing is R — L goes out to the slot.',
      'Say it right after the set: Red Gun.',
    ],
  },
}
