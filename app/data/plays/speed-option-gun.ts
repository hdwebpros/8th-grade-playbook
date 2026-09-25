/**
 * SPEED OPTION from the GUN — a gun-only concept (Coach Ryan, 2026-09-25,
 * from a coach's sketch "Black Gun Speed Option Right"). There is no
 * under-center Speed Option: it is authored straight onto the gun sets
 * (app/data/shotgun.ts), so these plays have no base to toggle back to.
 *
 * THE PLAY. The quarterback sprints outside the line of scrimmage and attacks
 * the alley backer. If the backer commits to him, he pitches to the trail
 * back; if the backer sits on the pitch, he keeps.
 *
 * COACH RYAN'S RULINGS (2026-09-25):
 *   - "The trail back is always the one who gets the ball." Super is on the
 *     quarterback's LEFT in every gun set, so going RIGHT Super is the pitch
 *     man and the wing beside the quarterback blocks; going LEFT the wing is
 *     the pitch man and Super blocks. The backfield is a true mirror.
 *   - Playside tackle: chip the defensive end to hold him for a moment. If the
 *     end is handled, climb to a linebacker and cut off his pursuit angle.
 *   - With the tight end on the play side (Black Right, Red Left), Y takes the
 *     end. On the open side (Red Right, Black Left) the tackle needs help:
 *     the playside back takes the end.
 *   - The playside back blocks the first guy he sees: if the end is
 *     disrupting, block him; otherwise climb.
 *   - Red and Black, both ways. Gun only, app only (not in playList) like the
 *     other gun plays.
 *
 * Id convention: 'speed-option-right-black-gun'. The '-gun' suffix keeps
 * `isGunPlay` / `baseIdOf` honest; `baseIdOf` finds no under-center play, so
 * the Under center / Gun toggle does not render.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'
import { mirrorAction, mirrorDefenderId, mirrorPos } from '../../utils/mirror'
import { GUN_CALL_PART } from './gun-shared'

type ActionMap = Partial<Record<OffPosId, Action[]>>
type AssignmentMap = Partial<Record<OffPosId, Assignment>>

const FRONTS: FrontId[] = ['44', '43', '52']

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

// ---------------------------------------------------------------------------
// Backfield, drawn going RIGHT from the gun spots: Q (0,−3), Super (−1,−4),
// the wing beside the quarterback (1,−4). Going left is the exact mirror with
// Super and the wing trading jobs, because their spots mirror each other.
// ---------------------------------------------------------------------------

/**
 * Q sprints flat for the edge, gaining ground, and turns up just outside the
 * end at the alley backer. Ends barely past the line — pressing the backer.
 */
const Q_SPRINT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 1.5, y: -2.9 },
      { x: 4, y: -2.3 },
      { x: 6.3, y: -1 },
      { x: 7.6, y: 0.8 },
    ],
  },
]

/**
 * Trail back from (−1,−4): crosses BEHIND the quarterback, deep, and settles
 * into pitch relationship — five wide, a yard back of Q's (7.6, 0.8).
 */
const TRAIL_PITCH: Action[] = [
  {
    kind: 'pitch',
    path: [
      { x: 0, y: -4.8 },
      { x: 2.5, y: -4.7 },
      { x: 5.5, y: -3.7 },
      { x: 9, y: -2 },
      { x: 12.6, y: -0.2 },
    ],
  },
]

/** Playside back from (1,−4): straight to the edge, just outside the end. */
const EDGE_PATH: Action = {
  kind: 'run',
  path: [
    { x: 2.2, y: -3.2 },
    { x: 4.2, y: -1.8 },
    { x: 5.2, y: -0.4 },
  ],
}

/** Tight-end side: Y has the end, so the playside back climbs to the next man in the alley. */
const edgeClimb = (targetId: string): Action[] => [EDGE_PATH, { kind: 'block', targetId }]

/** Open side: nobody outside the tackle, so the playside back takes the end. */
const EDGE_DE: Action[] = [
  { kind: 'run', path: [{ x: 2.2, y: -3.2 }, { x: 4, y: -1.6 }] },
  { kind: 'block', targetId: 'E-R' },
]

