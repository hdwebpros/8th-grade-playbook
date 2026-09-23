/**
 * VEER from the GUN — four plays built from the under-center Veer with
 * `gunPlay` (app/data/plays/gun-shared.ts). Gun alignments per
 * app/data/shotgun.ts: Q (0,−3), Super (−1,−4), the wing beside the
 * quarterback at (1,−4) — R in Red, L in Black — and the other wing out in
 * the open slot: L at (−8.5,−1) in Red, R at (8.5,−1) in Black. The line, X
 * and Y never move, so the linemen, X and Y inherit their base jobs.
 *
 * Coach Ryan's rulings (2026-09-21) baked in here:
 *   - No pre-snap motion.
 *   - Playside back gets the ball: the back on the playside of the
 *     quarterback dives at the crack of the playside guard; the other back
 *     swings BEHIND the quarterback into pitch relationship (about 5 wide by
 *     1 back) — Red Right: R dives, Super pitches. Red Left: Super dives, R
 *     pitches. Black Right: L dives, Super pitches. Black Left: Super dives,
 *     L pitches.
 *
 * DO NOT RUN (Coach Ryan, 2026-09-23): "In the gun formation, the Veer plays
 * won't work as designed because when there's an open defensive end, under
 * shotgun they can just sprint down and get the running back and
 * quarterback." All four plays carry `doNotRun`, and the drawing is changed
 * so the playside end is BLOCKED — by the playside tackle, the man he lines
 * up on (5-technique on the tackle's outside shoulder, every front). The
 * tackle is the only blocker INSIDE the end, so he is the only one who can
 * stop him coming down the line; Y on the tight-end side is outside him and
 * a down block would drive the end into the dive. The quarterback's read
 * moves out to the first playside defender the blocking leaves free (the
 * per-front `readKey`), and whoever the tackle used to climb to is left for
 * that read — the hole that keeps these plays pulled.
 *
 * The gun also takes away the PLAYSIDE WING on the wing-side veer (Red
 * Right, Black Left): under center he squeezed off the read key and pinned
 * the first backer. Now he is the dive back. The answers per front are
 * listed as DRAFT review notes on each play; Ryan said "draw something up, I
 * can always change it."
 *
 * Every path below is ABSOLUTE yards from the GUN starts (the renderer
 * prepends the player's alignment), not an offset of the base strokes.
 * Black Gun is NOT Red Gun mirrored — Super is left of the quarterback in
 * both sets — so each Black play is built from its own Black base.
 */

import type { Action, Assignment, Play } from '../../types/football'
import { gunPlay } from './gun-shared'
import { veerLeftBlack, veerLeftRed, veerRightBlack, veerRightRed } from './veer'

// ---------------------------------------------------------------------------
// Backfield strokes, RIGHT. Shared by Red Right (R dives, S pitches) and
// Black Right (L dives, S pitches) because the wing beside the quarterback
// stands at (1,−4) in both sets.
// ---------------------------------------------------------------------------

/**
 * The dive back beside the quarterback, from (1,−4): the crack of the right
 * guard (his inside leg, x ≈ 0.9) is almost straight ahead of him. He tucks
 * a hair inside to meet the ball in front of the quarterback — the mesh is
 * at about (0.9,−2.7) — then the same downhill bend as the base's dive,
 * carried to 4½ yards because he is the ball carrier.
 */
const DIVE_RIGHT: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: 0.9, y: -2.7 },
      { x: 1, y: -1.5 },
      { x: 1.3, y: -0.3 },
      { x: 2, y: 2 },
      { x: 2.6, y: 4.5 },
    ],
  },
]

/**
 * Q from (0,−3): one step playside to the mesh at (0.9,−2.7), ride it flat at
 * his own depth to about x 4, then break upfield at ~45° at the read key's
 * OUTSIDE hip (E-R at 3.55). Ends wide and barely past the line — pressing
 * the pitch, same landmark as the base's keep.
 */
const Q_READ_RIGHT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.9, y: -2.7 },
      { x: 2.6, y: -2.5 },
      { x: 4, y: -2 },
      { x: 5.4, y: -0.6 },
      { x: 6.4, y: 1.2 },
    ],
  },
]

