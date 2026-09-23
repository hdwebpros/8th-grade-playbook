/**
 * VEER from the GUN — four plays built from the under-center Veer with
 * `gunPlay` (app/data/plays/gun-shared.ts). Gun alignments per
 * app/data/shotgun.ts: Q (0,−3), Super (−1,−4), the wing beside the
 * quarterback at (1,−4) — R in Red, L in Black — and the other wing out in
 * the open slot: L at (−8.5,−1) in Red, R at (8.5,−1) in Black. The line, X
 * and Y never move.
 *
 * Coach Ryan's rulings (2026-09-21):
 *   - No pre-snap motion.
 *   - Playside back gets the ball: the back on the playside of the
 *     quarterback dives at the B gap, right off the playside guard's hip; the
 *     other back swings BEHIND the quarterback into pitch relationship (about
 *     5 wide by 1 back) — Red Right: R dives, Super pitches. Red Left: Super
 *     dives, R pitches. Black Right: L dives, Super pitches. Black Left: Super
 *     dives, L pitches.
 *
 * UNCOMMON PLAY (Coach Ryan, 2026-09-23). An open end in the gun can sprint
 * down and take the back and the quarterback, so from the gun BOTH TACKLES
 * BLOCK THE ENDS: "The goal of the play is to keep the defensive ends away
 * from the center. The right tackle and the left tackle, that should be
 * their main focus. The opposite side should block the D-end for 1-2 seconds
 * and try to let them in the backfield because by then the running back
 * should be up through the line. We are not as concerned with linemen
 * climbing on this one."
 *   - Playside tackle: blocks the playside end and keeps him OUTSIDE.
 *   - Backside tackle: blocks the backside end for 1–2 seconds, sliding
 *     INSIDE toward the center so the end has to go outside and around him.
 *   - Guards base the tackle on their outside shoulder; the center fills the
 *     playside A gap (even fronts) or bases the nose (5-2). Nobody climbs.
 *   - Quarterback: "still reads the defensive end because if he beats his
 *     man inside he should keep. Generally this is a handoff, but the
 *     quarterback must still read." Read key = the playside end.
 *   - Wing side (Red Right / Black Left): the slot on the back side blocks
 *     the "S" in the alley and Y climbs to the inside backer on his side.
 * All four plays carry `uncommon`: call it only when the B gap is open.
 *
 * Every path below is ABSOLUTE yards from the GUN starts (the renderer
 * prepends the player's alignment), not an offset of the base strokes.
 * Black Gun is NOT Red Gun mirrored in the backfield — Super is left of the
 * quarterback in both sets — so only the line, Y and slot strokes are
 * mirrored; the backfield strokes are shared by direction.
 */

import type { Action, Assignment, FrontId, OffPosId, Play } from '../../types/football'
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
// Mirroring helpers for the line, Y and slot (never the backfield).
// ---------------------------------------------------------------------------

type ActionMap = Partial<Record<OffPosId, Action[]>>
type AssignmentMap = Partial<Record<OffPosId, Assignment>>

/**
 * Negate every x of a stroke and swap a side-suffixed target (-L ⇄ -R) —
 * turns a left-hand stroke into its right-hand twin.
 */
const flipX = (actions: Action[]): Action[] =>
  actions.map((a) => ({
    ...a,
    ...(a.targetId ? { targetId: a.targetId.replace(/-(L|R)$/, (_, s) => (s === 'L' ? '-R' : '-L')) } : {}),
    ...(a.path ? { path: a.path.map((p) => ({ x: -p.x, y: p.y })) } : {}),
  }))

const SIDE_SWAP: Partial<Record<OffPosId, OffPosId>> = { LT: 'RT', RT: 'LT', LG: 'RG', RG: 'LG', L: 'R', R: 'L' }
const swapPos = (pos: OffPosId): OffPosId => SIDE_SWAP[pos] ?? pos

/** Flip every stroke and move it to the mirror-image player (LT ⇄ RT, L ⇄ R…). */
const mirrorActions = (m: ActionMap): ActionMap =>
  Object.fromEntries(Object.entries(m).map(([pos, a]) => [swapPos(pos as OffPosId), flipX(a!)]))

/** Same text, mirror-image player. The words are written side-neutral. */
const mirrorJobs = (m: AssignmentMap): AssignmentMap =>
  Object.fromEntries(Object.entries(m).map(([pos, a]) => [swapPos(pos as OffPosId), a]))

