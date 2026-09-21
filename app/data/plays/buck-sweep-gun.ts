/**
 * BUCK SWEEP from the GUN — four plays built from the under-center Buck Sweep
 * plays (./buck-sweep) with `gunPlay` (./gun-shared). The line never moves.
 *
 * COACH RYAN'S SPEC (2026-09-21), for Black Gun Buck Sweep Left, verbatim in
 * spirit: "We fake the handoff to the left wing, going right up to the right
 * guard. Before the play starts, the right wing goes in motion back towards
 * the quarterback. As soon as they say HUT, the super back runs out around
 * the left tackle to block the weak side alley. The X receiver should be
 * blocking the corner back. The handoff eventually goes to that right wing
 * who sweeps all the way to the outside by where that X receiver was. Left
 * tackle contains the edge and makes sure the defensive end does not get
 * outside of him. Left guard has to engage with the D tackle in front of him
 * for at least a second or two, and then he can pull. Right guard needs to
 * do one push block on the D tackle in front of him and then he can pull.
 * When the right guard pulls, all he needs to do is get around the left
 * tackle and run upfield and block any Jersey that he can. The left guard
 * needs to go around and help the super back with the weak side alley. Or
 * the linebacker that is closest to the ball. This, of course, would be
 * mirrored when you go to red."
 *
 * So the gun Buck Sweep is NOT the under-center picture with the backs moved.
 * There is no kick-out and no wrap: the ball goes all the way outside, the
 * playside tackle CONTAINS the end, Super leads to the alley, the guards
 * engage-then-pull, and the widest receiver has the corner.
 *
 * GUN GEOMETRY (app/data/shotgun.ts): Q (0,−3) · Super (−1,−4) · the wing
 * beside the QB at (1,−4) — R in Red, L in Black · the slot wing a yard off
 * the line at −8.5 (L, Red) or +8.5 (R, Black). Super is LEFT of the QB in
 * BOTH sets, so Black Gun is not Red Gun mirrored: on the RIGHT-going plays
 * Super has to cross behind the quarterback to reach the playside alley, and
 * the wing beside the quarterback fakes the buck ACROSS the quarterback's
 * face. That is why there are two backfield pictures (LEFT-going and
 * RIGHT-going) and every Black play is built from its own Black base.
 *
 * THE FOUR PLAYS:
 *   Black Gun Left  (split-end side, toward X) — Ryan's words above.
 *   Red Gun Right   (split-end side, toward X) — Ryan: "mirrored when you go
 *                   to red": L motions, R fakes, S crosses to the right alley.
 *   Red Gun Left    (tight-end side) — NOT described by Ryan. Same structure
 *                   applied: the slot wing L motions in and takes the sweep
 *                   back toward his own side; Y, the widest man there, has
 *                   the corner. Every choice is DRAFT in reviewNotes.
 *   Black Gun Right (tight-end side) — same, other side. DRAFT.
 *
 * Action paths are ABSOLUTE yards EXCLUDING the player's start; every Q, S
 * and wing path below is drawn from the GUN spots, not offset from the base.
 */

import type { Action, Assignment, OffPosId, Play } from '../../types/football'
import {
  buckSweepLeftBlack,
  buckSweepLeftRed,
  buckSweepRightBlack,
  buckSweepRightRed,
} from './buck-sweep'
import { gunPlay } from './gun-shared'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

/** Negate x on every point. Targets are set explicitly by the caller. */
const flip = (actions: Action[]): Action[] =>
  actions.map((a) => ({ ...a, path: a.path?.map((p) => ({ x: -p.x, y: p.y })) }))

// ---------------------------------------------------------------------------
// The motion wing. Pre-snap he comes in from the slot, flat and behind the
// quarterback, and is still moving at the snap: the motion ends at (±2.4,−5.2),
// a couple of yards short of the quarterback's heels. Two carries follow it:
//   THROUGH — the sweep keeps going the way the motion was going (Black Left,
//             Red Right: the split-end side). Mesh at about (∓0.4,−5.4).
//   RETURN  — the sweep goes back the way he came (Red Left, Black Right: the
//             tight-end side). He takes the ball at about (∓0.9,−5.5) and
//             hairpins back. See the DRAFT note on those plays.
// The ball turns up OUTSIDE everything — where the split end (x ±12) or the
// slot (x ±8.5) lined up — because nobody kicks anybody out on this version.
// ---------------------------------------------------------------------------

/** R in Black Gun, from the right slot (8.5,−1), motioning left. */
const MOTION_FROM_RIGHT: Action = {
  kind: 'motion',
  path: [
    { x: 6.6, y: -2.5 },
    { x: 4.4, y: -4.3 },
    { x: 2.4, y: -5.2 },
  ],
}
/** L in Red Gun, from the left slot (−8.5,−1), motioning right. */
const MOTION_FROM_LEFT: Action = flip([MOTION_FROM_RIGHT])[0]!

/** Sweep LEFT, continuing the motion: mesh behind the QB, out past x = −10. */
const SWEEP_LEFT_THROUGH: Action = {
  kind: 'carry',
  path: [
    { x: 0.6, y: -5.4 },
    { x: -1.6, y: -5.4 },
    { x: -4, y: -5.1 },
    { x: -6.4, y: -4.4 },
    { x: -8.6, y: -3 },
    { x: -10.2, y: -1 },
    { x: -10.6, y: 1.4 },
    { x: -10, y: 4.8 },
  ],
}
const SWEEP_RIGHT_THROUGH: Action = flip([SWEEP_LEFT_THROUGH])[0]!

