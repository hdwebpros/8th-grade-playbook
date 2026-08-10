/**
 * WAGGLE — varsity scan page-19.jpg, "PAP (BOOT)". The page holds three
 * panels: "Stretch Left Boot Rt", "Rocket Right Boot Lt", and "Waggle Rt".
 * This file is transcribed from the WAGGLE RT panel, cross-read against the
 * "Stretch Left Boot Rt" panel above it, which is the same protection and the
 * same boot with a different route distribution.
 *
 * Page 19 has NO assignment table — it is diagrams only. Every word of
 * assignment prose below is football, not transcription, and the depths on the
 * routes are read off a small hand-drawn panel. Both facts are flagged in
 * reviewNotes.
 *
 * The play, out of RED: the run action goes LEFT (the line blocks Stretch —
 * the panel above literally writes "STRETCH" across the offensive line) and the
 * quarterback boots RIGHT. So `direction` is 'right' — the pass side, which is
 * where playside/backside badges should read from.
 *
 * ARROWS AS DRAWN on the Waggle Rt panel (re-measured off the scan; the panel
 * is drawn about twice as wide as it is tall, so depths were taken off the
 * vertical scale and widths off the receivers' own alignments):
 *   LT LG C RG RT   short stems with block bars, every one of them leaning UP
 *                   and to the LEFT — the Stretch-left run action
 *   R               a wavy line (the book's motion mark) from the right wing
 *                   back across the formation BEHIND Super — the flat part of
 *                   the line runs ~2 yards deeper than S — then up and out
 *                   toward the LEFT tackle: motion across and take the fake
 *   S               up over the right guard and out flat to about 7-8 yards
 *                   outside, finishing right at the line: the flat route
 *   RG              a black line off the right guard sweeping out BEHIND the
 *                   wing to a block bar ~6 yards outside, ~1.5 yards behind
 *                   the line: the kick-out on the boot-side edge
 *   Q               straight back to about Super's depth, then back around and
 *                   out to an open circle ~5.5 yards outside and ~7 DEEP: the
 *                   launch point (we carry it at 5.5 deep — see reviewNotes)
 *   Y               inside release, climb to ~6, then across the field at
 *                   ~9 yards: the OVER route, not a shallow drag
 *   L               straight up ~10, then break inside on an angle to the deep
 *                   middle (~19 on the scan): the POST
 *   X               ~9-10 stem, plant inside, then break back out and up to
 *                   ~18: the (post-)corner
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'
import { mirrorPlay } from '../../utils/mirror'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

// ---------------------------------------------------------------------------
// Skill work — identical against all three fronts.
// ---------------------------------------------------------------------------

/** Q: reverse pivot into the fake, then boot to the launch point. */
const Q_BOOT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.6, y: -2.2 },
      { x: -1.3, y: -3.3 },
      { x: -0.3, y: -4.4 },
      { x: 1.8, y: -5.3 },
      { x: 3.7, y: -5.6 },
      { x: 5.6, y: -5.5 },
    ],
  },
]

/** R: motion across, then carry out the Stretch fake to the left. */
const R_FAKE: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 3.4, y: -2.4 },
      { x: 2.3, y: -4.6 },
      { x: 0.8, y: -6.2 },
      { x: -1.3, y: -6.4 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: -2.6, y: -5.4 },
      { x: -3.6, y: -3.6 },
      { x: -4.5, y: -1.9 },
    ],
  },
]

/** S: sell the run, then get out to the flat on the boot side. */
const S_FLAT: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 0.9, y: -3.4 },
      { x: 2.2, y: -2.0 },
      { x: 4.2, y: -1.0 },
      { x: 6.4, y: -0.2 },
      { x: 7.6, y: 0.4 },
    ],
  },
]

/** Y: the over — inside release, climb, then across the field at nine. */
const Y_OVER: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -4.0, y: 1.8 },
      { x: -3.0, y: 5.8 },
      { x: -0.6, y: 8.4 },
      { x: 2.8, y: 9.0 },
      { x: 6.4, y: 9.0 },
    ],
  },
]

