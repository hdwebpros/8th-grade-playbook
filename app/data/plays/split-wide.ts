/**
 * SPLIT WIDE — the four plays Coach Ryan invented. These exist in NO playbook.
 * Every one of them is a DRAFT written from one sentence of his, and every one
 * is behind the hard review gate in HANDOFF.md §10.
 *
 * Ryan's words, verbatim, and what each became:
 *   1. "a play where the halfback goes in motion to the right, and it's a QB
 *      keeper over the right guard B gap"          → splitWideKeeperRight /
 *                                                    splitWideKeeperLeft
 *   2. "standard hb dive, all receivers stop the crash to the middle"
 *                                                   → splitWideDiveRight / -Left
 *   3. "HB goes in motion, HB screen"               → splitWideScreenRight / -Left
 *   4. "HB chip blocks; receivers left→right run in, post, post, go"
 *                                                   → splitWideVictory
 *      REWRITTEN 2026-09-09: "Routes should be LTR 7, 1, 1, 9 … a play-fake
 *      to the Super who then blocks or picks up the blitz. QB has to release
 *      it within 3 seconds." Victory is now play-action off the Dive.
 *      SIDENOTE same day: "QB tells Super what side to fake on, try to
 *      guess blitz side." The fake side is the quarterback's call.
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
 *
 * DIRECTION (Coach Ryan, 2026-08-14, extended to the KEEP on 2026-08-18): the
 * DIVE, the SCREEN and the KEEP are all called with a direction like the runs
 * in Red and Black — each ships as a left/right pair linked by `audibleFlipId`
 * (Indy = left, Hoosier = right at the line). Split Wide is one balanced
 * formation, so there is no `formationTwinId` — 1×2 pairs, not 2×2 squares.
 * Only Victory stays one-way, per the same ruling.
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
import { mirrorPlay } from '../../utils/mirror'
import { splitWide } from '../split-wide-formation'

/**
 * WHY SPLIT WIDE NEEDS ITS OWN MIRROR — the X/Y problem.
 *
 * `mirrorPlay` swaps the side-NAMED ids (LT↔RT, LG↔RG, L↔R, defender -L/-R)
 * and negates every x, but it leaves entries keyed `X` and `Y` where they are.
 * That is correct for Red/Black: the formation itself mirrors, so Y physically
 * changes sides and his entry should follow him. Split Wide does NOT mirror —
 * it is ONE balanced set, Y is always wide LEFT at −13 and X always wide RIGHT
 * at +13 (see app/data/split-wide-formation.ts). In this set X and Y are
 * mirror-image POSITIONS that keep their spots, so a correct mirror must ALSO
 * exchange the X and Y entries everywhere they are keyed — actions, per-front
 * assignment overrides, alignOverrides, and the top-level assignments.
 * Otherwise Y inherits X's job across the whole field, which is exactly the
 * crossed-corner-blocks bug the first shipped Dive Left had.
 */
function swapXY<T>(rec: Partial<Record<OffPosId, T>>): Partial<Record<OffPosId, T>> {
  const { X, Y, ...rest } = rec
  const out: Partial<Record<OffPosId, T>> = { ...rest }
  if (Y !== undefined) out.X = Y
  if (X !== undefined) out.Y = X
  return out
}

