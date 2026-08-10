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
 * ARROWS AS DRAWN on the Waggle Rt panel:
 *   LT LG C RG RT   short stems with block bars, every one of them leaning UP
 *                   and to the LEFT — the Stretch-left run action
 *   R               a wavy line (the book's motion mark) from the right wing
 *                   back across the formation, then flat behind the backs, then
 *                   up and out to a point just outside the LEFT tackle: motion
 *                   across and take the fake
 *   S               up over the right guard and out flat to about 7 yards
 *                   outside at the line: the flat route
 *   a black line from the right-guard area sweeping out past the wing to a
 *                   block bar ~6 yards outside, 1 yard behind the line: the
 *                   kick-out on the boot-side edge
 *   Q               down to the fake, then back around and out to an open
 *                   circle ~5 yards outside and ~3.5 deep: the launch point
 *   Y               up ~3 and then all the way across at ~4 yards: the drag
 *   L               up ~5, then break inside on an angle to ~9-10: the over
 *   X               stem, plant inside, then break back out and up: the corner
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
      { x: -0.7, y: -2.0 },
      { x: -1.4, y: -2.8 },
      { x: -0.2, y: -3.7 },
      { x: 1.8, y: -4.2 },
      { x: 3.7, y: -4.0 },
      { x: 5.4, y: -3.5 },
    ],
  },
]

/** R: motion across, then carry out the Stretch fake to the left. */
const R_FAKE: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 3.4, y: -1.9 },
      { x: 2.0, y: -2.6 },
      { x: 0.2, y: -2.8 },
      { x: -1.6, y: -2.8 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: -3.0, y: -2.2 },
      { x: -4.3, y: -1.2 },
      { x: -5.1, y: 0.3 },
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

/** Y: the drag — up three, then across the field at four. */
const Y_DRAG: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -4.1, y: 1.6 },
      { x: -2.8, y: 3.4 },
      { x: 0.6, y: 4.2 },
      { x: 4.0, y: 4.4 },
      { x: 6.4, y: 4.4 },
    ],
  },
]

/** L: the over route — five up, then break inside and run across deep. */
const L_OVER: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -5.5, y: 1.6 },
      { x: -5.3, y: 5.0 },
      { x: -3.0, y: 6.6 },
      { x: 0.0, y: 8.2 },
      { x: 1.8, y: 9.4 },
    ],
  },
]

/** X: stem, plant inside, then break back out to the corner. */
const X_CORNER: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 12.3, y: 2.4 },
      { x: 12.2, y: 4.6 },
      { x: 10.3, y: 6.2 },
      { x: 12.6, y: 7.8 },
      { x: 14.4, y: 9.6 },
    ],
  },
]

const SKILL = {
  Q: Q_BOOT,
  R: R_FAKE,
  S: S_FLAT,
  Y: Y_DRAG,
  L: L_OVER,
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
      { x: 3.8, y: -1.1 },
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
      rule: 'Block Stretch left — the nose is yours.',
      detail:
        'Odd front, so there is a man right on you. Playside step, get your hat across him and hold him. The right guard is gone on the pull, so nobody is coming to help — hold your ground and do not chase.',
    },
    LT: {
      rule: 'Block Stretch left — reach the man on you.',
      detail:
        'The tackle is head up on you in a 5-2. Step left, hat across his playside number, sell the run. The end outside you releases with the tight end and chases nothing.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table. Page 19 has no assignment table, so
// this is written from the drawn arrows and standard boot rules.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  Q: {
    rule: 'Open left, ride the fake, then boot right. Read flat to drag to corner.',
    detail:
      'Open to the left exactly like Stretch — same footwork, same depth, ball out in front of your belly. Ride the fake all the way through, THEN pull it and get around the right edge, about five yards outside the tackle and three deep. Get your shoulders around. Read it low to high: flat first, drag second, corner third. Nothing there? Tuck it and run — this play is a run for you as often as it is a pass.',
  },
  R: {
    rule: 'Motion across and carry out the Stretch fake.',
    detail:
      'Motion back across the formation on the cadence, take the fake from the quarterback and run the Stretch track like the ball is in your gut, all the way outside the left tackle. If you jog this, the play does not work. You are the reason the linebackers step the wrong way.',
  },
  S: {
    rule: 'Sell the run, then get to the flat on the boot side.',
    detail:
      'Two hard steps toward the run action, then get over the top of the guard and out to the flat about seven yards outside. Turn your numbers to the quarterback and be ready early — you are his first look and his outlet if the edge gets messy.',
  },
  Y: {
    rule: 'Drag — three up, then across at four yards.',
    detail:
      'Get off the ball like you are blocking, then release inside and run flat across the field at about four yards, all the way to the boot side. Do not drift deep. Keep running until the quarterback throws it or crosses your face.',
  },
  L: {
    rule: 'Over route — five up, then break inside and run across deep.',
    detail:
      'Five yards straight upfield to hold the safety, then break inside on an angle and cross the middle at nine or ten. You are the answer if they jump the drag.',
  },
  X: {
    rule: 'Corner — stem it, plant inside, then break back out.',
    detail:
      'Stem up the field, give one hard step inside to move the corner, then break back out and go get it over your outside shoulder. You are the shot on this play.',
  },
  LT: {
    rule: 'Block Stretch left — take the first man to your left.',
    detail:
      'This is the Stretch block, not a pass set. Fire out at 45 to the left and put your hat on the first defender to your play side. Stay low, stay on the line — the second you stand up and pass-set, the linebackers know.',
  },
  LG: {
    rule: 'Block Stretch left — take the first man to your left.',
    detail:
      'Same 45-degree step you take on Stretch. Sell the run with your pads, then keep your feet moving and never let anybody cross your face back toward the quarterback.',
  },
  C: {
    rule: 'Block Stretch left — take the first man to your left.',
    detail:
      'Playside step, take whoever shows. Remember the right guard is pulling, so the gap behind you is open — get your head around fast and do not chase anybody downfield.',
  },
  RG: {
    rule: 'Pull flat to the boot side and kick out the edge.',
    detail:
      'Open to the right and run flat behind the tackle — do not go deep. Find the first man outside our right tackle and kick him OUT, away from the quarterback. Your block is the door the quarterback runs through.',
  },
  RT: {
    rule: 'Block Stretch left — take the first man to your left.',
    detail:
      'Step down to your left with everybody else. You are selling the run; the man behind you is the right guard\'s problem now.',
  },
}