/**
 * Playside tackle: chip the end on his inside shoulder (E-R at 3.55,1), then
 * climb to a linebacker and cut off his pursuit.
 */
const rtChipClimb = (targetId: string): Action[] => [
  { kind: 'block', path: [{ x: 3.2, y: 0.55 }] },
  { kind: 'block', targetId },
]

// ---------------------------------------------------------------------------
// Per-front targets, going RIGHT. Read key is the alley backer: the walked-up
// outside backer in the 4-4, the playside backer in the 4-3 and 5-2.
// ---------------------------------------------------------------------------

const READ: Record<FrontId, string> = { '44': 'O-R', '43': 'B-R', '52': 'B-R' }
/** Where the playside tackle climbs after the chip. */
const RT_CLIMB: Record<FrontId, string> = { '44': 'B-R', '43': 'M', '52': 'B-L' }
/** Tight-end side: the playside back climbs past the end to the alley safety. */
const EDGE_CLIMB: Record<FrontId, string> = { '44': 'F', '43': 'F-R', '52': 'F-R' }
/** Center: climbs to the backside backer vs even fronts, reaches the nose vs the 5-2. */
const C_TARGET: Record<FrontId, string> = { '44': 'B-L', '43': 'B-L', '52': 'N' }

const lineRight = (f: FrontId): ActionMap => ({
  RT: rtChipClimb(RT_CLIMB[f]),
  RG: block('T-R'),
  C: block(C_TARGET[f]),
  LG: block('T-L'),
  LT: block('E-L'),
})

/** Black Right: Y and the slot (R) on the play side, X backside. Q and the wing are added per play. */
const teSideRight = (f: FrontId): ActionMap => ({
  ...lineRight(f),
  Y: block('E-R'),
  R: block('C-R'),
  X: block('C-L'),
})

/** Red Right: X alone on the play side; Y and the slot (L) backside. */
const openSideRight = (f: FrontId): ActionMap => ({
  ...lineRight(f),
  X: block('C-R'),
  Y: block(f === '44' ? 'O-L' : 'F-L'),
  L: block('C-L'),
})

// ---------------------------------------------------------------------------
// Assignment text. Side-neutral so it serves both directions; letters come
// off the diagram (W/S flip with the formation's strength).
// ---------------------------------------------------------------------------

const Q_JOB: Assignment = {
  rule: 'Sprint to the edge. Attack the alley backer. He takes you, pitch it.',
  detail:
    'Catch the snap and sprint flat for the edge, then turn up just outside the end. Run right at the alley backer and make him pick. If he comes at you, pitch it to the trail back before he hits you. If he sits on the pitch, keep it and get upfield. Never pitch it late, and never pitch it inside.',
}

const PITCH_JOB = (who: string): Assignment => ({
  rule: 'Trail back. Five wide, one back. The pitch is yours.',
  detail: `You are the trail back, so the ball is yours on the pitch. On the snap, cross behind ${who} and get into pitch relationship: about five yards outside him and a yard behind. Hold that spacing all the way. Eyes on the quarterback, hands up and soft. Catch it first, then turn it up.`,
})

const EDGE_TE_JOB: Assignment = {
  rule: 'Playside back. Get to the edge. Block the first man you see.',
  detail:
    'Y has the end. Sprint to the edge just outside him. If the end is getting loose and blowing up the play, block him. If he is handled, climb and block the first man coming into the alley. Leave the alley backer alone: he is the quarterback\'s read.',
}

const EDGE_OPEN_JOB: Assignment = {
  rule: 'Playside back. Help on the end.',
  detail:
    'There is no tight end on this side, so our tackle needs help with the end. Sprint to the edge and block him. Keep him from getting upfield into the quarterback. If our tackle has him handled, climb and block the first man coming into the alley. Leave the alley backer alone: he is the quarterback\'s read.',
}

const PST_JOB: Assignment = {
  rule: 'Chip the end, then climb to a backer.',
  detail:
    'Hit the end on your outside shoulder and hold him for a moment. If he is lined up way outside, you will need help: stay on him until it gets there. Once he is handled, climb to a linebacker and cut off his angle to the ball. Best case, you block the end all by yourself.',
}

