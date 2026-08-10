/**
 * SPLIT WIDE — the four plays Coach Ryan invented. These exist in NO playbook.
 * Every one of them is a DRAFT written from one sentence of his, and every one
 * is behind the hard review gate in HANDOFF.md §10.
 *
 * Ryan's words, verbatim, and what each became:
 *   1. "a play where the halfback goes in motion to the right, and it's a QB
 *      keeper over the right guard B gap"          → splitWideKeeperRight
 *   2. "standard hb dive, all receivers stop the crash to the middle"
 *                                                   → splitWideDive
 *   3. "HB goes in motion, HB screen"               → splitWideHbScreen
 *   4. "HB chip blocks; receivers left→right run curl, post, post, go"
 *                                                   → splitWideChip
 *
 * THE HALFBACK MAPPING (the one decision everything else hangs on).
 * `OffPosId` has no `HB`. Split Wide on varsity page 4 has exactly one back —
 * the lone man behind the quarterback at 4½ yards, which is precisely where
 * Super (`S`) stands in Red. So in every play in this file:
 *
 *      >>>  "HB" = S (Super). He is the only back on the field.  <<<
 *
 * That also makes play 4 add up: "receivers left→right" is exactly four men —
 * Y (−13), L (−8.5), R (+8.5), X (+13) — for exactly four routes.
 *
 * Every block in here aims at a named defender, per Coach Ryan's directive.
 * There is no scan to copy for these plays, so each target is a decision, and
 * the reasoning for the ones that aren't obvious is written into `reviewNotes`.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'
import { splitWide } from '../split-wide-formation'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

/** Prepended to every play's notes. The gate, in the same words, every time. */
const GATE = 'DRAFT — Coach Ryan must approve this football before it reaches a player.'

/** The mapping note, repeated on every play so it can't be missed in review. */
const HB_NOTE =
  'HALFBACK = S (Super). There is no HB id in our frozen type set (X Y L R S Q C LG RG LT RT), and Split Wide on varsity p4 has exactly one back — the lone man 4½ yards behind the quarterback, which is Super\'s spot in Red. So every "HB" in your descriptions is drawn and coached as S. If you want the ball in a different kid\'s hands, say which letter and the whole file re-points at him.'

const FORMATION_NOTE =
  'Formation drafted in app/data/split-wide-formation.ts off page 4: Y split wide left at 13, L slot at 8.5 left, R slot at 8.5 right, X wide right at 13, slots a yard off the ball, Super 4½ deep. Seven on the line (Y, LT, LG, C, RG, RT, X) so it is legal with L and R off. The scan is within half a yard of symmetric; it is drawn exactly balanced. Confirm the splits — 8½ and 13 are big numbers for 8th graders on a high school field and you may want them tighter.'

const MIRROR_NOTE_PREFIX =
  'MIRROR: the football here mirrors exactly — Split Wide is a balanced set and all three of our fronts are left/right symmetric, so a left-handed twin is one mirrorPlay() call with zero hand corrections. It is deliberately NOT shipped yet: this is unapproved football, and mirroring it would double the number of wrong things a 13-year-old could read. Say the word at review and the twin appears. '

// ===========================================================================
// PLAY 1 — SPLIT WIDE RT KEEP  (motion right, QB keeper, right B gap)
// ===========================================================================
//
// The picture: Super goes in long motion to the right and never stops — he
// runs a full sweep track. The quarterback shows him the ball, pulls it, and
// goes downhill RIGHT NOW through the B gap between RG and RT, one gap inside
// of where everybody just chased.
//
// Line reasoning (why these targets and not others):
//  - The B gap is the RG/RT seam, so RG blocks the man on him and works him
//    IN, RT blocks the man on him and works him OUT. The hole is the daylight
//    between those two blocks. Nobody pulls: in our even fronts the backside
//    guard has a tackle head-up on him and can't leave.
//  - C is the uncovered man in both even fronts, so he does what he does on
//    Veer — steps playside and climbs. He goes to the backer who fits the B
//    gap: B-R in the 4-4, the Mike in the 4-3 (the 4-3's B-R is aligned too
//    wide to be the B-gap fitter, so the slot gets him instead).
//  - Vs the 5-2 the B gap is already open — nobody is aligned in it — so RG is
//    the uncovered man and HE climbs to B-R, RT walls the tackle head-up on
//    him, and C/LG double the nose.

const KEEP_S: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 2, y: -4.4 },
      { x: 4.5, y: -4.2 },
      { x: 7, y: -3.8 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: 9.5, y: -3 },
      { x: 11.5, y: -2.2 },
    ],
  },
]

const KEEP_Q: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 0.9, y: -1.9 },
      { x: 1.4, y: -2.2 },
    ],
  },
  {
    kind: 'carry',
    path: [
      { x: 1.8, y: -1.4 },
      { x: 2.2, y: -0.2 },
      { x: 2.4, y: 1.5 },
      { x: 2.8, y: 4 },
      { x: 3.2, y: 7 },
    ],
  },
]

const KEEP_SKILL = { S: KEEP_S, Q: KEEP_Q } satisfies Partial<Record<OffPosId, Action[]>>

const keepVs44: FrontPlan = {
  actions: {
    ...KEEP_SKILL,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('B-R'),
    RG: block('T-R'),
    RT: block('E-R'),
    L: block('S-L'),
    R: block('S-R'),
    Y: block('C-L'),
    X: block('C-R'),
  },
  assignments: {
    C: {
      rule: 'Uncovered — step playside and climb to the backer in the B gap.',
      detail:
        'Nobody on your nose in an even front. Playside foot first, then run through the B gap and put your hat on the backer stacked behind their tackle. He is the man who tackles this play if you miss him.',
    },
    R: {
      rule: 'Block the walked-up backer outside our tackle.',
      detail:
        'The 4-4 walks a backer up on the edge at 6½ yards — he is the man who runs the ball down from the outside. Come off the ball flat, get your hat outside his, and turn him away from the middle.',
    },
  },
}