/** Sweep LEFT after motioning in from the LEFT: take it, hairpin, go. */
const SWEEP_LEFT_RETURN: Action = {
  kind: 'carry',
  path: [
    { x: -0.9, y: -5.5 },
    { x: -2.4, y: -6 },
    { x: -4.6, y: -5.6 },
    { x: -6.6, y: -4.6 },
    { x: -8.4, y: -3 },
    { x: -9.6, y: -1 },
    { x: -9.8, y: 1.4 },
    { x: -9.2, y: 4.8 },
  ],
}
const SWEEP_RIGHT_RETURN: Action = flip([SWEEP_LEFT_RETURN])[0]!

// ---------------------------------------------------------------------------
// The buck fake — the wing beside the quarterback at (1,−4).
// ---------------------------------------------------------------------------

/**
 * LEFT-going plays: he fakes RIGHT, up into the right guard's B gap (the
 * 3-technique sits at 1.8, so the fake runs just outside him at 2.7). He is
 * on the quarterback's right already, so the ride is at the QB's right hip.
 */
const FAKE_RIGHT: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 1.5, y: -2.7 },
      { x: 2.3, y: -1.1 },
      { x: 2.7, y: 0.5 },
    ],
  },
]

/**
 * RIGHT-going plays: he fakes LEFT, into the left guard's B gap — ACROSS the
 * quarterback. A short step behind the quarterback's heels first so the path
 * clears him, then up. (Not a flip of FAKE_RIGHT: he starts on the right in
 * both sets.)
 */
const FAKE_LEFT: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 0.3, y: -3.9 },
      { x: -1.3, y: -2.7 },
      { x: -2.3, y: -1.1 },
      { x: -2.7, y: 0.5 },
    ],
  },
]

// ---------------------------------------------------------------------------
// The quarterback, from (0,−3): open to the buck fake, ride it a step, drop
// back two yards to the mesh behind him, hand to the motion wing, boot AWAY.
// ---------------------------------------------------------------------------

const Q_LEFT: Action[] = [
  { kind: 'run', path: [{ x: 0.5, y: -3.5 }, { x: -0.5, y: -5.1 }] },
  {
    kind: 'fake',
    path: [
      { x: 0.8, y: -4.9 },
      { x: 2.6, y: -4.2 },
      { x: 4.4, y: -3.2 },
      { x: 5.6, y: -2 },
    ],
  },
]
const Q_RIGHT: Action[] = flip(Q_LEFT)

// ---------------------------------------------------------------------------
// Super, from (−1,−4): out around the playside tackle RIGHT NOW, into the
// alley. Going left he is already on that side. Going right he has to cross
// behind the quarterback (and under the fake wing's first step) — flagged.
// ---------------------------------------------------------------------------

const S_LEFT_ALLEY: Action = {
  kind: 'run',
  path: [
    { x: -2.8, y: -4.2 },
    { x: -5, y: -3 },
    { x: -6.8, y: -1.2 },
  ],
}

const S_RIGHT_ALLEY: Action = {
  kind: 'run',
  path: [
    { x: 0.5, y: -4.7 },
    { x: 2.8, y: -4.2 },
    { x: 5, y: -3 },
    { x: 6.8, y: -1.2 },
  ],
}

// ---------------------------------------------------------------------------
// The playside tackle CONTAINS the end: a short reach that ends OUTSIDE the
// 5-technique (E at ±3.55) — "the end does not get outside of him".
// ---------------------------------------------------------------------------

const CONTAIN_LT: Action[] = [
  { kind: 'block', targetId: 'E-L', path: [{ x: -3.9, y: 0.4 }, { x: -4.3, y: 0.9 }] },
]
const CONTAIN_RT: Action[] = [
  { kind: 'block', targetId: 'E-R', path: [{ x: 3.9, y: 0.4 }, { x: 4.3, y: 0.9 }] },
]

// ---------------------------------------------------------------------------
// The guards. Each one is drawn as TWO actions: a short block stub on the
// tackle over him (the engage / the push), then the pull path chained off it.
// The pull's target is set per front by the caller.
//   PLAYSIDE guard: engage a count or two, pull flat, turn up in the alley.
//   BACKSIDE guard: one push, pull flat, get AROUND the playside tackle's
//   contain block (outside x ≈ −5), turn upfield.
// ---------------------------------------------------------------------------

const ENGAGE_TL: Action = { kind: 'block', targetId: 'T-L', path: [{ x: -1.9, y: 0.55 }] }
const ENGAGE_TR: Action = { kind: 'block', targetId: 'T-R', path: [{ x: 1.9, y: 0.55 }] }

/** LEFT-going: LG is the playside guard. */
const LG_ENGAGE_PULL_LEFT: Action[] = [
  ENGAGE_TL,
  {
    kind: 'run',
    path: [
      { x: -2.3, y: -1.1 },
      { x: -3.8, y: -1.5 },
      { x: -5.2, y: -1.2 },
      { x: -5.8, y: 0.2 },
    ],
  },
]
/** LEFT-going: RG is the backside guard. */
const RG_PUSH_PULL_LEFT: Action[] = [
  ENGAGE_TR,
  {
    kind: 'run',
    path: [
      { x: 1.4, y: -1.2 },
      { x: -0.6, y: -2 },
      { x: -2.8, y: -2.2 },
      { x: -4.8, y: -2 },
      { x: -6.4, y: -0.9 },
      { x: -7.1, y: 0.6 },
    ],
  },
]
/** RIGHT-going: RG is the playside guard, LG the backside guard. */
const RG_ENGAGE_PULL_RIGHT: Action[] = [ENGAGE_TR, ...flip(LG_ENGAGE_PULL_LEFT.slice(1))]
const LG_PUSH_PULL_RIGHT: Action[] = [ENGAGE_TL, ...flip(RG_PUSH_PULL_LEFT.slice(1))]