/** L: the post — ten straight up, then break inside to the deep middle. */
const L_POST: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -5.7, y: 1.6 },
      { x: -5.6, y: 6.0 },
      { x: -5.5, y: 10.3 },
      { x: -2.5, y: 14.6 },
      { x: 1.0, y: 18.4 },
    ],
  },
]

/** X: stem, plant inside, then break back out to the corner. */
const X_CORNER: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 12.1, y: 2.4 },
      { x: 12.0, y: 9.4 },
      { x: 10.4, y: 12.4 },
      { x: 12.2, y: 15.2 },
      { x: 13.6, y: 18.2 },
    ],
  },
]

const SKILL = {
  Q: Q_BOOT,
  R: R_FAKE,
  S: S_FLAT,
  Y: Y_OVER,
  L: L_POST,
  X: X_CORNER,
} satisfies Partial<Record<OffPosId, Action[]>>

/**
 * RG pulls flat to the boot side and kicks out the first man outside the right
 * tackle. Path first, then the block — the renderer draws the bar from the end
 * of the pull to the defender, so this stays right when a front moves.
 */
const rgPull = (targetId: string): Action[] => [
  {
    kind: 'run',
    path: [
      { x: 2.4, y: -0.9 },
      { x: 3.6, y: -1.3 },
      { x: 4.8, y: -1.5 },
    ],
  },
  { kind: 'block', targetId },
]

// ---------------------------------------------------------------------------
// Front plans. The run action — and therefore every block bar — goes LEFT.
// Rule for the line: block the first defender to your LEFT. Right guard pulls.
// ---------------------------------------------------------------------------

const vs44: FrontPlan = {
  actions: {
    ...SKILL,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('T-L'),
    RG: rgPull('E-R'),
    RT: block('T-R'),
  },
}

/** Same four down linemen as the 4-4, so the protection is identical. */
const vs43: FrontPlan = {
  actions: {
    ...SKILL,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('T-L'),
    RG: rgPull('E-R'),
    RT: block('T-R'),
  },
}