const keepVs43: FrontPlan = {
  actions: {
    ...KEEP_SKILL,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('M'),
    RG: block('T-R'),
    RT: block('E-R'),
    L: block('B-L'),
    R: block('B-R'),
    Y: block('C-L'),
    X: block('C-R'),
  },
  assignments: {
    C: {
      rule: 'Uncovered — climb to the Mike.',
      detail:
        'The Mike is stacked right over the ball in a 4-3 and he is the first man to fill the B gap. Step playside and go get him — do not drift, he is straight ahead of you.',
    },
    R: {
      rule: 'Block the backer on your side.',
      detail:
        'In a 4-3 the backers are wide and there is no walked-up edge man, so your guy is the backer at 4 yards. Take a flat angle, get inside-out on him, and do not let him cross your face to the ball.',
    },
    L: {
      rule: 'Backside — cut off the backer on your side.',
      detail:
        'You are away from the play. Your only job is that the backside backer never runs the ball down from behind. Flat angle, get in his way, stay on your feet.',
    },
  },
}

const keepVs52: FrontPlan = {
  actions: {
    ...KEEP_SKILL,
    LT: block('T-L'),
    LG: block('N'),
    C: block('N'),
    RG: block('B-R'),
    RT: block('T-R'),
    L: block('E-L'),
    R: block('E-R'),
    Y: block('C-L'),
    X: block('C-R'),
  },
  assignments: {
    C: {
      rule: 'Covered — Scoop the nose with LG.',
      detail:
        'Odd front, so the nose is right on you. Step playside and take his playside number; the guard is coming behind you to finish him. Same Scoop you run on Veer.',
    },
    LG: {
      rule: 'Odd — Scoop with C.',
      detail: 'Step playside and get your shoulder into the nose. If he slants away from us he is yours alone.',
    },
    RG: {
      rule: 'Uncovered — climb through the B gap to the backer.',
      detail:
        'A 5-2 leaves your gap wide open, and that is the gap the quarterback is running through. Step playside, run through the hole in front of him, and take the backer at 4 yards. You are leading him.',
    },
    RT: {
      rule: 'Base the man head up on you — work him OUT.',
      detail:
        'Their tackle is nose to nose with you. Get your hat outside his and drive him toward the sideline. The hole is the daylight between you and RG.',
    },
    R: {
      rule: 'Crack the end.',
      detail:
        'A 5-2 leaves their end free on the edge — he is the man who chases the quarterback down from outside. Come down flat and wall him off. Hat in front, never in the back.',
    },
  },
}

const keepAssignments: Record<OffPosId, Assignment> = {
  Y: {
    rule: 'Stalk the corner. Nothing crosses your face.',
    detail:
      'You are the whole back side. Get off the ball, close the space to the corner, and mirror him. He never gets inside you toward the ball.',
  },
  LT: {
    rule: 'Base the end. Do not let him chase.',
    detail:
      'Backside tackle. Step to him, hat across his outside number, and wall him off. Everything on your side is about nobody catching the quarterback from behind.',
  },
  LG: {
    rule: 'Even: base the man on you. Odd: Scoop the nose with C.',
    detail:
      'Look at the center\'s nose. Nobody there — take the man head up on you and hold him. A nose guard there — Scoop it with the center.',
  },
  C: {
    rule: 'Covered: Scoop with LG. Uncovered: climb to the B-gap backer.',
    detail:
      'Playside foot first, every time. Covered means the nose is yours with the guard. Uncovered means you climb through the B gap and block the backer who fills it.',
  },
  RG: {
    rule: 'Covered: base the man on you, work him IN. Uncovered: climb to the backer.',
    detail:
      'You are the inside wall of the hole. If a man is on you, drive him toward the center — never let him get outside your shoulder. If nobody is on you, run through the hole and lead the quarterback onto the backer.',
  },
  RT: {
    rule: 'Base the man on you, work him OUT.',
    detail:
      'You are the outside wall of the hole. Hat outside, drive him toward the sideline. If he is aligned wide of you, take a short flat step and get to him — he cannot be allowed to squeeze back in.',
  },
  X: {
    rule: 'Stalk the corner.',
    detail:
      'Same block you run on Veer. Sprint at him, break down under control at three yards, and stay on his outside number. If the quarterback breaks the first tackle, your man is the last one out there.',
  },
  L: {
    rule: 'Back side — cut off the first man outside our tackle.',
    detail:
      'Play is going away from you. Take a flat angle at the first defender outside LT and get in his path. You are not knocking anyone down; you are making him run around you.',
  },
  R: {
    rule: 'Play side — block the first defender outside our tackle.',
    detail:
      'You are the edge. Come off flat, get your hat outside his, and turn him away from the middle of the field. The keeper is coming inside of your block, not outside it.',
  },
  S: {
    rule: 'Long motion right. Full speed, sell the sweep, never stop.',
    detail:
      'Start on the coach\'s call and cross behind the quarterback at full speed — you have to be moving when the ball is snapped, and you have to be behind the line the whole way. Show your hands for the ball as you pass him and keep running the sweep track like you have it. Every step you take is a step their edge takes with you, and that is the whole play.',
  },
  Q: {
    rule: 'Snap as Super crosses. Show it, pull it, run the B gap.',
    detail:
      'Snap the ball when Super\'s near foot passes your near foot. Open right, put the ball in his belly and take it back out — one count, no more. Then get your shoulders square and run downhill in the gap between RG and RT. This is a keeper, not a read: the ball is yours before the snap. Do not bounce it outside — outside is where all of them went.',
  },
}

