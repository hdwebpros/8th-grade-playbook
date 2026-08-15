/**
 * Black — Red flipped. Tight end Y and the right wing packed on the RIGHT, the
 * left wing alone outside the left tackle, X split out LEFT. Every landmark
 * below is app/data/formations.ts (Red, run through mirrorFormation) said out
 * loud — nothing new, just the other side of the ball.
 */
import type { FormationGuide } from './types'

export const blackGuide: FormationGuide = {
  id: 'black',
  tagline: 'Red, flipped',
  spotIt: [
    'Tight end and a wing packed in on the RIGHT.',
    'One lone wing outside the left tackle.',
    'Split end wide to the LEFT.',
  ],
  why: 'It is Red with the strong side on the right, so the defense has to line up to a new picture and we run the same plays the other way.',
  strength: {
    side: 'right',
    note: 'Strong side is where the tight end is. In Black, look for Y and the wing packed together — that is the right side.',
  },
  lineup: {
    C: {
      where: 'On the ball, in the middle of the line.',
      check: 'You set the line. Everybody splits off you.',
    },
    LG: {
      where: 'On the line, to the LEFT of the center — 1½ yards helmet to helmet, about a foot of daylight between you.',
      check: 'Hand down, foot on the line.',
    },
    RG: {
      where: 'On the line, to the RIGHT of the center — 1½ yards helmet to helmet, about a foot of daylight between you.',
      check: 'Hand down, foot on the line.',
    },
    LT: {
      where: 'On the line, 1½ yards outside the left guard — about a foot of daylight.',
      check: 'You are the last lineman on the left. There is no tight end next to you in Black — the wing sits behind and outside you.',
    },
    RT: {
      where: 'On the line, 1½ yards outside the right guard — about a foot of daylight.',
      check: 'Hand down, foot on the line. The tight end sets up off you.',
    },
    Y: {
      where: 'On the line, 1½ yards outside the RIGHT tackle — about a foot of daylight.',
      check: 'Hand down, foot on the line — you are a lineman in this set. In Red you were on the left; in Black you are on the right.',
    },
    R: {
      where: 'Just outside the tight end and one step back. About a yard outside his shoulder, a yard off the ball.',
      check: 'You are a back, not a lineman. Stay off the line — you and Y are the packed-in pair on the right.',
    },
    L: {
      where: 'Just outside the left tackle and one step back. About a yard outside his shoulder, a yard off the ball.',
      check: 'You are the lone wing. Nobody on the line outside you — the split end is way out at the numbers.',
    },
    X: {
      where: 'On the line, split out wide to the LEFT — out near the numbers, about 12 yards from the ball.',
      check: 'Foot on the line — you count as one of the seven. In Red you were wide right; in Black you are wide left.',
    },
    Q: {
      where: 'Under center, hands in.',
      check: 'Same spot as Red. Only the picture in front of you flipped.',
    },
    S: {
      where: 'Straight behind the quarterback, 4½ yards deep — heels about 4½ yards off the ball.',
      check: 'Do not lean toward the strong side. Line up dead behind the center, same as Red.',
    },
  },
  remember: [
    'Seven on the line: X, left tackle, left guard, center, right guard, right tackle, Y. Wings, quarterback, and Super are off the ball.',
    'Same job, other side — whatever you did in Red, you do here from the flipped spot.',
    'Tight splits: about a foot of daylight between you and the next guy.',
  ],
  twinId: 'red',
  vsRed:
    'Red flipped — the tight end and wing move to the RIGHT, the lone wing to the left, and X splits out LEFT. Nobody changes jobs, only sides.',
}