// ---------------------------------------------------------------------------
// Words. Kid voice; the varsity terms stay (pull, contain, alley, buck).
// ---------------------------------------------------------------------------

type Side = 'left' | 'right'
const other = (s: Side): Side => (s === 'left' ? 'right' : 'left')

/** The motion wing — the ball carrier. `outside` says where the ball turns up. */
const CARRIER = (side: Side, outside: string): Assignment => ({
  rule: 'Motion back toward the quarterback. Take the handoff, sweep it wide.',
  detail: `Before the snap, come in motion from your slot back toward the quarterback — flat, and behind him. At HUT keep coming. He fakes the buck to the other wing first, then puts the ball in your belly behind him. Take it going ${side} and get ALL the way outside, ${outside}. Super and both guards are out in front of you. Get to the edge first, then turn it up.`,
})

/** The wing beside the quarterback — the buck fake. */
const BUCK = (side: Side): Assignment => ({
  rule: `Fake the buck ${side}. Sell it.`,
  detail: `Run at the ${side} guard like you have the ball — arms out, chest square, full speed into the line. The quarterback puts it in your belly and rides you for a step, then keeps it. Your fake is what makes the linebackers step the wrong way before the ball goes outside. Run through the hole even after you know you do not have it.`,
})

const Q_GUN = (side: Side): Assignment => ({
  rule: 'Ride the buck fake. Hand off behind you. Boot away.',
  detail: `Catch the snap, put the ball in the buck wing's belly and ride him one step — sell it with your eyes. Pull it out, drop back and turn to the motion wing coming behind you. Hand it to him going ${side} with your chest square to him, then boot ${other(side)} like you kept it. That fake is worth a defender.`,
})

const SUPER = (side: Side): Assignment => ({
  rule: 'Out around the tackle at HUT. Block the alley.',
  detail: `No fake for you on this one. At HUT you go — out around our ${side} tackle and into the alley. Block the first man who shows up out there and run him toward the sideline. The sweep is coming right behind you; whoever you hit is the man who would have made the tackle.`,
})

const CONTAIN: Assignment = {
  rule: 'Contain — the end does NOT get outside you.',
  detail:
    'Forget the down block. The end is your man, and your only job is to keep him inside you. Get your helmet outside him, get your hands on him and wall him toward the middle. Super and both guards are coming around you — if the end gets outside, he runs into all of them and the play dies.',
}

const PLAYSIDE_GUARD: Assignment = {
  rule: 'Engage the tackle over you for a count, THEN pull. Help in the alley.',
  detail:
    'Hit the tackle over you and stay on him for a second or two — long enough that he cannot chase the sweep. Then come off, pull flat around our tackle and get to the alley. Help Super with the man out there, or take the linebacker closest to the ball. Nobody has to be kicked out — the ball is going all the way outside.',
}

const BACKSIDE_GUARD = (side: Side): Assignment => ({
  rule: 'One push, then pull. Around our tackle, upfield, block any jersey.',
  detail: `Give the tackle over you one hard shove — one — then pull flat down the line. Get around our ${side} tackle, turn upfield, and block the first jersey you see. Do not stop to look for a certain man: run and hit somebody.`,
})

/** Y on the tight-end side: he is the widest man there, so the corner is his. */
const Y_CORNER: Assignment = {
  rule: 'Climb — block the corner.',
  detail:
    'The tackle has the end and Super has the alley, so you are free. You are the widest man on our side, and the ball is coming all the way outside — the corner is yours. Release, get to him fast, and stay on him.',
}

/** Per-front words for the three men whose target changes with the front. */
interface FrontWords {
  S: Assignment
  playsideGuard: Assignment
  backsideGuard: Assignment
}

