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
 * RYAN'S CORRECTION (2026-09-23) — which back fakes: "The spirit of Buck
 * Sweep is we fake the run on one side of the line and then sweep to the
 * other side. On Buck Sweep Right, we fake to the superback on the left, but
 * hand it off to the receiver coming across to the right. Buck Sweep Left,
 * we fake to the wing, then hand off to the receiver motioned out to the
 * left. Basically the opposite." So the fake is ALWAYS by the back on the
 * side AWAY from the sweep, straight ahead from his own spot — nobody crosses
 * the quarterback's face:
 *   LEFT-going:  the wing beside the QB (on his right) fakes right; Super
 *                (on his left) leads to the left alley.
 *   RIGHT-going: Super (on the QB's left) fakes left; the wing beside the QB
 *                (on his right) leads to the right alley.
 *
 * So the gun Buck Sweep is NOT the under-center picture with the backs moved.
 * There is no kick-out and no wrap: the ball goes all the way outside, the
 * playside tackle CONTAINS the end, Super leads to the alley, the guards
 * engage-then-pull, and the widest receiver has the corner. (Where the spec
 * says "Super" leads, read "the lead back": Super going left, the wing going
 * right.)
 *
 * GUN GEOMETRY (app/data/shotgun.ts): Q (0,−3) · Super (−1,−4) · the wing
 * beside the QB at (1,−4) — R in Red, L in Black · the slot wing a yard off
 * the line at −8.5 (L, Red) or +8.5 (R, Black). Super is LEFT of the QB in
 * BOTH sets, so Black Gun is not Red Gun mirrored — but with the 09-23 rule
 * the two backs just swap jobs by direction: going left the wing fakes and
 * Super leads, going right Super fakes and the wing leads. Each back works
 * on his own side of the quarterback in every play. Every Black play is
 * still built from its own Black base.
 *
 * RYAN (2026-09-23) — THE TIGHT-END SIDE, X ON A JET: "For Black Gun Buck
 * Sweep Right, the spirit of the play is to fake a run to the left and then
 * run with the motion player to the right. The fake handoff goes to the Super
 * like you already have it. That part is good. The X in this play would go in
 * motion and take the handoff and sweep to the right. The R wing then blocks
 * the S alley linebacker. Then of course the opposite is true." He also
 * confirmed the wing beside the quarterback LEADS the sweep: out around the
 * playside tackle ahead of the carrier, and he takes the corner (X is not out
 * there to block him any more).
 *
 * THE FOUR PLAYS:
 *   Black Gun Left  (split-end side, toward X) — Ryan's 09-21 words above:
 *                   R motions in from the slot and carries, L fakes right,
 *                   Super leads to the left alley, X has the corner.
 *   Red Gun Right   (split-end side, toward X) — Ryan 09-23: L motions across
 *                   and carries, SUPER fakes left, R leads to the right alley.
 *   Black Gun Right (tight-end side) — Ryan 09-23, the jet: X jets across from
 *                   wide left and carries right, SUPER fakes left, L (beside the
 *                   QB) leads around RT to the corner, R (right slot) blocks
 *                   the S in the alley.
 *   Red Gun Left    (tight-end side) — "the opposite is true": X jets across
 *                   from wide right and carries left, R fakes right, SUPER
 *                   leads around LT to the corner, L (left slot) blocks the S.
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
// The motion wing (the split-end-side plays: Black Left, Red Right). Pre-snap
// he comes in from the slot, flat and behind the quarterback, and is still
// moving at the snap: the motion ends at (±2.4,−5.2), a couple of yards short
// of the quarterback's heels. The sweep keeps going the way the motion was
// going; mesh at about (∓0.4,−5.4). The ball turns up OUTSIDE everything —
// where the split end (x ±12) lined up — because nobody kicks anybody out.
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

// ---------------------------------------------------------------------------
// X's jet (the tight-end-side plays: Red Left, Black Right). Ryan (09-23):
// "The X in this play would go in motion and take the handoff and sweep." X
// starts split wide on the far side (±12,0) and comes in jet motion flat
// across, behind the quarterback. The motion ends at the same spot the slot
// wing's does on the other two plays, (±2.4,−5.2), so X is at full speed at
// the snap and meets the quarterback just after it at the same 5.4-deep mesh
// — the quarterback's footwork is identical on all four plays. He keeps going
// and sweeps OUTSIDE everything, outside the lead back's block on the corner,
// so his path never crosses the lead's.
// ---------------------------------------------------------------------------

/** X in Red Gun, from (12,0), jet motion left across the formation. */
const JET_FROM_RIGHT: Action = {
  kind: 'motion',
  path: [
    { x: 10.6, y: -1.4 },
    { x: 8, y: -3 },
    { x: 5.2, y: -4.4 },
    { x: 2.4, y: -5.2 },
  ],
}
/** X in Black Gun, from (−12,0), jet motion right. */
const JET_FROM_LEFT: Action = flip([JET_FROM_RIGHT])[0]!

/** X's carry LEFT off the jet: mesh behind the QB, around the lead, up the sideline side. */
const JET_SWEEP_LEFT: Action = {
  kind: 'carry',
  path: [
    { x: 0.6, y: -5.4 },
    { x: -1.6, y: -5.4 },
    { x: -4, y: -5.3 },
    { x: -6.6, y: -4.6 },
    { x: -9, y: -3.4 },
    { x: -10.8, y: -1.4 },
    { x: -11.8, y: 1.2 },
    { x: -12.2, y: 4.4 },
  ],
}
const JET_SWEEP_RIGHT: Action = flip([JET_SWEEP_LEFT])[0]!

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
 * RIGHT-going plays: SUPER fakes LEFT from (−1,−4), up into the left guard's
 * B gap — the mirror of the wing's fake, because Super stands exactly where
 * the wing does, flipped. Ryan (09-23): "we fake to the superback on the left."
 */
const FAKE_LEFT_SUPER: Action[] = flip(FAKE_RIGHT)

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
// The LEAD back: out around the playside tackle RIGHT NOW, into the alley.
// Going left that is Super from (−1,−4); going right it is the wing beside
// the quarterback from (1,−4) — the same path, mirrored. Neither crosses.
// ---------------------------------------------------------------------------

const S_LEFT_ALLEY: Action = {
  kind: 'run',
  path: [
    { x: -2.8, y: -4.2 },
    { x: -5, y: -3 },
    { x: -6.8, y: -1.2 },
  ],
}

/** The wing beside the quarterback, from (1,−4), to the RIGHT alley. */
const WING_RIGHT_ALLEY: Action = flip([S_LEFT_ALLEY])[0]!

/**
 * The jet plays: the lead back goes out around the playside tackle, stays
 * OUTSIDE the slot's crack block (he passes under the slot's spot after the
 * slot has left it), and climbs to the corner. X runs outside him. Going left
 * it is Super from (−1,−4); going right the wing beside the QB from (1,−4).
 */
const LEAD_LEFT_CORNER: Action = {
  kind: 'run',
  path: [
    { x: -2.8, y: -4.2 },
    { x: -5, y: -3.4 },
    { x: -7.4, y: -2.6 },
    { x: -9.4, y: -1.2 },
    { x: -10.2, y: 1.4 },
    { x: -10.4, y: 3.6 },
  ],
}
const LEAD_RIGHT_CORNER: Action = flip([LEAD_LEFT_CORNER])[0]!

/**
 * The jet plays: the slot wing cracks inside on the S — the alley linebacker
 * (Ryan: "blocks the S alley linebacker"). From the left slot (−8.5,−1); the
 * target is set per front by the caller. 4-4: the walked-up S at (−6.5,3.5).
 * 4-3: the Sam at (−4,4.5). 5-2: no S — the inside backer at (−2,4).
 */
const SLOT_CRACK_LEFT: Record<'44' | '43' | '52', Action[]> = {
  '44': [{ kind: 'block', targetId: 'O-L', path: [{ x: -8.2, y: 0.6 }, { x: -7.5, y: 2.1 }, { x: -6.95, y: 2.95 }] }],
  '43': [{ kind: 'block', targetId: 'B-L', path: [{ x: -8.1, y: 0.8 }, { x: -6.5, y: 2.7 }, { x: -4.6, y: 4 }] }],
  '52': [{ kind: 'block', targetId: 'B-L', path: [{ x: -8.1, y: 0.8 }, { x: -6.2, y: 2.4 }, { x: -2.7, y: 3.6 }] }],
}
const SLOT_CRACK_RIGHT: Record<'44' | '43' | '52', Action[]> = {
  '44': [{ ...flip(SLOT_CRACK_LEFT['44'])[0]!, targetId: 'O-R' }],
  '43': [{ ...flip(SLOT_CRACK_LEFT['43'])[0]!, targetId: 'B-R' }],
  '52': [{ ...flip(SLOT_CRACK_LEFT['52'])[0]!, targetId: 'B-R' }],
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

/**
 * Who does what in the backfield, by direction (Ryan, 09-23): going LEFT the
 * wing fakes and Super leads; going RIGHT Super fakes and the wing leads.
 */
const faker = (side: Side): string => (side === 'left' ? 'the other wing' : 'Super')
const lead = (side: Side): string => (side === 'left' ? 'Super' : 'the wing')
const Lead = (side: Side): string => (side === 'left' ? 'Super' : 'The wing')

/** The motion wing — the ball carrier. `outside` says where the ball turns up. */
const CARRIER = (side: Side, outside: string): Assignment => ({
  rule: 'Motion back toward the quarterback. Take the handoff, sweep it wide.',
  detail: `Before the snap, come in motion from your slot back toward the quarterback — flat, and behind him. At HUT keep coming. He fakes the buck to ${faker(side)} going ${other(side)} first, then puts the ball in your belly behind him. Take it going ${side} and get ALL the way outside, ${outside}. ${Lead(side)} and both guards are out in front of you. Get to the edge first, then turn it up.`,
})

/**
 * The buck fake, going `side` — the wing beside the quarterback on a
 * LEFT-going play (fakes right), Super on a RIGHT-going play (fakes left).
 */
const BUCK = (side: Side): Assignment => ({
  rule: `Fake the buck ${side}. Sell it.`,
  detail: `Run at the ${side} guard like you have the ball — arms out, chest square, full speed into the line. The quarterback puts it in your belly and rides you for a step, then keeps it. Your fake is what makes the linebackers step the wrong way before the ball goes outside. Run through the hole even after you know you do not have it.`,
})

const Q_GUN = (side: Side): Assignment => ({
  rule: 'Ride the buck fake. Hand off behind you. Boot away.',
  detail: `Catch the snap, put the ball in ${side === 'left' ? "the buck wing's" : "Super's"} belly going ${other(side)} and ride him one step — sell it with your eyes. Pull it out, drop back and turn to the motion wing coming behind you. Hand it to him going ${side} with your chest square to him, then boot ${other(side)} like you kept it. That fake is worth a defender.`,
})

/** The lead back — Super going left, the wing beside the QB going right. */
const LEAD = (side: Side): Assignment => ({
  rule: 'Out around the tackle at HUT. Block the alley.',
  detail: `No fake for you on this one. At HUT you go — out around our ${side} tackle and into the alley. Block the first man who shows up out there and run him toward the sideline. The sweep is coming right behind you; whoever you hit is the man who would have made the tackle.`,
})

const CONTAIN = (side: Side): Assignment => ({
  rule: 'Contain — the end does NOT get outside you.',
  detail: `Forget the down block. The end is your man, and your only job is to keep him inside you. Get your helmet outside him, get your hands on him and wall him toward the middle. ${Lead(side)} and both guards are coming around you — if the end gets outside, he runs into all of them and the play dies.`,
})

const PLAYSIDE_GUARD = (side: Side): Assignment => ({
  rule: 'Engage the tackle over you for a count, THEN pull. Help in the alley.',
  detail: `Hit the tackle over you and stay on him for a second or two — long enough that he cannot chase the sweep. Then come off, pull flat around our tackle and get to the alley. Help ${lead(side)} with the man out there, or take the linebacker closest to the ball. Nobody has to be kicked out — the ball is going all the way outside.`,
})

const BACKSIDE_GUARD = (side: Side): Assignment => ({
  rule: 'One push, then pull. Around our tackle, upfield, block any jersey.',
  detail: `Give the tackle over you one hard shove — one — then pull flat down the line. Get around our ${side} tackle, turn upfield, and block the first jersey you see. Do not stop to look for a certain man: run and hit somebody.`,
})

/** Per-front words for the three men whose target changes with the front. */
interface FrontWords {
  /** The lead back: Super going left, the wing beside the QB going right. */
  lead: Assignment
  playsideGuard: Assignment
  backsideGuard: Assignment
}

const frontWords = (side: Side): Record<'44' | '43' | '52', FrontWords> => ({
  '44': {
    lead: {
      rule: 'Out around the tackle — block the walked-up backer in the alley.',
      detail: `At HUT go — around our ${side} tackle into the alley. The outside backer walked up on the edge is the first man out there. Hit him and run him toward the sideline; the sweep comes off your block.`,
    },
    playsideGuard: {
      rule: 'Engage the tackle for a count, then pull — take the inside backer.',
      detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. ${Lead(side)} has the walked-up backer, so you take the inside backer on our side as he scrapes to the alley — he is the linebacker closest to the ball.`,
    },
    backsideGuard: {
      rule: 'One push, then pull — around our tackle, upfield, any jersey.',
      detail: `One hard shove on the tackle over you, then pull flat. Get around our ${side} tackle, turn upfield and block the first jersey you see — in a 4-4 that is usually the free safety coming down.`,
    },
  },
  '43': {
    lead: {
      rule: 'Out around the tackle — block the outside backer.',
      detail: `Nobody is walked up in a 4-3, so the outside backer on your side is the first man to the alley. Get around our ${side} tackle and get on him before he can run to the ball.`,
    },
    playsideGuard: {
      rule: 'Engage the tackle for a count, then pull — take the Mike.',
      detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. ${Lead(side)} has the outside backer, so the linebacker closest to the ball — the Mike — is yours as he comes over the top.`,
    },
    backsideGuard: {
      rule: 'One push, then pull — around our tackle, upfield, any jersey.',
      detail: `One hard shove on the tackle over you, then pull flat. Get around our ${side} tackle, turn upfield and block the first jersey you see — in a 4-3 that is the safety on our side coming down.`,
    },
  },
  '52': {
    lead: {
      rule: 'Out around the tackle — block the first backer to the alley.',
      detail: `The 5-2 has nobody standing on the edge. Get around our ${side} tackle and take the inside backer on your side as he scrapes out — he is the first color in the alley.`,
    },
    playsideGuard: {
      rule: 'Engage the tackle for a count, then pull — take the far backer.',
      detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. ${Lead(side)} has the backer on our side, so the other inside backer coming over the top is the linebacker closest to the ball — he is yours.`,
    },
    backsideGuard: {
      rule: 'One push, then pull — around our tackle, upfield, any jersey.',
      detail: `One hard shove on the tackle over you, then pull flat. Get around our ${side} tackle, turn upfield and block the first jersey you see — in a 5-2 that is the safety on our side coming down.`,
    },
  },
})

const coachNotes = (side: Side): string[] => [
  `Fake one way, sweep the other - sell the buck ${other(side)}, the ball goes ${side} AFTER the fake.`,
  side === 'left'
    ? 'Super: out around the tackle right at HUT. Block the alley.'
    : 'Wing: out around the tackle right at HUT. Block the alley. Super fakes.',
  'Guards: engage, THEN pull. Nobody kicks - get outside and run.',
]

// ---------------------------------------------------------------------------
// Per-front targets. Playside defender ids for a LEFT-going play; the
// RIGHT-going play uses the -R ids. The reasoning is in the review notes.
//   lead (Super going left, the wing going right):
//       44 the walked-up backer (O) · 43 the outside backer (B) · 52 the
//       inside backer on our side (B) as he scrapes out.
//   Playside guard ("help Super or the backer closest to the ball"):
//       44 the inside backer on our side (B) · 43 the Mike · 52 the OTHER
//       inside backer (the lead back already has ours).
//   Backside guard ("any jersey", upfield): 44 the free safety · 43 / 52
//       the safety on our side.
// ---------------------------------------------------------------------------

const LEFT_TARGETS = {
  '44': { lead: 'O-L', playsideGuard: 'B-L', backsideGuard: 'F' },
  '43': { lead: 'B-L', playsideGuard: 'M', backsideGuard: 'F-L' },
  '52': { lead: 'B-L', playsideGuard: 'B-R', backsideGuard: 'F-L' },
} as const
const RIGHT_TARGETS = {
  '44': { lead: 'O-R', playsideGuard: 'B-R', backsideGuard: 'F' },
  '43': { lead: 'B-R', playsideGuard: 'M', backsideGuard: 'F-R' },
  '52': { lead: 'B-R', playsideGuard: 'B-L', backsideGuard: 'F-R' },
} as const

// ---------------------------------------------------------------------------
// Review notes shared by all four. Everything here is DRAFT unless it quotes
// Ryan directly.
// ---------------------------------------------------------------------------

const sharedNotes = (p: {
  side: Side
  carrier: OffPosId
  faker: OffPosId
  lead: OffPosId
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
    `THE BUCK FAKE (Ryan, 09-23: "we fake the run on one side of the line and then sweep to the other side"): ${p.faker} fakes ${other(p.side)} from his own spot, straight up into the B gap outside the ${other(p.side)} guard (past the 3-technique) with his arms out — drawn as a fake, not a carry. ${p.side === 'right' ? 'Ryan: "On Buck Sweep Right, we fake to the superback on the left."' : 'Ryan: "Buck Sweep Left, we fake to the wing."'} ${p.lead}, the other back, leads to the ${p.side} alley. Neither back crosses the quarterback's face.`,
    `DRAFT — PULL TARGETS PER FRONT (Ryan gave rules, not men — "help the super back with the weak side alley, or the linebacker that is closest to the ball" for ${p.playsideGuard}, "any jersey" for ${p.backsideGuard}). ${p.lead} (the lead back): 4-4 the walked-up backer ${t['44'].lead}, 4-3 the outside backer ${t['43'].lead}, 5-2 the inside backer on our side ${t['52'].lead} as he scrapes out (nobody stands in the 5-2 alley). ${p.playsideGuard}: 4-4 the inside backer ${t['44'].playsideGuard}, 4-3 the Mike, 5-2 the OTHER inside backer ${t['52'].playsideGuard} (${p.lead} already has ours). ${p.backsideGuard}: the safety — F in the 4-4, ${t['43'].backsideGuard} in the 4-3 and 5-2 — because "run upfield and block any jersey" ends at the safety once the backers are taken. All three are long block lines on the diagram, like the base play's alley blocks.`,
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
  coachNotes: coachNotes('left'),
  assignments: {
    R: CARRIER('left', 'out where X lined up'),
    L: BUCK('right'),
    Q: Q_GUN('left'),
    S: LEAD('left'),
    LT: CONTAIN('left'),
    LG: PLAYSIDE_GUARD('left'),
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
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['44'].lead)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['44'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['44'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('left', 'out where X lined up'),
        L: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN('left'),
        S: wordsLeft['44'].lead,
        LG: wordsLeft['44'].playsideGuard,
        RG: wordsLeft['44'].backsideGuard,
      },
    },
    '43': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['43'].lead)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['43'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['43'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('left', 'out where X lined up'),
        L: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN('left'),
        S: wordsLeft['43'].lead,
        LG: wordsLeft['43'].playsideGuard,
        RG: wordsLeft['43'].backsideGuard,
      },
    },
    '52': {
      actions: {
        S: [S_LEFT_ALLEY, ...block(LEFT_TARGETS['52'].lead)],
        LG: [...LG_ENGAGE_PULL_LEFT, ...block(LEFT_TARGETS['52'].playsideGuard)],
        RG: [...RG_PUSH_PULL_LEFT, ...block(LEFT_TARGETS['52'].backsideGuard)],
      },
      assignments: {
        R: CARRIER('left', 'out where X lined up'),
        L: BUCK('right'),
        Q: Q_GUN('left'),
        LT: CONTAIN('left'),
        S: wordsLeft['52'].lead,
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
      lead: 'S',
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
// RED GUN — Buck Sweep RIGHT (split-end side, toward X). Ryan (09-23): "we
// fake to the superback on the left, but hand it off to the receiver coming
// across to the right." L motions in from the left slot and carries; SUPER
// fakes the buck LEFT; R (beside the QB) leads to the right alley; RT
// contains; RG engages then pulls; LG pushes once then pulls around RT; X
// has the corner.
// ===========================================================================

const redGunRight = gunPlay(buckSweepRightRed, {
  ballCarrier: 'L',
  formationTwinId: 'buck-sweep-right-black-gun',
  audibleFlipId: 'buck-sweep-left-red-gun',
  summary: 'Buck fake inside, then the motion wing takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the right out of Red Gun — fake left, sweep right. The left wing comes in motion back toward the quarterback before the snap. At HUT the quarterback fakes the buck to Super going left at the left guard, then hands to the motion wing coming across behind him, who sweeps all the way outside to where X lined up. The right wing runs out around the right tackle to block the alley, the right tackle contains the end, the right guard engages then pulls to help in the alley, and the left guard pushes once, pulls around the right tackle and blocks any jersey upfield. X blocks the corner.',
  coachNotes: coachNotes('right'),
  assignments: {
    L: CARRIER('right', 'out where X lined up'),
    S: BUCK('left'),
    Q: Q_GUN('right'),
    R: LEAD('right'),
    RT: CONTAIN('right'),
    RG: PLAYSIDE_GUARD('right'),
    LG: BACKSIDE_GUARD('right'),
  },
  actions: {
    L: [MOTION_FROM_LEFT, SWEEP_RIGHT_THROUGH],
    S: FAKE_LEFT_SUPER,
    Q: Q_RIGHT,
    RT: CONTAIN_RT,
  },
  vs: {
    '44': {
      actions: {
        R: [WING_RIGHT_ALLEY, ...block(RIGHT_TARGETS['44'].lead)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['44'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['44'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('right', 'out where X lined up'),
        S: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN('right'),
        R: wordsRight['44'].lead,
        RG: wordsRight['44'].playsideGuard,
        LG: wordsRight['44'].backsideGuard,
      },
    },
    '43': {
      actions: {
        R: [WING_RIGHT_ALLEY, ...block(RIGHT_TARGETS['43'].lead)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['43'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['43'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('right', 'out where X lined up'),
        S: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN('right'),
        R: wordsRight['43'].lead,
        RG: wordsRight['43'].playsideGuard,
        LG: wordsRight['43'].backsideGuard,
      },
    },
    '52': {
      actions: {
        R: [WING_RIGHT_ALLEY, ...block(RIGHT_TARGETS['52'].lead)],
        RG: [...RG_ENGAGE_PULL_RIGHT, ...block(RIGHT_TARGETS['52'].playsideGuard)],
        LG: [...LG_PUSH_PULL_RIGHT, ...block(RIGHT_TARGETS['52'].backsideGuard)],
      },
      assignments: {
        L: CARRIER('right', 'out where X lined up'),
        S: BUCK('left'),
        Q: Q_GUN('right'),
        RT: CONTAIN('right'),
        R: wordsRight['52'].lead,
        RG: wordsRight['52'].playsideGuard,
        LG: wordsRight['52'].backsideGuard,
      },
    },
  },
  reviewNotes: [
    'Ryan (2026-09-23): "On Buck Sweep Right, we fake to the superback on the left, but hand it off to the receiver coming across to the right." So this is NOT a role-mirror of Black Gun Left: SUPER fakes the buck LEFT from his own spot, R (beside the quarterback, already on the right) leads out around RT to the alley, and L (the slot wing in Red) motions across and carries. RT contains, RG engages then pulls, LG one push then pulls around RT, X on the corner. Replaces the 09-21 draft where R faked across the quarterback and Super crossed behind him to the alley. Built from buck-sweep-right-red with gunPlay.',
    ...sharedNotes({
      side: 'right',
      carrier: 'L',
      faker: 'S',
      lead: 'R',
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
// THE JET PLAYS — the tight-end side (Red Gun Left, Black Gun Right). Ryan
// (09-23): X jets across and carries, the back AWAY from the sweep fakes the
// buck, the wing beside the QB / Super leads around the playside tackle to
// the corner, and the slot wing blocks the S in the alley. The line keeps the
// split-end-side plays' jobs (tackle contains, guards engage-then-pull).
// ===========================================================================

/** Kid-voice names for the three backs on a jet play. */
interface JetCast {
  /** The buck faker, away from the sweep. */
  faker: string
  /** The lead back (to the corner). */
  lead: string
  Lead: string
  /** The slot wing (on the S). */
  slot: string
}

/** Red Gun Left: R fakes right, Super leads left, L is the slot. */
const RED_LEFT_CAST: JetCast = { faker: 'the right wing', lead: 'Super', Lead: 'Super', slot: 'the left wing' }
/** Black Gun Right: Super fakes left, L (beside the QB) leads right, R is the slot. */
const BLACK_RIGHT_CAST: JetCast = { faker: 'Super', lead: 'the left wing', Lead: 'The left wing', slot: 'the right wing' }

const JET_CARRIER = (side: Side, c: JetCast): Assignment => ({
  rule: 'Jet motion across. Take the handoff at full speed, sweep it wide.',
  detail: `Before the snap, come in jet motion from your split — flat across the field, behind the quarterback. Time it so you reach him just after HUT, at full speed; never slow down for the ball. He fakes the buck to ${c.faker} going ${other(side)} first, then puts the ball in your belly behind him. Keep going ${side} and get ALL the way outside — outside ${c.lead}, who has the corner. ${c.slot[0]!.toUpperCase() + c.slot.slice(1)} has the S and both guards are pulling in front of you. Get to the edge first, then turn it up.`,
})

const Q_JET = (side: Side, c: JetCast): Assignment => ({
  rule: 'Ride the buck fake. Hand to X behind you. Boot away.',
  detail: `X is coming across in jet motion — do not wait for him, he times it to you. Catch the snap, put the ball in ${c.faker === 'Super' ? "Super's" : "the right wing's"} belly going ${other(side)} and ride him one step — sell it with your eyes. Pull it out, drop back and turn to X coming behind you. Hand it to him going ${side} with your chest square to him, then boot ${other(side)} like you kept it. That fake is worth a defender.`,
})

const LEAD_CORNER = (side: Side, c: JetCast): Assignment => ({
  rule: 'Lead the sweep. Out around the tackle — block the corner.',
  detail: `No fake for you on this one. At HUT you go — out around our ${side} tackle, outside ${c.slot}'s block, ahead of X. X is running the ball, so nobody else is out there for the corner: he is yours. Get to him fast, get on him and keep him inside you. X is coming around outside your block.`,
})

const Y_HELP_END = (side: Side): Assignment => ({
  rule: 'Help the tackle on the end.',
  detail: `Our ${side} tackle has the end and he must keep him inside. Step down and help him — the two of you make sure the end NEVER gets outside. The sweep is going around both of you; if the end gets loose, he runs into the whole play.`,
})

/** The slot wing on the S / alley linebacker, per front. */
const SLOT_S_WORDS = (c: JetCast): Record<'44' | '43' | '52', Assignment> => ({
  '44': {
    rule: 'Crack down on the S — the walked-up backer in the alley.',
    detail: `The S (their outside backer on your side) is walked up in the alley. Come inside and block him — get your helmet in front of him so he cannot run outside to the sweep. ${c.Lead} is coming around behind you for the corner.`,
  },
  '43': {
    rule: 'Crack down on the S — the outside backer.',
    detail: `In a 4-3 the S is the outside backer on your side, a few yards off the ball. He is the alley linebacker. Come inside and get in front of him before he can run to the sweep. ${c.Lead} is coming around behind you for the corner.`,
  },
  '52': {
    rule: 'Crack down on the backer on your side.',
    detail: `The 5-2 has no S standing in the alley. The inside backer on your side is the first linebacker who will run to the sweep — come inside and cut him off. ${c.Lead} is coming around behind you for the corner.`,
  },
})

/** The playside guard, per front — the slot has the S now, the lead back the corner. */
const JET_PSG_WORDS = (side: Side): Record<'44' | '43' | '52', Assignment> => ({
  '44': {
    rule: 'Engage the tackle for a count, then pull — take the inside backer.',
    detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. The slot wing has the walked-up backer, so you take the inside backer on our side as he scrapes to the alley — he is the linebacker closest to the ball.`,
  },
  '43': {
    rule: 'Engage the tackle for a count, then pull — take the Mike.',
    detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. The slot wing has the outside backer, so the linebacker closest to the ball — the Mike — is yours as he comes over the top.`,
  },
  '52': {
    rule: 'Engage the tackle for a count, then pull — take the far backer.',
    detail: `Hit the tackle over you and stay on him a second or two. Then pull flat around our ${side} tackle. The slot wing has the backer on our side, so the other inside backer coming over the top is the linebacker closest to the ball — he is yours.`,
  },
})

const JET_PLAYSIDE_GUARD = (side: Side): Assignment => ({
  rule: 'Engage the tackle over you for a count, THEN pull. Take the nearest backer.',
  detail: `Hit the tackle over you and stay on him for a second or two — long enough that he cannot chase the sweep. Then come off, pull flat around our ${side} tackle and take the linebacker closest to the ball that the slot wing does not have. Nobody has to be kicked out — the ball is going all the way outside.`,
})

const jetCoachNotes = (side: Side, c: JetCast): string[] => [
  `Fake ${other(side)}, sweep ${side} - sell the buck, then X takes it at full speed.`,
  `${c.Lead}: out around the tackle at HUT. Take the corner.`,
  'Guards: engage, THEN pull. Nobody kicks - get outside and run.',
]

/**
 * Per-front targets on the jet plays, playside LEFT (the RIGHT play uses the
 * -R ids and, in the 5-2, B-L for the playside guard). The slot inherits the
 * man the lead back used to have (the S / alley backer); the lead back takes
 * the corner; the guards are unchanged from the split-end-side plays.
 */
const JET_LEFT_TARGETS = {
  '44': { lead: 'C-L', slot: 'O-L', playsideGuard: 'B-L', backsideGuard: 'F' },
  '43': { lead: 'C-L', slot: 'B-L', playsideGuard: 'M', backsideGuard: 'F-L' },
  '52': { lead: 'C-L', slot: 'B-L', playsideGuard: 'B-R', backsideGuard: 'F-L' },
} as const
const JET_RIGHT_TARGETS = {
  '44': { lead: 'C-R', slot: 'O-R', playsideGuard: 'B-R', backsideGuard: 'F' },
  '43': { lead: 'C-R', slot: 'B-R', playsideGuard: 'M', backsideGuard: 'F-R' },
  '52': { lead: 'C-R', slot: 'B-R', playsideGuard: 'B-L', backsideGuard: 'F-R' },
} as const

const jetNotes = (p: {
  side: Side
  set: 'Red' | 'Black'
  faker: OffPosId
  lead: OffPosId
  slot: OffPosId
  playsideTackle: OffPosId
  playsideGuard: OffPosId
  backsideGuard: OffPosId
  playsideDT: string
  backsideEnd: string
  targets: typeof JET_LEFT_TARGETS | typeof JET_RIGHT_TARGETS
}): string[] => {
  const t = p.targets
  const sx = p.side === 'left' ? '−' : ''
  return [
    `DRAFT — THE JET TIMING. X starts split wide at (${p.side === 'left' ? '' : '−'}12, 0) and is drawn in motion across the formation, still at full speed at the snap, ending at (${p.side === 'left' ? '' : '−'}2.4, −5.2) — the same spot the slot wing's motion ends on the other two plays. So the mesh is the same: about 5.4 yards deep, right behind the quarterback, just after the snap, and the quarterback's footwork is identical on all four. That is about ten yards of motion before the snap; the snap has to come when X is roughly over the ${other(p.side)} tackle. If you want him meshing IN FRONT of the quarterback (a classic jet at about 2 yards), his path crosses the buck faker's, so we kept it behind.`,
    `DRAFT — X RUNS OUTSIDE THE LEAD. ${p.lead} gets to the corner first and walls him inside; X turns up outside that block at about x = ${sx}12, near where the corner lined up. That keeps X's path from crossing ${p.lead}'s. The alternative is ${p.lead} kicks the corner OUT and X cuts up inside him — say so if that is how you teach it (the lines will cross on the diagram).`,
    `THE SLOT ON THE S (Ryan: "The R wing then blocks the S alley linebacker" — here ${p.slot}). Per front: 4-4 the walked-up backer ${t['44'].slot} (drawn S against ${p.set}); 4-3 the Sam ${t['43'].slot} (drawn S); 5-2 there is no S, so the inside backer on our side ${t['52'].slot}, the first linebacker to the alley. DRAFT: this differs from Gun Veer, where the backside slot takes the $ (strong safety) in the 4-3 and 5-2 — here Ryan said "linebacker", so the slot cracks the backer and the backside guard keeps the safety.`,
    `DRAFT — Y IS THE EXTRA MAN. With the slot on the S, ${p.lead} on the corner and the guards on the backer and the safety, every playside defender has a blocker, so Y (whose under-center job is to climb to a backer — now taken) helps ${p.playsideTackle} keep the end inside. The end is the man who kills a sweep. Alternative: Y climbs to the inside backer and the playside guard goes one level up to the safety.`,
    `THE BUCK FAKE (Ryan, 09-23: "The fake handoff goes to the Super like you already have it"): ${p.faker} fakes ${other(p.side)} from his own spot, straight up into the B gap outside the ${other(p.side)} guard, arms out — drawn as a fake, not a carry. Neither back crosses the quarterback's face.`,
    `DRAFT — THE QUARTERBACK BOOTS AWAY after the handoff (${other(p.side)}, following the fake), the same short flat fake as the other three plays. Say the word to drop it.`,
    `DRAFT — THE LINE IS UNCHANGED from the split-end-side plays: ${p.playsideTackle} contains the end, ${p.playsideGuard} engages the tackle over him for a count then pulls (4-4 inside backer ${t['44'].playsideGuard}, 4-3 the Mike, 5-2 the OTHER inside backer ${t['52'].playsideGuard}), ${p.backsideGuard} gives one push, pulls around ${p.playsideTackle} and takes the safety (F in the 4-4, ${t['43'].backsideGuard} in the 4-3 and 5-2). C and the backside tackle keep their under-center jobs. The tackle over ${p.playsideGuard} (${p.playsideDT}) is still the one man deliberately left after the engage — delayed, not ignored.`,
    `DRAFT — BACKSIDE. The backside end (${p.backsideEnd}) is left alone, as under center; the buck fake is what holds him. X is no longer the backside free route — he is the ball carrier — so nobody runs the backside corner off.`,
    'DRAFT — no read key on this play, and nothing in `ignored`.',
  ]
}

const jetFront = (
  front: '44' | '43' | '52',
  side: Side,
  c: JetCast,
  pos: { lead: OffPosId; slot: OffPosId; tackle: OffPosId; psg: OffPosId; bsg: OffPosId },
) => {
  const t = (side === 'left' ? JET_LEFT_TARGETS : JET_RIGHT_TARGETS)[front]
  const lead = side === 'left' ? LEAD_LEFT_CORNER : LEAD_RIGHT_CORNER
  const slot = (side === 'left' ? SLOT_CRACK_LEFT : SLOT_CRACK_RIGHT)[front]
  const psg = side === 'left' ? LG_ENGAGE_PULL_LEFT : RG_ENGAGE_PULL_RIGHT
  const bsg = side === 'left' ? RG_PUSH_PULL_LEFT : LG_PUSH_PULL_RIGHT
  const words = (side === 'left' ? wordsLeft : wordsRight)[front]
  return {
    actions: {
      [pos.lead]: [lead, ...block(t.lead)],
      [pos.slot]: slot,
      [pos.psg]: [...psg, ...block(t.playsideGuard)],
      [pos.bsg]: [...bsg, ...block(t.backsideGuard)],
    },
    assignments: {
      X: JET_CARRIER(side, c),
      Q: Q_JET(side, c),
      [pos.lead]: LEAD_CORNER(side, c),
      [pos.slot]: SLOT_S_WORDS(c)[front],
      [pos.tackle]: CONTAIN(side),
      Y: Y_HELP_END(side),
      [pos.psg]: JET_PSG_WORDS(side)[front],
      [pos.bsg]: words.backsideGuard,
    },
  }
}

// ===========================================================================
// RED GUN — Buck Sweep LEFT (tight-end side). "The opposite is true" of
// Ryan's Black Gun Right: X jets across from wide right and carries left; R
// (beside the QB) fakes the buck right; SUPER leads around LT to the corner; L
// (left slot) blocks the S; LT contains, Y helps him; LG engages then pulls;
// RG pushes once then pulls around LT.
// ===========================================================================

const redLeftPos = { lead: 'S', slot: 'L', tackle: 'LT', psg: 'LG', bsg: 'RG' } as const

const redGunLeft = gunPlay(buckSweepLeftRed, {
  ballCarrier: 'X',
  formationTwinId: 'buck-sweep-left-black-gun',
  audibleFlipId: 'buck-sweep-right-red-gun',
  summary: 'Buck fake one way, then X comes across on a jet, takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the left out of Red Gun — at the tight end. X comes in jet motion from wide right, across the formation behind the quarterback. At HUT the quarterback fakes the buck to the right wing going right at the right guard, then hands to X going by behind him, who sweeps all the way outside to the left. Super runs out around the left tackle ahead of him and blocks the corner. The left wing, in the slot, blocks the S in the alley. The left tackle contains the end with Y helping, the left guard engages then pulls to the nearest backer, and the right guard pushes once, pulls around the left tackle and blocks any jersey upfield.',
  coachNotes: jetCoachNotes('left', RED_LEFT_CAST),
  assignments: {
    X: JET_CARRIER('left', RED_LEFT_CAST),
    R: BUCK('right'),
    Q: Q_JET('left', RED_LEFT_CAST),
    S: LEAD_CORNER('left', RED_LEFT_CAST),
    L: {
      rule: 'Crack down on the S — the alley linebacker.',
      detail: 'From the slot, come inside and block the S, the linebacker in the alley on your side. Get in front of him so he cannot run outside to the sweep. Super is coming around behind you for the corner.',
    },
    LT: CONTAIN('left'),
    Y: Y_HELP_END('left'),
    LG: JET_PLAYSIDE_GUARD('left'),
    RG: BACKSIDE_GUARD('left'),
  },
  actions: {
    X: [JET_FROM_RIGHT, JET_SWEEP_LEFT],
    R: FAKE_RIGHT,
    Q: Q_LEFT,
    LT: CONTAIN_LT,
    Y: block('E-L'),
  },
  vs: {
    '44': jetFront('44', 'left', RED_LEFT_CAST, redLeftPos),
    '43': jetFront('43', 'left', RED_LEFT_CAST, redLeftPos),
    '52': jetFront('52', 'left', RED_LEFT_CAST, redLeftPos),
  },
  reviewNotes: [
    'Ryan (2026-09-23), on Black Gun Right: "The X in this play would go in motion and take the handoff and sweep to the right. The R wing then blocks the S alley linebacker. Then of course the opposite is true." This is the opposite: X jets across from wide right and carries left, R (beside the quarterback) fakes the buck right, SUPER leads out around LT and takes the corner, L (left slot) cracks the S. Replaces the 09-21 draft where L motioned in from the slot and hairpinned back left and Y had the corner. Built from buck-sweep-left-red with gunPlay.',
    ...jetNotes({
      side: 'left',
      set: 'Red',
      faker: 'R',
      lead: 'S',
      slot: 'L',
      playsideTackle: 'LT',
      playsideGuard: 'LG',
      backsideGuard: 'RG',
      playsideDT: 'T-L',
      backsideEnd: 'E-R',
      targets: JET_LEFT_TARGETS,
    }),
  ],
})

// ===========================================================================
// BLACK GUN — Buck Sweep RIGHT (tight-end side). Ryan's jet play (09-23): X
// jets across from wide left and carries right; SUPER fakes the buck left; L
// (beside the QB) leads around RT to the corner; R (right slot) blocks the S;
// RT contains, Y helps him; RG engages then pulls; LG pushes once then pulls
// around RT. Built from the Black base, not mirrored.
// ===========================================================================

const blackRightPos = { lead: 'L', slot: 'R', tackle: 'RT', psg: 'RG', bsg: 'LG' } as const

const blackGunRight = gunPlay(buckSweepRightBlack, {
  ballCarrier: 'X',
  formationTwinId: 'buck-sweep-right-red-gun',
  audibleFlipId: 'buck-sweep-left-black-gun',
  summary: 'Buck fake one way, then X comes across on a jet, takes the handoff and sweeps it all the way outside.',
  description:
    'Buck Sweep to the right out of Black Gun — at the tight end. Fake a run to the left, then run with the motion man to the right. X comes in jet motion from wide left, across the formation behind the quarterback. At HUT the quarterback fakes the buck to Super going left at the left guard, then hands to X going by behind him, who sweeps all the way outside to the right. The left wing, beside the quarterback, runs out around the right tackle ahead of him and blocks the corner. The right wing, in the slot, blocks the S in the alley. The right tackle contains the end with Y helping, the right guard engages then pulls to the nearest backer, and the left guard pushes once, pulls around the right tackle and blocks any jersey upfield.',
  coachNotes: jetCoachNotes('right', BLACK_RIGHT_CAST),
  assignments: {
    X: JET_CARRIER('right', BLACK_RIGHT_CAST),
    S: BUCK('left'),
    Q: Q_JET('right', BLACK_RIGHT_CAST),
    L: LEAD_CORNER('right', BLACK_RIGHT_CAST),
    R: {
      rule: 'Crack down on the S — the alley linebacker.',
      detail: 'From the slot, come inside and block the S, the linebacker in the alley on your side. Get in front of him so he cannot run outside to the sweep. The left wing is coming around behind you for the corner.',
    },
    RT: CONTAIN('right'),
    Y: Y_HELP_END('right'),
    RG: JET_PLAYSIDE_GUARD('right'),
    LG: BACKSIDE_GUARD('right'),
  },
  actions: {
    X: [JET_FROM_LEFT, JET_SWEEP_RIGHT],
    S: FAKE_LEFT_SUPER,
    Q: Q_RIGHT,
    RT: CONTAIN_RT,
    Y: block('E-R'),
  },
  vs: {
    '44': jetFront('44', 'right', BLACK_RIGHT_CAST, blackRightPos),
    '43': jetFront('43', 'right', BLACK_RIGHT_CAST, blackRightPos),
    '52': jetFront('52', 'right', BLACK_RIGHT_CAST, blackRightPos),
  },
  reviewNotes: [
    'Ryan (2026-09-23): "For Black Gun Buck Sweep Right, the spirit of the play is to fake a run to the left and then run with the motion player to the right. The fake handoff goes to the Super like you already have it. That part is good. The X in this play would go in motion and take the handoff and sweep to the right. The R wing then blocks the S alley linebacker." He also confirmed L, beside the quarterback, leads out around RT ahead of X and takes the corner. Replaces the 09-21 draft where R motioned in from the slot and hairpinned back right and Y had the corner. Built from buck-sweep-right-black with gunPlay, not by mirroring Red Gun Left.',
    ...jetNotes({
      side: 'right',
      set: 'Black',
      faker: 'S',
      lead: 'L',
      slot: 'R',
      playsideTackle: 'RT',
      playsideGuard: 'RG',
      backsideGuard: 'LG',
      playsideDT: 'T-R',
      backsideEnd: 'E-L',
      targets: JET_RIGHT_TARGETS,
    }),
  ],
})

export const buckSweepGunPlays: Play[] = [redGunRight, blackGunRight, redGunLeft, blackGunLeft]
