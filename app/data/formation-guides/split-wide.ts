/**
 * Split Wide — app/data/split-wide-formation.ts said out loud: Y wide LEFT
 * and X wide RIGHT on the line near the numbers, L and R in the slots at 8½
 * a yard off the ball, five linemen at their normal splits, quarterback under
 * center, Super alone 4½ deep. Balanced — no strong side, no twin.
 */
import type { FormationGuide } from './types'

export const splitWideGuide: FormationGuide = {
  id: 'split-wide',
  tagline: 'Four wide, one back',
  spotIt: [
    'Nobody tight to the line — both edges are empty next to the tackles.',
    'Four receivers stretched across the field, two on each side, the outside two near the numbers.',
    'One lone back deep behind the quarterback.',
  ],
  why: 'It spreads the defense thin across the whole field, so they have to cover four receivers and still stop Super running behind the quarterback.',
  strength: {
    side: 'balanced',
    note: 'Both sides look the same — a slot and a wide receiver each way. There is no strong side, so the play call tells you which way we are going.',
  },
  lineup: {
    Y: {
      where: 'Split out to the LEFT, on the line, about 13 yards from the ball — right around the numbers. You are the last man on the line on the left.',
      check: 'Foot on the line, look in to the ball. You are one of the seven on the ball, so do not drift back.',
    },
    X: {
      where: 'Split out to the RIGHT, on the line, about 13 yards from the ball — right around the numbers. You are the last man on the line on the right.',
      check: 'Foot on the line, look in to the ball. You are the seventh man on the ball, so do not drift back.',
    },
    L: {
      where: 'Left slot: halfway between the left tackle and Y, a yard back off the ball. About 8½ yards from the ball.',
      check: 'Stay a yard OFF the line — you are a back here. If you creep up onto the line, Y is not eligible any more.',
    },
    R: {
      where: 'Right slot: halfway between the right tackle and X, a yard back off the ball. About 8½ yards from the ball.',
      check: 'Stay a yard OFF the line — you are a back here. If you creep up onto the line, X is not eligible any more.',
    },
    S: {
      where: 'Straight behind the quarterback, 4½ yards deep — about four and a half big steps back from the ball. You are the only back, so you are our halfback in this set.',
      check: 'Line your nose up on the center so you are dead center.',
    },
    Q: {
      where: 'Under center, hands under the center, feet set.',
      check: 'Look both ways before the snap: a slot and a wide receiver each side, and make sure both slots are off the ball.',
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
      where: 'On the line, left of the left guard — about a foot of daylight between you and him. Nobody is tight outside you; the next man out is the left slot, way out and a yard back.',
      check: 'Hand down, foot on the line. You are the last lineman on the left.',
    },
    RT: {
      where: 'On the line, right of the right guard — about a foot of daylight between you and him. Nobody is tight outside you; the next man out is the right slot, way out and a yard back.',
      check: 'Hand down, foot on the line. You are the last lineman on the right.',
    },
  },
  remember: [
    'Seven on the ball: Y, LT, LG, C, RG, RT, X. Slots, QB, and Super are off the ball.',
    'Slots a yard OFF the ball, every time — that is what keeps X and Y eligible.',
    'Line splits stay about a foot of daylight — the receivers spread out, the line does not.',
  ],
  vsRed:
    'Red with everybody stretched out — Y goes from tight to wide left, both wings become slots at 8½, X stays wide right, and Super is the only back.',
}
