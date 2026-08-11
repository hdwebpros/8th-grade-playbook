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
 *   4. "HB chip blocks; receivers left→right run in, post, post, go"
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
  Pt,
} from '../../types/football'
import { splitWide } from '../split-wide-formation'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

/**
 * THE SETTLE SPOT — (10.75, −1), dead between R (+8.5) and X (+13), at the
 * slots' own depth a yard off the ball.
 *
 * Per Coach Ryan: on BOTH the keep and the screen, Super motions out and STOPS
 * there. He gets set, turns his numbers to the quarterback, and puts his hands
 * up like the ball is coming. The two plays are the same picture until the
 * quarterback decides, which is the whole point — the motion and the settle are
 * what pull the backers off the line, and the keeper runs behind that.
 */
const SETTLE: Pt = { x: 10.75, y: -1 }

/** Super's motion out to the settle spot. Identical on the keep and the screen. */
const SETTLE_MOTION: Action = {
  kind: 'motion',
  path: [
    { x: 2.5, y: -4.5 },
    { x: 6, y: -4 },
    { x: 9, y: -2.5 },
    SETTLE,
  ],
}

/** Getting set: one short step back to the quarterback, hands up, selling it. */
const SETTLE_SHOW: Pt[] = [
  { x: 10.5, y: -1.3 },
  { x: 10.2, y: -1.6 },
]

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
// The picture: Super motions out to the right and STOPS between R and X, gets
// set, and shows his hands like the screen is coming. The quarterback sends him
// out, WAITS for him to get set, and reads the front while the backers widen
// and drift off the line. Then he shows the screen for one step and goes
// downhill through the B gap between RG and RT, behind everybody who just
// chased the picture.
//
// The screen and this play are the same look. Super settling out there is a
// decoy on this one and a live receiver on the other, and the quarterback's
// pre-snap read is what picks. If the settle draws a blitz instead of a drift,
// the quarterback audibles (see reviewNotes — the call is not built yet).
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

const KEEP_S: Action[] = [SETTLE_MOTION, { kind: 'fake', path: SETTLE_SHOW }]