export const splitWideKeeperRight: Play = {
  id: 'split-wide-keeper-right',
  name: 'Split Wide Keep',
  family: 'run',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'Q',
  description:
    'Super goes in long motion to the right and runs a sweep he never gets. The quarterback shows him the ball, keeps it, and runs downhill in the B gap between the right guard and the right tackle — one gap inside of everyone who just chased the motion.',
  assignments: keepAssignments,
  vs: { '44': keepVs44, '43': keepVs43, '52': keepVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'THE BIG QUESTION ON THIS PLAY: what does the motion man do after he clears? Drafted as a FULL-SPEED SWEEP FAKE — he keeps running and takes the edge defenders with him, and the quarterback keeps behind that flow. The other honest reading of your sentence is that he motions, settles outside the right tackle, and LEAD BLOCKS through the B gap. Both are real plays; the fake version needs no extra blocker because the front is outnumbered by the fake, the lead version gives you an extra hat in the hole but tips the play. Tell me which one you meant and I will redraw it.',
    'Is it a keeper or a read? Drafted as a pure keeper — the ball is the quarterback\'s before the snap, no readKey, nobody left unblocked on purpose. If you want it to be a give-or-keep off the end man, that is a different play and it needs a read key.',
    'B gap = between RG and RT, and the quarterback\'s aiming point is the outside hip of RG. Confirm that is the gap you mean by "over the right guard" — the other reading is the A gap right on top of him, which is the dive, and you already have a dive.',
    'Why nobody pulls: in both even fronts LG has a tackle head-up on him and cannot leave without giving up a free runner behind the play, so the uncovered center climbs to the B-gap backer instead. Vs the 5-2 that flips — RG is the uncovered man, so HE leads through the hole onto the backer while RT walls the man on his nose. If you would rather teach one pulling guard on every front, say so and I will change the front rules instead of the pictures.',
    'Vs the 4-3 the slot (R) blocks the backer at 4 yards instead of an edge man, because a 4-3 has no walked-up edge — so the center takes the Mike and R takes the outside backer. Vs the 5-2 R cracks the free end. Confirm you want the slot cracking IN on all three fronts rather than stalking the corner and letting the safety come free.',
    'Nobody blocks the deep safety on any front. That is on purpose — this play is meant to gain 4 to 6 downhill, and the safety is the guy who ends it. If you want it to be able to go the distance, someone has to leave a defender free to get to him.',
    MIRROR_NOTE_PREFIX +
      'The one thing that would NOT mirror is your call name, if you want "right" baked into the word the kids hear.',
  ],
}

// ===========================================================================
// PLAY 2 — SPLIT WIDE DIVE  ("standard hb dive, all receivers stop the crash")
// ===========================================================================
//
// Standard dive: Super downhill into the playside A gap, ball on his second
// step, quarterback carries out a boot fake away from it.
//
// The receiver rule is the part that needs your eyes — see reviewNotes. Drafted
// as: NOBODY GETS TO THE MIDDLE. The two slots crack back on the first
// unblocked defender outside our tackle (the man who crashes down the line),
// and the two wide receivers stalk the corners so their run support can never
// cross their face inside.

const DIVE_S: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: 0.25, y: -3 },
      { x: 0.55, y: -1.2 },
      { x: 0.8, y: 0.3 },
      { x: 1.05, y: 3 },
      { x: 1.3, y: 6 },
    ],
  },
]

const DIVE_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.4, y: -1.9 },
      { x: 0.8, y: -2.3 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: -1.5, y: -3 },
      { x: -3.5, y: -3.4 },
      { x: -5, y: -3 },
    ],
  },
]

const DIVE_SKILL = { S: DIVE_S, Q: DIVE_Q } satisfies Partial<Record<OffPosId, Action[]>>
const DIVE_WR = { Y: block('C-L'), X: block('C-R') } satisfies Partial<Record<OffPosId, Action[]>>

const diveVs44: FrontPlan = {
  actions: {
    ...DIVE_SKILL,
    ...DIVE_WR,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('B-R'),
    RG: block('T-R'),
    RT: block('E-R'),
    L: block('S-L'),
    R: block('S-R'),
  },
  assignments: {
    C: {
      rule: 'Uncovered — climb to the backer over the playside A gap.',
      detail:
        'Nobody on your nose. Step playside, get vertical, and take the backer stacked behind their tackle. He is the man in the hole.',
    },
    R: {
      rule: 'Crack the walked-up backer.',
      detail:
        'The 4-4 walks a backer up on the edge — he is the fastest man to the ball. Come down flat off the snap and stop him before he ever gets to the middle.',
    },
    L: {
      rule: 'Crack the walked-up backer.',
      detail:
        'Same job on the back side. He is chasing this play down the line, and you are the only one who can stop him.',
    },
  },
}

const diveVs43: FrontPlan = {
  actions: {
    ...DIVE_SKILL,
    ...DIVE_WR,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('M'),
    RG: block('T-R'),
    RT: block('E-R'),
    L: block('B-L'),
    R: block('B-R'),
  },
  assignments: {
    C: {
      rule: 'Uncovered — climb to the Mike.',
      detail: 'He is stacked straight over you and he is the man who fills the A gap. Step playside and go get him.',
    },
    R: {
      rule: 'Crack the backer on your side.',
      detail:
        'A 4-3 has no edge backer, so your man is the outside backer at 4 yards. Take a flat inside angle, beat him to the spot, and turn him away from the middle.',
    },
    L: {
      rule: 'Crack the backer on your side.',
      detail: 'Same block away from the play. He is the one who runs it down from behind if you miss him.',
    },
  },
}