const LINE_JOBS: AssignmentMap = {
  RG: {
    rule: 'Reach the tackle on your outside shoulder.',
    detail: 'Step playside and get your helmet outside him. Do not let him run down the line at the quarterback.',
  },
  LG: {
    rule: 'Backside. Cut off the tackle.',
    detail: 'Step playside and get between him and the ball. Do not let him chase the play down the line.',
  },
  LT: {
    rule: 'Backside. Cut off the end.',
    detail: 'Step playside and get between the end and the ball. He is chasing from behind, so stay on him.',
  },
}

const C_JOB: Record<FrontId, Assignment> = {
  '44': {
    rule: 'Uncovered. Climb to the backside backer.',
    detail: 'Nobody on your nose. Step playside and climb to the inside backer on the back side. Cut off his angle to the ball.',
  },
  '43': {
    rule: 'Uncovered. Climb to the backside backer.',
    detail: 'Nobody on your nose. Step playside and climb to the backer on the back side. Cut off his angle to the ball.',
  },
  '52': {
    rule: 'Covered. Reach the nose.',
    detail: 'The nose is head up on you. Step playside and get your helmet outside him so he cannot chase the play.',
  },
}

const TE_Y_JOB: Assignment = {
  rule: 'Block the end.',
  detail: 'The end is yours. Our tackle chips him first, then climbs. Get on him and keep him from running down the line at the quarterback.',
}
const TE_SLOT_JOB: Assignment = {
  rule: 'Playside slot. Block the corner.',
  detail: 'Release straight at the corner, break down, and stay on his outside number. The pitch runs off your block.',
}
const TE_X_JOB: Assignment = {
  rule: 'Backside. Run off the corner.',
  detail: 'Run right at the corner on your side and block him. Keep him from chasing the play across the field.',
}

const OPEN_X_JOB: Assignment = {
  rule: 'Playside. Block the corner.',
  detail: 'Release straight at the corner, break down, and stay on his outside number. The pitch runs off your block.',
}
const OPEN_Y_JOB: Record<FrontId, Assignment> = {
  '44': {
    rule: 'Backside. Cut off the outside backer.',
    detail: 'Release inside and get between the outside backer on your side and the ball. Do not let him chase the play.',
  },
  '43': {
    rule: 'Backside. Cut off the safety.',
    detail: 'Release and climb to the safety on your side. Get between him and the ball.',
  },
  '52': {
    rule: 'Backside. Cut off the safety.',
    detail: 'Release and climb to the safety on your side. Get between him and the ball.',
  },
}
const OPEN_SLOT_JOB: Assignment = {
  rule: 'Backside slot. Run off the corner.',
  detail: 'Run right at the corner on your side and block him. Keep him from chasing the play across the field.',
}

const lineJobsRight = (f: FrontId): AssignmentMap => ({ RT: PST_JOB, ...LINE_JOBS, C: C_JOB[f] })

// ---------------------------------------------------------------------------
// Mirroring. The line, Y, X and the slot mirror by side (mirrorPos). The two
// backs do NOT: Super (−1,−4) and the wing (1,−4) stand in each other's
// mirror spots, so the mirrored strokes go to the OTHER back.
// ---------------------------------------------------------------------------

const mirrorMap = (m: ActionMap, backSwap: Partial<Record<OffPosId, OffPosId>>): ActionMap =>
  Object.fromEntries(
    Object.entries(m).map(([pos, a]) => [
      backSwap[pos as OffPosId] ?? mirrorPos(pos as OffPosId),
      a!.map(mirrorAction),
    ]),
  )

const mirrorJobMap = (m: AssignmentMap, backSwap: Partial<Record<OffPosId, OffPosId>>): AssignmentMap =>
  Object.fromEntries(
    Object.entries(m).map(([pos, a]) => [backSwap[pos as OffPosId] ?? mirrorPos(pos as OffPosId), a]),
  )

const mirrorPlan = (plan: FrontPlan, backSwap: Partial<Record<OffPosId, OffPosId>>): FrontPlan => ({
  actions: mirrorMap(plan.actions, backSwap),
  ...(plan.assignments ? { assignments: mirrorJobMap(plan.assignments, backSwap) } : {}),
  ...(plan.readKey ? { readKey: mirrorDefenderId(plan.readKey) } : {}),
  ...(plan.ignored ? { ignored: plan.ignored.map(mirrorDefenderId) } : {}),
})