const KEEP_Q: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 1.4, y: -2.5 },
      { x: 1.7, y: -2.3 },
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
    L: block('O-L'),
    R: block('O-R'),
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
    rule: 'Motion out between R and X. STOP. Get set. Hands up, eyes on the quarterback.',
    detail:
      'On the quarterback\'s call, run out behind the line and stop between R and X — not past X, not next to R, right in the middle of them. Get your feet set and stay set for a full count; if you are still moving at the snap on this play we get a flag. Then turn your numbers to the quarterback, put your hands up, and stare at him like the ball is coming right now. You are not getting it. Your whole job is that the linebackers believe you are, and every step they take out toward you is a step away from where the quarterback is running.',
  },
  Q: {
    rule: 'Send Super out. Wait for him to get set. Read them. Then screen fake and run the B gap.',
    detail:
      'Call Super in motion and then WAIT — do not rush the snap. He has to be stopped and set out there before you go. While you wait, look at their linebackers. If they widen or back off the line toward Super, that is exactly what we want and you snap it. If they walk up and show blitz, do not snap it — check us into something else (ask me for the call). After the snap: take one hard step right and show the screen with your eyes and the ball, then get your shoulders square and run downhill in the gap between RG and RT. This is a keeper, not a read — the ball is yours before the snap. Do not bounce it outside. Take the few yards that are there and get down — this play is worth three or four every time because their line is standing there waiting for the screen. It is not a play we are trying to break; it is a play we are trying to CASH.',
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
    'Super motions out between R and X, gets set, and shows his hands like the screen is coming. The quarterback waits for him to set, reads the linebackers, and then runs downhill in the B gap between the right guard and the right tackle — behind everybody the screen picture just pulled off the line. This is a few-yards play, not a home run: we run it AFTER the screen, when their defensive line has seen that picture once and relaxes on it, and the quarterback rams it up in there for what is sitting in front of him.',
  assignments: keepAssignments,
  vs: { '44': keepVs44, '43': keepVs43, '52': keepVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'RESOLVED, per your call: Super MOTIONS OUT AND SETTLES between R and X — he does not run a sweep track and he does not lead block. He gets set at (10.75, −1), dead between the two of them and level with the slots, turns to the quarterback and shows his hands to sell the screen. Same settle spot and the same motion path as Split Wide Screen, on purpose: the two plays are one picture until the quarterback decides.',
    'SET, NOT MOVING. Because he stops and gets set instead of staying in motion, he must be SET FOR A FULL SECOND before the snap or it is illegal motion — that is a real flag at this level and it is the opposite of the timing rule on every other motion in our book, where the kid has to still be moving. Confirm you want to teach the two different rules, or tell me to drift him slowly instead of stopping dead and the flag risk goes away.',
    'THE PRE-SNAP READ IS THE PLAY. Written into the quarterback\'s assignment: send Super, WAIT for him to set, watch the backers. Drift/widen → snap it. Blitz → check out of it. That means this play now depends on an audible that does not exist yet, and until it does, the quarterback\'s only real answer to a blitz look is a timeout or running it anyway. FLAGGED FOR THE NEXT ROUND: the audible builder (app/pages/audible.vue) is digits-and-routes today, so "check to the screen" is not something it can express. Tell me when you want to build that and what the word is that the kids hear.',
    'PER COACH RYAN — WHAT THIS PLAY IS FOR: "used to get just a few yards, D-line relaxes thinking it\'s a screen again, QB rams a few." That is now written into the description and into the quarterback\'s detail as "cash it, do not try to break it." Two consequences worth naming: (1) this play is a SEQUENCE play — it is worth much less on the first snap of a game than it is after they have seen the screen, so it belongs on the call sheet as a follow-up, not an opener; (2) it means the "nobody blocks the deep safety" note below is not a problem at all, because we are not asking this play to go the distance. Tell me if you want the call sheet / practice script to carry that ordering explicitly.',
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
    L: block('O-L'),
    R: block('O-R'),
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
// Super motions out and SETTLES between R and X — the exact same motion and the
// exact same settle spot as Split Wide Keep, so the two plays are one picture
// until the ball leaves. He stands there with his hands up; on the keep it is a
// lie and on this one it is true. The quarterback opens away, lets the right
// side of the rush come free, and throws it out to him behind the line with RG
// and RT leading.
//
// The two deliberately UNBLOCKED rushers on the right are the screen: they run
// upfield past the quarterback and the ball goes out behind them. That is the
// play, and it is why the protection targets look one man short.

const SCREEN_S: Action[] = [
  SETTLE_MOTION,
  {
    kind: 'carry',
    path: [
      ...SETTLE_SHOW,
      { x: 10.8, y: 1 },
      { x: 11.4, y: 5 },
      { x: 11.8, y: 9 },
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
      { x: 4, y: -3.4 },
      { x: 7, y: -2.4 },
      { x: 10.2, y: -1.6 },
    ],
  },
]

/** RG: one count of pass set, then out flat to lead inside-up. */
const SCREEN_RG_RELEASE: Action = {
  kind: 'run',
  path: [
    { x: 1.8, y: -0.4 },
    { x: 4, y: -1.2 },
    { x: 7, y: -1 },
  ],
}

/** RT: one count of pass set, then out flat and up the alley ahead of the catch. */
const SCREEN_RT_RELEASE: Action = {
  kind: 'run',
  path: [
    { x: 3.4, y: -0.5 },
    { x: 6.5, y: -1.4 },
    { x: 9.8, y: -1 },
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
    RT: [SCREEN_RT_RELEASE, ...block('O-R')],
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
      'Super is catching it just outside of you, so you are the block he runs off of. Come off the ball like a route so nobody smells screen, then break down and take him. Inside-out — never let him cross your face to the sideline.',
  },
  S: {
    rule: 'Motion out between R and X. STOP. Get set, hands up — then catch it and get north.',
    detail:
      'Exactly the same trip you take on the keep: out behind the line, stop between R and X, feet set, numbers to the quarterback, hands up. Set for a full count before the snap. Stand still and let it come to you — do not drift toward him and do not start upfield until you have caught it. Look the ball all the way in, THEN find your blockers: RG is your inside wall, RT is out in front of you, R is inside you and X is downfield. Get up the sideline. Never bounce back inside — that is where the rush ended up.',
  },
  Q: {
    rule: 'Send him out, wait for him to set, open away, let the right side come free, throw it flat.',
    detail:
      'Same start as the keep — call Super out, WAIT for him to be stopped and set, and look at their linebackers while you wait. Then snap it, take a hard three-step drop opening AWAY from the screen, and hold your eyes to the back side for one full count. The end on the right is unblocked on purpose; let him run at you. Then turn and throw it at Super\'s numbers while he is standing still — this is a short, flat, hard throw behind the line. Never throw it late and never throw it behind him. Against a team that blitzes, the ball MUST be out on time — the second you feel extra men coming, that is the snap this play was built for, and holding it one extra beat is the only way to lose it.',
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
    'Super motions out and settles between R and X with his hands up — the same picture as the keep. We let their right-side rush come free, the quarterback sells a drop the other way, and the ball goes out behind them to Super standing still, with both right-side linemen leading him up the sideline. This is our answer to a team that blitzes: the more men they send, the fewer are left out there with Super. The ball has to come out quick — that is the whole play — and it puts Super in space.',
  assignments: screenAssignments,
  vs: { '44': screenVs44, '43': screenVs43, '52': screenVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'WHICH SCREEN? "HB goes in motion, HB screen" has two honest readings and I drafted the first: (1) a TRUE SCREEN — Super motions past the tackle and out into the flat, we deliberately let the two right-side rushers come free upfield, and RG and RT release to lead him. (2) A QUICK/BUBBLE SCREEN — Super motions out to a slot and gets the ball immediately with only R and X blocking, no linemen out. Version 1 is a bigger play and teaches real screen timing; version 2 is far easier to get right in a week. Tell me which one and I will keep the other as a change-up or throw it away.',
    'THE UNBLOCKED MEN ARE THE PLAY. Vs the 4-4 and 4-3 the right end is unblocked on purpose; vs the 5-2 both the right tackle and the right end are. That is what makes a screen work, and it will look like a mistake on the diagram until a kid is told why. Confirm you are comfortable teaching "let him come" to 13-year-olds — if not, the answer is the bubble version, where nobody is intentionally free.',
    'The ball flight is drawn with the `pitch` action kind because the frozen schema has no `pass` kind (see docs/SEAM.md §2). It renders as the dotted ball-flight line, which reads correctly, but flag it if you want passes drawn differently across the whole book.',
    'THE PAIR: this play and Split Wide Keep are now deliberately the same pre-snap picture and the same first second — Super out and set between R and X, quarterback waiting and reading. That is the point of both, and it is also the setup for checking between them at the line, which we have not built yet (see the keep\'s notes).',
    'Lead-blocker targets, and why: RG always turns back INSIDE and walls off the first pursuit defender over the ball (the backer in the 4-4 and 5-2, the Mike in the 4-3) — he is the man who reads screen fastest and he is the one who makes this a 2-yard play. RT goes further out and takes the first man on the edge (the walked-up backer in the 4-4, the near safety in the two-high 4-3 and 5-2). Then we count hats: vs the 4-4 and the 5-2 we have one more blocker out there than they have defenders, so R takes the corner and X RUNS HIM OFF deep instead of blocking; vs the 4-3 R takes the outside backer and X stalks the corner. Deliberately NOT drawn: a block on the deep middle safety in the 4-4 — a guard cannot get to a man 10 yards deep before the ball does, so the play is coached as "get the yards and get out of bounds." Confirm that trade.',
    'THE SETTLE, per your call: Super motions out and STOPS between R and X at (10.75, −1) — same motion path, same spot, same hands-up look as Split Wide Keep, and the code literally shares the constants so the two diagrams can never drift apart. That moved the catch point about 4 yards wider than it was drafted, so three things moved with it: RT now releases all the way out to 9.8 to be in front of the catch, RG out to 7 as the inside wall, and the throw is now a flat, standing catch instead of a lead throw to a moving man. Because he is standing still, this is an easier throw and an easier catch than the drafted version — and a slower one, so RG and RT have to be moving on their release or they will not be there in time.',
    'HE IS SET, WHICH MEANS HE IS NOT MOVING AT THE SNAP. Same rule note as on the keep: a man who motions and stops must be set a full second before the snap. On this play that is also a timing tax — the quarterback cannot snap it the instant Super arrives, so the defense gets an extra beat to look at him standing out there. Worth confirming: if the linebackers start jumping the screen because it is telegraphed, the answer is the keep, which is exactly why the two share a picture.',
    'PER COACH RYAN — WHAT THIS PLAY IS FOR: "works for blitzing teams, ball must get out quick, gets the Super in space." Now in the description and in the quarterback\'s detail. This also answers the timing worry two notes up from a different direction: against a blitzing team the extra beat Super spends standing there is bought back, because the men who would be looking at him are running at the quarterback instead. It also sharpens the choice between the two screen versions in the note above — if the trigger for this call is BLITZ, the quick/bubble version gets the ball out faster than the true screen does, and speed is the thing you just said matters most. Worth a decision.',
    'Y and L clear out on every front. Confirm — the alternative is having L block the backside pursuit, but he is 8½ yards away from anything worth blocking and his route is what empties the middle.',
    MIRROR_NOTE_PREFIX +
      'One caution before mirroring this one: a left-handed quarterback throws this screen very differently, so mirror it for the picture, not for the technique.',
  ],
}

// ===========================================================================
// PLAY 4 — SPLIT WIDE CHIP  (in / post / post / go, HB chips)
// ===========================================================================
//
// Your route call, left to right across the formation:
//   Y (wide left)  — 10-YARD IN
//   L (slot left)  — 7 POST
//   R (slot right) — 7 POST
//   X (wide right) — 9 GO
//
// Super never releases. He drops with the quarterback, settles on his blind-side
// hip, scans the line, and blocks whoever gets through — no named target on any
// front, because his man is whoever comes free. Protection slides right (RAM),
// which is why the center's man is on the right side.

const CHIP_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0, y: -4 },
      { x: 0, y: -6 },
    ],
  },
]