const diveVs52: FrontPlan = {
  actions: {
    ...DIVE_SKILL,
    ...DIVE_WR,
    LT: block('T-L'),
    LG: block('N'),
    C: block('N'),
    RG: block('B-R'),
    RT: block('T-R'),
    L: block('E-L'),
    R: block('E-R'),
  },
  assignments: {
    C: {
      rule: 'Covered — Scoop the nose with LG.',
      detail:
        'Odd front. The nose is on you and he is standing in the hole. Step playside, take his playside number, and let the guard finish him.',
    },
    LG: {
      rule: 'Odd — Scoop with C.',
      detail: 'Step playside, shoulder into the nose. If he slants away, he is yours by yourself and the center climbs.',
    },
    RG: {
      rule: 'Uncovered — climb to the backer.',
      detail:
        'Nobody on you in a 5-2. Step playside off the double team and take the backer at 4 yards. He is the man in the hole once the nose is handled.',
    },
    RT: {
      rule: 'Base the man head up on you.',
      detail: 'Their tackle is nose to nose with you. Take him where he wants to go and seal him away from the A gap.',
    },
    R: {
      rule: 'Crack the end.',
      detail:
        'A 5-2 leaves their end unblocked on the edge, and on an inside run he crashes flat down the line. That is the crash. Get your hat in front of him and wall him out.',
    },
    L: {
      rule: 'Crack the end.',
      detail: 'Same job on the back side — the backside end chasing down the line is what turns a 5-yard dive into a 1-yard dive.',
    },
  },
}

const diveAssignments: Record<OffPosId, Assignment> = {
  Y: {
    rule: 'Stalk the corner. He never crosses your face to the middle.',
    detail:
      'Off the ball hard like it is a route, break down at three yards, and mirror him. In these fronts the corner is a run-support player — the second he starts inside, you are in his way.',
  },
  LT: {
    rule: 'Base the man on you. Nobody chases.',
    detail: 'Backside. Step, punch, wall him off from the ball. All you owe is that nobody catches Super from behind.',
  },
  LG: {
    rule: 'Even: base the man on you. Odd: Scoop the nose with C.',
    detail: 'Check the center\'s nose. Empty — take your own man. Nose guard — Scoop it with the center.',
  },
  C: {
    rule: 'Covered: Scoop with LG. Uncovered: climb to the backer in the hole.',
    detail:
      'Playside foot first. Covered means the nose is yours and the guard is helping. Uncovered means you get vertical and block the backer who fills the A gap — he is the man who makes this tackle.',
  },
  RG: {
    rule: 'Covered: base the man on you. Uncovered: climb to the backer.',
    detail:
      'You are the playside wall of the hole. If a man is on you, drive him — he cannot fall back into the A gap. If nobody is on you, get to the second level.',
  },
  RT: {
    rule: 'Base the man on you.',
    detail: 'Take him wherever he wants to go and seal him outside. The dive is inside of you and it is not coming back out.',
  },
  X: {
    rule: 'Stalk the corner. He never crosses your face to the middle.',
    detail:
      'Same as the other side. Sprint, break down, mirror. If he tries to fold inside for the tackle, your body is the wall.',
  },
  L: {
    rule: 'Crack the first unblocked defender outside our tackle.',
    detail:
      'That is the man who crashes down the line. Come off the ball flat and downhill, get your helmet in FRONT of him, and turn him toward the sideline. Never block him in the back and never dive at his knees.',
  },
  R: {
    rule: 'Crack the first unblocked defender outside our tackle.',
    detail:
      'Same block, play side. You are stopping the crash before it starts — one step late and he is already in the hole.',
  },
  S: {
    rule: 'Dive — aim at the outside hip of the center.',
    detail:
      'Straight downhill, no rounding. Ball on your second step, both hands on it, shoulders square. Take whatever crease shows off the center\'s block and fall forward. Four yards every time is what makes the rest of this formation work.',
  },
  Q: {
    rule: 'Open, hand it, carry out the fake away.',
    detail:
      'Reverse-pivot, put the ball in his belly on his second step, and let it go. Then keep your empty hand on your hip and run three hard steps AWAY from the play with your eyes up. Everyone who bites on you is a man who is not tackling Super.',
  },
}

export const splitWideDive: Play = {
  id: 'split-wide-dive',
  name: 'Split Wide Dive',
  family: 'run',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'S',
  description:
    'The simplest play in the book. Super runs downhill at the outside hip of the center, the line blocks the man in front of them, and all four receivers keep the defense from crashing to the middle. Four yards, every snap, out of a formation that looks like a pass.',
  assignments: diveAssignments,
  vs: { '44': diveVs44, '43': diveVs43, '52': diveVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    '*** THE OPEN QUESTION FROM HANDOFF §10 — "all receivers stop the crash to the middle." *** This is the one sentence in the whole package that is not confirmed, and this whole play is built on a guess at it. Drafted as CRACK BLOCKS: the two slots (L and R) come down flat and block the first unblocked defender outside our tackle — the guy crashing down the line — and the two wide receivers (Y and X) stalk the corners so their run support cannot fold inside either. Read as: "nobody gets to the middle where the dive is." OTHER READINGS I did not draw, tell me if one of them is what you meant: (a) all four receivers RELEASE INSIDE and block the second level / safeties, which is more of a screen-blocking picture; (b) all four run vertical ROUTES to pull the defense out of the middle so it cannot crash — the opposite answer, blocking nobody; (c) only the two slots crack and the wide receivers run off; (d) "crash" means a specific stunt you see from a specific team, in which case tell me which defender and I will aim at him. Everything about this play except the dive itself changes depending on your answer.',
    HB_NOTE,
    FORMATION_NOTE,
    'Crack block safety: I wrote "helmet in FRONT of him, never in the back, never at his knees" into every crack assignment. At this level a crack block is the easiest way to draw a flag or hurt somebody. If you would rather these be stalk blocks in space than true cracks, that is a one-word change and it is worth making on purpose.',
    'Which gap? Drafted as the playside A gap — aiming point is the center\'s outside hip. "Standard dive" could also mean straight over the center or at the guard\'s outside hip (B gap). Confirm the aiming point; it changes who the center and both guards climb to.',
    'Vs the 5-2 the crack targets change on their own: the ends are the unblocked men there, so the slots crack the ENDS. Vs the 4-4 they crack the walked-up edge backers, and vs the 4-3 they crack the outside backers. The rule the kids learn stays one sentence — "first unblocked man outside our tackle" — and the picture solves itself per front. Confirm you like teaching it as a rule rather than as three memorized names.',
    'The quarterback\'s boot fake away is my addition, not yours. It costs nothing and it is what makes the same look sell the keeper and the screen. Cut it if you want the dive taught totally clean.',
    MIRROR_NOTE_PREFIX +
      'You never named a side for the dive, so it is drawn to the RIGHT to match the rest of the package. If the dive should be called with a direction like the runs in Red and Black, say so.',
  ],
}