// ---------------------------------------------------------------------------
// Words.
// ---------------------------------------------------------------------------

const SUMMARY =
  'Quarterback sprints to the edge and pitches off the alley backer.'

const COACH_NOTES = [
  'Quarterback: attack the alley backer. He comes at you, pitch it early.',
  'Trail back: five wide, one back. The pitch is yours.',
  'Playside tackle: chip the end, then climb.',
]

const REVIEW_NOTES = (teSide: boolean): string[] => [
  'Read key = the alley backer: walked-up outside backer (O-) in the 4-4, playside backer (B-) in the 4-3 and 5-2. Coach sketch showed the playside tackle\'s arrow at the Sam; drawn instead as chip the end, climb to the next backer inside (4-4 inside backer, 4-3 Mike, 5-2 backside backer), per Ryan\'s 2026-09-25 answer.',
  teSide
    ? 'Tight-end side: Y takes the end, so the playside back climbs past him to the alley safety (F in the 4-4, $ in the 4-3/5-2). Backside X runs off the corner.'
    : 'Open side: the playside back takes the end (tackle needs help). Nobody is left for the playside safety in the 4-3/5-2, so he is drawn ignored; X blocks the corner. Backside Y cuts off (outside backer in the 4-4, safety in the 4-3/5-2) and the slot runs off the corner.',
  'Backside line and center: reach/cut off playside. Judgment call, not from the sketch.',
]

// ---------------------------------------------------------------------------
// Right-hand plans. Black Right = tight-end side (wing L beside Q, slot R);
// Red Right = open side (wing R beside Q, slot L).
// ---------------------------------------------------------------------------

const blackRightPlan = (f: FrontId): FrontPlan => ({
  readKey: READ[f],
  actions: { ...teSideRight(f), Q: Q_SPRINT, S: TRAIL_PITCH, L: edgeClimb(EDGE_CLIMB[f]) },
  assignments: {
    ...lineJobsRight(f),
    Y: TE_Y_JOB,
    R: TE_SLOT_JOB,
    X: TE_X_JOB,
    Q: Q_JOB,
    S: PITCH_JOB('the quarterback'),
    L: EDGE_TE_JOB,
  },
})

const redRightPlan = (f: FrontId): FrontPlan => ({
  readKey: READ[f],
  ...(f === '44' ? {} : { ignored: ['F-R'] }),
  actions: { ...openSideRight(f), Q: Q_SPRINT, S: TRAIL_PITCH, R: EDGE_DE },
  assignments: {
    ...lineJobsRight(f),
    X: OPEN_X_JOB,
    Y: OPEN_Y_JOB[f],
    L: OPEN_SLOT_JOB,
    Q: Q_JOB,
    S: PITCH_JOB('the quarterback'),
    R: EDGE_OPEN_JOB,
  },
})

/** The per-front plans as a record, built once per front. */
const byFront = (plan: (f: FrontId) => FrontPlan): Record<FrontId, FrontPlan> =>
  Object.fromEntries(FRONTS.map((f) => [f, plan(f)])) as Record<FrontId, FrontPlan>

/** Front-independent text: the 4-4 plan's assignments. */
const baseJobs = (plans: Record<FrontId, FrontPlan>) =>
  plans['44'].assignments as Record<OffPosId, Assignment>

const call = (set: 'Red' | 'Black', dir: 'Right' | 'Left') => [
  { word: set, label: 'formation' },
  GUN_CALL_PART,
  { word: 'Speed Option', label: 'play' },
  { word: dir, label: 'direction' },
]

const blackRight = byFront(blackRightPlan)
const redRight = byFront(redRightPlan)
// Black Right mirrored is Red Left: Black's wing L → Super, Super → Red's wing R.
const redLeft = byFront((f) => mirrorPlan(blackRight[f], { L: 'S', S: 'R' }))
// Red Right mirrored is Black Left: Red's wing R → Super, Super → Black's wing L.
const blackLeft = byFront((f) => mirrorPlan(redRight[f], { R: 'S', S: 'L' }))