const reviewNotes = [
  "Page 19 has NO assignment table — it is three hand-drawn panels and nothing else. Everything in the assignment column of this play is football written from the drawn arrows plus standard boot rules. It needs your eyes more than any other play we have transcribed.",
  "BIGGEST OPEN QUESTION — who carries out the fake and who blocks the edge. On the Waggle Rt panel there is a wavy line (the book's motion mark, same one used on Jet and Rocket) running from the right wing back across the formation and out toward the left tackle, and a separate black line running out to a block bar on the boot-side edge. We read that as: R motions across and takes the fake, and the RIGHT GUARD pulls to kick out the edge. The other honest reading of the same ink is: R never motions, R blocks the edge, and Super carries out the fake. Those are very different plays for R and for Super. Please settle it — it is a small change either way.",
  "Route depths are estimates. The Waggle panel is about two inches wide on the scan and there is no depth text anywhere on the page. We used honest 8th-grade numbers: Y drag at 4, L over breaking at 5 and crossing at 9-10, X corner planting around 6, Super's flat at the line about 7 wide. Change any number and we'll re-cut it.",
  "The quarterback's boot landmark on the scan is very shallow — the drawn line finishes almost at the line of scrimmage. We set the launch point at about 5 yards outside and 3.5 deep, which is a depth a 13-year-old can actually throw from. Flagging the deviation.",
  "Protection rule as coded: every lineman blocks the first defender to his LEFT (the Stretch run action), which is exactly what all five block bars on the scan show. Against our 5-2 that leaves the LEFT end (E-L) unblocked, because the tight end has released on the drag. On a boot away from him that is normal, but say the word if you'd rather the left tackle fan out to him and the guard/center slide.",
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
    'Our play-action bread and butter. Everything up front looks exactly like Stretch going left — same steps, same fake, the wing coming across to take the ball — and then the quarterback keeps it and boots the other way with three receivers flooding the right side: the flat underneath, the drag at four, and the corner over the top. If they chase the run, somebody is wide open. If they do not, the run was going to work.',
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
 * the over route, Y still runs the drag, and X — split left — still runs the
 * corner on the boot side.
 */
export const waggleBlack: Play = mirrorPlay(waggleRed, {
  id: 'waggle-black',
  formation: 'black',
  description:
    'Waggle the other way out of Black. Fake the Stretch to the right, boot left, and flood it: flat, drag, corner. L is the motion man taking the fake now and the left guard pulls to open the edge.',
  reviewNotes: [
    ...reviewNotes,
    'Waggle Black is generated by mirroring Waggle Red (app/utils/mirror.ts) with no hand corrections. Page 19 only draws this play in one direction, so unlike Stretch there is no second scan to check the mirror against — it is symmetric football, but nobody has seen varsity draw it.',
  ],
})

export const wagglePlays: Play[] = [waggleRed, waggleBlack]