const frontWords = (side: Side): Record<'44' | '43' | '52', FrontWords> => ({
  '44': {
    S: {
      rule: 'Out around the tackle — block the walked-up backer in the alley.',
      detail: `At HUT go — around our ${side} tackle into the alley. The outside backer walked up on the edge is the first man out there. Hit him and run him toward the sideline; the sweep comes off your block.`,
    },
    playsideGuard: {
      rule: 'Engage the tackle for a count, then pull — take the inside backer.',
      detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. Super has the walked-up backer, so you take the inside backer on our side as he scrapes to the alley — he is the linebacker closest to the ball.`,
    },
    backsideGuard: {
      rule: 'One push, then pull — around our tackle, upfield, any jersey.',
      detail: `One hard shove on the tackle over you, then pull flat. Get around our ${side} tackle, turn upfield and block the first jersey you see — in a 4-4 that is usually the free safety coming down.`,
    },
  },
  '43': {
    S: {
      rule: 'Out around the tackle — block the outside backer.',
      detail: `Nobody is walked up in a 4-3, so the outside backer on your side is the first man to the alley. Get around our ${side} tackle and get on him before he can run to the ball.`,
    },
    playsideGuard: {
      rule: 'Engage the tackle for a count, then pull — take the Mike.',
      detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. Super has the outside backer, so the linebacker closest to the ball — the Mike — is yours as he comes over the top.`,
    },
    backsideGuard: {
      rule: 'One push, then pull — around our tackle, upfield, any jersey.',
      detail: `One hard shove on the tackle over you, then pull flat. Get around our ${side} tackle, turn upfield and block the first jersey you see — in a 4-3 that is the safety on our side coming down.`,
    },
  },
  '52': {
    S: {
      rule: 'Out around the tackle — block the first backer to the alley.',
      detail: `The 5-2 has nobody standing on the edge. Get around our ${side} tackle and take the inside backer on your side as he scrapes out — he is the first color in the alley.`,
    },
    playsideGuard: {
      rule: 'Engage the tackle for a count, then pull — take the far backer.',
      detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. Super has the backer on our side, so the other inside backer coming over the top is the linebacker closest to the ball — he is yours.`,
    },
    backsideGuard: {
      rule: 'One push, then pull — around our tackle, upfield, any jersey.',
      detail: `One hard shove on the tackle over you, then pull flat. Get around our ${side} tackle, turn upfield and block the first jersey you see — in a 5-2 that is the safety on our side coming down.`,
    },
  },
})

const coachNotes = [
  'Sell the buck fake - the ball goes outside AFTER the fake.',
  'Super: out around the tackle right at HUT. Block the alley.',
  'Guards: engage, THEN pull. Nobody kicks - get outside and run.',
]

// ---------------------------------------------------------------------------
// Per-front targets. Playside defender ids for a LEFT-going play; the
// RIGHT-going play uses the -R ids. The reasoning is in the review notes.
//   S:  44 the walked-up backer (O) · 43 the outside backer (B) · 52 the
//       inside backer on our side (B) as he scrapes out.
//   Playside guard ("help Super or the backer closest to the ball"):
//       44 the inside backer on our side (B) · 43 the Mike · 52 the OTHER
//       inside backer (Super already has ours).
//   Backside guard ("any jersey", upfield): 44 the free safety · 43 / 52
//       the safety on our side.
// ---------------------------------------------------------------------------

const LEFT_TARGETS = {
  '44': { S: 'O-L', playsideGuard: 'B-L', backsideGuard: 'F' },
  '43': { S: 'B-L', playsideGuard: 'M', backsideGuard: 'F-L' },
  '52': { S: 'B-L', playsideGuard: 'B-R', backsideGuard: 'F-L' },
} as const
const RIGHT_TARGETS = {
  '44': { S: 'O-R', playsideGuard: 'B-R', backsideGuard: 'F' },
  '43': { S: 'B-R', playsideGuard: 'M', backsideGuard: 'F-R' },
  '52': { S: 'B-R', playsideGuard: 'B-L', backsideGuard: 'F-R' },
} as const

// ---------------------------------------------------------------------------
// Review notes shared by all four. Everything here is DRAFT unless it quotes
// Ryan directly.
// ---------------------------------------------------------------------------

const sharedNotes = (p: {
  side: Side
  carrier: OffPosId
  faker: OffPosId
  playsideTackle: OffPosId
  playsideGuard: OffPosId
  backsideGuard: OffPosId
  playsideDT: string
  backsideDT: string
  targets: typeof LEFT_TARGETS | typeof RIGHT_TARGETS
}): string[] => {
  const t = p.targets
  return [
    `DRAFT — THE MOTION. ${p.carrier} comes in from the slot on a flat arc behind the quarterback and is drawn still moving at the snap, ending at (±2.4, −5.2) — about two yards short of the quarterback's heels. Ryan said "goes in motion back towards the quarterback" but not how far; we stopped him short so the handoff happens on the run, behind the quarterback, at about 5.4 yards deep. If you want him to motion all the way across before the snap (a true jet), or to stop and set, the motion end point and the mesh move.`,
    `DRAFT — THE MESH IS 5.4 YARDS DEEP. The quarterback catches at 3, rides the buck fake to ${p.faker} for a step, then drops back about two yards to hand to ${p.carrier} going by behind him. That is the under-center play's 5-yard mesh, reached from the gun. If you would rather the motion man run shallower and the quarterback stay put, say so.`,
    `DRAFT — THE QUARTERBACK BOOTS AWAY after the handoff, like the under-center play (Ryan did not mention the boot). It is drawn as a short flat fake ${other(p.side)}. Say the word to drop it.`,
    `DRAFT — THE BUCK FAKE: ${p.faker} runs the B gap outside the ${other(p.side)} guard (past the 3-technique) with his arms out; drawn as a fake, not a carry. Ryan: "fake the handoff to the ${p.faker === 'L' ? 'left' : 'right'} wing, going ${other(p.side)} up to the ${other(p.side)} guard."`,
    `DRAFT — PULL TARGETS PER FRONT (Ryan gave rules, not men — "help the super back with the weak side alley, or the linebacker that is closest to the ball" for ${p.playsideGuard}, "any jersey" for ${p.backsideGuard}). Super: 4-4 the walked-up backer ${t['44'].S}, 4-3 the outside backer ${t['43'].S}, 5-2 the inside backer on our side ${t['52'].S} as he scrapes out (nobody stands in the 5-2 alley). ${p.playsideGuard}: 4-4 the inside backer ${t['44'].playsideGuard}, 4-3 the Mike, 5-2 the OTHER inside backer ${t['52'].playsideGuard} (Super already has ours). ${p.backsideGuard}: the safety — F in the 4-4, ${t['43'].backsideGuard} in the 4-3 and 5-2 — because "run upfield and block any jersey" ends at the safety once the backers are taken. All three are long block lines on the diagram, like the base play's alley blocks.`,
    `DRAFT — THE ENGAGE-THEN-PULL is drawn as a short block stub on the tackle over each guard, then the pull path chained off it. ${p.playsideGuard}'s pull turns up at about 5.8 wide, just outside our tackle's contain block on the end; ${p.backsideGuard} goes a yard deeper and a yard wider (7.1) to get AROUND that block, then upfield. Neither guard is timed on the diagram — the "second or two" versus "one push" difference lives in the words.`,
    `DRAFT — WHO IS LEFT AFTER THE ENGAGE. The tackle over ${p.playsideGuard} (${p.playsideDT}) is engaged for a count and then released with NOBODY on him — that is the spec ("engage… then he can pull"), and our ${p.playsideTackle} is on the end now instead of blocking down on him. The tackle over ${p.backsideGuard} (${p.backsideDT}) gets the one push and then the center's block-back in the even fronts (base job); in the 5-2 the center has the nose and the backside tackle cuts him off (base job). So the one man deliberately left on every front is ${p.playsideDT}. He is not in \`ignored\` (no dashed ring) because he is not ignored, he is delayed — say the word if you want the ring.`,
    `DRAFT — UNBLOCKED PER FRONT, playside: 4-4 nobody (end, both backers, corner and free safety all have a man) except ${p.playsideDT} after the engage; 4-3 the same; 5-2 the same. Backside, as under center: 4-4 the walked-up backer and corner away from the play; 4-3 the safety and corner away from the play; 5-2 the safety and corner away from the play.`,
    `DRAFT — ${p.playsideTackle} CONTAINS THE END (Ryan). That is a change from the under-center play, where the playside tackle blocks DOWN on the tackle over the pulling guard. Drawn as a short reach ending just outside the 5-technique.`,
    'DRAFT — no read key on this play, and nothing in `ignored`.',
  ]
}

// ===========================================================================
// BLACK GUN — Buck Sweep LEFT (split-end side, toward X). Ryan's play.
// R motions in from the right slot and carries; L fakes the buck right; S
// leads to the left alley; LT contains; LG engages then pulls; RG pushes once
// then pulls around LT; X has the corner.
// ===========================================================================

const wordsLeft = frontWords('left')
const wordsRight = frontWords('right')

const blackGunLeft = gunPlay(buckSweepLeftBlack, {
  ballCarrier: 'R',
  formationTwinId: 'buck-sweep-left-red-gun',
  audibleFlipId: 'buck-sweep-right-black-gun',
  summary: 'Buck fake inside, then the motion wing takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the left out of Black Gun. The right wing comes in motion back toward the quarterback before the snap. At HUT the quarterback fakes the buck to the left wing going right at the right guard, then hands to the motion wing, who sweeps all the way outside to where X lined up. Super runs out around the left tackle to block the alley, the left tackle contains the end, the left guard engages then pulls to help in the alley, and the right guard pushes once, pulls around the left tackle and blocks any jersey upfield. X blocks the corner. Nobody kicks out — the ball goes around everything.',
  coachNotes,
  assignments: {
    R: CARRIER('left', 'out where X lined up'),
    L: BUCK('right'),
    Q: Q_GUN('left'),
    S: SUPER('left'),
    LT: CONTAIN,
    LG: PLAYSIDE_GUARD,
    RG: BACKSIDE_GUARD('left'),
  },
  actions: {
    R: [MOTION_FROM_RIGHT, SWEEP_LEFT_THROUGH],
    L: FAKE_RIGHT,
    Q: Q_LEFT,
    LT: CONTAIN_LT,
  },
  vs: {
    '44': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['44'].S)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['44'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['44'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('left', 'out where X lined up'),
        L: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN,
        S: wordsLeft['44'].S,
        LG: wordsLeft['44'].playsideGuard,
        RG: wordsLeft['44'].backsideGuard,
      },
    },
    '43': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['43'].S)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['43'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['43'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('left', 'out where X lined up'),
        L: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN,
        S: wordsLeft['43'].S,
        LG: wordsLeft['43'].playsideGuard,
        RG: wordsLeft['43'].backsideGuard,
      },
    },
    '52': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['52'].S)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['52'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['52'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('left', 'out where X lined up'),
        L: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN,
        S: wordsLeft['52'].S,
        LG: wordsLeft['52'].playsideGuard,
        RG: wordsLeft['52'].backsideGuard,
      },
    },
  },
  reviewNotes: [
    "This is the play Ryan described on 2026-09-21, word for word in the file header: R motions back toward the quarterback, L fakes the buck right at the right guard, R takes the handoff and sweeps to where X lined up, Super out around the left tackle for the alley, X on the corner, LT contains, LG engages then pulls to help in the alley or the nearest backer, RG one push then pulls around LT and blocks any jersey. Built from buck-sweep-left-black with gunPlay.",
    ...sharedNotes({
      side: 'left',
      carrier: 'R',
      faker: 'L',
      playsideTackle: 'LT',
      playsideGuard: 'LG',
      backsideGuard: 'RG',
      playsideDT: 'T-L',
      backsideDT: 'T-R',
      targets: LEFT_TARGETS,
    }),
    'DRAFT — C, RT, Y and X keep their under-center jobs on every front: C blocks back on T-R in the even fronts (after RG\'s push) and takes the nose in the 5-2; RT climbs to B-R in the even fronts and cuts off T-R in the 5-2; Y walls off E-R; X stalks the corner C-L, which is exactly what Ryan asked of him.',
    'DRAFT — THE SWEEP TURNS UP at about x = −10.5, just inside where X lined up (−12), because the corner is blocked by X and everything else is inside. "Sweeps all the way to the outside by where that X receiver was."',
  ],
})