/**
 * The pitch man, Super, from (−1,−4): no motion — on the snap he crosses
 * BEHIND the quarterback (deeper than −3 the whole way past him) and settles
 * into the 5-by-1 off the quarterback's break: ends at (11.4, 0.2), five
 * wide and a yard back of Q's (6.4, 1.2).
 */
const PITCH_RIGHT: Action[] = [
  {
    kind: 'pitch',
    path: [
      { x: 0.6, y: -4.7 },
      { x: 2.8, y: -4.5 },
      { x: 5.2, y: -3.5 },
      { x: 8.2, y: -2 },
      { x: 11.4, y: 0.2 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Backfield strokes, LEFT. Shared by Red Left (S dives, R pitches) and Black
// Left (S dives, L pitches). Super at (−1,−4) is straight behind the crack of
// the left guard; the wing at (1,−4) crosses behind the quarterback.
// ---------------------------------------------------------------------------

/** Super from (−1,−4): dive at the crack of LG — the left-hand geometry. */
const DIVE_LEFT: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -0.9, y: -2.7 },
      { x: -1, y: -1.5 },
      { x: -1.3, y: -0.3 },
      { x: -2, y: 2 },
      { x: -2.6, y: 4.5 },
    ],
  },
]

/** Q from (0,−3): step LEFT to the mesh, ride flat, break at E-L's outside hip. */
const Q_READ_LEFT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.9, y: -2.7 },
      { x: -2.6, y: -2.5 },
      { x: -4, y: -2 },
      { x: -5.4, y: -0.6 },
      { x: -6.4, y: 1.2 },
    ],
  },
]

/** The wing beside the quarterback, from (1,−4): behind Q, out to 5-by-1 left. */
const PITCH_LEFT: Action[] = [
  {
    kind: 'pitch',
    path: [
      { x: -0.6, y: -4.7 },
      { x: -2.8, y: -4.5 },
      { x: -5.2, y: -3.5 },
      { x: -8.2, y: -2 },
      { x: -11.4, y: 0.2 },
    ],
  },
]

// ---------------------------------------------------------------------------
// The slot wing's jobs. In the gun one wing stands in the open slot, 8½ wide
// and a yard off the ball — on the BACKSIDE of the wing-side veer (Red Right:
// L; Black Left: R) and on the PLAYSIDE of the tight-end veer (Red Left: L;
// Black Right: R).
// ---------------------------------------------------------------------------

/**
 * Backside slot vs the 4-4's single free safety in the middle (F at 0,10):
 * release inside and work to him — a work-to path, no bar, like the base's
 * backside X. Drawn from the LEFT slot (−8.5,−1); negate for the right.
 */
const SLOT_BACKSIDE_TO_F_44: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -8, y: 0.6 },
      { x: -6.6, y: 2.8 },
      { x: -5, y: 5 },
      { x: -3.2, y: 7.2 },
    ],
  },
]

/** Backside slot vs the two-high fronts: work to the near safety (F-L at −6,11). */
const SLOT_BACKSIDE_TO_F_TWO_HIGH: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -8.1, y: 0.6 },
      { x: -7.6, y: 2.8 },
      { x: -7.1, y: 5 },
      { x: -6.6, y: 7.4 },
    ],
  },
]

/**
 * Playside slot vs the 4-4: Y bases the walked-up backer, so the next man to
 * the alley is the CORNER — stalk him. Block-by-target so the stroke follows
 * the front if the corner is ever tuned.
 */
const SLOT_STALK_CORNER_LEFT: Action[] = [{ kind: 'block', targetId: 'C-L' }]

/**
 * Playside slot vs the two-high fronts: the near safety is the alley filler,
 * so crack down on him as he comes — climb inside the corner and set the bar
 * around 5 yards, cutting back inside. Same landmark the base's wing pinned
 * from the line, now reached from the slot at (−8.5,−1).
 */
const SLOT_CRACK_SAFETY_LEFT: Action[] = [
  {
    kind: 'block',
    targetId: 'F-L',
    path: [
      { x: -8.3, y: 0.6 },
      { x: -7.9, y: 2.4 },
      { x: -7.4, y: 4.2 },
      { x: -6.7, y: 5.4 },
    ],
  },
]