// ===========================================================================
// PLAY 3 — SPLIT WIDE RT SCREEN  (motion, HB screen)
// ===========================================================================
//
// Super motions right and keeps going into the flat. The quarterback opens
// away, lets the right side of the rush come free, and throws it out to him
// behind the line with RG and RT out in front.
//
// The two deliberately UNBLOCKED rushers on the right are the screen: they run
// upfield past the quarterback and the ball goes out behind them. That is the
// play, and it is why the protection targets look one man short.

const SCREEN_S: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 2, y: -4.3 },
      { x: 4.5, y: -4 },
      { x: 6.5, y: -3.2 },
    ],
  },
  {
    kind: 'carry',
    path: [
      { x: 8, y: -2.2 },
      { x: 9.2, y: -0.8 },
      { x: 9.8, y: 2 },
      { x: 10, y: 6 },
    ],
  },
]

const SCREEN_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -1.2, y: -3.2 },
      { x: -2.4, y: -4.4 },
    ],
  },
  {
    kind: 'pitch',
    path: [
      { x: 1, y: -4.2 },
      { x: 4, y: -3.6 },
      { x: 5, y: -3.2 },
      { x: 7, y: -2.6 },
    ],
  },
]

/** RG: one count of pass set, then out flat to lead inside-up. */
const SCREEN_RG_RELEASE: Action = {
  kind: 'run',
  path: [
    { x: 1.8, y: -0.4 },
    { x: 3.5, y: -1.2 },
    { x: 5.5, y: -1 },
  ],
}

/** RT: one count of pass set, then out flat and up the alley. */
const SCREEN_RT_RELEASE: Action = {
  kind: 'run',
  path: [
    { x: 3.4, y: -0.5 },
    { x: 5.5, y: -1.4 },
    { x: 7.5, y: -1 },
  ],
}

/** X's clear-out: run the corner off instead of blocking him. */
const SCREEN_X_CLEAROUT: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 13, y: 6 },
      { x: 13.6, y: 12 },
    ],
  },
]

/** Y and L clear out away from the screen and take their coverage with them. */
const SCREEN_CLEAROUT = {
  Y: [
    {
      kind: 'route',
      path: [
        { x: -13, y: 6 },
        { x: -13.6, y: 12 },
      ],
    },
  ],
  L: [
    {
      kind: 'route',
      path: [
        { x: -8.5, y: 10 },
        { x: -4, y: 14 },
      ],
    },
  ],
} satisfies Partial<Record<OffPosId, Action[]>>

const SCREEN_SKILL = {
  S: SCREEN_S,
  Q: SCREEN_Q,
  ...SCREEN_CLEAROUT,
} satisfies Partial<Record<OffPosId, Action[]>>