const FRONTS: FrontId[] = ['44', '43', '52']

// ---------------------------------------------------------------------------
// The line, drawn for a play going RIGHT (RT playside, LT backside). The
// left-hand line is `mirrorActions` of this.
// ---------------------------------------------------------------------------

/**
 * Playside tackle keeps the end OUTSIDE. The end is a 5-technique on his
 * outside shoulder at (3.55,1) on every front: step up the end's INSIDE
 * number and drive him back and out — the bar lands a yard past the LOS,
 * pushing away from the center. From RT (3,0).
 */
const PST_KEEP_DE_OUT: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 2.85, y: 0.45 },
      { x: 2.9, y: 1.2 },
      { x: 3.35, y: 1.85 },
    ],
  },
]

/**
 * Backside tackle: one to two seconds on the end, sliding INSIDE toward the
 * center so the end has to go outside and around him. A short stroke — step
 * inside, hands on the end's inside shoulder, bar facing him. From LT (−3,0).
 */
const BST_SLIDE_DE: Action[] = [
  {
    kind: 'block',
    path: [
      { x: -2.7, y: 0.3 },
      { x: -2.95, y: 0.6 },
    ],
  },
]

/** Playside guard bases the 3-technique on his outside shoulder (T-R at 1.8). */
const PSG_BASE: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 2.25, y: 0.45 },
      { x: 2.5, y: 1.15 },
      { x: 2.05, y: 1.75 },
    ],
  },
]

/**
 * Backside guard bases the 3-technique on his outside shoulder (T-L at
 * −1.8): up his inside number, drive him back and away from the play. No
 * climb. From LG (−1.5,0).
 */
const BSG_BASE: Action[] = [
  {
    kind: 'block',
    path: [
      { x: -1.35, y: 0.45 },
      { x: -1.15, y: 1.2 },
      { x: -1.55, y: 1.85 },
    ],
  },
]

/** Center vs an even front: nobody on him — step playside and fill the A gap. */
const C_FILL_A_GAP: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 0.3, y: 0.6 },
      { x: 0.55, y: 1.5 },
    ],
  },
]

/** Center vs the 5-2: base the nose (N at 0,1) on his playside number. No scoop. */
const C_BASE_NOSE: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 0.55, y: 0.4 },
      { x: 0.65, y: 1.15 },
      { x: 0.25, y: 1.8 },
    ],
  },
]

const lineRight = (front: FrontId): ActionMap => ({
  RT: PST_KEEP_DE_OUT,
  RG: PSG_BASE,
  C: front === '52' ? C_BASE_NOSE : C_FILL_A_GAP,
  LG: BSG_BASE,
  LT: BST_SLIDE_DE,
})
const lineLeft = (front: FrontId): ActionMap => mirrorActions(lineRight(front))

// ---------------------------------------------------------------------------
// Wing-side backside (Red Right, drawn on the LEFT; Black Left mirrors it).
// Coach Ryan, 2026-09-23: "L blocks the S alley", Y climbs to the
// left-middle linebacker.
// ---------------------------------------------------------------------------

/**
 * Backside slot to the "S" in the alley. Vs the 4-4 there is no strong
 * safety — the S is the walked-up Sam (O-L, lettered S against Red) standing
 * in the alley. Vs the 4-3 and 5-2 it is the strong safety ($, F-L against
 * Red) coming down into the alley: climb inside the corner and meet him, bar
 * around 5 yards. From the left slot (−8.5,−1).
 */
const SLOT_ALLEY: Record<FrontId, Action[]> = {
  '44': [
    {
      kind: 'block',
      targetId: 'O-L',
      path: [
        { x: -8.2, y: 0.6 },
        { x: -7.5, y: 2.1 },
        { x: -6.95, y: 2.95 },
      ],
    },
  ],
  '43': [
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
  ],
  '52': [
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
  ],
}

/**
 * Backside Y climbs to the inside backer on his side: release outside the
 * end (the tackle has him and is forcing him wide), climb, and cut back
 * inside to the backer. 4-4: B-L over the guard. 4-3: the backer on his side
 * (B-L, lettered S against Red) — the Mike is left alone. 5-2: B-L. From Y
 * (−4.5,0).
 */