/**
 * Negate every x of a stroke and swap a side-suffixed target (-L ⇄ -R) —
 * turns a left-hand slot or tackle stroke into its right-hand twin.
 */
const flipX = (actions: Action[]): Action[] =>
  actions.map((a) => ({
    ...a,
    ...(a.targetId ? { targetId: a.targetId.replace(/-(L|R)$/, (_, s) => (s === 'L' ? '-R' : '-L')) } : {}),
    ...(a.path ? { path: a.path.map((p) => ({ x: -p.x, y: p.y })) } : {}),
  }))

/**
 * Playside tackle BASES the end (Do Not Run change, 2026-09-23). The end is a
 * 5-technique on his outside shoulder at (3.55,1) on every front: up around
 * the end's inside number and drive him back off the line, bar a yard past
 * the LOS cutting back inside — the same base shape RG draws on the
 * 3-technique. Right-hand stroke from RT (3,0); flipX for LT.
 */
const PST_BASE_DE_RIGHT: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 3.95, y: 0.45 },
      { x: 4.2, y: 1.15 },
      { x: 3.75, y: 1.75 },
    ],
  },
]
const PST_BASE_DE_LEFT: Action[] = flipX(PST_BASE_DE_RIGHT)

// ---------------------------------------------------------------------------
// Assignment text. Kid voice; the varsity words stay.
// ---------------------------------------------------------------------------

const Q_GUN: Assignment = {
  rule: 'Catch it, step playside, mesh. The end is blocked — read the first man left free.',
  detail:
    'Catch the snap clean and step toward the dive back — he is right beside you, so the mesh is quick. From the gun we BLOCK the end, so he is not your read any more: your eyes go to the first playside defender our blocking leaves free (the Read chip on the diagram). He comes down for the dive: pull it and attack his outside hip at about 45 degrees. He stays wide: give it. He takes you: press the pitch.',
}

const dive = (guard: string): Assignment => ({
  rule: `Dive — aim at the crack of the ${guard} guard.`,
  detail: `No motion — you are the dive back. On the snap, go: aim at the crack of the ${guard} guard, soft fold on the mesh, wave read on the ball. If it stays, it is yours — run downhill. If he pulls it, keep sprinting and take a tackler with you.`,
})

const pitchMan = (who: string): Assignment => ({
  rule: 'Pitch man — swing behind the quarterback, five wide by one back.',
  detail: `No motion. On the snap, cross BEHIND ${who} — never in front of him — and get to pitch relationship: about five yards outside him and a yard behind. Hold it as he attacks the end. Eyes on the ball the whole way, hands up and soft.`,
})

const slotBackside = (side: string): Assignment => ({
  rule: 'Backside slot — work to the safety.',
  detail: `You are out in the ${side} slot, away from the play. Release inside and work to the safety — cut off the last man between the pitch and the end zone. Nobody loafs on the back side.`,
})

const SLOT_BACKSIDE_44: Assignment = {
  rule: 'Backside slot — work to the free safety.',
  detail:
    'One safety in the middle in this front. Release inside and go get him — cut off the last man between the pitch and the end zone.',
}

const SLOT_BACKSIDE_TWO_HIGH: Assignment = {
  rule: 'Backside slot — work to the near safety.',
  detail:
    'Two safeties in this front. Release inside and work to the one on your side — cut off the deep pursuit.',
}

const SLOT_PLAYSIDE: Assignment = {
  rule: 'Playside slot — block the alley: corner in a 4-4, near safety in a 4-3 or 5-2.',
  detail:
    'The tight end takes the first man outside the read key, so you take the next man to the alley. One safety in the middle (4-4): stalk the corner. Two safeties (4-3, 5-2): crack down on the near safety as he fills. Rule two: hit the near color — find an opponent and block.',
}

const SLOT_STALK_CORNER: Assignment = {
  rule: 'Playside slot — stalk the corner.',
  detail:
    'Y bases the walked-up backer, so the corner is the next man to the alley. Release straight at him, break down under control, and stay on his outside number — the pitch runs off your block.',
}

const SLOT_CRACK_SAFETY: Assignment = {
  rule: 'Playside slot — crack down on the near safety.',
  detail:
    'The backers inside are covered. The near safety is the alley filler in this front — climb inside the corner, get your helmet across him as he comes down, and pin him back inside. Rule two: hit the near color — find an opponent and block.',
}