/** `mirrorPlay`, then the X↔Y exchange a balanced one-formation set requires. */
function mirrorSplitWidePlay(play: Play, overrides: Partial<Play>): Play {
  const m = mirrorPlay(play)
  const assignments = swapXY(m.assignments) as Record<OffPosId, Assignment>
  const vs = {} as Record<FrontId, FrontPlan>
  for (const [frontId, plan] of Object.entries(m.vs) as [FrontId, FrontPlan][]) {
    const next: FrontPlan = { ...plan, actions: swapXY(plan.actions) }
    if (plan.assignments) next.assignments = swapXY(plan.assignments)
    if (plan.alignOverrides) next.alignOverrides = swapXY(plan.alignOverrides)
    vs[frontId] = next
  }
  return { ...m, assignments, vs, ...overrides }
}

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
// PLAY 1 — SPLIT WIDE KEEP  (motion, QB keeper — ships as a right/left pair)
// ===========================================================================
//
// The direction word is what tells Super which way to motion out to and the
// quarterback which gap he is sneaking through. Right = motion right, run the
// RG/RT B gap. Left = motion left, run the LG/LT B gap. Indy flips it to left
// at the line, Hoosier to right, same as the Dive and the Screen.
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
//  - The B gap is the RG/RT seam, and on EVERY front their tackle is a
//    3-technique on RG's outside shoulder — standing at the inside edge of it
//    — with their end on RT's outside shoulder. So RG blocks the man on him
//    and works him IN, RT blocks the man on him and works him OUT, and the
//    hole is the daylight between those two blocks. Nobody pulls: the backside
//    guard has their tackle on his own outside shoulder on every front and
//    can't leave.
//  - C is the uncovered man in both even fronts, so he does what he does on
//    Veer — steps playside and climbs. He goes to the backer who fits the B
//    gap: B-R in the 4-4, the Mike in the 4-3 (the 4-3's B-R is aligned too
//    wide to be the B-gap fitter, so the slot gets him instead).
//  - Vs the 5-2 the front side does not change at all — same two blocks, same
//    hole. What changes is the middle: the nose is head-up on C and both
//    guards are covered, so the center has him ALONE and nobody climbs to a
//    backer off the line. The two slots take the two backers instead.

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
      { x: 2.3, y: -0.2 },
      { x: 2.7, y: 1.5 },
      { x: 3, y: 4 },
      { x: 3.3, y: 7 },
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
        'Nobody on your nose in an even front. Playside foot first, then run through the B gap and put your helmet on the backer stacked behind their tackle. He is the man who tackles this play if you miss him.',
    },
    R: {
      rule: 'Block the walked-up backer outside our tackle.',
      detail:
        'The 4-4 walks a backer up on the edge at 6½ yards — he is the man who runs the ball down from the outside. Come off the ball flat, get your helmet outside his, and turn him away from the middle.',
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
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('N'),
    RG: block('T-R'),
    RT: block('E-R'),
    L: block('B-L'),
    R: block('B-R'),
    Y: block('C-L'),
    X: block('C-R'),
  },
  assignments: {
    C: {
      rule: 'Covered — the nose is yours, ALONE.',
      detail:
        'Odd front, so the nose is head-up on you — and in this front both guards have their own man on their outside shoulder, so nobody is coming to help you. Playside foot first, hat on his playside number, and move him off the spot. He cannot cross your face into the hole.',
    },
    RG: {
      rule: 'Their tackle is on your outside shoulder, in the hole — work him IN.',
      detail:
        'Five down men and every one of them is blocked, and yours is the one standing at the inside edge of the gap the quarterback is running through. Drive him toward the center and never let him get back outside your shoulder. The hole is the daylight between you and RT.',
    },
    RT: {
      rule: 'Their end is on your outside shoulder — work him OUT.',
      detail:
        'Nobody is head-up on you in this front: their tackle is inside on RG and their end is half a man outside you. Short flat step, hat outside his, and drive him toward the sideline.',
    },
    R: {
      rule: 'Block the backer at 4 yards.',
      detail:
        'A 5-2 has nobody walked up on the edge, and our line has every big man blocked — so the man who fills this hole is the backer at 4 yards on your side. Flat angle, get inside-out on him, and do not let him cross your face to the ball.',
    },
    L: {
      rule: 'Backside — cut off the backer on your side.',
      detail:
        'You are away from the play. Take a flat angle at the backside backer and make him run around you; he is the one who catches this from behind.',
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
    rule: 'Base the man on your outside shoulder. Do not chase.',
    detail:
      'Their tackle sits on your outside shoulder on every front we see — even or odd, he is right there. Step to him, hat across, and wall him off from the ball. You are the back side of this play.',
  },
  C: {
    rule: 'Uncovered: climb to the B-gap backer. Covered: the nose is yours, alone.',
    detail:
      'Playside foot first, every time. Look at your nose: in an even front nobody is there, so you climb through the B gap and block the backer who fills it. In the 5-2 the nose guard is head-up on you and both guards have their own man — so he is yours by yourself, and he does not get to cross your face into the hole.',
  },
  RG: {
    rule: 'Base the man on your outside shoulder, work him IN.',
    detail:
      'You are the inside wall of the hole. Their tackle lines up on your outside shoulder on every front, right at the inside edge of the gap the quarterback is running through — drive him toward the center and never let him get back outside your shoulder.',
  },
  RT: {
    rule: 'Base the end on your outside shoulder, work him OUT.',
    detail:
      'You are the outside wall of the hole. He is half a man outside you on every front, so take a short flat step to get to him, hat outside his, and drive him toward the sideline. He cannot be allowed to squeeze back in.',
  },
  X: {
    rule: 'Stalk the corner.',
    detail:
      'Same block you run on Veer. Sprint at him, break down under control at three yards, and stay on his outside number. If the quarterback breaks the first tackle, your man is the last one out there.',
  },
  L: {
    rule: 'Back side — cut off the first man on your side our line has not blocked.',
    detail:
      'Play is going away from you. Take a flat angle at the first defender who can run this down from the back side — the backer walked up on the edge if they have one, the backer at 4 yards if they do not — and get in his path. You are not knocking anyone down; you are making him run around you.',
  },
  R: {
    rule: 'Play side — block the first man outside our tackle our line has not blocked.',
    detail:
      'You are the edge. In a 4-4 that is the backer walked up out there; in a 4-3 and a 5-2 our line has every big man, so it is the backer at 4 yards. Come off flat, get your helmet outside his, and turn him away from the middle of the field. The keeper is coming inside of your block, not outside it.',
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
  name: 'Keep',
  call: [
    { word: 'Split Wide', label: 'formation' },
    { word: 'Keep', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'Q',
  audibleFlipId: 'split-wide-keeper-left',
  summary: 'Designed QB run / sneak.',
  coachNotes: [
    'Wait for Super to get set - one full second - before the snap.',
    'Run it after the screen. Take your three or four yards and get down.',
  ],
  description:
    'Super motions out to the right — between R and X on this call — gets set, and shows his hands like the screen is coming. The quarterback waits for him to set, reads the linebackers, and then runs downhill in the B gap between the right guard and the right tackle — behind everybody the screen picture just pulled off the line. This is a few-yards play, not a home run: we run it AFTER the screen, when their defensive line has seen that picture once and relaxes on it, and the quarterback rams it up in there for what is sitting in front of him.',
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
    'Why nobody pulls: on every front LG has their tackle on his own outside shoulder and cannot leave without giving up a free runner behind the play, so on the two even fronts the uncovered center climbs to the B-gap backer instead. Vs the 5-2 nobody climbs off the line at all — the nose is head-up on the center and both guards are covered, so the five blocks are man-for-man and the two slots take the two backers. If you would rather teach one pulling guard on every front, say so and I will change the front rules instead of the pictures.',
    'CHANGED 2026-09-17 WITH THE NEW ALIGNMENT — your words: "N is directly over C. DT should be directly over the last letter on the guard (either the L or the G in RG). DE should be directly over the edge of the circle on the OT." The 5-2 tackle is no longer head-up on our tackle, he is a 3-technique on the guard\'s outside shoulder, so the 5-2 blocking on this play changed: RG now blocks that tackle (he is standing in the B gap we are running) and works him IN instead of climbing to a backer; RT now blocks the END on his outside shoulder and works him OUT instead of the tackle; the center has the nose ALONE (no Scoop — LG is covered too, so he cannot come help); and the two slots block the two backers instead of cracking the ends, because our tackles now have the ends. The hole itself did not move: it is still the daylight between RG and RT.',
    'Vs the 4-3 and the 5-2 the slot (R) blocks the backer at 4 yards instead of an edge man, because neither front walks a man up on the edge and neither leaves an end free any more — our tackle has him. In the 4-3 the center takes the Mike and R takes the outside backer; in the 5-2 the center has the nose and R has the playside backer. Confirm you want the slot blocking IN on all three fronts rather than stalking the corner and letting the safety come free.',
    'Nobody blocks the deep safety on any front. That is on purpose — this play is meant to gain 4 to 6 downhill, and the safety is the guy who ends it. If you want it to be able to go the distance, someone has to leave a defender free to get to him.',
    'DIRECTION — RESOLVED (Coach Ryan, 2026-08-18): the Keep is called with a direction, and the word does two jobs at once — it tells Super which way to MOTION OUT to and it tells the quarterback which way to SNEAK. Right = motion right, settle between R and X, run the RG/RT B gap; Left = motion left, settle between L and Y, run the LG/LT B gap. Indy = left, Hoosier = right at the line, wired through audibleFlipId. One balanced formation, so no formationTwinId.',
    'MIRROR — SHIPPED for the keep: Split Wide Keep Left is one mirrorSplitWidePlay() call (the mirror plus the X↔Y exchange this balanced set needs) with zero hand corrections to the football. What IS hand-authored over there is the prose — every rule that says "right", "R and X", "RG and RT" is rewritten, because mirrorPlay re-keys assignments but cannot rewrite a sentence. Review the right-handed play and you have reviewed the football of both; read the left one only for its words. Note that the keep and the screen must be called to the SAME side to stay one picture — Keep Right pairs with Screen Right, Keep Left with Screen Left.',
  ],
}

// ---------------------------------------------------------------------------
// PLAY 1b — SPLIT WIDE KEEP LEFT: the same play the other way, and the reason
// the call now carries a direction — the word tells Super which way to motion
// out to and the quarterback which way to sneak.
//
// The GEOMETRY is one mirrorSplitWidePlay() call: Super motions out and settles
// between L and Y at (−10.75, −1), and the quarterback runs the B gap between
// LG and LT. The set is drawn exactly balanced and all three fronts are
// symmetric, so the football needed no hand corrections.
//
// The PROSE is hand-translated. mirrorPlay re-keys every assignment onto the
// right player, but it cannot rewrite "right" into "left" inside a sentence, so
// the four rules that name a side — C, R, S and Q, plus the center vs the 5-2 —
// are authored fresh at the already-correct keys.
// ---------------------------------------------------------------------------

export const splitWideKeeperLeft: Play = (() => {
  const m = mirrorSplitWidePlay(splitWideKeeperRight, {})
  return {
    ...m,
    id: 'split-wide-keeper-left',
    call: [
      { word: 'Split Wide', label: 'formation' },
      { word: 'Keep', label: 'play' },
      { word: 'Left', label: 'direction' },
    ],
    audibleFlipId: 'split-wide-keeper-right',
    description:
      'Super motions out to the left — between L and Y on this call — gets set, and shows his hands like the screen is coming. The quarterback waits for him to set, reads the linebackers, and then runs downhill in the B gap between the left guard and the left tackle — behind everybody the screen picture just pulled off the line. This is a few-yards play, not a home run: we run it AFTER the screen, when their defensive line has seen that picture once and relaxes on it, and the quarterback rams it up in there for what is sitting in front of him.',
    assignments: {
      ...m.assignments,
      C: {
        rule: 'Uncovered: climb to the B-gap backer. Covered: the nose is yours, alone.',
        detail:
          'Playside foot first, every time — and playside is LEFT on this call. Look at your nose: in an even front nobody is there, so you climb through the B gap and block the backer who fills it. In the 5-2 the nose guard is head-up on you and both guards have their own man, so he is yours by yourself.',
      },
      R: {
        rule: 'Back side — cut off the first man outside our tackle.',
        detail:
          'Play is going away from you. Take a flat angle at the first defender outside RT and get in his path. You are not knocking anyone down; you are making him run around you.',
      },
      S: {
        rule: 'Motion out between L and Y. STOP. Get set. Hands up, eyes on the quarterback.',
        detail:
          'The call says LEFT, so you go left. On the quarterback\'s call, run out behind the line and stop between L and Y — not past Y, not next to L, right in the middle of them. Get your feet set and stay set for a full count; if you are still moving at the snap on this play we get a flag. Then turn your numbers to the quarterback, put your hands up, and stare at him like the ball is coming right now. You are not getting it. Your whole job is that the linebackers believe you are, and every step they take out toward you is a step away from where the quarterback is running.',
      },
      Q: {
        rule: 'Send Super out LEFT. Wait for him to get set. Read them. Then screen fake and run the B gap.',
        detail:
          'Call Super in motion to the left and then WAIT — do not rush the snap. He has to be stopped and set out there before you go. While you wait, look at their linebackers. If they widen or back off the line toward Super, that is exactly what we want and you snap it. If they walk up and show blitz, do not snap it — check us into something else (ask me for the call). After the snap: take one hard step left and show the screen with your eyes and the ball, then get your shoulders square and run downhill in the gap between LG and LT. This is a keeper, not a read — the ball is yours before the snap. Do not bounce it outside. Take the few yards that are there and get down — this play is worth three or four every time because their line is standing there waiting for the screen. It is not a play we are trying to break; it is a play we are trying to CASH.',
      },
    },
    vs: {
      ...m.vs,
      '52': {
        ...m.vs['52']!,
        assignments: {
          ...m.vs['52']!.assignments,
          C: {
            rule: 'Covered — the nose is yours, ALONE.',
            detail:
              'Odd front, so the nose is head-up on you, and both guards have their own man on their outside shoulder — nobody is coming to help. Step playside — LEFT — take his playside number, and move him off the spot.',
          },
        },
      },
    } satisfies Record<FrontId, FrontPlan>,
    reviewNotes: [
      ...(splitWideKeeperRight.reviewNotes ?? []),
      'GENERATED: this play is mirrorSplitWidePlay(splitWideKeeperRight) — the straight mirror plus the X↔Y exchange this balanced set needs, so Y (wide left) now runs the playside stalk and X (wide right) carries the whole back side. The football took zero hand corrections. What was hand-authored is only the language: the center\'s odd-front note is written playside-LEFT, R is the backside cut-off behind RT, Super motions out between L and Y, and the quarterback steps left and runs the LG/LT B gap. Review the right-handed play for the football; read this one only for its words.',
    ],
  }
})()

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
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('N'),
    RG: block('T-R'),
    RT: block('E-R'),
    L: block('B-L'),
    R: block('B-R'),
  },
  assignments: {
    C: {
      rule: 'Covered — the nose is yours, ALONE.',
      detail:
        'Odd front. The nose is head-up on you and he is standing in the hole, and both guards have their own man on their outside shoulder — nobody can come help. Playside foot first, hat on his playside number, and move him off the spot. Super is running right off your playside hip.',
    },
    RG: {
      rule: 'Base their tackle — he is on your outside shoulder.',
      detail:
        'Five down men, five of us, and yours is the one on your outside shoulder. Step, drive, and keep him going away from the hole — he cannot fall back inside into the A gap where the dive is.',
    },
    RT: {
      rule: 'Base the end on your outside shoulder.',
      detail: 'Their tackle is inside on RG, so all you have is the end half a man outside you. Take him where he wants to go and seal him outside. The dive is inside of you and it is not coming back out.',
    },
    R: {
      rule: 'Crack the backer on your side.',
      detail:
        'A 5-2 leaves no big man unblocked — our tackles have both ends now — so the man who crashes into the middle is the backer at 4 yards. Take a flat inside angle, beat him to the spot, and turn him away from the middle. Hat in front, never in the back.',
    },
    L: {
      rule: 'Crack the backer on your side.',
      detail: 'Same job on the back side — the backside backer chasing down the line is what turns a 5-yard dive into a 1-yard dive.',
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
    rule: 'Base the man on your outside shoulder.',
    detail: 'Their tackle is on your outside shoulder on every front. Step, punch, wall him off from the ball — he does not get back inside you into the dive.',
  },
  C: {
    rule: 'Uncovered: climb to the backer in the hole. Covered: the nose is yours, alone.',
    detail:
      'Playside foot first. In an even front nobody is on your nose, so you get vertical and block the backer who fills the A gap — he is the man who makes this tackle. In the 5-2 the nose is head-up on you and both guards have a man of their own, so he is yours by yourself and you move him off the hole.',
  },
  RG: {
    rule: 'Base the man on your outside shoulder.',
    detail:
      'You are the playside wall of the hole. Their tackle lines up on your outside shoulder on every front — drive him, and he cannot fall back into the A gap.',
  },
  RT: {
    rule: 'Base the end on your outside shoulder.',
    detail: 'Take him wherever he wants to go and seal him outside. The dive is inside of you and it is not coming back out.',
  },
  X: {
    rule: 'Stalk the corner. He never crosses your face to the middle.',
    detail:
      'Same as the other side. Sprint, break down, mirror. If he tries to fold inside for the tackle, your body is the wall.',
  },
  L: {
    rule: 'Crack the first man on your side our line has not blocked.',
    detail:
      'That is the man who crashes down the line: the backer walked up on the edge in a 4-4, the outside backer in a 4-3, the backer at 4 yards in a 5-2. Come off the ball flat and downhill, get your helmet in FRONT of him, and turn him toward the sideline. Never block him in the back and never dive at his knees.',
  },
  R: {
    rule: 'Crack the first man outside our tackle our line has not blocked.',
    detail:
      'Same block, play side. You are stopping the crash before it starts — one step late and he is already in the hole.',
  },
  S: {
    rule: 'Dive — aim at the playside hip of the center.',
    detail:
      'Straight downhill, no rounding. Ball on your second step, both hands on it, shoulders square. Take whatever crease shows off the center\'s block and fall forward. Four yards every time is what makes the rest of this formation work.',
  },
  Q: {
    rule: 'Open, hand it, carry out the fake away.',
    detail:
      'Reverse-pivot, put the ball in his belly on his second step, and let it go. Then keep your empty hand on your hip and run three hard steps AWAY from the play with your eyes up. Everyone who bites on you is a man who is not tackling Super.',
  },
}

export const splitWideDiveRight: Play = {
  id: 'split-wide-dive-right',
  name: 'Dive',
  call: [
    { word: 'Split Wide', label: 'formation' },
    { word: 'Dive', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'S',
  audibleFlipId: 'split-wide-dive-left',
  summary: 'Simple run. Super crashes the middle.',
  coachNotes: [
    'Four yards, every snap. Hit the hole full speed.',
    'Receivers: nobody crosses your face to the middle.',
  ],
  description:
    'The simplest play in the book. Super runs downhill at the playside hip of the center — the right side on this call — the line blocks the man in front of them, and all four receivers keep the defense from crashing to the middle. Four yards, every snap, out of a formation that looks like a pass.',
  assignments: diveAssignments,
  vs: { '44': diveVs44, '43': diveVs43, '52': diveVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    '*** THE OPEN QUESTION FROM HANDOFF §10 — "all receivers stop the crash to the middle." *** This is the one sentence in the whole package that is not confirmed, and this whole play is built on a guess at it. Drafted as CRACK BLOCKS: the two slots (L and R) come down flat and block the first unblocked defender outside our tackle — the guy crashing down the line — and the two wide receivers (Y and X) stalk the corners so their run support cannot fold inside either. Read as: "nobody gets to the middle where the dive is." OTHER READINGS I did not draw, tell me if one of them is what you meant: (a) all four receivers RELEASE INSIDE and block the second level / safeties, which is more of a screen-blocking picture; (b) all four run vertical ROUTES to pull the defense out of the middle so it cannot crash — the opposite answer, blocking nobody; (c) only the two slots crack and the wide receivers run off; (d) "crash" means a specific stunt you see from a specific team, in which case tell me which defender and I will aim at him. Everything about this play except the dive itself changes depending on your answer.',
    HB_NOTE,
    FORMATION_NOTE,
    'Crack block safety: I wrote "helmet in FRONT of him, never in the back, never at his knees" into every crack assignment. At this level a crack block is the easiest way to draw a flag or hurt somebody. If you would rather these be stalk blocks in space than true cracks, that is a one-word change and it is worth making on purpose.',
    'Which gap? Drafted as the playside A gap — aiming point is the center\'s playside hip. "Standard dive" could also mean straight over the center or at the playside guard\'s outside hip (B gap). Confirm the aiming point; it changes who the center and both guards climb to.',
    'The crack targets change by front on their own: vs the 4-4 the slots crack the walked-up edge backers, vs the 4-3 the outside backers, and vs the 5-2 the two inside backers. The rule the kids learn stays one sentence — "the first man on your side our line has not blocked" — and the picture solves itself per front. Confirm you like teaching it as a rule rather than as three memorized names.',
    'CHANGED 2026-09-17 WITH THE NEW ALIGNMENT — your words: "N is directly over C. DT should be directly over the last letter on the guard (either the L or the G in RG). DE should be directly over the edge of the circle on the OT." In the 5-2 their tackle is no longer head-up on our tackle, so the 5-2 line blocking on this play is now man-for-man like the even fronts: LT and RT have the two ends on their outside shoulders, both guards have the tackles on theirs, and the center has the nose ALONE (no Scoop — the guard who used to help him is covered now). That also took the free ends away from the slots, so vs the 5-2 they crack the two inside backers instead. The dive itself is untouched: same track, same aiming point at the center\'s playside hip.',
    'The quarterback\'s boot fake away is my addition, not yours. It costs nothing and it is what makes the same look sell the keeper and the screen. Cut it if you want the dive taught totally clean.',
    'DIRECTION — RESOLVED (Coach Ryan, 2026-08-14): the dive IS called with a direction, like the runs in Red and Black, and Indy/Hoosier flip it at the line — Indy = left, Hoosier = right, wired through audibleFlipId. Split Wide is one balanced formation, so unlike those runs there is no Red/Black formation twin: just this left/right pair, no formationTwinId.',
    'MIRROR — SHIPPED for the dive (superseding the file-wide "not shipped yet" stance): Split Wide is a balanced set and all three fronts are left/right symmetric, so Split Wide Dive Left is one mirrorSplitWidePlay() call — mirrorPlay plus the X↔Y exchange this balanced set needs — with zero hand corrections to the football, and it now ships as this play\'s audible flip. Keep and Victory remain one-way per the same ruling. Both dive plays still sit behind the HANDOFF §10 review gate like everything else in this file.',
  ],
}

// ---------------------------------------------------------------------------
// PLAY 2b — SPLIT WIDE DIVE LEFT: the mirror of the play above, and nothing
// else. The set is drawn exactly balanced and all three fronts are symmetric,
// so mirrorSplitWidePlay() — mirrorPlay plus the X↔Y exchange, see the helper
// above — needs zero hand corrections. The overrides below are only identity
// (id, call, flip link) and left-handed wording.
// ---------------------------------------------------------------------------

export const splitWideDiveLeft: Play = mirrorSplitWidePlay(splitWideDiveRight, {
  id: 'split-wide-dive-left',
  call: [
    { word: 'Split Wide', label: 'formation' },
    { word: 'Dive', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  audibleFlipId: 'split-wide-dive-right',
  description:
    'The simplest play in the book, run to the left. Super runs downhill at the playside hip of the center — the left side on this call — the line blocks the man in front of them, and all four receivers keep the defense from crashing to the middle. Four yards, every snap, out of a formation that looks like a pass.',
  reviewNotes: [
    ...(splitWideDiveRight.reviewNotes ?? []),
    'GENERATED: this play is mirrorSplitWidePlay(splitWideDiveRight) — the straight mirror with the X↔Y exchange applied on top, because in this balanced set X and Y are mirror-image POSITIONS that keep their spots (Y is always wide left, X always wide right) and so their entries must trade places when everything else flips. The set is drawn exactly balanced and all three fronts are left/right symmetric, so nothing needed a hand correction. NOTE THE FIX: the first shipped version of this play used plain mirrorPlay() and had the wide men crossing the whole field — Y aimed at C-R and X at C-L. With the swap, Y blocks C-L and X blocks C-R on BOTH directions, which is right because the dive\'s wide-receiver job is symmetric: each man stalks his own corner. Review the right-handed play and you have reviewed this one.',
  ],
})

// ===========================================================================
// PLAY 3 — SPLIT WIDE SCREEN  (motion, HB screen — ships as a right/left pair)
// ===========================================================================
//
// Super motions out and SETTLES between R and X — the exact same motion and the
// exact same settle spot as Split Wide Keep, so the two plays are one picture
// until the ball leaves. He stands there with his hands up; on the keep it is a
// lie and on this one it is true. The quarterback opens away and throws it out
// to him behind the line.
//
// REWRITTEN 2026-09-17 per Coach Ryan. The problem: "the DE gets into the
// backfield, disrupting the pass to the Super or rushing the QB." The first
// version let the playside end come free on purpose, screen-style. No more:
//
//  - RT REACH-BLOCKS the playside end and pushes him AWAY from the play
//    (right-side play, push him left). Big reach block, aggressive reach step.
//  - RG still sets one count, then PULLS — hooks around the outside of the end
//    RT is reaching, and finds the playside inside backer. "If that linebacker
//    is out of position or unreachable, find any jersey that you can block."
//  - X blocks the corner in front of him, every front. No more run-off.
//  - R (the playside slot) blocks the strong-side ALLEY backer — the
//    linebacker closest to the play.
//  - LT (the away-side tackle) just BUMPS his end so he can't get in quick,
//    then gets upfield to a linebacker, or a safety.
//
// So the only man who comes anywhere near free now is the away-side end after
// LT's bump — and vs the 5-2, the tackle on RG's outside shoulder, whom RG lets
// go after one count. Both are on the side the ball is leaving from, late.

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

/**
 * RG: one count of pass set, then PULL — flat behind the line, around the
 * OUTSIDE of the end RT is reaching, and turn up. The block that follows the
 * pull aims back inside at the backer chasing the screen.
 */
const SCREEN_RG_PULL: Action = {
  kind: 'run',
  path: [
    { x: 2, y: -0.6 },
    { x: 4.6, y: -1 },
    { x: 6.6, y: -0.3 },
    { x: 7.3, y: 1.2 },
  ],
}

/**
 * RT: the REACH. Aggressive reach step to the end's OUTSIDE hip, then run him
 * back inside, away from the play. The block bar points back at him from the
 * outside — that is the picture of "push him left."
 */
const reachBlock = (step: Pt, targetId: string): Action[] => [
  { kind: 'run', path: [step] },
  ...block(targetId),
]
/**
 * E-R sits at 3.55 on EVERY front now — a 5-technique on RT's outside shoulder
 * — so there is one reach step, not one per front: a short hard step to his
 * outside hip at 4, then the bar back inside at him.
 */
const SCREEN_RT_REACH: Action[] = reachBlock({ x: 4, y: 0.3 }, 'E-R')

/**
 * LT: BUMP the away-side end — one short block bar at his inside shoulder —
 * then climb and block a linebacker (a safety if the backer is gone).
 */
const SCREEN_LT_CHIP: Action = {
  kind: 'block',
  targetId: 'E-L',
  path: [{ x: -3.5, y: 0.5 }],
}

/**
 * LG (the away-side guard): block his man for about one second — until the
 * quarterback starts to throw — then let him go and climb up the middle of
 * the field to block any jersey. The climb is a line to NOBODY on purpose:
 * it is there so the whole line knows it can get upfield once the ball is out.
 */
const SCREEN_LG_HOLD: Action = {
  kind: 'block',
  targetId: 'T-L',
  path: [{ x: -2.05, y: 0.5 }],
}
const SCREEN_LG_CLIMB: Action = {
  kind: 'run',
  path: [
    { x: -0.4, y: 1.7 },
    { x: -0.2, y: 5.5 },
  ],
}

/**
 * RG vs the 5-2 ONLY: no pull. Their tackle is a 3-technique on RG's own
 * outside shoulder — standing in the B gap RT is about to vacate for the end
 * — so if RG pulled he would run straight into the backfield behind him. RG
 * disrupts him just long enough for the pass to get off, then climbs to the
 * playside backer.
 */
const SCREEN_RG_HOLD_ODD: Action = {
  kind: 'block',
  targetId: 'T-R',
  path: [{ x: 2.05, y: 0.5 }],
}

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
  /** X blocks the corner in front of him on every front. */
  X: block('C-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

/** Even-front protection: LT bumps and climbs, LG holds one count and climbs, C has the tackle, RT reaches the end. */
const SCREEN_EVEN_PRO = {
  LT: [SCREEN_LT_CHIP, ...block('B-L')],
  LG: [SCREEN_LG_HOLD, SCREEN_LG_CLIMB],
  C: block('T-R'),
  RT: SCREEN_RT_REACH,
} satisfies Partial<Record<OffPosId, Action[]>>

const screenVs44: FrontPlan = {
  actions: {
    ...SCREEN_SKILL,
    ...SCREEN_EVEN_PRO,
    RG: [SCREEN_RG_PULL, ...block('B-R')],
    R: block('O-R'),
  },
  assignments: {
    RG: {
      rule: 'Check the tackle first, then pull around the end and find the playside inside backer.',
      detail:
        'He is lined up right on your outside shoulder — check him quick so he can not get in on you instantly, get him off his pace, then release. Hook around the outside of the end RT is reaching and turn up. The inside backer on the screen side is yours — he is the first man to read screen and run at it. If he is gone or you cannot get to him, block any jersey you can find.',
    },
    R: {
      rule: 'Block the walked-up backer — the Sam. The most important block on this play.',
      detail:
        'He is the alley backer, standing on the edge closest to the catch. Come off the ball like a route, break down, and wall him off from Super. Inside-out — never let him cross your face to the sideline. Nobody else on the field can make this block for you.',
    },
    LT: {
      rule: 'Bump the end, then climb to the away-side backer.',
      detail:
        'A 4-4 keeps one man deep in the middle, and after the bump he is the safety you go find if the backer has already run to the screen.',
    },
  },
}

const screenVs43: FrontPlan = {
  actions: {
    ...SCREEN_SKILL,
    ...SCREEN_EVEN_PRO,
    RG: [SCREEN_RG_PULL, ...block('M')],
    R: block('B-R'),
  },
  assignments: {
    RG: {
      rule: 'Check the tackle first, then pull around the end and find the Mike.',
      detail:
        'He is lined up right on your outside shoulder — check him quick so he can not get in on you instantly, get him off his pace, then release. Hook around the outside of the end RT is reaching and turn up. The Mike is the first man to read screen and run at it — he is the one who ruins this play. If he is gone or you cannot get to him, block any jersey you can find.',
    },
    R: {
      rule: 'Block the outside backer — the Sam. The most important block on this play.',
      detail:
        'He is the alley backer closest to the catch. Get inside-out on him and wall him off from Super. Nobody else on the field can make this block for you.',
    },
    LT: {
      rule: 'Bump the end, then climb to the Will.',
      detail:
        'The Will is right there behind the end you bumped. If he is already gone to the screen, keep climbing and take the safety on your side.',
    },
  },
}

const screenVs52: FrontPlan = {
  actions: {
    ...SCREEN_SKILL,
    LT: [SCREEN_LT_CHIP, ...block('B-L')],
    LG: [SCREEN_LG_HOLD, SCREEN_LG_CLIMB],
    C: block('N'),
    RG: [SCREEN_RG_HOLD_ODD, ...block('B-R')],
    RT: SCREEN_RT_REACH,
    R: block('B-R'),
  },
  assignments: {
    C: {
      rule: 'Take the nose by yourself.',
      detail:
        'Odd front — he is right on you and there is nobody to help. Punch, sit down, and keep him off the quarterback for two counts.',
    },
    RT: {
      rule: 'Reach the end — same as always. Nobody is inside you: the tackle is RG\'s.',
      detail:
        'Same reach — step hard to the end\'s outside hip and run him back to the left. In this front their tackle is lined up on RG\'s outside shoulder, not on you, and RG is holding him for the first count. All you have is the end.',
    },
    RG: {
      rule: 'NO pull. Disrupt the tackle on your outside shoulder, then climb to the playside backer.',
      detail:
        'Odd front — their tackle is right on your outside shoulder, standing in the gap between you and RT, and RT is leaving him to reach the end. Pull, and that man runs straight into the backfield. So you do not pull here. Block him inside-out just long enough for the quarterback to get the pass off. Right as the ball is coming out, let him go and climb to the playside linebacker. If R already has him, take the next jersey — the safety coming down.',
    },
    R: {
      rule: 'Block the NEAREST defender — the linebacker if he shows. The most important block on this play.',
      detail:
        'A 5-2 has no alley backer walked up on you, so the man closest to the catch is whoever shows first — usually the playside linebacker scraping out, sometimes the safety filling. Come off the ball like a route, find the nearest jersey, and wall him off from Super. Inside-out. Nobody else is close enough to make this block — it is yours, and the play does not work without it.',
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
    rule: 'Bump the end, then get upfield and block a linebacker — or a safety.',
    detail:
      'Do not stay on him. One hard punch to slow him down so he cannot get in fast, then let him go and climb. Find the first linebacker on your side and block him; if he is already gone, keep going and find the safety. The ball is out quick — the bump is all the protection we need from you.',
  },
  LG: {
    rule: 'Block your man for one second — until the quarterback starts to throw — then let him go and climb.',
    detail:
      'Your man is away from the play, so you only have to hold him for about one count. Set inside-out and stay on him until the quarterback starts to throw. Then let him go, get upfield through the middle, and block any jersey you can find. Your line on the picture goes to nobody on purpose — it is there so the whole line knows: once the ball is out, everybody climbs and blocks.',
  },
  C: {
    rule: 'Pass set. Block the first man to your right; if a nose is on you, he is yours alone.',
    detail:
      'You are the last man protecting the middle. Two counts is all we need — the ball is out before the rush ever gets home.',
  },
  RG: {
    rule: 'Check the tackle on your outside shoulder first, then pull around the end and find the linebacker.',
    detail:
      'He is lined up right on your outside shoulder, and your first job is making sure he does not get in on you instantly — hit him with a quick check to knock him off his pace, then get off him. Only then do you pull: flat, around the OUTSIDE of the end RT is reaching — never inside him, that is where RT is pushing him. Turn up and find the linebacker chasing the screen; get your head across him. If that backer is out of position or you cannot reach him, find any jersey you can block. Never run out there with nobody to hit.',
  },
  RT: {
    rule: 'REACH the end. Push him inside, away from the play.',
    detail:
      'This is a big reach block and it is the block that fixes this play. Aggressive reach step — your outside foot goes hard to the end\'s outside hip — get your helmet across his outside number, and run him back to the LEFT. He does not get upfield and he does not get to Super. If he tries to go outside you, you are already there. If he runs inside, that is where you wanted him — go with him.',
  },
  X: {
    rule: 'Go up and block the corner in front of you.',
    detail:
      'Come off the ball like a route, get to him under control, and stay on his outside number so everything spills back inside to Super. You are the last block on the sideline.',
  },
  L: {
    rule: 'Clear out — post across the middle.',
    detail:
      'Run the middle of the field empty. The safety who chases you is the safety who is not sitting in the alley waiting for Super.',
  },
  R: {
    rule: 'Block the alley backer — the linebacker closest to the play. The most important block on this play, every front.',
    detail:
      'You are the playside slot, so the strong-side alley is yours — and this is the block the whole play lives or dies on, no matter what front you see. Come off the ball like a route so nobody smells screen, then break down and take the backer closest to the catch. Inside-out — never let him cross your face to the sideline. Super is running off your block.',
  },
  S: {
    rule: 'Motion out between R and X. STOP. Get set, hands up — then catch it and get north.',
    detail:
      'Exactly the same trip you take on the keep: out behind the line, stop between R and X, feet set, numbers to the quarterback, hands up. Set for a full count before the snap. Stand still and let it come to you — do not drift toward him and do not start upfield until you have caught it. Look the ball all the way in, THEN find your blockers: RT has the end sealed inside, RG is coming around the end to wall off the backer, R has the alley, X has the corner. Get up the sideline. Never bounce back inside.',
  },
  Q: {
    rule: 'Send him out, wait for him to set, open away, throw it flat on time.',
    detail:
      'Same start as the keep — call Super out, WAIT for him to be stopped and set, and look at their linebackers while you wait. Then snap it, take a hard three-step drop opening AWAY from the screen, and hold your eyes to the back side for one full count. RT is reaching the end on the screen side, so nobody should be in your throwing lane — the man who might get to you is the away-side end after LT bumps him, and he is coming from the side you opened to, so be on time. Turn and throw it at Super\'s numbers while he is standing still — a short, flat, hard throw behind the line. Never throw it late and never throw it behind him. Against a team that blitzes, the ball MUST be out on time — the second you feel extra men coming, that is the snap this play was built for, and holding it one extra beat is the only way to lose it.',
  },
}

export const splitWideScreenRight: Play = {
  id: 'split-wide-screen-right',
  name: 'Screen',
  call: [
    { word: 'Split Wide', label: 'formation' },
    { word: 'Screen', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'pass',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'S',
  audibleFlipId: 'split-wide-screen-left',
  summary: 'Quick screen to Super in space. Tackle reaches the end, guard pulls around him.',
  coachNotes: [
    'Our answer to a blitzing team - the ball must be out on time.',
    'RT: reach the end and push him inside. He never gets to Super.',
    'RG: hook around the end, find the backer. No backer? Any jersey. (5-2: hold the tackle first, then climb.)',
    'Once the ball is out, everybody climbs and blocks.',
    'Super: stand still, hands up. Catch it first, then run.',
  ],
  description:
    'Super motions out and settles between R and X with his hands up — the same picture as the keep. The quarterback sells a drop the other way and the ball goes out flat to Super standing still. The screen-side end does NOT come free any more: RT reaches him and pushes him inside, away from the play, and RG pulls around the outside of that block to find the backer. R has the alley backer and X has the corner, so Super has a wall in front of him up the sideline. The away-side guard holds his man for one count, until the ball is coming out, then he climbs too — once the ball is gone, everybody blocks. This is our answer to a team that blitzes: the ball comes out quick and it puts Super in space.',
  assignments: screenAssignments,
  vs: { '44': screenVs44, '43': screenVs43, '52': screenVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'REWRITTEN 2026-09-17 FROM YOUR NOTE: "the DE gets into the backfield, disrupting the pass to the Super or rushing the QB." Every change below is yours, in your order: RT reach-blocks the playside end away from the play (right-side play, push him left) with an aggressive reach step; X goes up and blocks the corner in front of him; R blocks the strong-side alley backer closest to the play; the pulling guard hooks around the end RT is blocking and finds that linebacker — "if that linebacker is out of position or unreachable, find any jersey that you can block"; and the away-side tackle just bumps his end so he cannot get in quick, then gets upfield to a linebacker or a safety.',
    'ADJUSTED 2026-09-17 (SECOND PASS) FROM YOUR NOTES: (1) "Opposite play-side guard: initially block a defender away from the play for about one second until the quarterback starts to throw. Once that point is reached, let your guy go and climb up field and block any jersey. Draw a line blocking nothing, just in the center of the field, so the line knows it can all climb up and block." — LG now has a short block bar on the tackle (the hold) and then a plain arrow up the middle of the field to nobody, on every front. That arrow is the "everybody climbs" picture and the LG text says so. (2) "On a 5-2, the playside wing blocks the nearest defender, which could be the linebacker as well. It is the most important block. And on the 5-2 I don\'t want the right guard pulling until after he blocks the D-tackle just long enough for the quarterback to get the pass off; right as he is doing that, climb up to the playside linebacker." — vs the 5-2 only, RG no longer pulls: short block bar on the tackle over his own outside shoulder (T-R), then a bar up to the playside backer (B-R). R is drawn to that same backer (B-R) as "the nearest defender" and his 5-2 rule calls it the most important block on the play.',
    'ADJUSTED 2026-09-17 (THIRD PASS) FROM YOUR NOTE: "the play side guard... has to initially make sure the tackle doesn\'t get in instantly. Check him quickly first to get him off pace, but then you do your pull." RG\'s pull technique on the two even fronts now leads with that check — he holds the tackle on his outside shoulder just long enough to knock him off his pace before releasing into the pull around RT\'s reach block. Left alone on purpose: the 5-2, where RG still does not pull at all, because his tackle is the one man nobody else can take once RT leaves to reach the end (see the note below) — that is a scheme reason, not a wording gap, so say so if you actually want him pulling there too. ALSO YOUR NOTE: "against all fronts, the wing that is on play side has the most important block." R\'s alley block is now called the most important block on the play on every front — 44, 43, and 52 — not just the 5-2, where that line was already written in.',
    'BOTH R AND RG ARE DRAWN TO THE PLAYSIDE BACKER IN THE 5-2. That is on purpose, not a mistake: R takes the nearest man who shows (usually that backer), and RG climbs to the same backer with "if R already has him, take the next jersey — the safety" in his text. Two bars on one man is the honest picture of "first one there takes him." If you would rather RG\'s climb be drawn to the strong safety (F-R) so nobody doubles, say so and it is a one-line change.',
    'WHAT CHANGED ON THE DIAGRAM: RT no longer releases — his arrow is a reach step to the end\'s OUTSIDE hip with the block bar pointing back inside at him, which is the picture of "push him left." RG\'s release is now a pull that goes flat, around the outside of the end, and turns up before the block bar goes back inside to the backer. LT\'s arrow is a short block bar on the end\'s inside shoulder (the bump) followed by a second bar up to the away-side inside backer. X now has a block bar on the corner on every front instead of the run-off route.',
    'WHO IS FREE NOW. The old play let the playside end come free on purpose; that is what you saw getting into the backfield, and it is gone. Vs the 4-4 and 4-3 nobody on the screen side is free. The one man who can get home now is the AWAY-side end after LT bumps and leaves him — and he is coming from the side the quarterback opens to, which is why the quarterback\'s detail says to be on time. Vs the 5-2 nobody on the screen side is free either now: your second-pass note has RG holding the tackle on his own outside shoulder instead of pulling, so the man standing in the gap RT vacates for the end is accounted for. The away-side tackle (T-L in the 5-2, on LG\'s outside shoulder) is LG\'s for the one count he holds, then he is loose too — same trade as the end, the ball is already out.',
    'THE TARGETS BY FRONT, and why: R takes the alley backer closest to the play — the Sam walked up on the edge in the 4-4 (O-R), the Sam in the 4-3 (B-R), and in the 5-2, which has no alley backer, the nearest defender, drawn as the playside backer (B-R) per your second pass. RG\'s "that linebacker" on the pull is the playside inside backer — B-R in the 4-4, the Mike in the 4-3; in the 5-2 he does not pull, he holds T-R and climbs to B-R. LT climbs to the away-side inside backer in all three (B-L, the Will in the 4-3) with the safety as his fallback in the text. LG\'s climb is to nobody on every front, by your call. Nobody is on the deep middle safety in the 4-4; same trade as before, get the yards and get out of bounds.',
    'ALIGNMENT RETUNE 2026-09-17, your words: "N is directly over C. DT should be directly over the last letter on the guard (either the L or the G in RG). DE should be directly over the edge of the circle on the OT." The hand-drawn steps in this play were tuned to the old spots, so they moved with the defense: RT\'s reach step is now one step to (4, 0.3) on every front (the end is at 3.55 on all three now, so there is no longer an even/odd version of it), LT\'s bump lands at (−3.5, 0.5), and LG\'s one-count hold is at (−2.05, 0.5) — the guard\'s own outside shoulder, where their tackle now stands on every front. The 5-2 no longer needs its own numbers for any of that; only RG\'s 5-2 hold is still its own action, because on the even fronts he pulls.',
    'THE REACH IS THE HARD BLOCK. Asking a 13-year-old right tackle to reach a defensive end who is lined up outside him is a real ask — he needs the reach step drilled until it is automatic, and the end will beat it upfield sometimes. When he does, RG\'s pull path takes him around the OUTSIDE of that block, so RG must read it: if the end has beaten RT to the outside, RG goes inside him instead and takes him, and the backer becomes "any jersey." That read is in the RG text as "never inside him" for the normal case; confirm you want the exception taught, or keep it simple.',
    'X BLOCKS THE CORNER ON EVERY FRONT NOW. The old play had X run the corner off deep vs the 4-4 and 5-2 and only stalk him vs the 4-3. Your call is simpler and it is the same rule on every front, which is a better rule for kids.',
    'The ball flight is drawn with the `pitch` action kind because the frozen schema has no `pass` kind (see docs/SEAM.md §2). It renders as the dotted ball-flight line, which reads correctly, but flag it if you want passes drawn differently across the whole book.',
    'THE PAIR: this play and Split Wide Keep are still the same pre-snap picture and the same first second — Super out and set between R and X, quarterback waiting and reading. That is the point of both, and it is also the setup for checking between them at the line, which we have not built yet (see the keep\'s notes).',
    'THE SETTLE, per your call: Super motions out and STOPS between R and X at (10.75, −1) — same motion path, same spot, same hands-up look as Split Wide Keep, and the code literally shares the constants so the two diagrams can never drift apart. Because he is standing still, this is a flat, standing catch — an easy throw and an easy catch, and a slower one, so RG has to be moving on his pull or he will not be around the end in time.',
    'HE IS SET, WHICH MEANS HE IS NOT MOVING AT THE SNAP. Same rule note as on the keep: a man who motions and stops must be set a full second before the snap. On this play that is also a timing tax — the quarterback cannot snap it the instant Super arrives, so the defense gets an extra beat to look at him standing out there. If the linebackers start jumping the screen because it is telegraphed, the answer is the keep, which is exactly why the two share a picture.',
    'PER COACH RYAN — WHAT THIS PLAY IS FOR: "works for blitzing teams, ball must get out quick, gets the Super in space." In the description and in the quarterback\'s detail.',
    'Y and L clear out on every front. Confirm — the alternative is having L block the backside pursuit, but he is 8½ yards away from anything worth blocking and his route is what empties the middle.',
    'DIRECTION — RESOLVED (Coach Ryan, 2026-08-14): the Screen is now called with a direction like the Dive — Indy = left, Hoosier = right at the line, wired through audibleFlipId; one balanced formation, so no formationTwinId.',
    'MIRROR — SHIPPED for the screen: Split Wide Screen Left now ships as this play\'s audible flip, built with mirrorSplitWidePlay (the mirror plus the X↔Y exchange the balanced set needs). The old caution stands even with it shipped: a mirrored screen mirrors the PICTURE, not the quarterback\'s technique — throwing left off an away-opening drop is a different rep for a right-handed kid, and it needs its own practice time before the left call is live on game day.',
  ],
}

// ---------------------------------------------------------------------------
// PLAY 3b — SPLIT WIDE SCREEN LEFT: the mirror of the play above. The GEOMETRY
// is one mirrorSplitWidePlay() call — Super settles between L and Y at
// (−10.75, −1), LT reaches the left end and pushes him RIGHT, LG pulls around
// him, L has the alley, Y has the corner, RT bumps and climbs, RG holds one
// count and climbs to nobody. The PROSE is all
// hand-translated: mirrorPlay re-keys assignments correctly but cannot rewrite
// "right" into "left" inside a sentence, so every rule and detail below is
// authored fresh at the already-correct mirrored keys.
// ---------------------------------------------------------------------------

export const splitWideScreenLeft: Play = (() => {
  const m = mirrorSplitWidePlay(splitWideScreenRight, {})
  return {
    ...m,
    id: 'split-wide-screen-left',
    call: [
      { word: 'Split Wide', label: 'formation' },
      { word: 'Screen', label: 'play' },
      { word: 'Left', label: 'direction' },
    ],
    audibleFlipId: 'split-wide-screen-right',
    description:
      'Super motions out and settles between L and Y with his hands up — the same screen picture, flipped to the left. The quarterback sells a drop the other way and the ball goes out flat to Super standing still. The screen-side end does NOT come free: LT reaches him and pushes him inside, away from the play, and LG pulls around the outside of that block to find the backer. L has the alley backer and Y has the corner, so Super has a wall in front of him up the left sideline. The away-side guard holds his man for one count, until the ball is coming out, then he climbs too — once the ball is gone, everybody blocks. This is our answer to a team that blitzes: the ball comes out quick and it puts Super in space.',
    assignments: {
      Y: {
        rule: 'Go up and block the corner in front of you.',
        detail:
          'You are the wide man on the screen side now. Come off the ball like a route, get to him under control, and stay on his outside number so everything spills back inside to Super. You are the last block on the sideline.',
      },
      LT: {
        rule: 'REACH the end. Push him inside, away from the play.',
        detail:
          'This is a big reach block and it is the block that fixes this play. Aggressive reach step — your outside foot goes hard to the end\'s outside hip — get your helmet across his outside number, and run him back to the RIGHT. He does not get upfield and he does not get to Super. If he tries to go outside you, you are already there. If he runs inside, that is where you wanted him — go with him.',
      },
      LG: {
        rule: 'Check the tackle on your outside shoulder first, then pull around the end and find the linebacker.',
        detail:
          'He is lined up right on your outside shoulder, and your first job is making sure he does not get in on you instantly — hit him with a quick check to knock him off his pace, then get off him. Only then do you pull: flat, around the OUTSIDE of the end LT is reaching — never inside him, that is where LT is pushing him. Turn up and find the linebacker chasing the screen; get your head across him. If that backer is out of position or you cannot reach him, find any jersey you can block. Never run out there with nobody to hit.',
      },
      C: {
        rule: 'Pass set. Block the first man to your left; if a nose is on you, he is yours alone.',
        detail:
          'You are the last man protecting the middle. Two counts is all we need — the ball is out before the rush ever gets home.',
      },
      RG: {
        rule: 'Block your man for one second — until the quarterback starts to throw — then let him go and climb.',
        detail:
          'Your man is away from the play, so you only have to hold him for about one count. Set inside-out and stay on him until the quarterback starts to throw. Then let him go, get upfield through the middle, and block any jersey you can find. Your line on the picture goes to nobody on purpose — it is there so the whole line knows: once the ball is out, everybody climbs and blocks.',
      },
      RT: {
        rule: 'Bump the end, then get upfield and block a linebacker — or a safety.',
        detail:
          'Do not stay on him. One hard punch to slow him down so he cannot get in fast, then let him go and climb. Find the first linebacker on your side and block him; if he is already gone, keep going and find the safety. The ball is out quick — the bump is all the protection we need from you.',
      },
      X: {
        rule: 'Clear out — run straight up the field.',
        detail:
          'Nothing is coming to you and that is the point. Run hard for four seconds and take the corner and the deep help with you, away from the screen.',
      },
      L: {
        rule: 'Block the alley backer — the linebacker closest to the play. The most important block on this play, every front.',
        detail:
          'You are the playside slot, so the alley on the left is yours — and this is the block the whole play lives or dies on, no matter what front you see. Come off the ball like a route so nobody smells screen, then break down and take the backer closest to the catch. Inside-out — never let him cross your face to the sideline. Super is running off your block.',
      },
      R: {
        rule: 'Clear out — post across the middle.',
        detail:
          'Run the middle of the field empty. The safety who chases you is the safety who is not sitting in the alley waiting for Super.',
      },
      S: {
        rule: 'Motion out between L and Y. STOP. Get set, hands up — then catch it and get north.',
        detail:
          'Same settle, other side: out behind the line to your LEFT, stop between L and Y — not past Y, not next to L, right in the middle of them. Feet set, numbers to the quarterback, hands up. Set for a full count before the snap. Stand still and let it come to you — do not drift toward him and do not start upfield until you have caught it. Look the ball all the way in, THEN find your blockers: LT has the end sealed inside, LG is coming around the end to wall off the backer, L has the alley, Y has the corner. Get up the LEFT sideline. Never bounce back inside.',
      },
      Q: {
        rule: 'Send him out, wait for him to set, open away, throw it flat on time.',
        detail:
          'Same play as Screen Right, sent the other way. Call Super out to your LEFT, WAIT for him to be stopped and set, and look at their linebackers while you wait. Then snap it, take a hard three-step drop opening AWAY to the RIGHT, and hold your eyes to the back side for one full count. LT is reaching the end on the screen side, so nobody should be in your throwing lane — the man who might get to you is the right end after RT bumps him, and he is coming from the side you opened to, so be on time. Turn and throw it at Super\'s numbers while he is standing still — a short, flat, hard throw behind the line, and throwing it to your left is the harder half of this pair, so it gets its own reps in practice. Never throw it late and never throw it behind him. Against a team that blitzes, the ball MUST be out on time — the second you feel extra men coming, that is the snap this play was built for, and holding it one extra beat is the only way to lose it.',
      },
    } satisfies Record<OffPosId, Assignment>,
    vs: {
      '44': {
        ...m.vs['44'],
        assignments: {
          LG: {
            rule: 'Check the tackle first, then pull around the end and find the playside inside backer.',
            detail:
              'He is lined up right on your outside shoulder — check him quick so he can not get in on you instantly, get him off his pace, then release. Hook around the outside of the end LT is reaching and turn up. The inside backer on the screen side is yours — he is the first man to read screen and run at it. If he is gone or you cannot get to him, block any jersey you can find.',
          },
          L: {
            rule: 'Block the walked-up backer on your side. The most important block on this play.',
            detail:
              'He is the alley backer, standing on the edge closest to the catch. Come off the ball like a route, break down, and wall him off from Super. Inside-out — never let him cross your face to the sideline. Nobody else on the field can make this block for you.',
          },
          RT: {
            rule: 'Bump the end, then climb to the away-side backer.',
            detail:
              'A 4-4 keeps one man deep in the middle, and after the bump he is the safety you go find if the backer has already run to the screen.',
          },
        },
      },
      '43': {
        ...m.vs['43'],
        assignments: {
          LG: {
            rule: 'Check the tackle first, then pull around the end and find the Mike.',
            detail:
              'He is lined up right on your outside shoulder — check him quick so he can not get in on you instantly, get him off his pace, then release. Hook around the outside of the end LT is reaching and turn up. The Mike is the first man to read screen and run at it — he is the one who ruins this play. If he is gone or you cannot get to him, block any jersey you can find.',
          },
          L: {
            rule: 'Block the outside backer on your side. The most important block on this play.',
            detail:
              'He is the alley backer closest to the catch. Get inside-out on him and wall him off from Super. Nobody else on the field can make this block for you.',
          },
          RT: {
            rule: 'Bump the end, then climb to the outside backer on your side.',
            detail:
              'He is right there behind the end you bumped. If he is already gone to the screen, keep climbing and take the safety on your side.',
          },
        },
      },
      '52': {
        ...m.vs['52'],
        assignments: {
          C: {
            rule: 'Take the nose by yourself.',
            detail:
              'Odd front — he is right on you and there is nobody to help. Punch, sit down, and keep him off the quarterback for two counts.',
          },
          LT: {
            rule: 'Reach the end — same as always. Nobody is inside you: the tackle is LG\'s.',
            detail:
              'Same reach — step hard to the end\'s outside hip and run him back to the right. In this front their tackle is lined up on LG\'s outside shoulder, not on you, and LG is holding him for the first count. All you have is the end.',
          },
          LG: {
            rule: 'NO pull. Disrupt the tackle on your outside shoulder, then climb to the playside backer.',
            detail:
              'Odd front — their tackle is right on your outside shoulder, standing in the gap between you and LT, and LT is leaving him to reach the end. Pull, and that man runs straight into the backfield. So you do not pull here. Block him inside-out just long enough for the quarterback to get the pass off. Right as the ball is coming out, let him go and climb to the playside linebacker. If L already has him, take the next jersey — the safety coming down.',
          },
          L: {
            rule: 'Block the NEAREST defender — the linebacker if he shows. The most important block on this play.',
            detail:
              'A 5-2 has no alley backer walked up on you, so the man closest to the catch is whoever shows first — usually the playside linebacker scraping out, sometimes the safety filling. Come off the ball like a route, find the nearest jersey, and wall him off from Super. Inside-out. Nobody else is close enough to make this block — it is yours, and the play does not work without it.',
          },
        },
      },
    } satisfies Record<FrontId, FrontPlan>,
    reviewNotes: [
      ...(splitWideScreenRight.reviewNotes ?? []),
      'GENERATED: this play is mirrorSplitWidePlay(splitWideScreenRight) with every line of prose hand-translated to the left, not machine-flipped. The X↔Y exchange is applied because the balanced set keeps X and Y in their spots — they are mirror-image positions, so their entries trade places when everything else flips: Y is now the playside wide man who blocks the corner, X is the backside clear-out. The 2026-09-17 rewrite and its second pass mirror cleanly: LT reaches E-L and pushes him right, LG pulls around him to the backer (vs the 5-2 he holds T-L instead and climbs to B-L), L has the alley (the nearest man in the 5-2), RT bumps E-R and climbs, RG holds T-R one count and climbs to nobody. Reviewing the right screen reviews the geometry of this one. What it does NOT review is the throw — throwing left off an away-opening drop is a different rep for a right-handed kid, and the left call needs its own practice time before it is live.',
    ],
  }
})()

// ===========================================================================
// PLAY 4 — SPLIT WIDE VICTORY  (post / slant / slant / fade, play-fake to Super)
// ===========================================================================
//
// REWRITTEN 2026-09-09 per Coach Ryan: "Routes should be LTR 7, 1, 1, 9.
// Designed for shorter passes, but also designed to run after we've ran out of
// split wide formation before, so the new addition is a play-fake to the Super
// who then blocks or picks up the blitz. QB has to release it within 3 seconds."
//
// Your route call, left to right across the formation:
//   Y (wide left)  — 7 POST
//   L (slot left)  — 1 SLANT
//   R (slot right) — 1 SLANT
//   X (wide right) — 9 FADE
//
// The two slants are the play. The post and the fade run the corners and the
// safety off so the slants have grass behind the linebackers — and the
// linebackers are the men the fake is for. Super takes the Dive fake on the
// Dive's exact track, then plants in the A gap and blocks the first man
// through. WHICH A gap is the quarterback's call before the snap — sidenote from
// Coach Ryan the same day: "QB tells Super what side to fake on, try to guess
// blitz side." The diagram draws the fake to the RIGHT because that is the Dive's
// default side and the protection slides right (RAM); a LEFT call is the same
// picture flipped for Super and the quarterback only. The line does not change.
//
// THE CLOCK: three seconds. The quarterback fakes, sets, and the ball is gone
// on "one-thousand-three" — thrown, thrown away, or he is running with it.

/**
 * Q: open to the right and put the ball in Super's belly on the Dive track —
 * same mesh point as Split Wide Dive Right — then get back off it and set up
 * shallow, about five and a half deep. No boot: the fake is the mesh, and the
 * ball has to be out in three. Drawn to the right; on a LEFT call he opens left
 * and meshes at the mirror of this spot.
 */
const VIC_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.4, y: -1.9 },
      { x: 0.7, y: -2.4 },
      { x: -0.2, y: -4.2 },
      { x: -0.5, y: -5.6 },
    ],
  },
]

/** Y — 7 post from wide left. Tree geometry off (−13, 0), breaking inside. */
const VIC_Y: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -13, y: 15 },
      { x: -6.5, y: 21 },
    ],
  },
]

/** L — 1 slant from the left slot. Tree geometry off (−8.5, −1), breaking inside. */
const VIC_L: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -8.5, y: 3 },
      { x: -4, y: 6.5 },
    ],
  },
]