/**
 * Y — 10-yard IN (dig). Not off the tree: varsity p14 has no in-breaking route
 * at ten, so this is drafted — ten yards straight up from (−13, 0), then snap
 * it off square and run flat across the field toward the ball.
 */
const CHIP_Y: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -13, y: 10 },
      { x: -5.5, y: 10.5 },
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

/**
 * Super: no chip, no release. He drops with the quarterback, settles on his
 * blind-side hip at the depth of the drop, and scans the line for anyone who
 * gets through. The arrow is a short block-capped path to that spot and it ends
 * there on purpose — where he goes next is whoever comes free, which is a
 * different man on every snap and cannot be drawn.
 */
const CHIP_S_SCAN: Action[] = [
  {
    kind: 'block',
    path: [
      { x: -0.8, y: -5.1 },
      { x: -1.3, y: -5.9 },
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
    // The double team, not the backer: two hats converging on T-R is the combo
    // picture, and it keeps the center's line from running upfield. Per Ryan.
    C: block('T-R'),
    S: CHIP_S_SCAN,
  },
  assignments: {
    C: {
      rule: 'Ram — slide right. Stay home. Double with RG until the A-gap backer comes.',
      detail:
        'Nobody is on your nose, so do not chase anybody upfield — sit back and stay square. Get your hands on RG\'s man and help him double it, and keep your eyes on the 4-4 backer stacked in the right A gap, because he is the one who blitzes it. If he comes, come off the double and take him by yourself. If he never comes, you finish the snap on the double.',
    },
  },
}

const chipVs43: FrontPlan = {
  actions: {
    ...CHIP_ROUTES,
    Q: CHIP_Q,
    ...CHIP_EVEN_LINE,
    // Same combo picture as the 4-4. The Mike is 4½ yards deep and the center
    // does not go get him — he doubles until the Mike declares. Per Ryan.
    C: block('T-R'),
    S: CHIP_S_SCAN,
  },
  assignments: {
    C: {
      rule: 'Ram — slide right. Stay home. The Mike is yours if he comes, RG\'s man if he does not.',
      detail:
        'The Mike is straight over you and he is the only man who can get into the A gap — but he is four yards deep, so do not go get him. Sit back off the ball, put your hands on RG\'s man and double it, and watch the Mike the whole time. He blitzes, you leave the double and take him. He drops, you never leave the double.',
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
    S: CHIP_S_SCAN,
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
      rule: 'Same job, and vs this front somebody IS coming.',
      detail:
        'Five rushers against five linemen means the extra man is yours every snap in a 5-2. Stay on the quarterback\'s hip and find him — most often it is the blindside end beating LT or a backer running through the middle. You are the sixth blocker and you do not leave, ever, on this front.',
    },
  },
}

const chipAssignments: Record<OffPosId, Assignment> = {
  Y: {
    rule: 'IN — ten yards, then break flat across.',
    detail:
      'Ten yards straight up the field, sell that you are going deep, then plant your outside foot and break FLAT inside — square, not drifting back and not drifting deeper. Keep running across the field and keep your eyes on the quarterback the whole way. Super is staying in to block, so you are the ONLY outlet on this play — you are running to open grass behind the linebackers, so do not stop until the ball is out.',
  },
  LT: {
    rule: 'Pass set. The end is yours.',
    detail:
      'Kick-slide, hands inside, keep your feet moving. Nobody is chipping him for you — but Super is standing behind your inside shoulder scanning, so if the end crosses your face, Super is there. Force him to run the long way around.',
  },
  LG: {
    rule: 'Ram — slide right. Block the man in your gap.',
    detail: 'Set with the slide. Whoever shows in the gap to your right is yours; do not chase a man who goes away from you.',
  },
  C: {
    rule: 'Ram — slide right. Never go upfield. Covered: the nose is yours. Uncovered: sit back, double, and look for the blitz.',
    detail:
      'Ram means the whole line slides right. YOU DO NOT GO UPFIELD ON THIS PLAY — not one step, ever. This is a five-step drop and your job is behind the line, not in front of it. If there is a nose on you, forget the slide — he is yours by yourself. If nobody is on you, sit back off the ball with your feet under you and your eyes inside: put your hands on the guard\'s man and help him double it, and keep looking for a backer running the A gap. The second a blitzer shows, leave the double and take him. You are the man who cleans up whatever the slide does not cover.',
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
    rule: 'Stay on the quarterback\'s hip. Scan the line. Block anyone who gets through.',
    detail:
      'You do not have one man and you never leave. Drop with the quarterback, settle on his blind-side hip about a yard off him, feet under you, and look at the line — not downfield. Start your eyes inside and work out. Whoever comes free, you take: step to him, hands inside, and put him on the ground or on his back foot. If nobody comes through, you stand right there until the ball is gone. The snap you leave early is the snap the quarterback gets hit.',
  },
  Q: {
    rule: 'Five-step drop. Posts first, then the in.',
    detail:
      'Big five-step drop and get your eyes to the middle of the field. Two safeties — take the post away from the deep help. One safety — hit the other post behind him. If the middle is closed, come off it fast to Y running the in underneath. He is moving, so throw him open out in front of him — never behind. There is no checkdown on this play — Super is blocking — so if the in is not there, throw it away or run. Never hold it for a fourth count.',
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
    'Four receivers, four routes, left to right: in, post, post, go. Super never leaves — he sits on the quarterback\'s hip, scans the line, and blocks whoever gets through. Two posts from both slots is the play, and Y\'s ten-yard in is the outlet when the middle is closed.',
  assignments: chipAssignments,
  vs: { '44': chipVs44, '43': chipVs43, '52': chipVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'ROUTE ASSIGNMENT, left to right across the formation exactly as you said it: Y (wide left) 10-YARD IN, L (left slot) POST, R (right slot) POST, X (wide right) GO. Confirm "left to right" means across the formation from the offense\'s point of view and not from the sideline, because from the sideline it reverses and the Go ends up on the left.',
    'Y\'S ROUTE IS NOW A 10-YARD IN, per your change — it was the 5 (curl). THE TREE HAS NO IN. Varsity p14 runs 0 block, 1 slant, 2 speed out, 3 hitch, 4 wheel, 5 curl, 6 comeback, 7 post, 8 corner, 9 fade — nothing that breaks flat inside at ten, so this route is drafted rather than traced and it has NO NUMBER. That means it cannot be called in the audible system, which is digits only. Two ways out: (a) give it a number and add it to app/data/routes.ts so it can be called like everything else — but every free digit is taken, so it would mean renumbering something; or (b) leave it as a route that only exists inside this play and is called by name. I drafted (b). Tell me which you want. Also confirm the DEPTH — you said ten yards, which is one yard past the tree\'s curl; against a 44 that puts him right in the linebackers\' drop, and twelve would put him behind them.',
    'Y IS DRAWN BREAKING FLAT AND RUNNING, not squaring up and sitting. That is the difference between an in and a curl and it matters for the quarterback: an in is a moving target thrown out in front, a curl is a spot. If what you actually want is "get to ten, break in, and sit down in the hole," say so — that is a dig-and-settle and the picture and the coaching words both change.',
    'We have no "Go" in the route tree — the tree (varsity p14) numbers 9 as FADE. Drafted as the 9, run straight up the field leaning to the sideline. If "go" to you means a pure vertical with no lean, that is a different route and it may be worth adding to the tree.',
    'SUPER IS A SCAN BLOCKER — per your correction, "chip" here means BLOCK ANYONE WHO GETS THROUGH, not punch-and-release. He is no longer aimed at a named defender on any front, which is the one place in the whole book where a blocker has no target, and that is on purpose: his man is whoever comes free, and that is a different man every snap. His arrow is a short line to the quarterback\'s blind-side hip at the depth of the drop, capped with the block bar and ending there — the picture says "this is where you stand and block," not "this is where you run." Two things to confirm: (1) WHICH HIP — drafted on the BLIND side (left, for a right-handed quarterback) since that is the runner the drop cannot see, but if you would rather he set on the throwing side or simply "behind the quarterback, square," say which and I will move the dot; (2) he is now purely a blocker on all three fronts, so this play releases FOUR receivers and has no checkdown. Y\'s in carries the whole outlet job by itself.',
    'THE TWO POSTS RUN INTO EACH OTHER. Drawn straight off the tree, both posts break at 15 yards and finish 2 yards either side of the goal post — that is two of our receivers and one safety in the same window, and it shows up plainly on the diagram. Real options: (a) leave it, and coach the quarterback to throw the one away from the safety; (b) make the back-side one a SKINNY post that stays outside the hash; (c) stagger the depths, 12 and 18, so they are never at the same level. I drafted (a) because it is literally what you called, but (b) or (c) is probably what you want on the field.',
    'PER COACH RYAN — THE CENTER: "the C can\'t go upfield, he sits back and helps double team or pick up a blitz." Rewritten on all three fronts. The base rule now leads with NEVER GO UPFIELD and makes his default job the double team with RG, with the blitz pickup as the thing that pulls him off it — that is a real change of emphasis from the draft, which had him aimed at a named backer first and helping "if he does not come." Vs the 5-2 he is untouched: there is a nose on him and he has no one to help, which is the one front where your rule cannot apply. THE DIAGRAM IS FIXED TOO: his arrow used to run UPFIELD — 4 yards to the stacked backer vs the 4-4, 4½ yards to the Mike vs the 4-3 — which is exactly the picture you said is wrong. On both even fronts it now points at T-R, the same man RG is blocking, so the center and the guard converge on one defender. Two hats on one man is the standard combo picture and it reads as "double team" without any new symbol on the field. It also stays behind the line, which is the whole point. What the diagram now does NOT show is the conditional — "leave the double when the backer comes" lives only in the words, which is normal (no playbook draws an if/then), but say the word if you want a second, lighter line out to the blitzer and I will add one.',
    'Vs the 5-2 the scan rule solves itself — five rushers against five linemen means the extra man is Super\'s every single snap, so his assignment text on that front tells him to expect somebody rather than to look for somebody. Same picture, same arrow, all three fronts; only the coaching words change.',
    'Protection is drawn as RAM (slide right) so the language matches varsity p15 and the pass-pro page. That is why the center\'s arrow points to the right A-gap man rather than straight ahead. If you would rather this be straight man protection, say so and the center\'s picture changes on all three fronts.',
    'No ball flight is drawn on this one because the throw depends on what the safeties do — the diagram shows four routes and a progression written in the quarterback\'s assignment instead. Tell me if you want an arrow to a primary receiver on the picture.',
    'No readKey is set on any of these four plays — none of them is an option and nobody is reading a defender. Say so if you want the chip to carry a formal safety read.',
    MIRROR_NOTE_PREFIX +
      'This one is the least worth mirroring: flipping it puts the Go on the left and the in on the right, which is a different concept, not the same play the other way. If you want a left-handed version, tell me the route order you want and I will author it fresh.',
  ],
}

export const splitWidePlays: Play[] = [
  splitWideKeeperRight,
  splitWideDive,
  splitWideHbScreen,
  splitWideChip,
]