/** Playside tackle from the gun — every front, both sides. */
const PST_BLOCK_DE: Assignment = {
  rule: 'Gun change: BLOCK the end. Base him — do not let him come down.',
  detail:
    'Under center you leave the end alone. From the gun you do NOT: he is the man on your outside shoulder, and if nobody touches him he sprints down the line and takes the dive back and the quarterback both. Step at him, get your helmet on his inside number, and keep him from coming down. Drive him back off the line.',
}

/** Y on the tight-end-side gun veer: the end is the tackle's now. */
const Y_GUN_44: Assignment = {
  rule: 'Playside — base the walked-up backer.',
  detail:
    'Our tackle blocks the end from the gun, so release outside the end and BASE the walked-up backer — drive him out of the alley.',
}
const Y_GUN_43: Assignment = {
  rule: 'Playside — base the backer over you.',
  detail:
    'Our tackle blocks the end from the gun. Release outside the end, climb, and base the playside backer sitting over your head — turn him out of the lane.',
}
const Y_GUN_52: Assignment = {
  rule: 'Playside — pin the first filler.',
  detail:
    'Our tackle blocks the end from the gun. Release tight off the end\'s outside hip and pin the first jersey that fills — the playside backer — pushing him back inside.',
}

const SUMMARY = 'Triple option from the gun. DO NOT RUN — the playside tackle blocks the DE.'

/** Coach Ryan's reason, shown with the red Do Not Run badge. */
const DO_NOT_RUN =
  'In the gun an open defensive end can sprint down and take the running back and the quarterback both. Drawn here with the end blocked, but this play stays out of the game plan.'

const GUN_CHANGE_NOTE =
  'Gun change: we BLOCK the end. Left alone, he sprints down and takes the back AND the quarterback.'

const coachNotesRight = [
  GUN_CHANGE_NOTE,
  "Dive back: no motion, no waiting. Straight at the guard's crack, full speed.",
  'Super: behind the quarterback, five wide, one back. Be there every time.',
]

const coachNotesLeft = [
  GUN_CHANGE_NOTE,
  "Super: no motion, no waiting. Straight at the guard's crack, full speed.",
  'Pitch man: behind the quarterback, five wide, one back. Be there every time.',
]

const DE_BLOCK_REVIEW_NOTE = (pst: string, readKeys: string) =>
  `DO NOT RUN + DE BLOCKED (Coach Ryan, 2026-09-23): an open end sprints down from the gun and takes the dive back and the quarterback. ${pst} now BASES the playside end on every front instead of veering inside him — he is the only blocker inside the end, so the only one who can stop him coming down. The quarterback reads the first playside defender left free instead (${readKeys}). The man ${pst} used to climb to is that read or is simply unblocked — that is why the play stays flagged Do Not Run.`

// ---------------------------------------------------------------------------
// RED GUN VEER RIGHT — wing side. R dives, Super pitches, L is the backside
// slot. RT bases the end; the wing's old pin and RT's old climb are both
// gone, so the playside backers are the quarterback's read or unblocked.
// ---------------------------------------------------------------------------

const draftWingSide = (pst: string, slot: string, side: string) => [
  `DRAFT — Wing side with ${pst} on the end: vs the 4-4 the read moves to the walked-up outside backer and the backer over the guard is unblocked (he used to be ${pst}'s climb). Vs the 4-3 and 5-2 the read is the playside backer ${pst} used to climb to. X still blocks the corner.`,
  `DRAFT — Backside slot (${slot} at ${side}): given the base's backside-split-end job, 'work to the safety' — the free safety in the 4-4, the near safety in the two-high fronts. Drawn as a work-to run path, no bar. Alternative: block the backside corner.`,
  'DRAFT — Dive back beside the quarterback: drawn tucking a hair inside to mesh in FRONT of the quarterback at about (±0.9,−2.7), then the base dive bend at the guard\'s crack, carried to 4½ yards. Quarterback rides the mesh flat to about four line-splits outside the ball and breaks at ~45°, same endpoint as the base keep.',
  'DRAFT — Pitch man: single `pitch` stroke from his gun spot, crossing behind the quarterback (deeper than −3 until he is past him) and settling 5 wide by 1 back off the quarterback\'s break at (±11.4, 0.2). No motion, per Ryan.',
]