/** Even-front protection: three men, four rushers, and E-R goes free on purpose. */
const SCREEN_EVEN_PRO = {
  LT: block('E-L'),
  LG: block('T-L'),
  C: block('T-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

const screenVs44: FrontPlan = {
  actions: {
    ...SCREEN_SKILL,
    ...SCREEN_EVEN_PRO,
    RG: [SCREEN_RG_RELEASE, ...block('B-R')],
    RT: [SCREEN_RT_RELEASE, ...block('S-R')],
    R: block('C-R'),
    X: SCREEN_X_CLEAROUT,
  },
  assignments: {
    RT: {
      rule: 'Set one count, release, and take the walked-up backer.',
      detail:
        'He is the first man outside on the edge and he is standing right in front of where you come out. Get to him under control and turn him inside — Super is running around your outside shoulder.',
    },
    R: {
      rule: 'Block the corner.',
      detail:
        'Vs a 4-4 we let X run off deep instead of blocking, so the corner is yours. Come off the ball like a route, break down, and stay on his outside number.',
    },
    X: {
      rule: 'Run him off — vertical, all the way.',
      detail:
        'A 4-4 keeps one man deep in the middle, and he is not blockable on a throw this fast. Instead of blocking, take the corner deep and out of the play. Sprint up the sideline and do not look back.',
    },
  },
}

const screenVs43: FrontPlan = {
  actions: {
    ...SCREEN_SKILL,
    ...SCREEN_EVEN_PRO,
    RG: [SCREEN_RG_RELEASE, ...block('M')],
    RT: [SCREEN_RT_RELEASE, ...block('F-R')],
    R: block('B-R'),
    X: block('C-R'),
  },
  assignments: {
    RG: {
      rule: 'Set one count, release, and take the Mike.',
      detail: 'He is the first man to read screen and run at it. He is the one who ruins this play — go find him.',
    },
    RT: {
      rule: 'Set one count, release, and take the safety on your side.',
      detail: 'A 4-3 plays two deep, so your man is the near safety coming down into the alley.',
    },
    R: {
      rule: 'Block the outside backer.',
      detail: 'He is closest to the catch. Get inside-out on him and wall him off from Super.',
    },
  },
}

const screenVs52: FrontPlan = {
  actions: {
    ...SCREEN_SKILL,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('N'),
    RG: [SCREEN_RG_RELEASE, ...block('B-R')],
    RT: [SCREEN_RT_RELEASE, ...block('F-R')],
    R: block('C-R'),
    X: SCREEN_X_CLEAROUT,
  },
  assignments: {
    C: {
      rule: 'Take the nose by yourself.',
      detail: 'Odd front — he is right on you and there is nobody to help. Punch, sit down, and keep him off the quarterback for two counts.',
    },
    R: {
      rule: 'Block the corner.',
      detail:
        'Vs a 5-2 we let X run off instead of blocking, so the corner is yours. Come off the ball under control, break down, and stay on his outside number.',
    },
    X: {
      rule: 'Run him off — vertical, all the way.',
      detail:
        'A 5-2 plays two deep and gives us one more blocker than we need in the alley, so your job is to take the corner OUT of the play instead of blocking him. Sprint straight up the sideline and do not look back.',
    },
  },
}

const screenAssignments: Record<OffPosId, Assignment> = {
  Y: {
    rule: 'Clear out — run straight up the field.',
    detail:
      'Nothing is coming to you and that is the point. Run hard for four seconds and take the corner and the deep help with you, away from the screen.',
  },
  LT: {
    rule: 'Pass set. Block the end.',
    detail:
      'Real pass set, real punch — you are selling a dropback. Kick-slide, hands inside, and keep him off the quarterback for two full counts.',
  },
  LG: {
    rule: 'Pass set. Block the man on you.',
    detail: 'Set inside-out and hold him. If he stunts inside, you go with him — the quarterback is stepping away from you.',
  },
  C: {
    rule: 'Pass set. Block the first man to your right; if a nose is on you, he is yours alone.',
    detail:
      'You are the last man protecting the middle. Two counts is all we need — the ball is out before the rush ever gets home.',
  },
  RG: {
    rule: 'Set one count, then release flat and lead inside-up.',
    detail:
      'Show him a pass set, let him beat you upfield — that is what we want — then get out into the flat and climb to the first backer chasing the screen. You are the inside blocker; get your head across him.',
  },
  RT: {
    rule: 'Set one count, then release flat and lead up the alley.',
    detail:
      'Same set, same release, but you go further and deeper than RG. You have the deep man who comes down to make the tackle. Run under control the last three steps so you do not run past him.',
  },
  X: {
    rule: '4-3: block the corner. 4-4 and 5-2: run him off deep.',
    detail:
      'Count the hats outside with you. If we already have enough blockers out there, the best thing you can do is take the corner deep and out of the play — sprint up the sideline. If we are a man short, you stalk him and stay on his outside number so everything spills back inside.',
  },
  L: {
    rule: 'Clear out — post across the middle.',
    detail:
      'Run the middle of the field empty. The safety who chases you is the safety who is not sitting in the alley waiting for Super.',
  },
  R: {
    rule: 'Block the first defender inside the corner.',
    detail:
      'You are the first block Super runs off of. Come off the ball like a route so nobody smells screen, then break down and take him. Inside-out — never let him cross your face to the sideline.',
  },
  S: {
    rule: 'Motion right, keep going to the flat, catch it, and get north.',
    detail:
      'Motion at three-quarter speed so you arrive on time, not early — stay behind the line the whole way. Turn your numbers to the quarterback at about 7 yards outside him and 2 yards behind the line and look the ball in. Catch it first, THEN look for your blockers: RG is your inside wall, RT is out front, R and X are ahead of you. Get up the sideline. Never bounce back inside — that is where the rush ended up.',
  },
  Q: {
    rule: 'Open away, sell the drop, let the right side come free, throw it flat.',
    detail:
      'Take a hard three-step drop opening AWAY from the screen and hold your eyes to the back side — you are lying to them for one full second. The end on the right is unblocked on purpose; let him run at you. Then turn and throw it out in front of Super, at his numbers, so he can catch it moving. Never throw it late and never throw it behind him.',
  },
}

export const splitWideHbScreen: Play = {
  id: 'split-wide-hb-screen',
  name: 'Split Wide Screen',
  family: 'pass',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'S',
  description:
    'Super motions right and keeps running to the flat. We let their right-side rush come free, the quarterback sells a drop the other way, and the ball goes out behind them to Super with both right-side linemen leading him up the sideline.',
  assignments: screenAssignments,
  vs: { '44': screenVs44, '43': screenVs43, '52': screenVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'WHICH SCREEN? "HB goes in motion, HB screen" has two honest readings and I drafted the first: (1) a TRUE SCREEN — Super motions past the tackle and out into the flat, we deliberately let the two right-side rushers come free upfield, and RG and RT release to lead him. (2) A QUICK/BUBBLE SCREEN — Super motions out to a slot and gets the ball immediately with only R and X blocking, no linemen out. Version 1 is a bigger play and teaches real screen timing; version 2 is far easier to get right in a week. Tell me which one and I will keep the other as a change-up or throw it away.',
    'THE UNBLOCKED MEN ARE THE PLAY. Vs the 4-4 and 4-3 the right end is unblocked on purpose; vs the 5-2 both the right tackle and the right end are. That is what makes a screen work, and it will look like a mistake on the diagram until a kid is told why. Confirm you are comfortable teaching "let him come" to 13-year-olds — if not, the answer is the bubble version, where nobody is intentionally free.',
    'The ball flight is drawn with the `pitch` action kind because the frozen schema has no `pass` kind (see docs/SEAM.md §2). It renders as the dotted ball-flight line, which reads correctly, but flag it if you want passes drawn differently across the whole book.',
    'Lead-blocker targets, and why: RG always turns back INSIDE and walls off the first pursuit defender over the ball (the backer in the 4-4 and 5-2, the Mike in the 4-3) — he is the man who reads screen fastest and he is the one who makes this a 2-yard play. RT goes further out and takes the first man on the edge (the walked-up backer in the 4-4, the near safety in the two-high 4-3 and 5-2). Then we count hats: vs the 4-4 and the 5-2 we have one more blocker out there than they have defenders, so R takes the corner and X RUNS HIM OFF deep instead of blocking; vs the 4-3 R takes the outside backer and X stalks the corner. Deliberately NOT drawn: a block on the deep middle safety in the 4-4 — a guard cannot get to a man 10 yards deep before the ball does, so the play is coached as "get the yards and get out of bounds." Confirm that trade.',
    'Motion speed: drafted at three-quarter speed so Super arrives at the catch point on time. If you want him at full speed like the keeper motion, the throw has to lead him further and the catch point moves 3 yards wider.',
    'Y and L clear out on every front. Confirm — the alternative is having L block the backside pursuit, but he is 8½ yards away from anything worth blocking and his route is what empties the middle.',
    MIRROR_NOTE_PREFIX +
      'One caution before mirroring this one: a left-handed quarterback throws this screen very differently, so mirror it for the picture, not for the technique.',
  ],
}

// ===========================================================================
// PLAY 4 — SPLIT WIDE CHIP  (curl / post / post / go, HB chips)
// ===========================================================================
//
// Your route call, left to right across the formation:
//   Y (wide left)  — 5 CURL
//   L (slot left)  — 7 POST
//   R (slot right) — 7 POST
//   X (wide right) — 9 GO
//
// Super chips the blindside end and leaks out as the outlet. Protection slides
// right (RAM), which is why the center's man is on the right side.

const CHIP_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0, y: -4 },
      { x: 0, y: -6 },
    ],
  },
]