const vs52: FrontPlan = {
  actions: {
    ...SKILL,
    LT: block('T-L'),
    LG: block('T-L'),
    C: block('N'),
    RG: rgPull('E-R'),
    RT: block('T-R'),
  },
  assignments: {
    C: {
      rule: 'Block Stretch to the fake side — the nose is yours.',
      detail:
        'Odd front, so there is a man head up on you. Step toward the fake, get your hat across him and hold him. The pulling guard is gone, so nobody is coming to help — hold your ground and do not chase.',
    },
    LT: {
      rule: 'Block Stretch to the fake side — reach the man on you.',
      detail:
        'The tackle is head up on you in a 5-2. Step toward the fake, hat across his near number, sell the run. The end outside you releases with the tight end and chases nothing.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table. Page 19 has no assignment table, so
// this is written from the drawn arrows and standard boot rules.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  Q: {
    rule: 'Open to the fake side, ride the fake, then boot back the other way. Read flat to over to corner.',
    detail:
      'Open to the fake side exactly like Stretch — same footwork, same depth, ball out in front of your belly. Ride the fake all the way through, THEN pull it and get around the boot-side edge, about five yards outside the tackle and five deep. Get your shoulders around. Read it low to high: flat first, the over at nine second, the corner third. Nothing there? Tuck it and run — this play is a run for you as often as it is a pass.',
  },
  R: {
    rule: 'Motion across and carry out the Stretch fake.',
    detail:
      'Motion back across the formation on the cadence — run it deep, behind Super, the way it is drawn — take the fake from the quarterback and run the Stretch track like the ball is in your gut, out toward the tackle on the fake side. If you jog this, the play does not work. You are the reason the linebackers step the wrong way.',
  },
  S: {
    rule: 'Sell the run, then get to the flat on the boot side.',
    detail:
      'Two hard steps toward the run action, then get over the top of the guard and out to the flat about seven yards outside. Turn your numbers to the quarterback and be ready early — you are his first look and his outlet if the edge gets messy.',
  },
  Y: {
    rule: 'Over route — climb inside, then run across at nine yards.',
    detail:
      'Get off the ball like you are blocking, then release INSIDE, climb to about six, and run across the field at nine yards all the way to the boot side. Do not drift deeper and do not settle short — nine is where the linebackers are not, once they chase the run. Keep running until the quarterback throws it or crosses your face.',
  },
  L: {
    rule: 'Post — ten straight up, then break inside for the deep middle.',
    detail:
      'Ten yards straight up the field at the safety, then stick your outside foot in the ground and take it to the post. You clear the middle for the over route, and if the safety jumps the crosser you are gone.',
  },
  X: {
    rule: 'Corner — stem to ten, plant inside, then break back out.',
    detail:
      'Stem up the field about ten, give one hard step inside to move the corner, then break back out and go get it over your outside shoulder at eighteen. You are the shot on this play.',
  },
  LT: {
    rule: 'Block Stretch to the fake side — take the first man that way.',
    detail:
      'This is the Stretch block, not a pass set. Fire out at 45 toward the fake and put your hat on the first defender that way. Stay low, stay on the line — the second you stand up and pass-set, the linebackers know.',
  },
  LG: {
    rule: 'Block Stretch to the fake side — take the first man that way.',
    detail:
      'Same 45-degree step you take on Stretch. Sell the run with your pads, then keep your feet moving and never let anybody cross your face back toward the quarterback.',
  },
  C: {
    rule: 'Block Stretch to the fake side — take the first man that way.',
    detail:
      'Step toward the fake and take whoever shows. Remember the guard on the boot side is pulling, so the gap behind you is open — get your head around fast and do not chase anybody downfield.',
  },
  RG: {
    rule: 'Pull flat to the boot side and kick out the edge.',
    detail:
      'Open to the boot side and run flat behind the line — do not go deep. Find the first man outside our boot-side tackle and kick him OUT, away from the quarterback. Your block is the door the quarterback runs through.',
  },
  RT: {
    rule: 'Block Stretch to the fake side — take the first man that way.',
    detail:
      'Step down toward the fake with everybody else. You are selling the run; the man behind you belongs to the pulling guard now.',
  },
}

const reviewNotes = [
  "Page 19 has NO assignment table — it is three hand-drawn panels and nothing else. Everything in the assignment column of this play is football written from the drawn arrows plus standard boot rules. It needs your eyes more than any other play we have transcribed.",
  "BIGGEST OPEN QUESTION — who carries out the fake and who blocks the edge. On the Waggle Rt panel there is a wavy line (the book's motion mark, same one used on Jet and Rocket) running from the right wing back across the formation and out toward the left tackle, and a separate black line running out to a block bar on the boot-side edge. We read that as: R motions across and takes the fake, and the RIGHT GUARD pulls to kick out the edge. The other honest reading of the same ink is: R never motions, R blocks the edge, and Super carries out the fake. Those are very different plays for R and for Super. Please settle it — it is a small change either way. (One piece of evidence, offered not to close the question but because you should have it: on a zoom of the scan the wavy line and the line running left out of the backfield are BOTH drawn in R's red, while the line to the block bar is black like the linemen, and it can be traced back to a start point directly under the right guard. Super's black line traces up over the guard and out to the flat arrow, which is a separate line.)",
  "ROUTE DEPTHS RE-CUT after a superimpose pass on a zoom of the panel — this is the big change in this pass, so look at the picture. Our first transcription had Y on a 4-yard DRAG and L on an over crossing at 9-10. Measured against the panel's own vertical scale, the ink says the opposite: Y runs the OVER (inside release, climb to about 6, across at 9) and L runs a deep POST (about 10 straight up, then break inside to the deep middle — the drawn arrow finishes near 19). X's corner is also drawn much deeper than we had it: about a 10-yard stem, plant inside, break back out to about 18. There is NO shallow drag on this panel; the underneath level is Super's flat. Depths are still estimates — the panel has no depth text — but the ORDER and SHAPE now match the drawing. If 18-19 yards is too deep for our kids, say so and we'll compress the whole flood while keeping the shape.",
  "The quarterback's boot landmark on the scan is DEEP, not shallow — an earlier note here said the opposite and it was wrong. The open circle is drawn about 7 yards behind the line and 5-6 yards outside, below Super. We carry it at 5.5 outside and 5.5 deep, shallower than drawn, because that is a depth a 13-year-old can actually throw from and still get around the edge. Flagging the deviation; say the word and we'll take it to the drawn 7.",
  "R's motion track on the scan runs DEEP — the flat part of it is about two yards BEHIND Super, not between Super and the quarterback where we first had it. It is now drawn that way. The consequence is that the motion line and the quarterback's ride no longer visibly meet on our diagram, which is exactly what the scan looks like too, but it does make the mesh point a coaching-point rather than a drawing-point. And the drawn fake track stops behind the left tackle rather than running past the line of scrimmage — ours now stops there too.",
  "Protection rule as coded: every lineman blocks the first defender to his LEFT (the Stretch run action), which is exactly what all five block bars on the scan show. Against our 5-2 that leaves the LEFT end (E-L) unblocked, because the tight end has released on the over. On a boot away from him that is normal, but say the word if you'd rather the left tackle fan out to him and the guard/center slide.",
  "Side effect of the deeper routes: the Waggle diagram now frames about 20 yards downfield instead of 10, so it draws at a smaller scale than the run plays. That is the diagram fitting the play, not a bug — but if you want every card to share one scale, tell us and we'll cap the frame.",
  "The right guard's pull is drawn passing BEHIND the wing and putting the block bar about 6 yards outside and 1.5 yards behind the line, so his pull path now runs past R instead of stopping inside him. The block target is unchanged (first man outside the right tackle).",
  "The right guard pulling means the backside A gap is open. That is the price of the play and it is why the fake has to be good. If you'd rather keep the guard in and have the wing kick the edge, that is the alternate reading in the note above and it fixes this at the same time.",
  "Direction: `waggleRed.direction` is 'right' — the BOOT side, not the fake side — so the playside/backside badges read from where the ball is going. The run fake goes left. Confirm that is how you want it labeled for the kids.",
  "The panel above Waggle on the same page, 'Stretch Left Boot Rt', is the same protection and the same boot with the routes handed out differently (there the left wing runs the shallow flat all the way across and the tight end runs the deep over). If you want that one in the book too it is a small file — same bones, different routes.",
  "Waggle is the only pass in this slice, so nothing here has been checked against Ram/Bull pass protection from page 15. If you want the line's language on this play to match the protection page, tell us which words to use.",
]

export const waggleRed: Play = {
  id: 'waggle-red',
  name: 'Waggle',
  callName: 'PAP (Boot)',
  family: 'pass',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'Q',
  description:
    'Our play-action bread and butter. Everything up front looks exactly like Stretch going left — same steps, same fake, the wing coming across to take the ball — and then the quarterback keeps it and boots the other way into a three-level flood: Super in the flat underneath, the tight end running the over at nine, and X on the corner over the top, with L clearing the middle on the post. If they chase the run, somebody is wide open. If they do not, the run was going to work.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}

/**
 * Waggle Black — generated by mirroring Waggle Red.
 *
 * Hand corrections after the mirror: NONE. Page 19 only draws the play one way
 * (Waggle Rt out of Red), so there is no second scan to diff against; all three
 * of our fronts are left/right symmetric and every job flips cleanly — L is the
 * motion man and fake carrier now, LG pulls to kick the boot-side edge, R runs
 * the post, Y still runs the over, and X — split left — still runs the corner
 * on the boot side.
 */
export const waggleBlack: Play = mirrorPlay(waggleRed, {
  id: 'waggle-black',
  formation: 'black',
  description:
    'Waggle the other way out of Black. Fake the Stretch to the right, boot left, and flood it: flat, over, corner, with the post clearing the middle. L is the motion man taking the fake now and the left guard pulls to open the edge.',
  reviewNotes: [
    ...reviewNotes,
    'Waggle Black is generated by mirroring Waggle Red (app/utils/mirror.ts) with no hand corrections. Page 19 only draws this play in one direction, so unlike Stretch there is no second scan to check the mirror against — it is symmetric football, but nobody has seen varsity draw it.',
  ],
})

export const wagglePlays: Play[] = [waggleRed, waggleBlack]