export const veerRightRedGun: Play = {
  ...gunPlay(veerRightRed, {
    ballCarrier: 'R',
    formationTwinId: 'veer-right-black-gun',
    audibleFlipId: 'veer-left-red-gun',
    summary: SUMMARY,
    description:
      'Veer Right from the gun. No motion: R is already beside the quarterback, so he takes the dive at the crack of the right guard, the quarterback meshes with him, and Super swings behind the quarterback as the pitch man. The gun change: RT BLOCKS the end instead of leaving him to the read — from the gun an unblocked end sprints down and takes the back and the quarterback both — so the quarterback reads the first playside defender left free. L, out in the left slot, works to the safety on the back side.',
    coachNotes: coachNotesRight,
    assignments: {
      Q: Q_GUN,
      R: dive('right'),
      S: pitchMan('the quarterback'),
      L: slotBackside('left'),
      RT: PST_BLOCK_DE,
    },
    actions: {
      Q: Q_READ_RIGHT,
      R: DIVE_RIGHT,
      S: PITCH_RIGHT,
      RT: PST_BASE_DE_RIGHT,
    },
    vs: {
      '44': {
        readKey: 'O-R',
        ignored: [],
        actions: { L: SLOT_BACKSIDE_TO_F_44 },
        // The base's per-front R text is the wing's pin — replace it on every front.
        assignments: { R: dive('right'), L: SLOT_BACKSIDE_44, RT: PST_BLOCK_DE },
      },
      '43': {
        readKey: 'B-R',
        actions: { L: SLOT_BACKSIDE_TO_F_TWO_HIGH },
        assignments: { R: dive('right'), L: SLOT_BACKSIDE_TWO_HIGH, RT: PST_BLOCK_DE },
      },
      '52': {
        readKey: 'B-R',
        actions: { L: SLOT_BACKSIDE_TO_F_TWO_HIGH },
        assignments: { R: dive('right'), L: SLOT_BACKSIDE_TWO_HIGH, RT: PST_BLOCK_DE },
      },
    },
    reviewNotes: [
      DE_BLOCK_REVIEW_NOTE('RT', '4-4: the walked-up outside backer; 4-3 and 5-2: the playside backer'),
      ...draftWingSide('RT', 'L', '(−8.5,−1)'),
    ],
  }),
  doNotRun: DO_NOT_RUN,
}

// ---------------------------------------------------------------------------
// RED GUN VEER LEFT — tight-end side. Super dives, R pitches, L is the
// PLAYSIDE slot. LT bases the end; Y keeps his base man outside the end;
// L's job moves from the wing spot to the slot.
// ---------------------------------------------------------------------------

const draftTeSide = (slot: string, side: string, pst: string) => [
  `DRAFT — Tight-end side with ${pst} on the end: Y keeps his base man (walked-up backer in the 4-4, playside backer in the 4-3, first filler in the 5-2). Vs the 4-4 the backer over the guard — ${pst}'s old climb — is left free and becomes the read. Vs the 4-3 and 5-2 every backer is covered and the slot has the near safety, so the only man left free is the CORNER: he is the read. Y is not the one on the end because he lines up OUTSIDE him — a down block drives the end into the dive.`,
  `DRAFT — Playside slot (${slot} at ${side}): Y bases his base man, so the slot takes the NEXT man to the alley. Vs the 4-4 that is the corner — stalk block, aimed by target id. Vs the 4-3 and 5-2 it is the near safety filling — a crack from the slot, bar around 5 yards cutting back inside. Alternative: stalk the corner on every front and read the safety instead.`,
  'DRAFT — Dive back (Super at (−1,−4) on the left, straight behind the crack of the guard): drawn tucking a hair inside to mesh in FRONT of the quarterback at about (∓0.9,−2.7), then the base dive bend, carried to 4½ yards. Quarterback rides the mesh flat and breaks at ~45°, same endpoint as the base keep.',
  'DRAFT — Pitch man (the wing beside the quarterback): single `pitch` stroke from (1,−4), crossing behind the quarterback and settling 5 wide by 1 back off his break at (∓11.4, 0.2). No motion, per Ryan.',
]