// ===========================================================================
// RED GUN — Buck Sweep RIGHT (split-end side, toward X). Ryan: "mirrored when
// you go to red." L motions in from the left slot and carries; R fakes the
// buck LEFT across the quarterback; S crosses behind the quarterback to the
// right alley; RT contains; RG engages then pulls; LG pushes once then pulls
// around RT; X has the corner.
// ===========================================================================

const redGunRight = gunPlay(buckSweepRightRed, {
  ballCarrier: 'L',
  formationTwinId: 'buck-sweep-right-black-gun',
  audibleFlipId: 'buck-sweep-left-red-gun',
  summary: 'Buck fake inside, then the motion wing takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the right out of Red Gun — the mirror of the Black Gun version. The left wing comes in motion back toward the quarterback before the snap. At HUT the quarterback fakes the buck to the right wing going left at the left guard, then hands to the motion wing, who sweeps all the way outside to where X lined up. Super crosses behind the quarterback and runs out around the right tackle to block the alley, the right tackle contains the end, the right guard engages then pulls to help in the alley, and the left guard pushes once, pulls around the right tackle and blocks any jersey upfield. X blocks the corner.',
  coachNotes,
  assignments: {
    L: CARRIER('right', 'out where X lined up'),
    R: BUCK('left'),
    Q: Q_GUN('right'),
    S: SUPER('right'),
    RT: CONTAIN,
    RG: PLAYSIDE_GUARD,
    LG: BACKSIDE_GUARD('right'),
  },
  actions: {
    L: [MOTION_FROM_LEFT, SWEEP_RIGHT_THROUGH],
    R: FAKE_LEFT,
    Q: Q_RIGHT,
    RT: CONTAIN_RT,
  },
  vs: {
    '44': {
      actions: {
        S: [S_RIGHT_ALLEY, ...block(RIGHT_TARGETS['44'].S)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['44'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['44'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('right', 'out where X lined up'),
        R: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN,
        S: wordsRight['44'].S,
        RG: wordsRight['44'].playsideGuard,
        LG: wordsRight['44'].backsideGuard,
      },
    },
    '43': {
      actions: {
        S: [S_RIGHT_ALLEY, ...block(RIGHT_TARGETS['43'].S)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['43'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['43'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('right', 'out where X lined up'),
        R: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN,
        S: wordsRight['43'].S,
        RG: wordsRight['43'].playsideGuard,
        LG: wordsRight['43'].backsideGuard,
      },
    },
    '52': {
      actions: {
        S: [S_RIGHT_ALLEY, ...block(RIGHT_TARGETS['52'].S)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['52'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['52'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('right', 'out where X lined up'),
        R: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN,
        S: wordsRight['52'].S,
        RG: wordsRight['52'].playsideGuard,
        LG: wordsRight['52'].backsideGuard,
      },
    },
  },
  reviewNotes: [
    'Ryan: "This, of course, would be mirrored when you go to red." Mirrored in ROLES, not in coordinates — Super stands on the quarterback\'s left in both sets. L (the slot wing in Red) motions and carries, R (beside the quarterback) fakes the buck LEFT, RT contains, RG engages then pulls, LG one push then pulls around RT, X on the corner. Built from buck-sweep-right-red with gunPlay.',
    'DRAFT — SUPER CROSSES BEHIND THE QUARTERBACK on this one. He starts a yard LEFT of the quarterback and the alley is on the RIGHT, so at HUT he runs flat behind the quarterback (under the mesh, at about 4.7 deep) and out around the right tackle. He is a step later to the alley than on the Black Gun version and his path runs right past the fake wing\'s first step. If that traffic bothers you the fix is a formation call (Super to the right of the quarterback in Red Gun), not a play change.',
    'DRAFT — THE BUCK FAKE CROSSES THE QUARTERBACK\'S FACE: R starts on the quarterback\'s right and the buck goes LEFT at the left guard, so he takes a short step behind the quarterback\'s heels and then up into the left B gap. The quarterback opens LEFT to ride him. Same picture in reverse on Black Gun Right.',
    ...sharedNotes({
      side: 'right',
      carrier: 'L',
      faker: 'R',
      playsideTackle: 'RT',
      playsideGuard: 'RG',
      backsideGuard: 'LG',
      playsideDT: 'T-R',
      backsideDT: 'T-L',
      targets: RIGHT_TARGETS,
    }),
    'DRAFT — C, LT, Y and X keep their under-center jobs on every front: C blocks back on T-L in the even fronts (after LG\'s push) and takes the nose in the 5-2; LT climbs to B-L in the even fronts and cuts off T-L in the 5-2; Y walls off E-L; X stalks the corner C-R.',
    'DRAFT — THE SWEEP TURNS UP at about x = 10.5, just inside where X lined up (12).',
  ],
})

// ===========================================================================
// RED GUN — Buck Sweep LEFT (tight-end side). NOT DESCRIBED BY RYAN. Same
// structure: L motions in from the left slot and takes the sweep back toward
// his own side; R fakes the buck right; S leads to the left alley; LT
// contains; LG engages then pulls; RG pushes once then pulls around LT; Y,
// the widest man on the play side, has the corner. Every decision is DRAFT.
// ===========================================================================

const tightEndSideNotes = (p: {
  side: Side
  carrier: OffPosId
  faker: OffPosId
  slotX: number
  corner: string
  playsideTackle: OffPosId
  playsideDT: string
  backsideEnd: string
}): string[] => [
  `DRAFT — RYAN DID NOT DESCRIBE THIS ONE. It is the split-end-side play's structure applied to the tight-end side: the slot wing ${p.carrier} motions back toward the quarterback and takes the sweep BACK toward his own side, ${p.faker} fakes the buck the other way, Super leads around the ${p.side} tackle, the guards engage-then-pull the same way, ${p.playsideTackle} contains, and the widest man on the play side — Y — has the corner. Ryan: "I can always change it."`,
  `DRAFT — THE RETURN MOTION IS THE THING TO LOOK AT. ${p.carrier} motions IN toward the quarterback (the only direction "back towards the quarterback" can mean from his slot) and then has to take the handoff and go BACK the way he came. It is drawn as a hairpin: motion arrives at (${p.side === 'left' ? '−' : ''}2.4, −5.2), he takes the ball at about (${p.side === 'left' ? '−' : ''}0.9, −5.5) and bends back ${p.side}. That is a full stop and turn at the mesh. Two cleaner alternatives if you do not like it: (a) NO motion on the tight-end side — the slot wing blocks down as usual and the wing beside the quarterback takes the sweep from his gun spot, Super still leads; or (b) the slot wing motions in, and the play goes the OTHER way (which is just the split-end-side play out of the same set). Say which.`,
  `DRAFT — Y BLOCKS THE CORNER (${p.corner}) on every front. Under center Y blocks down / climbs to a backer; here ${p.playsideTackle} has the end, Super has the alley, the playside guard has the nearest backer, and the ball is going all the way outside, so the corner is the man nobody else reaches. Y is 6½ yards from him, which is a stalk, not a crack. The alternative is Y climbs to the backer as under center and the corner is left for the runner.`,
  `DRAFT — THE SWEEP TURNS UP at about x = ${p.side === 'left' ? '−' : ''}9.7 — where the slot lined up (${p.slotX}) — rather than out at the split end, because there is no split end on this side and Y is stalking the corner from 4½ yards.`,
  `DRAFT — THE BACKSIDE END (${p.backsideEnd}) is left alone, exactly as the under-center tight-end-side play leaves him (the backside wing who might have barred him is now the buck faker). X runs the corner off on the back side, as under center.`,
]

const redGunLeft = gunPlay(buckSweepLeftRed, {
  ballCarrier: 'L',
  formationTwinId: 'buck-sweep-left-black-gun',
  audibleFlipId: 'buck-sweep-right-red-gun',
  summary: 'Buck fake inside, then the motion wing takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the left out of Red Gun — at the tight end. The left wing comes in motion from the slot back toward the quarterback before the snap. At HUT the quarterback fakes the buck to the right wing going right at the right guard, then hands to the motion wing, who takes it back left and sweeps all the way outside to where he lined up. Super runs out around the left tackle to block the alley, the left tackle contains the end, the left guard engages then pulls to help in the alley, the right guard pushes once, pulls around the left tackle and blocks any jersey upfield, and Y blocks the corner.',
  coachNotes,
  assignments: {
    L: CARRIER('left', 'out where you lined up'),
    R: BUCK('right'),
    Q: Q_GUN('left'),
    S: SUPER('left'),
    LT: CONTAIN,
    LG: PLAYSIDE_GUARD,
    RG: BACKSIDE_GUARD('left'),
    Y: Y_CORNER,
  },
  actions: {
    L: [MOTION_FROM_LEFT, SWEEP_LEFT_RETURN],
    R: FAKE_RIGHT,
    Q: Q_LEFT,
    LT: CONTAIN_LT,
    Y: block('C-L'),
  },
  vs: {
    '44': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['44'].S)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['44'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['44'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('left', 'out where you lined up'),
        R: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN,
        Y: Y_CORNER,
        S: wordsLeft['44'].S,
        LG: wordsLeft['44'].playsideGuard,
        RG: wordsLeft['44'].backsideGuard,
      },
    },
    '43': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['43'].S)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['43'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['43'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('left', 'out where you lined up'),
        R: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN,
        Y: Y_CORNER,
        S: wordsLeft['43'].S,
        LG: wordsLeft['43'].playsideGuard,
        RG: wordsLeft['43'].backsideGuard,
      },
    },
    '52': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['52'].S)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['52'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['52'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('left', 'out where you lined up'),
        R: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN,
        Y: Y_CORNER,
        S: wordsLeft['52'].S,
        LG: wordsLeft['52'].playsideGuard,
        RG: wordsLeft['52'].backsideGuard,
      },
    },
  },
  reviewNotes: [
    ...tightEndSideNotes({
      side: 'left',
      carrier: 'L',
      faker: 'R',
      slotX: -8.5,
      corner: 'C-L',
      playsideTackle: 'LT',
      playsideDT: 'T-L',
      backsideEnd: 'E-R',
    }),
    ...sharedNotes({
      side: 'left',
      carrier: 'L',
      faker: 'R',
      playsideTackle: 'LT',
      playsideGuard: 'LG',
      backsideGuard: 'RG',
      playsideDT: 'T-L',
      backsideDT: 'T-R',
      targets: LEFT_TARGETS,
    }),
    'DRAFT — C and RT keep their under-center jobs on every front: C blocks back on T-R in the even fronts (after RG\'s push) and takes the nose in the 5-2; RT climbs to B-R in the even fronts and cuts off T-R in the 5-2. Y CHANGED (corner, above). X is backside and runs his free route as under center.',
  ],
})

// ===========================================================================
// BLACK GUN — Buck Sweep RIGHT (tight-end side). NOT DESCRIBED BY RYAN. R
// motions in from the right slot and takes the sweep back right; L fakes the
// buck LEFT across the quarterback; S crosses behind the quarterback to the
// right alley; RT contains; RG engages then pulls; LG pushes once then pulls
// around RT; Y has the corner. Built from the Black base, not mirrored.
// ===========================================================================

const blackGunRight = gunPlay(buckSweepRightBlack, {
  ballCarrier: 'R',
  formationTwinId: 'buck-sweep-right-red-gun',
  audibleFlipId: 'buck-sweep-left-black-gun',
  summary: 'Buck fake inside, then the motion wing takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the right out of Black Gun — at the tight end. The right wing comes in motion from the slot back toward the quarterback before the snap. At HUT the quarterback fakes the buck to the left wing going left at the left guard, then hands to the motion wing, who takes it back right and sweeps all the way outside to where he lined up. Super crosses behind the quarterback and runs out around the right tackle to block the alley, the right tackle contains the end, the right guard engages then pulls to help in the alley, the left guard pushes once, pulls around the right tackle and blocks any jersey upfield, and Y blocks the corner.',
  coachNotes,
  assignments: {
    R: CARRIER('right', 'out where you lined up'),
    L: BUCK('left'),
    Q: Q_GUN('right'),
    S: SUPER('right'),
    RT: CONTAIN,
    RG: PLAYSIDE_GUARD,
    LG: BACKSIDE_GUARD('right'),
    Y: Y_CORNER,
  },
  actions: {
    R: [MOTION_FROM_RIGHT, SWEEP_RIGHT_RETURN],
    L: FAKE_LEFT,
    Q: Q_RIGHT,
    RT: CONTAIN_RT,
    Y: block('C-R'),
  },
  vs: {
    '44': {
      actions: {
        S: [S_RIGHT_ALLEY, ...block(RIGHT_TARGETS['44'].S)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['44'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['44'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('right', 'out where you lined up'),
        L: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN,
        Y: Y_CORNER,
        S: wordsRight['44'].S,
        RG: wordsRight['44'].playsideGuard,
        LG: wordsRight['44'].backsideGuard,
      },
    },
    '43': {
      actions: {
        S: [S_RIGHT_ALLEY, ...block(RIGHT_TARGETS['43'].S)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['43'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['43'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('right', 'out where you lined up'),
        L: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN,
        Y: Y_CORNER,
        S: wordsRight['43'].S,
        RG: wordsRight['43'].playsideGuard,
        LG: wordsRight['43'].backsideGuard,
      },
    },
    '52': {
      actions: {
        S: [S_RIGHT_ALLEY, ...block(RIGHT_TARGETS['52'].S)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['52'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['52'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('right', 'out where you lined up'),
        L: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN,
        Y: Y_CORNER,
        S: wordsRight['52'].S,
        RG: wordsRight['52'].playsideGuard,
        LG: wordsRight['52'].backsideGuard,
      },
    },
  },
  reviewNotes: [
    ...tightEndSideNotes({
      side: 'right',
      carrier: 'R',
      faker: 'L',
      slotX: 8.5,
      corner: 'C-R',
      playsideTackle: 'RT',
      playsideDT: 'T-R',
      backsideEnd: 'E-L',
    }),
    'DRAFT — SUPER CROSSES BEHIND THE QUARTERBACK, same as Red Gun Right: he starts on the left and the alley is on the right, so he runs flat under the mesh and out around the right tackle. And the buck fake crosses the quarterback\'s face: L steps behind the quarterback\'s heels and up into the left B gap. Built from buck-sweep-right-black with gunPlay, not by mirroring Red Gun Left — Super is on the quarterback\'s left in both sets.',
    ...sharedNotes({
      side: 'right',
      carrier: 'R',
      faker: 'L',
      playsideTackle: 'RT',
      playsideGuard: 'RG',
      backsideGuard: 'LG',
      playsideDT: 'T-R',
      backsideDT: 'T-L',
      targets: RIGHT_TARGETS,
    }),
    'DRAFT — C and LT keep their under-center jobs on every front: C blocks back on T-L in the even fronts (after LG\'s push) and takes the nose in the 5-2; LT climbs to B-L in the even fronts and cuts off T-L in the 5-2. Y CHANGED (corner, above). X is backside and runs his free route as under center.',
  ],
})

export const buckSweepGunPlays: Play[] = [redGunRight, blackGunRight, redGunLeft, blackGunLeft]