/** R — 1 slant from the right slot. Tree geometry off (+8.5, −1), breaking inside. */
const VIC_R: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 8.5, y: 3 },
      { x: 4, y: 6.5 },
    ],
  },
]

/** X — 9 fade from wide right. Tree geometry off (+13, 0), leaning to the sideline. */
const VIC_X: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 13, y: 8 },
      { x: 14.4, y: 15 },
      { x: 15, y: 23 },
    ],
  },
]

const VIC_ROUTES = { Y: VIC_Y, L: VIC_L, R: VIC_R, X: VIC_X } satisfies Partial<
  Record<OffPosId, Action[]>
>

/**
 * Super: the Dive fake, then the block. The first leg is the Dive's own track
 * (see DIVE_S) drawn as a fake — downhill at the playside hip of the center,
 * hands out, sold all the way to the line. It ends in a block bar just behind
 * the right A gap on purpose: that is where he plants, squares up, and takes the
 * first man who comes through. Who that is changes every snap, so no defender is
 * named — the picture says "fake to here, then block right here." The RIGHT gap
 * is only the default drawing: the quarterback calls the side before the snap,
 * to whichever A gap he thinks the blitz is coming through, and on a LEFT call
 * this whole arrow flips across the center.
 */
const VIC_S_FAKE_BLOCK: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 0.25, y: -3 },
      { x: 0.55, y: -1.9 },
    ],
  },
  {
    kind: 'block',
    path: [{ x: 0.9, y: -1 }],
  },
]