export const veerLeftRedGun: Play = {
  ...gunPlay(veerLeftRed, {
    ballCarrier: 'S',
    formationTwinId: 'veer-left-black-gun',
    audibleFlipId: 'veer-right-red-gun',
    summary: SUMMARY,
    description:
      'Veer Left from the gun, at the tight end. No motion: Super is the playside back, so he takes the dive at the crack of the left guard, the quarterback meshes with him, and R swings behind the quarterback as the pitch man. The gun change: LT BLOCKS the end instead of leaving him to the read — from the gun an unblocked end sprints down and takes the back and the quarterback both — so the quarterback reads the first playside defender left free. Y still bases his man outside the end, and L — out in the left slot instead of on the wing — blocks the alley from there.',
    coachNotes: coachNotesLeft,
    assignments: {
      Q: Q_GUN,
      S: dive('left'),
      R: pitchMan('the quarterback'),
      L: SLOT_PLAYSIDE,
      LT: PST_BLOCK_DE,
    },
    actions: {
      Q: Q_READ_LEFT,
      S: DIVE_LEFT,
      R: PITCH_LEFT,
      LT: PST_BASE_DE_LEFT,
    },
    vs: {
      '44': {
        readKey: 'B-L',
        actions: { L: SLOT_STALK_CORNER_LEFT },
        assignments: { L: SLOT_STALK_CORNER, LT: PST_BLOCK_DE, Y: Y_GUN_44 },
      },
      '43': {
        readKey: 'C-L',
        actions: { L: SLOT_CRACK_SAFETY_LEFT },
        assignments: { L: SLOT_CRACK_SAFETY, LT: PST_BLOCK_DE, Y: Y_GUN_43 },
      },
      '52': {
        readKey: 'C-L',
        actions: { L: SLOT_CRACK_SAFETY_LEFT },
        assignments: { L: SLOT_CRACK_SAFETY, LT: PST_BLOCK_DE, Y: Y_GUN_52 },
      },
    },
    reviewNotes: [
      DE_BLOCK_REVIEW_NOTE('LT', '4-4: the backer over the guard; 4-3 and 5-2: the corner'),
      ...draftTeSide('L', '(−8.5,−1)', 'LT'),
    ],
  }),
  doNotRun: DO_NOT_RUN,
}

// ---------------------------------------------------------------------------
// BLACK GUN VEER RIGHT — tight-end side (Black puts Y right). L is beside the
// quarterback and dives; Super pitches; R is the PLAYSIDE slot at (8.5,−1).
// Built from its own Black base — the backfield is Red Right's, not a mirror.
// ---------------------------------------------------------------------------

export const veerRightBlackGun: Play = {
  ...gunPlay(veerRightBlack, {
    ballCarrier: 'L',
    formationTwinId: 'veer-right-red-gun',
    audibleFlipId: 'veer-left-black-gun',
    summary: SUMMARY,
    description:
      'Veer Right from the gun out of Black — the tight end side. No motion: L is beside the quarterback in Black, so he takes the dive at the crack of the right guard, the quarterback meshes with him, and Super swings behind the quarterback as the pitch man. The gun change: RT BLOCKS the end instead of leaving him to the read — from the gun an unblocked end sprints down and takes the back and the quarterback both — so the quarterback reads the first playside defender left free. Y still bases his man outside the end, and R — out in the right slot instead of on the wing — blocks the alley from there.',
    coachNotes: coachNotesRight,
    assignments: {
      Q: Q_GUN,
      L: dive('right'),
      S: pitchMan('the quarterback'),
      R: SLOT_PLAYSIDE,
      RT: PST_BLOCK_DE,
    },
    actions: {
      Q: Q_READ_RIGHT,
      L: DIVE_RIGHT,
      S: PITCH_RIGHT,
      RT: PST_BASE_DE_RIGHT,
    },
    vs: {
      '44': {
        readKey: 'B-R',
        actions: { R: flipX(SLOT_STALK_CORNER_LEFT) },
        assignments: { R: SLOT_STALK_CORNER, RT: PST_BLOCK_DE, Y: Y_GUN_44 },
      },
      '43': {
        readKey: 'C-R',
        actions: { R: flipX(SLOT_CRACK_SAFETY_LEFT) },
        assignments: { R: SLOT_CRACK_SAFETY, RT: PST_BLOCK_DE, Y: Y_GUN_43 },
      },
      '52': {
        readKey: 'C-R',
        actions: { R: flipX(SLOT_CRACK_SAFETY_LEFT) },
        assignments: { R: SLOT_CRACK_SAFETY, RT: PST_BLOCK_DE, Y: Y_GUN_52 },
      },
    },
    reviewNotes: [
      DE_BLOCK_REVIEW_NOTE('RT', '4-4: the backer over the guard; 4-3 and 5-2: the corner'),
      ...draftTeSide('R', '(8.5,−1)', 'RT'),
      'DRAFT — Black Gun is not Red Gun mirrored: the backfield strokes here are Red Gun Veer Right\'s verbatim (the wing beside the quarterback is L instead of R, same spot); only the slot strokes are the Red-left ones negated in x.',
    ],
  }),
  doNotRun: DO_NOT_RUN,
}