/** Y — 5 curl. Route 5 off the tree, run from (−13, 0), inside = toward the ball. */
const CHIP_Y: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -13, y: 10 },
      { x: -11.4, y: 8.6 },
    ],
  },
]

/** L — 7 post from the left slot. */
const CHIP_L: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -8.5, y: 14 },
      { x: -2, y: 20 },
    ],
  },
]

/** R — 7 post from the right slot. */
const CHIP_R: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 8.5, y: 14 },
      { x: 2, y: 20 },
    ],
  },
]

/** X — 9 go/fade from wide right. */
const CHIP_X: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 13, y: 8 },
      { x: 14.4, y: 15 },
      { x: 15, y: 23 },
    ],
  },
]

const CHIP_ROUTES = { Y: CHIP_Y, L: CHIP_L, R: CHIP_R, X: CHIP_X } satisfies Partial<
  Record<OffPosId, Action[]>
>

/** Super: punch the blindside end, then leak to the left flat as the outlet. */
const CHIP_S_RELEASE: Action[] = [
  { kind: 'block', targetId: 'E-L' },
  {
    kind: 'route',
    path: [
      { x: -6.5, y: -1.5 },
      { x: -8.5, y: 0.5 },
      { x: -9, y: 2 },
    ],
  },
]

const CHIP_EVEN_LINE = {
  LT: block('E-L'),
  LG: block('T-L'),
  RG: block('T-R'),
  RT: block('E-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

const chipVs44: FrontPlan = {
  actions: {
    ...CHIP_ROUTES,
    Q: CHIP_Q,
    ...CHIP_EVEN_LINE,
    C: block('B-R'),
    S: CHIP_S_RELEASE,
  },
  assignments: {
    C: {
      rule: 'Ram — slide right. Your man is the backer in the right A gap.',
      detail:
        'Nobody is on your nose, so on the slide your gap is the A gap to your right. The 4-4 backer stacked there is the one who blitzes it. Snap, get your eyes on him, and if he does not come, help RG.',
    },
  },
}

const chipVs43: FrontPlan = {
  actions: {
    ...CHIP_ROUTES,
    Q: CHIP_Q,
    ...CHIP_EVEN_LINE,
    C: block('M'),
    S: CHIP_S_RELEASE,
  },
  assignments: {
    C: {
      rule: 'Ram — slide right. Your man is the Mike.',
      detail:
        'The Mike is straight over you and he is the only man who can get into the A gap. Take him if he comes; help RG if he does not.',
    },
  },
}

const chipVs52: FrontPlan = {
  actions: {
    ...CHIP_ROUTES,
    Q: CHIP_Q,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('N'),
    RG: block('T-R'),
    RT: block('E-R'),
    S: block('E-L'),
  },
  assignments: {
    C: {
      rule: 'The nose is yours, alone.',
      detail: 'Odd front, five rushers, nobody to help you. Punch him, get your feet under you, and do not get pushed back into the quarterback.',
    },
    LG: {
      rule: 'Block the man on our tackle.',
      detail:
        'In a 5-2 their tackles line up on our tackles, so you take a short set to your outside and pick him up — LT has the end. If nobody shows, look inside for the nose.',
    },
    RG: {
      rule: 'Block the man on our tackle.',
      detail: 'Same rule as LG, other side. Short outside set, hands inside, ride him past the quarterback.',
    },
    S: {
      rule: 'No free release — stay in and help LT on the end.',
      detail:
        'A 5-2 rushes five and we only have five linemen, so you are the sixth man and you do not leave. Double the blindside end with LT. If he drops into coverage, THEN you leak out to the flat.',
    },
  },
}

const chipAssignments: Record<OffPosId, Assignment> = {
  Y: {
    rule: '5 — Curl.',
    detail:
      'Ten yards up the field, sell that you are going deep, then curl back inside toward the quarterback and find the open grass. You are the outlet on the back side — sit down and give him a target.',
  },
  LT: {
    rule: 'Pass set. You have the end — and Super is chipping him.',
    detail:
      'Kick-slide, hands inside, keep your feet moving. Super punches him first, so expect the end to be knocked off balance — finish him.',
  },
  LG: {
    rule: 'Ram — slide right. Block the man in your gap.',
    detail: 'Set with the slide. Whoever shows in the gap to your right is yours; do not chase a man who goes away from you.',
  },
  C: {
    rule: 'Ram — slide right. Covered: the nose is yours. Uncovered: the A gap to your right.',
    detail:
      'Ram means the whole line slides right. If there is a nose on you, forget the slide — he is yours by yourself. If not, take whoever comes into the right A gap and help the guard when nobody does.',
  },
  RG: {
    rule: 'Ram — slide right. Block the man on you.',
    detail: 'Take the man over you and ride him past the quarterback. Hands inside, never reach.',
  },
  RT: {
    rule: 'Pass set. Block the end.',
    detail: 'You are the edge on the throwing side. Kick-slide and force him to run the long way around — that is all a tackle owes on a five-step drop.',
  },
  X: {
    rule: '9 — Go.',
    detail:
      'Straight up the field, leaning toward the sideline. Run past him and go get the ball over your outside shoulder. Even when it does not come, your man cannot help on the posts.',
  },
  L: {
    rule: '7 — Post.',
    detail:
      'Stem at the corner for fifteen, then break inside on an angle at the goal post and keep running. You and R are running the same route from both sides — one of you will be behind the safety.',
  },
  R: {
    rule: '7 — Post.',
    detail:
      'Same route as L, other side. Fifteen and break in. With the Go clearing outside of you, the room is over the middle — go take it.',
  },
  S: {
    rule: 'Chip the blindside end, then leak to the flat. Odd front: stay in.',
    detail:
      'Set your feet, punch the end on the quarterback\'s blind side with both hands, and knock him off his track — one hit, not a wrestling match. Then slide out into the flat, turn around, and be there. You are the answer when nothing downfield is open. If they rush five, you never leave.',
  },
  Q: {
    rule: 'Five-step drop. Posts first, then the outlet.',
    detail:
      'Big five-step drop and get your eyes to the middle of the field. Two safeties — take the post away from the deep help. One safety — hit the other post behind him. If the middle is closed, come off it fast: the curl on the back side, then Super in the flat. Never hold it for a fourth count.',
  },
}

export const splitWideChip: Play = {
  id: 'split-wide-chip',
  name: 'Split Wide Chip',
  family: 'pass',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'Q',
  description:
    'Four receivers, four routes, left to right: curl, post, post, go. Super stays in, punches the blindside end, then leaks to the flat as the outlet. Two posts from both slots is the play — one of them comes open the second the safeties pick a side.',
  assignments: chipAssignments,
  vs: { '44': chipVs44, '43': chipVs43, '52': chipVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'ROUTE ASSIGNMENT, left to right across the formation exactly as you said it: Y (wide left) CURL, L (left slot) POST, R (right slot) POST, X (wide right) GO. Confirm "left to right" means across the formation from the offense\'s point of view and not from the sideline, because from the sideline it reverses and the Go ends up on the left.',
    'We have no "Go" in the route tree — the tree (varsity p14) numbers 9 as FADE. Drafted as the 9, run straight up the field leaning to the sideline. If "go" to you means a pure vertical with no lean, that is a different route and it may be worth adding to the tree.',
    'WHO DOES SUPER CHIP? Drafted as the end on the quarterback\'s BLIND SIDE — the left end for a right-handed quarterback — because that is the free runner a five-step drop cannot see coming. He punches him, then leaks to the LEFT flat as the outlet. Alternatives if you meant something else: chip the play-side end (the Go side), or chip whoever the coach calls in the huddle. Also confirm the outlet side — a checkdown into the flat on the same side he chipped is the natural release, but it puts him away from three of the four routes.',
    'THE TWO POSTS RUN INTO EACH OTHER. Drawn straight off the tree, both posts break at 15 yards and finish 2 yards either side of the goal post — that is two of our receivers and one safety in the same window, and it shows up plainly on the diagram. Real options: (a) leave it, and coach the quarterback to throw the one away from the safety; (b) make the back-side one a SKINNY post that stays outside the hash; (c) stagger the depths, 12 and 18, so they are never at the same level. I drafted (a) because it is literally what you called, but (b) or (c) is probably what you want on the field.',
    'Vs the 5-2 Super does NOT release — five rushers against five linemen means he is the sixth man and he stays in with LT. That is the one front where this play only has four men out. Confirm, or tell me you would rather keep all four routes and let a lineman handle it alone.',
    'Protection is drawn as RAM (slide right) so the language matches varsity p15 and the pass-pro page. That is why the center\'s arrow points to the right A-gap man rather than straight ahead. If you would rather this be straight man protection, say so and the center\'s picture changes on all three fronts.',
    'No ball flight is drawn on this one because the throw depends on what the safeties do — the diagram shows four routes and a progression written in the quarterback\'s assignment instead. Tell me if you want an arrow to a primary receiver on the picture.',
    'No readKey is set on any of these four plays — none of them is an option and nobody is reading a defender. Say so if you want the chip to carry a formal safety read.',
    MIRROR_NOTE_PREFIX +
      'This one is the least worth mirroring: flipping it puts the Go on the left and the curl on the right, which is a different concept, not the same play the other way. If you want a left-handed version, tell me the route order you want and I will author it fresh.',
  ],
}

export const splitWidePlays: Play[] = [
  splitWideKeeperRight,
  splitWideDive,
  splitWideHbScreen,
  splitWideChip,
]