export const speedOptionRightBlackGun: Play = {
  id: 'speed-option-right-black-gun',
  name: 'Speed Option',
  call: call('Black', 'Right'),
  family: 'run',
  formation: 'black',
  variant: 'gun',
  direction: 'right',
  ballCarrier: 'Q',
  summary: SUMMARY,
  description:
    'The quarterback sprints to the right edge and attacks the alley backer. Super is the trail back: he crosses behind the quarterback and holds five wide, one back. If the backer takes the quarterback, he pitches it to Super. If the backer sits on Super, he keeps. Y takes the end after RT chips him, RT climbs to a backer, L gets to the edge and blocks the first man he sees, and R blocks the corner.',
  assignments: baseJobs(blackRight),
  vs: blackRight,
  formationTwinId: 'speed-option-right-red-gun',
  audibleFlipId: 'speed-option-left-black-gun',
  coachNotes: COACH_NOTES,
  reviewNotes: REVIEW_NOTES(true),
}

export const speedOptionRightRedGun: Play = {
  id: 'speed-option-right-red-gun',
  name: 'Speed Option',
  call: call('Red', 'Right'),
  family: 'run',
  formation: 'red',
  variant: 'gun',
  direction: 'right',
  ballCarrier: 'Q',
  summary: SUMMARY,
  description:
    'The quarterback sprints to the right edge, away from the tight end, and attacks the alley backer. Super is the trail back: he crosses behind the quarterback and holds five wide, one back. If the backer takes the quarterback, he pitches it to Super. If the backer sits on Super, he keeps. With no tight end on this side, R helps RT with the end, RT chips and climbs to a backer, and X blocks the corner.',
  assignments: baseJobs(redRight),
  vs: redRight,
  formationTwinId: 'speed-option-right-black-gun',
  audibleFlipId: 'speed-option-left-red-gun',
  coachNotes: COACH_NOTES,
  reviewNotes: REVIEW_NOTES(false),
}

export const speedOptionLeftRedGun: Play = {
  id: 'speed-option-left-red-gun',
  name: 'Speed Option',
  call: call('Red', 'Left'),
  family: 'run',
  formation: 'red',
  variant: 'gun',
  direction: 'left',
  ballCarrier: 'Q',
  summary: SUMMARY,
  description:
    'The quarterback sprints to the left edge, toward the tight end, and attacks the alley backer. R is the trail back: he crosses behind the quarterback and holds five wide, one back. If the backer takes the quarterback, he pitches it to R. If the backer sits on R, he keeps. Y takes the end after LT chips him, LT climbs to a backer, Super gets to the edge and blocks the first man he sees, and L blocks the corner.',
  assignments: baseJobs(redLeft),
  vs: redLeft,
  formationTwinId: 'speed-option-left-black-gun',
  audibleFlipId: 'speed-option-right-red-gun',
  coachNotes: COACH_NOTES,
  reviewNotes: REVIEW_NOTES(true),
}

export const speedOptionLeftBlackGun: Play = {
  id: 'speed-option-left-black-gun',
  name: 'Speed Option',
  call: call('Black', 'Left'),
  family: 'run',
  formation: 'black',
  variant: 'gun',
  direction: 'left',
  ballCarrier: 'Q',
  summary: SUMMARY,
  description:
    'The quarterback sprints to the left edge, away from the tight end, and attacks the alley backer. L is the trail back: he crosses behind the quarterback and holds five wide, one back. If the backer takes the quarterback, he pitches it to L. If the backer sits on L, he keeps. With no tight end on this side, Super helps LT with the end, LT chips and climbs to a backer, and X blocks the corner.',
  assignments: baseJobs(blackLeft),
  vs: blackLeft,
  formationTwinId: 'speed-option-left-red-gun',
  audibleFlipId: 'speed-option-right-black-gun',
  coachNotes: COACH_NOTES,
  reviewNotes: REVIEW_NOTES(false),
}

export const speedOptionGunPlays: Play[] = [
  speedOptionRightRedGun,
  speedOptionRightBlackGun,
  speedOptionLeftRedGun,
  speedOptionLeftBlackGun,
]