// ---------------------------------------------------------------------------
// BLACK GUN VEER LEFT — wing side (Y is right, X split left). Super dives at
// the crack of LG; L, beside the quarterback, is the pitch man; R is the
// BACKSIDE slot at (8.5,−1). LT bases the end.
// ---------------------------------------------------------------------------

export const veerLeftBlackGun: Play = {
  ...gunPlay(veerLeftBlack, {
    ballCarrier: 'S',
    formationTwinId: 'veer-left-red-gun',
    audibleFlipId: 'veer-right-black-gun',
    summary: SUMMARY,
    description:
      'Veer Left from the gun out of Black — the wing side. No motion: Super is the playside back, so he takes the dive at the crack of the left guard, the quarterback meshes with him, and L swings behind the quarterback as the pitch man. The gun change: LT BLOCKS the end instead of leaving him to the read — from the gun an unblocked end sprints down and takes the back and the quarterback both — so the quarterback reads the first playside defender left free. R, out in the right slot, works to the safety on the back side.',
    coachNotes: coachNotesLeft,
    assignments: {
      Q: Q_GUN,
      S: dive('left'),
      L: pitchMan('the quarterback'),
      R: slotBackside('right'),
      LT: PST_BLOCK_DE,
    },
    actions: {
      Q: Q_READ_LEFT,
      S: DIVE_LEFT,
      L: PITCH_LEFT,
      LT: PST_BASE_DE_LEFT,
    },
    vs: {
      '44': {
        readKey: 'O-L',
        ignored: [],
        actions: { R: flipX(SLOT_BACKSIDE_TO_F_44) },
        // The base's per-front L text is the wing's pin — replace it on every front.
        assignments: { L: pitchMan('the quarterback'), R: SLOT_BACKSIDE_44, LT: PST_BLOCK_DE },
      },
      '43': {
        readKey: 'B-L',
        actions: { R: flipX(SLOT_BACKSIDE_TO_F_TWO_HIGH) },
        assignments: { L: pitchMan('the quarterback'), R: SLOT_BACKSIDE_TWO_HIGH, LT: PST_BLOCK_DE },
      },
      '52': {
        readKey: 'B-L',
        actions: { R: flipX(SLOT_BACKSIDE_TO_F_TWO_HIGH) },
        assignments: { L: pitchMan('the quarterback'), R: SLOT_BACKSIDE_TWO_HIGH, LT: PST_BLOCK_DE },
      },
    },
    reviewNotes: [
      DE_BLOCK_REVIEW_NOTE('LT', '4-4: the walked-up outside backer; 4-3 and 5-2: the playside backer'),
      ...draftWingSide('LT', 'R', '(8.5,−1)'),
      'DRAFT — Black Gun is not Red Gun mirrored: the backfield strokes here are Red Gun Veer Left\'s verbatim (the pitch man is L instead of R, same spot beside the quarterback); only the slot and tackle strokes are the Red-right ones negated in x.',
    ],
  }),
  doNotRun: DO_NOT_RUN,
}

export const veerGunPlays: Play[] = [
  veerRightRedGun,
  veerRightBlackGun,
  veerLeftRedGun,
  veerLeftBlackGun,
]