const Y_CLIMB: Record<FrontId, Action[]> = {
  '44': [
    {
      kind: 'block',
      targetId: 'B-L',
      path: [
        { x: -4.6, y: 1.1 },
        { x: -4.2, y: 2.6 },
        { x: -3.1, y: 3.5 },
        { x: -2.2, y: 3.75 },
      ],
    },
  ],
  '43': [
    {
      kind: 'block',
      targetId: 'B-L',
      path: [
        { x: -4.65, y: 1.2 },
        { x: -4.55, y: 2.6 },
        { x: -4.2, y: 3.85 },
      ],
    },
  ],
  '52': [
    {
      kind: 'block',
      targetId: 'B-L',
      path: [
        { x: -4.6, y: 1.1 },
        { x: -4.25, y: 2.6 },
        { x: -3.3, y: 3.4 },
        { x: -2.55, y: 3.65 },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Tight-end-side playside slot (Red Left, drawn on the LEFT; Black Right
// mirrors it). Not re-ruled on 2026-09-23 — same jobs as the first gun pass.
// ---------------------------------------------------------------------------

/** Vs the 4-4: Y bases the walked-up backer, so the slot stalks the corner. */
const SLOT_STALK_CORNER: Action[] = [{ kind: 'block', targetId: 'C-L' }]

/** Vs the 4-3 and 5-2: crack down on the near safety as he fills the alley. */
const SLOT_CRACK_SAFETY: Action[] = [
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

const SLOT_PLAYSIDE: Record<FrontId, Action[]> = {
  '44': SLOT_STALK_CORNER,
  '43': SLOT_CRACK_SAFETY,
  '52': SLOT_CRACK_SAFETY,
}

// ---------------------------------------------------------------------------
// Assignment text. Kid voice; the varsity words stay. Written side-neutral so
// the same words serve both directions.
// ---------------------------------------------------------------------------

const Q_GUN: Assignment = {
  rule: 'Mesh and read the playside end. Give it unless he beats our tackle inside.',
  detail:
    'Catch the snap clean and step toward the dive back. He is right beside you, so the mesh is quick. Our tackle is blocking the playside end, but you still read him. Most of the time this is a handoff. If the end beats our tackle to the inside, pull it and get outside him. If you keep it and somebody takes you, press the pitch.',
}

const dive = (guard: string): Assignment => ({
  rule: `Dive — the B gap, right off the ${guard} guard's hip.`,
  detail: `No motion. You are the dive back. On the snap, go: aim at the B gap, right off the ${guard} guard's outside hip. Soft fold on the mesh, wave read on the ball. If it stays, it is yours: sprint straight up through the hole. If he pulls it, keep sprinting and take a tackler with you.`,
})

const pitchMan = (who: string): Assignment => ({
  rule: 'Pitch man — swing behind the quarterback, five wide by one back.',
  detail: `No motion. On the snap, cross BEHIND ${who}, never in front of him, and get to pitch relationship: about five yards outside him and a yard behind. Hold it. Eyes on the ball the whole way, hands up and soft.`,
})

const PST_JOB: Assignment = {
  rule: 'Block the end. Keep him OUTSIDE.',
  detail:
    'From the gun both tackles block the ends. The end on your outside shoulder is yours: step at him, get your helmet on his inside number, and keep him outside. Never let him come down the line toward the center. The quarterback is watching him: if he beats you inside, the quarterback keeps it.',
}

const BST_JOB: Assignment = {
  rule: 'Block the end for 1-2 seconds. Slide inside, make him go around.',
  detail:
    'You are away from the play, but the end on your outside shoulder is still yours. Step inside toward the center and get your hands on him. Keep him away from the center for one or two seconds, sliding inside with him so he has to go outside and around you. If he gets into the backfield late and wide, that is fine. The back is already through the line.',
}

const PSG_JOB: Assignment = {
  rule: 'Base the tackle on your outside shoulder.',
  detail:
    'Their tackle is on your outside shoulder in every front. Take him and drive him back. The dive comes right off your outside hip, so do not let him slide into that hole. No climbing on this play.',
}

const BSG_JOB: Assignment = {
  rule: 'Base the tackle on your outside shoulder.',
  detail:
    'Their tackle is on your outside shoulder. Get your helmet on his inside number and drive him back, away from the play. No climbing on this play.',
}

const C_GAP_JOB: Assignment = {
  rule: 'Uncovered. Step playside and fill the gap.',
  detail:
    'Nobody on your nose. Step playside and block anybody who comes through the gap between you and the guard. No climbing on this play.',
}

const C_NOSE_JOB: Assignment = {
  rule: 'Covered. Base the nose.',
  detail:
    'The nose is head up on you. Take him by yourself and drive him back. No scoop on this play: the guard has his own man.',
}

const lineJobsRight = (front: FrontId): AssignmentMap => ({
  RT: PST_JOB,
  RG: PSG_JOB,
  C: front === '52' ? C_NOSE_JOB : C_GAP_JOB,
  LG: BSG_JOB,
  LT: BST_JOB,
})
const lineJobsLeft = (front: FrontId): AssignmentMap => mirrorJobs(lineJobsRight(front))

/** Wing-side backside slot (Red L, Black R). */
const SLOT_ALLEY_JOB: Record<FrontId, Assignment> = {
  '44': {
    rule: 'Backside slot. Block the S in the alley.',
    detail:
      'The S (their outside backer on your side) walks up in the alley. Come inside and block him. Keep him from chasing the play down the line.',
  },
  '43': {
    rule: 'Backside slot. Block the $ in the alley.',
    detail:
      'The strong safety ($) comes down into the alley on your side. Climb inside the corner, meet him as he comes, and keep him from chasing the play.',
  },
  '52': {
    rule: 'Backside slot. Block the $ in the alley.',
    detail:
      'The strong safety ($) comes down into the alley on your side. Climb inside the corner, meet him as he comes, and keep him from chasing the play.',
  },
}

/** Wing-side backside Y. */
const Y_CLIMB_JOB: Record<FrontId, Assignment> = {
  '44': {
    rule: 'Backside. Climb to the inside backer on your side.',
    detail:
      'Our tackle has the end. Release outside the end, climb, and cut back inside to the inside backer on your side of the ball. Get between him and the play.',
  },
  '43': {
    rule: 'Backside. Climb to the backer on your side.',
    detail:
      'Our tackle has the end. Release outside him and climb to the backer on your side (the S). Leave the Mike alone. Get between your man and the play.',
  },
  '52': {
    rule: 'Backside. Climb to the inside backer on your side.',
    detail:
      'Our tackle has the end. Release outside the end, climb, and cut back inside to the backer on your side. Get between him and the play.',
  },
}

/** Tight-end-side playside Y (Red Left, Black Right): his base man, same as the first gun pass. */
const Y_PLAYSIDE_JOB: Record<FrontId, Assignment> = {
  '44': {
    rule: 'Playside. Base the walked-up backer.',
    detail:
      'Our tackle has the end. Release outside the end and BASE the walked-up backer. Drive him out of the alley.',
  },
  '43': {
    rule: 'Playside. Base the backer over you.',
    detail:
      'Our tackle has the end. Release outside him, climb, and base the playside backer sitting over your head. Turn him out of the lane.',
  },
  '52': {
    rule: 'Playside. Pin the first filler.',
    detail:
      "Our tackle has the end. Release tight off the end's outside hip and pin the first jersey that fills, pushing him back inside.",
  },
}

/** Tight-end-side playside slot (Red L, Black R). */
const SLOT_PLAYSIDE_JOB: Record<FrontId, Assignment> = {
  '44': {
    rule: 'Playside slot. Stalk the corner.',
    detail:
      'Y bases the walked-up backer, so the corner is the next man to the alley. Release straight at him, break down under control, and stay on his outside number. The pitch runs off your block.',
  },
  '43': {
    rule: 'Playside slot. Crack down on the near safety.',
    detail:
      'The near safety is the alley filler in this front. Climb inside the corner, get your helmet across him as he comes down, and pin him back inside. Rule two: hit the near color. Find an opponent and block.',
  },
  '52': {
    rule: 'Playside slot. Crack down on the near safety.',
    detail:
      'The near safety is the alley filler in this front. Climb inside the corner, get your helmet across him as he comes down, and pin him back inside. Rule two: hit the near color. Find an opponent and block.',
  },
}

// ---------------------------------------------------------------------------
// Words shared by all four plays.
// ---------------------------------------------------------------------------

const SUMMARY = 'Triple option from the gun. Uncommon: both tackles block the ends.'

/** Coach Ryan's "when to call it", shown with the amber Uncommon Play badge. */
const UNCOMMON =
  'Call it only when we see a hole in the B gap, right behind one of our guards, that the back can sprint straight up through.'

const GUN_CHANGE_NOTE =
  'Both tackles block the ends. Keep them away from the center. Backside tackle: 1-2 seconds. Quarterback still reads the playside end.'

const coachNotesRight = [
  GUN_CHANGE_NOTE,
  'Dive back: no motion, no waiting. Straight up the B gap, full speed.',
  'Super: behind the quarterback, five wide, one back. Be there every time.',
]

const coachNotesLeft = [
  GUN_CHANGE_NOTE,
  'Super: no motion, no waiting. Straight up the B gap, full speed.',
  'Pitch man: behind the quarterback, five wide, one back. Be there every time.',
]

const ENDS_REVIEW_NOTE = (pst: string, bst: string, side: string) =>
  `UNCOMMON PLAY + BOTH ENDS BLOCKED (Coach Ryan, 2026-09-23), replacing the 2026-09-23 Do Not Run pass: "The goal of the play is to keep the defensive ends away from the center." ${pst} keeps the playside end OUTSIDE (up his inside number, bar pushing back and out). ${bst} blocks the backside end for 1–2 seconds, sliding inside toward the center so the end goes outside and around him — drawn as a short stroke to the end's inside shoulder. The quarterback reads the playside end (E-${side}) on every front: give unless he beats ${pst} inside, then keep. The corner/safety reads from the Do Not Run pass are gone.`

const LINE_REVIEW_NOTE =
  '"We are not as concerned with linemen climbing on this one." Guards base the 3-technique on their outside shoulder; the center steps playside and fills the A gap vs the 4-4 and 4-3 and bases the nose vs the 5-2 (no scoop, no Rip pull). Consequence: every inside backer except the one backside Y climbs to is unblocked — on the wing side the playside backers are free too. That is the trade Ryan described: the back is through the B gap before they matter.'

const QB_PITCH_REVIEW_NOTE =
  "Quarterback's keep and the pitch man's path are unchanged from the first gun pass: the keep still breaks at the playside end's outside hip, which is where he goes if the end beats the tackle inside, and the pitch man still holds 5-by-1 off it. No conflict found; flag if Ryan wants the pitch man to do something else on a play that is mostly a handoff."

// ---------------------------------------------------------------------------
// RED GUN VEER RIGHT — wing side. R dives, Super pitches, L is the backside
// slot. RT keeps the end out; LT slides inside on the backside end; L blocks
// the S in the alley; Y climbs to the backer on his side.
// ---------------------------------------------------------------------------

const wingBacksideActions = (front: FrontId): ActionMap => ({
  ...lineRight(front),
  Y: Y_CLIMB[front],
  L: SLOT_ALLEY[front],
})
const wingBacksideJobs = (front: FrontId): AssignmentMap => ({
  ...lineJobsRight(front),
  Y: Y_CLIMB_JOB[front],
  L: SLOT_ALLEY_JOB[front],
})

const wingSideReviewNote = (slot: string, set: string, side: 'L' | 'R') =>
  `JUDGMENT CALL — backside "${slot} blocks the S alley" / "Y climbs to the middle linebacker on his side", per front. 4-4: there is no strong safety, so the S is the walked-up Sam (O-${side}, drawn as S against ${set}) standing in the alley; Y climbs to the inside backer over the guard (B-${side}). 4-3: ${slot} takes the strong safety ($, F-${side}) coming down into the alley and Y climbs to the backer on his side (B-${side}, drawn as S); the Mike is not blocked. 5-2: ${slot} to the $ (F-${side}), Y to the inside backer (B-${side}). Alternative for the 4-3: ${slot} on the Sam and Y on the Mike.`

export const veerRightRedGun: Play = {
  ...gunPlay(veerRightRed, {
    ballCarrier: 'R',
    formationTwinId: 'veer-right-black-gun',
    audibleFlipId: 'veer-left-red-gun',
    summary: SUMMARY,
    description:
      'Veer Right from the gun. No motion: R is already beside the quarterback, so he takes the dive up the B gap off the right guard, the quarterback meshes with him, and Super swings behind the quarterback as the pitch man. Both tackles block the ends to keep them away from the center: RT keeps his end outside, and LT holds the backside end for a second or two, sliding inside so the end has to go around. The quarterback still reads the playside end and keeps only if he beats RT inside. On the back side L blocks the S in the alley and Y climbs to the backer on his side.',
    coachNotes: coachNotesRight,
    assignments: {
      Q: Q_GUN,
      R: dive('right'),
      S: pitchMan('the quarterback'),
      ...wingBacksideJobs('44'),
    },
    actions: {
      Q: Q_READ_RIGHT,
      R: DIVE_RIGHT,
      S: PITCH_RIGHT,
    },
    vs: Object.fromEntries(
      FRONTS.map((f) => [
        f,
        {
          readKey: 'E-R',
          ignored: [],
          actions: wingBacksideActions(f),
          // The base's per-front R text is the wing's pin — replace it on every front.
          assignments: { R: dive('right'), ...wingBacksideJobs(f) },
        },
      ]),
    ),
    reviewNotes: [
      ENDS_REVIEW_NOTE('RT', 'LT', 'R'),
      wingSideReviewNote('L', 'Red', 'L'),
      LINE_REVIEW_NOTE,
      QB_PITCH_REVIEW_NOTE,
    ],
  }),
  uncommon: UNCOMMON,
}

// ---------------------------------------------------------------------------
// RED GUN VEER LEFT — tight-end side. Super dives, R pitches, L is the
// PLAYSIDE slot. LT keeps the end out; RT slides inside on the backside end;
// Y and L keep their jobs from the first gun pass.
// ---------------------------------------------------------------------------

const teSideActions = (front: FrontId): ActionMap => ({
  ...lineLeft(front),
  L: SLOT_PLAYSIDE[front],
})
const teSideJobs = (front: FrontId): AssignmentMap => ({
  ...lineJobsLeft(front),
  Y: Y_PLAYSIDE_JOB[front],
  L: SLOT_PLAYSIDE_JOB[front],
})

const TE_SIDE_REVIEW_NOTE =
  "Tight-end side, not re-ruled on 2026-09-23: Y keeps his man outside the end (walked-up backer in the 4-4, playside backer in the 4-3, first filler in the 5-2) and the playside slot keeps his (stalk the corner in the 4-4, crack the near safety in the 4-3 and 5-2). Y's strokes are the under-center play's."

export const veerLeftRedGun: Play = {
  ...gunPlay(veerLeftRed, {
    ballCarrier: 'S',
    formationTwinId: 'veer-left-black-gun',
    audibleFlipId: 'veer-right-red-gun',
    summary: SUMMARY,
    description:
      'Veer Left from the gun, at the tight end. No motion: Super is the playside back, so he takes the dive up the B gap off the left guard, the quarterback meshes with him, and R swings behind the quarterback as the pitch man. Both tackles block the ends to keep them away from the center: LT keeps his end outside, and RT holds the backside end for a second or two, sliding inside so the end has to go around. The quarterback still reads the playside end and keeps only if he beats LT inside. Y bases his man outside the end, and L blocks the alley from the left slot.',
    coachNotes: coachNotesLeft,
    assignments: {
      Q: Q_GUN,
      S: dive('left'),
      R: pitchMan('the quarterback'),
      ...teSideJobs('44'),
    },
    actions: {
      Q: Q_READ_LEFT,
      S: DIVE_LEFT,
      R: PITCH_LEFT,
    },
    vs: Object.fromEntries(
      FRONTS.map((f) => [f, { readKey: 'E-L', actions: teSideActions(f), assignments: teSideJobs(f) }]),
    ),
    reviewNotes: [
      ENDS_REVIEW_NOTE('LT', 'RT', 'L'),
      TE_SIDE_REVIEW_NOTE,
      LINE_REVIEW_NOTE,
      QB_PITCH_REVIEW_NOTE,
    ],
  }),
  uncommon: UNCOMMON,
}

// ---------------------------------------------------------------------------
// BLACK GUN VEER RIGHT — tight-end side (Black puts Y right). L is beside the
// quarterback and dives; Super pitches; R is the PLAYSIDE slot at (8.5,−1).
// Line, Y and slot are Red Left mirrored; the backfield is Red Right's.
// ---------------------------------------------------------------------------

export const veerRightBlackGun: Play = {
  ...gunPlay(veerRightBlack, {
    ballCarrier: 'L',
    formationTwinId: 'veer-right-red-gun',
    audibleFlipId: 'veer-left-black-gun',
    summary: SUMMARY,
    description:
      'Veer Right from the gun out of Black, the tight end side. No motion: L is beside the quarterback in Black, so he takes the dive up the B gap off the right guard, the quarterback meshes with him, and Super swings behind the quarterback as the pitch man. Both tackles block the ends to keep them away from the center: RT keeps his end outside, and LT holds the backside end for a second or two, sliding inside so the end has to go around. The quarterback still reads the playside end and keeps only if he beats RT inside. Y bases his man outside the end, and R blocks the alley from the right slot.',
    coachNotes: coachNotesRight,
    assignments: {
      Q: Q_GUN,
      L: dive('right'),
      S: pitchMan('the quarterback'),
      ...mirrorJobs(teSideJobs('44')),
    },
    actions: {
      Q: Q_READ_RIGHT,
      L: DIVE_RIGHT,
      S: PITCH_RIGHT,
    },
    vs: Object.fromEntries(
      FRONTS.map((f) => [
        f,
        { readKey: 'E-R', actions: mirrorActions(teSideActions(f)), assignments: mirrorJobs(teSideJobs(f)) },
      ]),
    ),
    reviewNotes: [
      ENDS_REVIEW_NOTE('RT', 'LT', 'R'),
      TE_SIDE_REVIEW_NOTE,
      LINE_REVIEW_NOTE,
      QB_PITCH_REVIEW_NOTE,
      "Black Gun is not Red Gun mirrored in the backfield: the backfield strokes here are Red Gun Veer Right's verbatim (the wing beside the quarterback is L instead of R, same spot); the line, Y and slot are Red Gun Veer Left's mirrored.",
    ],
  }),
  uncommon: UNCOMMON,
}

// ---------------------------------------------------------------------------
// BLACK GUN VEER LEFT — wing side (Y is right, X split left). Super dives up
// the B gap off LG; L, beside the quarterback, is the pitch man; R is the
// BACKSIDE slot at (8.5,−1). Line, Y and slot are Red Right mirrored.
// ---------------------------------------------------------------------------

export const veerLeftBlackGun: Play = {
  ...gunPlay(veerLeftBlack, {
    ballCarrier: 'S',
    formationTwinId: 'veer-left-red-gun',
    audibleFlipId: 'veer-right-black-gun',
    summary: SUMMARY,
    description:
      'Veer Left from the gun out of Black, the wing side. No motion: Super is the playside back, so he takes the dive up the B gap off the left guard, the quarterback meshes with him, and L swings behind the quarterback as the pitch man. Both tackles block the ends to keep them away from the center: LT keeps his end outside, and RT holds the backside end for a second or two, sliding inside so the end has to go around. The quarterback still reads the playside end and keeps only if he beats LT inside. On the back side R blocks the S in the alley and Y climbs to the backer on his side.',
    coachNotes: coachNotesLeft,
    assignments: {
      Q: Q_GUN,
      S: dive('left'),
      L: pitchMan('the quarterback'),
      ...mirrorJobs(wingBacksideJobs('44')),
    },
    actions: {
      Q: Q_READ_LEFT,
      S: DIVE_LEFT,
      L: PITCH_LEFT,
    },
    vs: Object.fromEntries(
      FRONTS.map((f) => [
        f,
        {
          readKey: 'E-L',
          ignored: [],
          actions: mirrorActions(wingBacksideActions(f)),
          // The base's per-front L text is the wing's pin — replace it on every front.
          assignments: { L: pitchMan('the quarterback'), ...mirrorJobs(wingBacksideJobs(f)) },
        },
      ]),
    ),
    reviewNotes: [
      ENDS_REVIEW_NOTE('LT', 'RT', 'L'),
      wingSideReviewNote('R', 'Black', 'R'),
      LINE_REVIEW_NOTE,
      QB_PITCH_REVIEW_NOTE,
      "Black Gun is not Red Gun mirrored in the backfield: the backfield strokes here are Red Gun Veer Left's verbatim (the pitch man is L instead of R, same spot beside the quarterback); the line, Y and slot are Red Gun Veer Right's mirrored.",
    ],
  }),
  uncommon: UNCOMMON,
}

export const veerGunPlays: Play[] = [
  veerRightRedGun,
  veerRightBlackGun,
  veerLeftRedGun,
  veerLeftBlackGun,
]