const VIC_EVEN_LINE = {
  LT: block('E-L'),
  LG: block('T-L'),
  RG: block('T-R'),
  RT: block('E-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

const victoryVs44: FrontPlan = {
  actions: {
    ...VIC_ROUTES,
    Q: VIC_Q,
    ...VIC_EVEN_LINE,
    // The double team, not the backer: two hats converging on T-R is the combo
    // picture, and it keeps the center's line from running upfield. Per Ryan.
    C: block('T-R'),
    S: VIC_S_FAKE_BLOCK,
  },
  assignments: {
    C: {
      rule: 'Ram — slide right. Stay home. Double with RG until the A-gap backer comes.',
      detail:
        'Nobody is on your nose, so do not chase anybody upfield — sit back and stay square. Get your hands on RG\'s man and help him double it, and keep your eyes on the 4-4 backer stacked in the right A gap, because he is the one who blitzes it. If he comes, come off the double and take him — and if the quarterback called the fake to your side, Super is coming off it into that same gap, so the two of you have him. If he never comes, you finish the snap on the double.',
    },
    S: {
      rule: 'Fake the Dive to the side the quarterback calls, then plant. The stacked backer is the man to expect.',
      detail:
        'The 4-4 has a backer stacked over each A gap, so whichever side the quarterback calls, there is one sitting right where you are faking — and the fake is exactly what pulls him downhill. Sell it hard, plant, and if he is coming, meet him in the hole — square, low, hands inside. If he drops instead, stay right there and take the next man through. The ball is out in three, so you only have to win for three.',
    },
  },
}

const victoryVs43: FrontPlan = {
  actions: {
    ...VIC_ROUTES,
    Q: VIC_Q,
    ...VIC_EVEN_LINE,
    // Same combo picture as the 4-4. The Mike is 4½ yards deep and the center
    // does not go get him — he doubles until the Mike declares. Per Ryan.
    C: block('T-R'),
    S: VIC_S_FAKE_BLOCK,
  },
  assignments: {
    C: {
      rule: 'Ram — slide right. Stay home. The Mike is yours if he comes, RG\'s man if he does not.',
      detail:
        'The Mike is straight over you and he is the only man who can get into the A gap — but he is four yards deep, so do not go get him. Sit back off the ball, put your hands on RG\'s man and double it, and watch the Mike the whole time. He blitzes, you leave the double and take him — Super is in whichever A gap the quarterback called, so if that is yours you have help. He drops, you never leave the double.',
    },
    S: {
      rule: 'Fake the Dive to the side the quarterback calls, then plant. The Mike is the man to expect.',
      detail:
        'The Mike is four yards deep, straight over the ball, so he is one step from either A gap — whichever side the quarterback calls, your fake is aimed right at him and he has to honor it. Sell it, plant in the gap, and take him if he comes. If he drops into the slant windows, that is the one man the slants have to beat, and you stay home and block whoever else shows.',
    },
  },
}

const victoryVs52: FrontPlan = {
  actions: {
    ...VIC_ROUTES,
    Q: VIC_Q,
    LT: block('E-L'),
    LG: block('T-L'),
    C: block('N'),
    RG: block('T-R'),
    RT: block('E-R'),
    S: VIC_S_FAKE_BLOCK,
  },
  assignments: {
    C: {
      rule: 'The nose is yours, alone.',
      detail: 'Odd front, five rushers, nobody to help you. Punch him, get your feet under you, and do not get pushed back into the quarterback.',
    },
    LG: {
      rule: 'Their tackle is on your outside shoulder — he is yours.',
      detail:
        'In a 5-2 their tackle lines up right on your outside shoulder, in the gap between you and LT, so he is YOURS and not the tackle\'s — LT has the end outside him. Short set to your outside, hands inside, and ride him past the quarterback. Nobody is coming to help: five rushers, five of us.',
    },
    RG: {
      rule: 'Their tackle is on your outside shoulder — he is yours.',
      detail: 'Same rule as LG, other side. Short outside set, hands inside, ride him past the quarterback. RT has the end outside you.',
    },
    S: {
      rule: 'Fake the Dive to the side the quarterback calls, then plant. Vs this front somebody IS coming.',
      detail:
        'Five rushers against five linemen means the extra man is yours every snap in a 5-2. Sell the fake, plant in the A gap the quarterback called, get your eyes up, and find him — most often it is a backer running through inside, or the end beating a tackle. Take the first one you see. You are the sixth blocker and you do not leave on this front, ever.',
    },
  },
}

const victoryAssignments: Record<OffPosId, Assignment> = {
  Y: {
    rule: '7 — Post.',
    detail:
      'Stem at the corner for fifteen, then break inside on an angle at the goal post and keep running. You are running the safety off — the fake is pulling him up and you are pulling him back, and either way he cannot sit on L\'s slant underneath you. If the safety bites the fake and never gets back, you are the shot.',
  },
  LT: {
    rule: 'Pass set. The end is yours, alone.',
    detail:
      'Kick-slide, hands inside, keep your feet moving. You are the blind side and nobody is behind you — Super is faking into an A gap on this play, not standing on the quarterback\'s hip — even on a LEFT call he lands inside next to LG, not out on your edge. Force the end to run the long way around. The ball is gone in three seconds, so make him take four.',
  },
  LG: {
    rule: 'Ram — slide right. Block the man in your gap.',
    detail: 'Set with the slide. Whoever shows in the gap to your right is yours; do not chase a man who goes away from you.',
  },
  C: {
    rule: 'Ram — slide right. Never go upfield. Covered: the nose is yours. Uncovered: sit back, double, and look for the blitz.',
    detail:
      'Ram means the whole line slides right. YOU DO NOT GO UPFIELD ON THIS PLAY — not one step, ever. It looks like the Dive to them, but it is a pass for you, and your job is behind the line, not in front of it. If there is a nose on you, forget the slide — he is yours by yourself. If nobody is on you, sit back off the ball with your feet under you and your eyes inside: put your hands on the guard\'s man and help him double it, and keep looking for a backer running the A gap. The second a blitzer shows, leave the double and take him. Super is coming off the fake into whichever A gap the quarterback called, so listen for the call — if it is your side, you and he have that gap together.',
  },
  RG: {
    rule: 'Ram — slide right. Block the man on you.',
    detail: 'Take the man over you and ride him past the quarterback. Hands inside, never reach.',
  },
  RT: {
    rule: 'Pass set. Block the end.',
    detail: 'You are the edge on the throwing side. Kick-slide and force him to run the long way around — three seconds is all you owe.',
  },
  X: {
    rule: '9 — Fade.',
    detail:
      'Straight up the field, leaning toward the sideline. Run past him and go get the ball over your outside shoulder. Your real job is to take the corner with you — R is slanting into the room you leave, and if the corner sits down on that slant, the ball comes to you over the top.',
  },
  L: {
    rule: '1 — Slant.',
    detail:
      'Three hard steps upfield, then plant and cut inside on an angle. Look for the ball RIGHT NOW — this is a three-second play and you are the first look. The backers are stepping up for the Dive fake; run behind them into the window Y\'s post opens. Catch it and turn upfield.',
  },
  R: {
    rule: '1 — Slant.',
    detail:
      'Same route as L, other side. Three steps, plant, cut inside, eyes to the quarterback right now. X is running the corner off outside of you, so the window is inside — get there fast and show him your numbers.',
  },
  S: {
    rule: 'Take the Dive fake to the side the quarterback calls. Plant in that A gap. Block the first man through.',
    detail:
      'The quarterback tells you the side before the snap — RIGHT or LEFT — and that is the A gap you fake into. He is guessing where the blitz is coming from, so expect a man. From there this is the Dive to you for two steps — same track, same downhill aim at the center\'s hip on the called side, hands out and ready, shoulders square. The only difference is the ball is not there. Do NOT slow down when it is not: plant right behind the A gap you were sent to, get your eyes up, and the first man who comes through is yours — step to him, hands inside, put him on his back foot. If nobody comes, you stay planted and square until the ball is gone. The snap you jog the fake is the snap the linebackers sit on the slants.',
  },
  Q: {
    rule: 'Call the fake side. Fake to Super, set, throw. Slants first. Ball out in THREE SECONDS.',
    detail:
      'Before the snap, look at the backers and guess which side the blitz is coming from — a backer walked up, a backer leaning, a safety creeping down — and tell Super that side, one word: RIGHT or LEFT. No read? Call RIGHT; that is the way the Dive goes and the way the line slides. Then open to the called side and put the ball in Super\'s belly exactly like the Dive — same footwork, ball on his second step — then pull it, get back off the fake and set up shallow. Count it: one-thousand-one is the fake, one-thousand-two you are set with your eyes on the slants, one-thousand-three the ball is GONE. Pick the slant on the side where the backer bit the fake and throw it out in front of him. If both backers sit and a safety bit the fake, hit Y on the post behind him. If a corner sits down on R\'s slant, X is open over the top. Nothing there on three? Throw it away or run. You NEVER hold it for a fourth count — Super is a blocker, not a checkdown, and the protection is built for three seconds, not five.',
  },
}

export const splitWideVictory: Play = {
  id: 'split-wide-victory',
  name: 'Victory',
  call: [
    { word: 'Split Wide', label: 'formation' },
    { word: 'Victory', label: 'play' },
  ],
  family: 'pass',
  formation: splitWide.id,
  direction: 'right',
  ballCarrier: 'Q',
  summary: 'Play-action off the Dive. Two quick slants inside, post and fade outside. Ball out in three seconds.',
  coachNotes: [
    'Quarterback: guess the blitz side and tell Super. Fake, set, throw. One-thousand-three and the ball is GONE.',
    'Super: fake the Dive to the side you were told, then plant in that A gap and block the first man through.',
    'Center: never go upfield. Double with the guard and watch for the blitz.',
  ],
  description:
    'Four receivers, left to right: post, slant, slant, fade. We run this after we have run the ball out of Split Wide, because it starts as the Dive — the quarterback puts the ball in Super\'s belly on the Dive track, and Super sells it into the line, then plants in the A gap and blocks whoever comes. Which A gap is the quarterback\'s call before the snap: he guesses where the blitz is coming from and sends the fake there, so Super is already standing in the hole the blitzer wants. The two slants are the play: the linebackers step up for the fake and the slants run in behind them. The post and the fade run the corners and the safety off so nobody is sitting in those windows. It is a quick throw — the ball is out in three seconds, thrown or thrown away.',
  assignments: victoryAssignments,
  vs: { '44': victoryVs44, '43': victoryVs43, '52': victoryVs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: [
    GATE,
    HB_NOTE,
    FORMATION_NOTE,
    'REWRITTEN 2026-09-09 FROM YOUR NOTE: "Routes should be LTR 7, 1, 1, 9. Designed for shorter passes, but also designed to run after we\'ve ran out of split wide formation before, so the new addition is a play-fake to the Super who then blocks or picks up the blitz. QB has to release it within 3 seconds." The old in/post/post/go picture, the five-step drop, and Super\'s scan-block on the quarterback\'s hip are all gone. What follows is what changed and the calls made along the way.',
    'SIDENOTE 2026-09-09, also yours: "QB tells Super what side to fake on, try to guess blitz side." Written in as a pre-snap call: the quarterback reads the backers, says RIGHT or LEFT to Super, and the fake, the mesh, and Super\'s plant all go to that A gap. RIGHT is the default with no read, because that is the Dive\'s side and the side the line slides. HOW he tells him is written as one word at the line; if you would rather it be a tap, a huddle call, or a word inside the play call, that is prose only. The diagram still draws the RIGHT version on all three fronts — a LEFT arrow for Super and the quarterback would either need a second diagram or a toggle, neither of which exists in the schema. The LINE DOES NOT FLIP with the call: RAM still slides right either way. That is on purpose — with the line sliding right, the free man is usually coming from the left, so a LEFT call puts Super exactly where the help is thinnest, and flipping the protection with the call would double the linemen\'s rules. Say so if you want BULL tied to a LEFT call instead.',
    'ROUTE ASSIGNMENT, left to right across the formation exactly as you said it: Y (wide left) 7 POST, L (left slot) 1 SLANT, R (right slot) 1 SLANT, X (wide right) 9 FADE. All four are straight off the tree in app/data/routes.ts at tree width — the slants break at three yards and finish at six and a half, four yards either side of the ball; the post breaks at fifteen; the fade leans out from eight. Every route now has a number, so the old "Y\'s in has no digit" problem is gone with the in. Same standing confirmation as before: "left to right" is read across the formation from the offense\'s side, not from the sideline.',
    'THE SLANTS ARE THE PLAY and they are drawn to the tree, which means both finish at six and a half yards, four yards off the ball on their own sides — eight yards apart, so they do not run into each other the way the two posts used to. Between them is the middle of the field the fake is supposed to empty. Against a 4-3 the Mike is sitting exactly there at 4½ yards, and if he does not bite the fake he is the one man in both windows; that is written into Super\'s 4-3 note and into the quarterback\'s read. If you would rather one slant clear deeper (a 7 for L, say, making it post/post/slant/fade), say so — it is one digit.',
    'THE PLAY-FAKE IS THE DIVE\'S OWN FOOTBALL. The quarterback opens to the right and meshes at the same spot Split Wide Dive Right meshes (drawn off DIVE_Q), and Super\'s fake leg is DIVE_S\'s first two points — downhill at the playside hip of the center. That is deliberate: the whole reason to run this after the Dive is that the first two steps look identical from a linebacker\'s depth. It is faked to the RIGHT A gap because the Dive ships right by default and the protection already slides right; a left-handed fake would also mean a left-handed Super spot and a different center rule. There is NO boot after the mesh — the quarterback pulls it and sets up straight back, about five and a half deep, because a boot fake costs a second you do not have in a three-count.',
    'SUPER AFTER THE FAKE: he PLANTS in the right A gap, a yard behind the line, and blocks the first man through. His arrow is the fake leg capped with a block bar right there — the picture says "fake to here, block here," not "run through the hole." He is still not aimed at a named defender on any front, because his man is whoever comes; but each front now tells him who to EXPECT: the stacked A-gap backer in the 4-4, the Mike in the 4-3, and "somebody, every snap" in the 5-2. The center\'s A-gap rule is unchanged, so on the two even fronts the center and Super share that gap — the center doubles until the backer comes, Super is already there when he does. Two men on one blitzer is the safe error. If you would rather Super come off the fake and set on the quarterback\'s hip like the old version, say so, but a back who fakes into the line and then backs out to the hip is neither a good fake nor a good blocker.',
    'THREE SECONDS is written as a count — one-thousand-one fake, one-thousand-two set, one-thousand-three gone — in the quarterback\'s assignment, and every lineman\'s detail now says the ball is out in three, so nobody is coached to hold a block for a five-step drop that is not coming. The description and the first coach note say it too. There is no field on the Play type for a clock, so it lives in the words; if you want it on the diagram or as a drill stat, that is new UI.',
    'THE LINE STILL PASS-SETS. You did not say to change the protection, so the tackles kick-slide and the interior still runs RAM (slide right) exactly as before, with the center\'s never-go-upfield rule intact. That is the honest weak spot of this play-fake: a pass-setting line is the first thing a coached linebacker keys, and the varsity Waggle sells its fake by having the line fire out like the run for one count. Options if you want a better fake: (a) leave it — the fake is Super\'s and the quarterback\'s, and 8th-grade backers key the back, not the guards; (b) have the interior take one Dive step and then set, which is a different technique to teach and a new arrow on three fronts. Drafted as (a). Say the word for (b).',
    'PROGRESSION: slants first, to the side where the backer bit; post if a safety bit the fake; fade if a corner squats on R\'s slant; away or run on three. No readKey is set — the quarterback is reading two linebackers, not one defender, and that is a progression, not a formal read. Say so if you want a formal key drawn.',
    'No ball flight is drawn — the throw depends on which backer bites. The diagram shows the four routes, the fake, and Super\'s block spot; the progression lives in the quarterback\'s assignment. Tell me if you want an arrow to the primary slant on the picture.',
    'THE 5-2 vs the fake: five down linemen means no A-gap backer to fool — the two backers are at depth over the guards and the fake pulls them straight down into the slant windows if they bite. Super\'s 5-2 note tells him to expect a man regardless, because five rushers against five linemen always leaves one over. Unchanged from the old version except for where he stands.',
    'Protection is drawn as RAM (slide right) so the language matches varsity p15 and the pass-pro page. That is why the center\'s arrow points to the right A-gap man rather than straight ahead. If you would rather this be straight man protection, say so and the center\'s picture changes on all three fronts.',
    MIRROR_NOTE_PREFIX +
      'Less needed now that the fake side is the quarterback\'s call — a LEFT call already moves the fake and Super without a second play. A full Victory Left would still be a different thing: line slides left (BULL), fade on the left, post on the right. That is one mirrorSplitWidePlay() call plus the prose if you want it. Not shipped until you say so, same ruling as the Keep.',
  ],
}

export const splitWidePlays: Play[] = [
  splitWideKeeperRight,
  splitWideKeeperLeft,
  splitWideDiveRight,
  splitWideDiveLeft,
  splitWideScreenRight,
  splitWideScreenLeft,
  splitWideVictory,
]
