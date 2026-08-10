/**
 * THE AUDIBLE — the numbered passing system, as a machine.
 *
 * This file used to hold three hand-authored "free call" plays. It now holds
 * the SYSTEM those three plays were examples of: `buildAudible()` turns any
 * call — protection plus two digits — into a real Play the diagram can draw.
 * The three examples from the scans are still here; they are the first three
 * calls fed to the machine, plus the hand-written coaching prose that the
 * generic builder cannot know.
 *
 * That is what makes /audible work: a kid can call something nobody has ever
 * drawn and the screen shows him what it looks like.
 *
 * Sources:
 *   varsity p14 — the route tree (already transcribed in app/data/routes.ts)
 *   varsity p15 — PASS PROTECTION, "RAM / BULL" (landscape, scanned sideways)
 *   varsity p16 — DROPBACK concept panels (landscape, scanned sideways)
 *   varsity p17 — SPRINT protection + the book's own printed play-call example
 *   varsity p18 — SPRINT concept panels (landscape, scanned sideways)
 *
 * THE SYSTEM, in one paragraph
 * ---------------------------------------------------------------------------
 * Every route on the tree has a digit:
 *
 *     0 block · 1 slant · 2 speed out · 3 hitch · 4 wheel
 *     5 curl  · 6 comeback · 7 post · 8 corner · 9 fade
 *
 * A call is FORMATION + PROTECTION + DIGITS. The digits are read
 * OUTSIDE-TO-IN on the split-end side. In Red the split end (X) is the
 * outside man and the right wing (R) is the man inside him, so the first
 * digit is always X's and the second digit is always R's. In Black it is the
 * mirror: X is still the outside man, and the left wing (L) is inside him.
 *
 * WHO CARRIES A DIGIT TODAY
 * ---------------------------------------------------------------------------
 * As the system stands, the digits go to three men: the split end and the two
 * wings. Y, the tight end, is a zero on the calls we have — which is part of
 * why 0 is on the tree at all.
 *
 * OPEN: we are exploring how to call the Y to a route in this audible system.
 * It may be a fourth number. Awaiting confirmation, so nothing here sends him
 * out yet.
 *
 * TWO DIGITS, OR THREE
 * ---------------------------------------------------------------------------
 * Varsity p16/p18 label their panels "(x2) - 12, (x3) - 112" — a digit per
 * receiver on the surface. Our normal call is TWO digits, and then the
 * backside wing has a standing rule: he runs a 2, a speed out, the OPPOSITE
 * way. Call a THIRD digit and that rule is off — the third digit is his, and
 * he runs it off his own side.
 *
 * THE DASH TAG
 * ---------------------------------------------------------------------------
 * "Dash" rides after the protection word — Red Ram Dash 33. It means Super
 * does not block: he releases out of the backfield to the flat on the
 * SPLIT-END side, the same side the digits are on. It works on either
 * protection, and it trades a blocker for a fourth target.
 *
 * THE PROTECTIONS
 * ---------------------------------------------------------------------------
 * RAM / BULL (dropback, p15). "RAM = SLIDE TO RIGHT. BULL = SLIDE TO LEFT.
 * SUPER — OFF HIP OF TACKLE AWAY. DEFEND YOUR GAP!" The picture on p15 is
 * drawn as BULL: every one of the five linemen has a stem capped with a block
 * bar about half a man to his LEFT, and Super's line runs up and to the RIGHT
 * to a bar on the inside hip of the right tackle. We always slide TOWARD the
 * split-end side, so Red is Ram and Black is Bull — which means p15's drawn
 * picture is literally our Black dropback and Red is its mirror.
 *
 * SPRINT (p17). "SPRINT RT: REACH RT — SUPER: PLAYSIDE EDGE." Same gap
 * ownership as the slide, different technique and a different job for Super:
 * on p17 every lineman's arc runs to the call side and hooks up one gap over,
 * the right tackle's arc hooks up OUTSIDE him, and Super's long arc comes out
 * of the backfield and caps with a bar beyond the tackle — the playside edge.
 * "Sprint: Gain Depth — Sprint Downhill Toward Sideline."
 *
 * THE THREE EXAMPLES
 * ---------------------------------------------------------------------------
 *   Red Ram 33      — dropback, both digits the same. The simplest call there
 *                     is. (varsity p16, panel "(x2) - 33")
 *   Red Ram 12      — dropback, two digits that work together: the slant runs
 *                     in behind the out. (varsity p16, panel "(x2) - 12")
 *   Red Sprint Right 54 — the book's own printed example: "Red - Sprint Rt 54 —
 *                     Reach To The Right — 54 = WR Curl, Wing Wheel."
 *                     (varsity p17 text, drawn on p18 panel "(x2) - 54")
 *
 * Each is authored to the RIGHT out of Red and mirrored into Black.
 */

import type {
  Action,
  Assignment,
  FormationId,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
  Pt,
} from '../../types/football'
import { mirrorPlay } from '../../utils/mirror'
import { routes } from '../routes'

// ---------------------------------------------------------------------------
// Small authoring helpers
// ---------------------------------------------------------------------------

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

/**
 * A block with nobody in the gap: a short set step into the gap you own,
 * capped with the block bar. Used where the front leaves a lineman uncovered
 * and the slide still makes that gap his.
 */
const setBlock = (path: Pt[]): Action[] => [{ kind: 'block', path }]

const ROUTE_BY_NUM = new Map(routes.map((r) => [r.num, r]))

/**
 * Put a numbered route from app/data/routes.ts onto a receiver.
 *
 * `side` is +1 when the receiver's sideline is to the offense's right (the
 * tree is drawn once with +x toward the receiver's OUTSIDE and flipped for
 * the other side of the formation, per app/data/routes.ts).
 *
 * `widen` stretches the LATERAL part of the route only — depths and breaks
 * are never touched. It exists for one reason: the wing lines up 8 yards
 * inside the split end, so his out and his wheel have to cover more ground
 * sideways to finish at the same landmark on the field. That is what the
 * scans draw (p16 "12": the wing's out finishes OUTSIDE the split end's
 * alignment; p18 "54": the wing's wheel turns up OUTSIDE the curl).
 *
 * Zero is not a route, it is a block, so it comes back with the block kind —
 * otherwise a called 0 would draw a two-yard "route" into a defender.
 */
function routeOn(num: number, from: Pt, side: 1 | -1, widen = 1): Action[] {
  const def = ROUTE_BY_NUM.get(num)
  if (!def) throw new Error(`audible: no route numbered ${num}`)
  return [
    {
      kind: num === 0 ? 'block' : 'route',
      path: def.path.map((p) => ({ x: from.x + p.x * widen * side, y: p.y })),
    },
  ]
}

/**
 * How far the INSIDE receiver's route has to be stretched sideways.
 *
 * The wing starts 7.8 yards inside the split end, so any route that finishes
 * near the sideline has to cover that ground too or it dies in traffic behind
 * the outside man. Only two of these were measured off the scans — the 2 off
 * p16's "12" panel and the 4 off p18's "54" panel. The rest of the
 * outside-breaking routes are estimated from those two so that a called
 * audible draws something honest; see the review note.
 */
const WING_WIDEN: Record<number, number> = {
  0: 1, // block — no stretch
  1: 1, // slant — breaks inside, already going the short way
  2: 2, // speed out — MEASURED off p16 "(x2) - 12"
  3: 1, // hitch — straight back at the quarterback
  4: 1.7, // wheel — MEASURED off p18 "(x2) - 54"
  5: 1, // curl — breaks inside
  6: 1.7, // comeback — estimated
  7: 1, // post — breaks inside
  8: 1.5, // corner — estimated
  9: 1.5, // fade — estimated
}

/** Red alignments (app/data/formations.ts) — the origins routes are hung on. */
const AT_X: Pt = { x: 12, y: 0 }
const AT_R: Pt = { x: 4.2, y: -1 }
const AT_L: Pt = { x: -5.7, y: -1 }

// ---------------------------------------------------------------------------
// The five linemen + the tight end.
//
// Slide right (Ram) and reach right (Sprint) own the SAME gaps — each man is
// responsible for the gap to his playside. The difference between the two
// protections is technique and what Super does, not who blocks whom. So one
// line map serves both, per front.
// ---------------------------------------------------------------------------

/** 4-4: tackles head up on our guards, ends outside our tackles, two inside backers. */
const LINE_44 = {
  Y: block('E-L'),
  LT: block('T-L'),
  LG: block('B-L'),
  C: block('B-R'),
  RG: block('T-R'),
  RT: block('E-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

/** 4-3: same four down men, but only the Mike threatens the two A gaps. */
const LINE_43 = {
  Y: block('E-L'),
  LT: block('T-L'),
  LG: setBlock([{ x: -0.7, y: 0.9 }]),
  C: block('M'),
  RG: block('T-R'),
  RT: block('E-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

/**
 * 5-2 (odd): five down men means there is no empty gap to slide into. The
 * protection stops being a slide and becomes man-on — everybody blocks the
 * man over him, and the two uncovered guards climb to the two backers.
 */
const LINE_52 = {
  Y: block('E-L'),
  LT: block('T-L'),
  LG: block('B-L'),
  C: block('N'),
  RG: block('B-R'),
  RT: block('T-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

const LINE: Record<FrontId, Partial<Record<OffPosId, Action[]>>> = {
  '44': LINE_44,
  '43': LINE_43,
  '52': LINE_52,
}

// ---------------------------------------------------------------------------
// Super and the quarterback.
// ---------------------------------------------------------------------------

/**
 * Dropback Super, p15: "OFF HIP OF TACKLE AWAY." Red slides right, so Super
 * sets at the inside hip of the LEFT tackle and takes the first man through
 * that gap. Drawn on p15 as a line out of the backfield capping with a bar
 * between the away guard and the away tackle.
 */
const S_RAM_HIP: Action[] = setBlock([
  { x: -1.1, y: -3.5 },
  { x: -2.3, y: -2.1 },
])

/**
 * Dropback Super vs the odd front: nothing is left over inside, so he has the
 * end away from the tight end instead of a hip.
 */
const S_RAM_52: Action[] = [
  { kind: 'run', path: [{ x: 2.2, y: -4.1 }] },
  { kind: 'block', targetId: 'E-R' },
]

/**
 * DASH — the tag that takes Super out of the protection.
 *
 * Coach Ryan's term: on Dash, Super does not block anybody. He releases out of
 * the backfield toward the SPLIT-END side (the side the digits are on, right
 * out of Red) and shows up in the flat. It is a route, not a block, so the
 * diagram draws him as a receiver.
 *
 * This works on either protection. It costs us the blocker Super would have
 * been — off the away tackle's hip on a dropback, or the playside edge on a
 * sprint — which is the trade the quarterback has to know he is making.
 */
const S_DASH: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 2.6, y: -4.2 },
      { x: 5.6, y: -3.1 },
      { x: 8.6, y: -1 },
      { x: 10.2, y: 2 },
    ],
  },
]

/** Sprint Super, p17: out of the backfield, flat to the call side, block the playside edge. */
const sprintSuper = (edgeId: string): Action[] => [
  { kind: 'run', path: [{ x: 2.5, y: -4.2 }, { x: 4.6, y: -3.3 }] },
  { kind: 'block', targetId: edgeId },
]

/** Five-step drop, straight back off the midline. */
const Q_DROP: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.3, y: -3.7 },
      { x: -0.5, y: -6.2 },
    ],
  },
]

/** p17: "Gain Depth — Sprint Downhill Toward Sideline." */
const Q_SPRINT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.6, y: -2.8 },
      { x: 1.6, y: -3.7 },
      { x: 4.6, y: -3.3 },
      { x: 7.6, y: -2.3 },
    ],
  },
]

// ---------------------------------------------------------------------------
// The backside wing — a standing rule when the call is only two digits.
// ---------------------------------------------------------------------------

/**
 * Coach Ryan's rule: the wing away from the action runs a 2 — a speed out, the
 * OPPOSITE way — whenever the call is two digits. He is the outside man on his
 * own side (only Y is inside him), so unlike the called wing he has no ground
 * to make up sideways; the route runs at its tree width.
 *
 * If a THIRD digit is called it is his, and it replaces this.
 */
const L_BACKSIDE_OUT: Action[] = routeOn(2, AT_L, -1)

// ---------------------------------------------------------------------------
// Assignment text — the front-independent teaching table.
// ---------------------------------------------------------------------------

const a = (rule: string, detail: string): Assignment => ({ rule, detail })

/** Everything that is the same on every dropback call out of Red. */
const DROPBACK_JOBS = {
  Y: a(
    'Zero — block. You have the end on your side.',
    "On the calls we have, the digits go to the split end and the two wings, so yours is a zero: stay in and block. Inside foot back, take the end outside our tackle and ride him past the quarterback. If he tries to cross your face, you have him — never let him inside. (We are working on a way to call you to a route in this system, maybe as a fourth number — until that is confirmed, block.)",
  ),
  LT: a(
    'Ram — slide toward the split end. Block the man in your gap on the slide side.',
    'Short kick with your slide-side foot, hands inside, and defend the gap between you and the guard. The man over the guard is the one who attacks it. Ram means the whole line moves toward the split end together — you are the back end of that.',
  ),
  LG: a(
    'Ram — slide toward the split end. Block the man in your gap on the slide side.',
    'Your gap is the one between you and the center. If a down lineman is in it, he is yours. If it is empty, set in it anyway and take the first jersey that shows up — that is what "DEFEND YOUR GAP" means.',
  ),
  C: a(
    'Snap, then slide toward the split end. Block the man in your gap on the slide side.',
    'Snap it and get your slide-side hand and foot moving the same instant. Your gap is between you and the guard on the slide side. Never turn your shoulders — square, and let him come to you.',
  ),
  RG: a(
    'Ram — slide toward the split end. Block the man in your gap on the slide side.',
    'The man over you can slant either way; step with the slide, get your hands on his near number and wall him. Do not chase a man who goes away from you — the guy behind you has him.',
  ),
  RT: a(
    'Ram — slide toward the split end. You have the end outside you.',
    'You are the last man on the slide, so your gap is the outside one. Kick, get depth, and turn the rusher around the pocket instead of into it. Push him past the quarterback, never let him under you.',
  ),
  S: a(
    'Off the inside hip of the tackle AWAY from the slide.',
    'The slide goes toward the split end, so you set at the inside hip of the tackle AWAY from the slide and you have the first man through there. Chest square, eyes inside-out. If nobody comes, stay home — you are the last thing between a blitzer and the quarterback.',
  ),
  Q: a(
    'Five-step drop. Read the outside digit first.',
    'Straight back off the midline, five steps, ball at your chest. The call tells you where to look: the first digit is X and the second is the wing, and you work outside-to-in exactly the way the call is said. Feet set on the last step, then throw.',
  ),
  L: a(
    'Backside wing — two digits called, so you run the 2. Speed out, AWAY.',
    'Nobody said a third number, so you have the standing rule: a speed out the OPPOSITE way from the call. Five yards, roll your shoulders, break flat for YOUR sideline. You are the outlet if the quarterback comes off the digits, and you pull a defender away from them either way.',
  ),
} satisfies Partial<Record<OffPosId, Assignment>>

/** Everything that is the same on every sprint call out of Red. */
const SPRINT_JOBS = {
  Y: a(
    'Zero — block. You have the end on your side.',
    'No digit for you on this call, so it is a zero — a route for the Y is still being worked out. You are the back side of a sprint: the quarterback is running away from you, so all you have to do is keep the end from chasing him down. Get your hat across him and stay on your feet.',
  ),
  LT: a(
    'Sprint — REACH to the call side. Block the man in your gap that way.',
    'Reach means get your head and your playside hand across him, not just push. Rip your call-side arm through and run your feet — the pocket is moving to the call side and you have to move with it.',
  ),
  LG: a(
    'Sprint — REACH to the call side. Block the man in your gap that way.',
    'Same gap as Ram, harder technique. Head across, hands inside, work up the field toward the sideline. If your gap is empty, keep running to the call side and take the first man who crosses your face.',
  ),
  C: a(
    'Snap, then REACH to the call side. Block the man in your gap that way.',
    'Snap and reach in one motion — that is the hardest block on the play. Get your call-side hand on his playside number and turn him. If you get beat, get beat from behind, never from the front side.',
  ),
  RG: a(
    'Sprint — REACH to the call side. Block the man in your gap that way.',
    'You are already on the call side, so this is a straight reach on the man over you. Turn his shoulders toward our sideline and the throwing lane opens up behind him.',
  ),
  RT: a(
    'Sprint — REACH the man outside you.',
    'You have the widest down lineman. Reach him and run him UP the field — Super is coming outside of you for the next man, so your job is to seal the inside of that alley.',
  ),
  S: a(
    'Super — block the PLAYSIDE EDGE.',
    'Straight out of the backfield to the call side, flat and fast. Find the outermost rusher on that side and kick him out. You are the edge of the pocket and the quarterback is running straight at your outside shoulder — do not let anything under you.',
  ),
  Q: a(
    'Sprint to the call side. Gain depth, then sprint downhill toward the sideline.',
    "Open to the call side, get depth on your first three steps so you clear the tackle, then flatten out and run downhill at the sideline. Shoulders square to where you are throwing. Work outside-to-in through the digits, and if it is not there, run — a sprint-out quarterback who tucks it is not a mistake.",
  ),
  L: a(
    'Backside wing — two digits called, so you run the 2. Speed out, AWAY.',
    'Same standing rule as any two-digit call: speed out the OPPOSITE way from the sprint. Five yards, break flat for YOUR sideline. The quarterback is running away from you, so you are the throwback — get your eyes back to him the second you break and stay alive.',
  ),
} satisfies Partial<Record<OffPosId, Assignment>>

// ---------------------------------------------------------------------------
// Per-front assignment overrides — only where the FRONT changes the job.
// ---------------------------------------------------------------------------

const OVERRIDES_43: Partial<Record<OffPosId, Assignment>> = {
  LG: a(
    'Nobody in your gap. Set in it and take the first man through.',
    'This front only has four down linemen and none of them is in the gap between you and the center. Do not go looking for work — set in the gap, keep your eyes on the Mike, and blow up anybody who blitzes that gap.',
  ),
  C: a(
    'You have the Mike.',
    'He is stacked head up over the ball, and in this front he is the only backer who can get to the quarterback inside. Snap, slide with the protection, and put your hat on him the moment he moves.',
  ),
}

const OVERRIDES_52: Partial<Record<OffPosId, Assignment>> = {
  LT: a(
    'Odd front — no slide. Take the man on your nose.',
    'Five down linemen means every gap already has somebody in it, so there is nothing to slide into. The tackle is head up on you: he is yours, all by yourself, all day.',
  ),
  LG: a(
    'Odd front — uncovered. Climb to the backer on your side.',
    'Nobody is on you in a 5-2. Set, get your eyes on the backer behind the nose, and go get him. If he drops into coverage, stay square and help the center.',
  ),
  C: a(
    'Odd front — the nose is on you. He is yours.',
    "A man on your nose is what makes this an ODD front. Snap and get into him immediately — you cannot let a nose guard walk you back into the quarterback's lap.",
  ),
  RG: a(
    'Odd front — uncovered. Climb to the backer on your side.',
    'Same as the other guard, other side. Nobody on you, so the backer behind the nose on your side is yours.',
  ),
  RT: a(
    'Odd front — take the man on your nose.',
    'The tackle is head up on you instead of an end being outside you. Block him and stay square; Super has the end outside.',
  ),
}

const S_52_DROPBACK_ASSIGNMENT: Assignment = a(
  'Odd front — you have the END on the split-end side.',
  'Against a 5-2 every inside gap already has a blocker, so there is no hip for you to sit on. Come out of the backfield to the split-end side and kick the end out. If you stay inside on this front, nobody blocks him.',
)

// ---------------------------------------------------------------------------
// Front plan builders
// ---------------------------------------------------------------------------

/** Skill actions = the called digits + the backside wing. */
type Skill = Partial<Record<OffPosId, Action[]>>

/**
 * On Dash, Super is a receiver on every front, so the per-front Super rules
 * (the hip, the 5-2 end, the playside edge) do not apply and neither does the
 * 5-2 Super assignment override.
 */
function dropbackPlans(skill: Skill, dash: boolean): Record<FrontId, FrontPlan> {
  return {
    '44': {
      actions: { ...LINE['44'], ...skill, S: dash ? S_DASH : S_RAM_HIP, Q: Q_DROP },
    },
    '43': {
      actions: { ...LINE['43'], ...skill, S: dash ? S_DASH : S_RAM_HIP, Q: Q_DROP },
      assignments: { ...OVERRIDES_43 },
    },
    '52': {
      actions: { ...LINE['52'], ...skill, S: dash ? S_DASH : S_RAM_52, Q: Q_DROP },
      assignments: dash
        ? { ...OVERRIDES_52 }
        : { ...OVERRIDES_52, S: S_52_DROPBACK_ASSIGNMENT },
    },
  }
}

function sprintPlans(skill: Skill, dash: boolean): Record<FrontId, FrontPlan> {
  const superOn = (edgeId: string) => (dash ? S_DASH : sprintSuper(edgeId))
  return {
    '44': {
      actions: { ...LINE['44'], ...skill, S: superOn('O-R'), Q: Q_SPRINT },
    },
    '43': {
      actions: { ...LINE['43'], ...skill, S: superOn('B-R'), Q: Q_SPRINT },
      assignments: { ...OVERRIDES_43 },
    },
    '52': {
      actions: { ...LINE['52'], ...skill, S: superOn('E-R'), Q: Q_SPRINT },
      assignments: { ...OVERRIDES_52 },
    },
  }
}

// ---------------------------------------------------------------------------
// Shared review notes — every judgment call in this file, for Coach Ryan.
// ---------------------------------------------------------------------------

const sharedReviewNotes = [
  'DIGIT ORDER — confirmed off the scans, not assumed. p18 panel "(x3) - 542" draws the split end on a curl, the next man in on a wheel, and the innermost on a speed out, in that order right-to-left from the sideline. p16 panel "(x2) - 92" draws the split end on a fade and the man inside him on a speed out. Outside-to-in on the split-end side is what the book actually draws.',
  'TWO DIGITS OR THREE — the normal call is two digits, X first and the wing inside him second. A third digit belongs to the BACKSIDE wing and cancels his standing out. That is Coach Ryan\'s rule, given directly, and it is what the caller on /audible now offers.',
  'THE Y IS AN OPEN QUESTION — on every dropback and sprint panel in the scans the tight end is drawn with no route, so as it stands the digits belong to the split end and the two wings and Y is a zero. We are exploring how to call the Y to a route in this audible system; it may be the fourth number. Awaiting confirmation, so nothing in here releases him yet — say the word and we will wire it up.',
  "THE BACKSIDE WING'S STANDING RULE IS A 2 — Coach Ryan's rule: on a two-digit call the wing away from the action runs a speed out the OPPOSITE way, on both protections. That REPLACES what the scans happened to draw (p16 had him arcing to the backside flat on dropback, p18 had him on a post under sprint) — the coach's standing rule wins over one drawn panel. His out runs at tree width, not the stretched width the called wing uses, because he is already the outside man on his side.",
  'DASH — Coach Ryan\'s term, not in the scans. "Dash" after the protection word means Super releases instead of blocking and goes to the flat on the SPLIT-END side — the side the digits are on. It is offered on both dropback and sprint. On dropback that gives up the away-tackle hip; on sprint it gives up the playside edge, so the quarterback has no edge blocker and has to know it. The flat landmark drawn here (about 10 yards out, 2 yards past the line) is authored — say the word if you want him flatter, deeper, or checking release first.',
  'RAM vs BULL DIRECTION — p15 is one picture titled "RAM / BULL". The drawn arrows all cap about half a man to the LEFT of each lineman and Super\'s arrow runs up-and-RIGHT to a bar on the inside hip of the right tackle, so the picture as drawn is BULL (slide left, Super off the hip of the tackle away). We slide TOWARD the split-end side so the free edge is always on the tight end\'s side where Y is standing — that makes Red = Ram and Black = Bull, and it makes p15\'s drawn picture literally our Black dropback. If you would rather always slide away from the throw, say so and both dropback plays flip.',
  "SUPER'S DROPBACK BAR — on p15 Super's block bar sits BETWEEN the away guard and the away tackle and behind the line, not outside the tackle. That is transcribed as drawn: he sets at the away tackle's inside hip at depth. It is written as a set-step block rather than a block on a named defender, because in an even front nobody is standing there pre-snap.",
  'SLIDE vs REACH TARGETS — Ram (slide right) and Sprint Right (reach right) give the linemen the SAME gaps; the difference on p15 vs p17 is technique and Super\'s job. So one line map serves both protections in this file. Flag it if you teach different gap ownership for the two.',
  'VS THE 5-2 THE PROTECTION IS A DIFFERENT PICTURE — five down men means there is no empty gap to slide into, so the protection becomes man-on: Y has the end, both tackles have the man on their nose, the center has the nose guard, and the two uncovered guards climb to the two backers. On DROPBACK that leaves Super with the end on the split-end side instead of a hip (the p15 rule cannot be run against this front). On SPRINT he still has the playside edge, which against a 5-2 is that same end. This is the biggest front-driven change in the file — please eyeball the 5-2 diagrams first.',
  'THE PLAYSIDE EDGE, BY FRONT — p17 says "SUPER: PLAYSIDE EDGE" without naming anybody. Resolved here as the outermost rusher on the call side: the walked-up backer in the 4-4, the Sam in the 4-3, the end in the 5-2. Confirm.',
  "THE QUARTERBACK'S PATH IS NOT DRAWN ON p15 OR p16 — the dropback panels show him as a circle with no line. The five-step drop here is authored, not transcribed. The SPRINT path IS drawn (p18, the long black arrow that dips behind Super and then runs flat toward the sideline) and follows p17's words, \"Gain Depth — Sprint Downhill Toward Sideline.\"",
  "WING ROUTE WIDTH — the wing lines up eight yards inside the split end, so his out and his wheel have to cover more ground sideways to finish at the same spot on the field. The route paths here stretch that lateral distance (and only the lateral distance — every depth and every break point comes straight out of app/data/routes.ts). That is what the scans draw: on p16 \"12\" the wing's out finishes outside the split end's alignment, and on p18 \"54\" the wheel turns up outside the curl.",
  'WING WIDTH FOR THE ROUTES THE SCANS NEVER DREW — /audible lets a kid call any two digits, which means the wing can be sent on routes varsity never drew for him. Only the 2 (off p16) and the 4 (off p18) are measured; the 6, 8 and 9 are stretched by an estimated amount so a called audible draws something honest, and the inside-breaking routes (1, 3, 5, 7) are not stretched at all. Those three estimates are the numbers to eyeball.',
  'THE VARSITY DROPBACK AND SPRINT PAGES ARE DRAWN IN SPREAD SETS — p16 and p18 use 2x2 and 3x1 out of Twins/Spread/Over/Trips, all of which are cut from our book. Only the ROUTE CONCEPTS and the numbering are transcribed from them; the alignments are our Red and Black from p1, and the protections come from p15 and p17.',
]

// ---------------------------------------------------------------------------
// THE MACHINE — one call in, one Play out.
// ---------------------------------------------------------------------------

export type Protection = 'dropback' | 'sprint'

/** A digit off the route tree: 0–9. */
export type Digit = number

/**
 * A call: which protection, and the digits read outside-to-in on the
 * split-end side. `outside` is always X's; `inside` is always the called
 * wing's; the optional third digit is the BACKSIDE wing's.
 *
 * Two digits is the normal call — the backside wing then has his standing
 * rule, a speed out away. Say a third digit and you have bought him a route.
 * Y never has one either way.
 */
export interface AudibleCall {
  protection: Protection
  outside: Digit
  inside: Digit
  /** Optional third digit — the backside wing's route. */
  backside?: Digit
  /** "Dash": Super releases to the split-end-side flat instead of blocking. */
  dash?: boolean
}

/** Hand-written prose the generic builder cannot know. Optional. */
export interface AudibleAuthoring {
  id?: string
  description?: string
  /** Overrides on top of the generated table — keyed by RED position ids. */
  assignments?: Partial<Record<OffPosId, Assignment>>
  reviewNotes?: string[]
}

export const PROTECTION_LABELS: Record<Protection, Record<'red' | 'black', string>> = {
  dropback: { red: 'Ram', black: 'Bull' },
  sprint: { red: 'Sprint Right', black: 'Sprint Left' },
}

/** "33", "54", "542" — the digits as they are said in the huddle. */
export const digitsOf = (call: AudibleCall): string =>
  `${call.outside}${call.inside}${call.backside ?? ''}`

/** "Red Ram 33", "Black Sprint Left Dash 54". Dash rides after the protection. */
export function callNameOf(call: AudibleCall, formation: 'red' | 'black'): string {
  const form = formation === 'red' ? 'Red' : 'Black'
  const tag = call.dash ? ' Dash' : ''
  return `${form} ${PROTECTION_LABELS[call.protection][formation]}${tag} ${digitsOf(call)}`
}

const routeNameOf = (num: Digit): string => ROUTE_BY_NUM.get(num)?.name ?? `Route ${num}`
const routeDetailOf = (num: Digit): string => ROUTE_BY_NUM.get(num)?.description ?? ''

/**
 * The two receiver jobs, written straight off the route tree. Every audible
 * gets these; the three examples then paste their hand-written versions over
 * the top.
 */
function digitAssignments(call: AudibleCall): Partial<Record<OffPosId, Assignment>> {
  const jobs: Partial<Record<OffPosId, Assignment>> = {
    X: a(
      `First digit: ${call.outside} — ${routeNameOf(call.outside).toLowerCase()}.`,
      `You are the outside man on the split-end side, so the FIRST digit is always yours. ${routeDetailOf(call.outside)}`,
    ),
    R: a(
      `Second digit: ${call.inside} — ${routeNameOf(call.inside).toLowerCase()}.`,
      `You are the inside man, so you get the SECOND digit. ${routeDetailOf(call.inside)}`,
    ),
  }

  // A third digit buys the backside wing a route and cancels his standing out.
  if (call.backside !== undefined) {
    jobs.L = a(
      `Third digit: ${call.backside} — ${routeNameOf(call.backside).toLowerCase()}.`,
      `Three numbers were called, so the last one is yours and you do NOT run your standing out. Run it off your own side. ${routeDetailOf(call.backside)}`,
    )
  }

  if (call.dash) {
    jobs.S = a(
      'DASH — you are not blocking. Release to the flat on the split-end side.',
      'Dash means you leave the backfield. Get out toward the same side the digits are on and get to about three yards deep in the flat, numbers back to the quarterback. Nobody is blocking your gap now, so RUN — the sooner you are a target, the sooner the ball can come out.',
    )
  }

  return jobs
}

/** The generic, no-prose description of a call — used when nothing is authored. */
function describeCall(call: AudibleCall, formation: 'red' | 'black'): string {
  const wing = formation === 'red' ? 'the right wing' : 'the left wing'
  const backWing = formation === 'red' ? 'the left wing' : 'the right wing'
  const side = formation === 'red' ? 'RIGHT' : 'LEFT'
  const superJob = call.dash
    ? `sends Super out of the backfield to the ${side} flat — "Dash" means he releases instead of blocking`
    : call.protection === 'dropback'
      ? 'sets Super off the inside hip of the tackle away from the slide'
      : 'sends Super to block the playside edge'
  const prot =
    call.protection === 'dropback'
      ? `"${PROTECTION_LABELS.dropback[formation]}" slides the line ${side}, ${superJob}, and the quarterback takes a five-step drop`
      : `"${PROTECTION_LABELS.sprint[formation]}" reaches the line ${side}, ${superJob}, and sprints the quarterback downhill toward that sideline`
  const backside =
    call.backside === undefined
      ? `${backWing} runs his standing rule — a 2, speed out, the opposite way`
      : `the third digit, the ${call.backside}, belongs to ${backWing}, so he runs a ${routeNameOf(call.backside).toLowerCase()} off his own side instead of his standing out`
  return (
    `${callNameOf(call, formation)}. ${prot}. ` +
    `Then the digits, read outside-to-in on the split-end side: the ${call.outside} belongs to X, the outside man, ` +
    `so he runs a ${routeNameOf(call.outside).toLowerCase()}; the ${call.inside} belongs to ${wing}, the man inside him, ` +
    `so he runs a ${routeNameOf(call.inside).toLowerCase()}. Y blocks on this call — a way to send him on a route is still being worked out — and ${backside}.`
  )
}

/**
 * Build the RED version of a call. Black is this play mirrored — see
 * `buildAudible`.
 */
function buildAudibleRed(call: AudibleCall, authoring: AudibleAuthoring = {}): Play {
  const skill: Skill = {
    X: routeOn(call.outside, AT_X, 1),
    R: routeOn(call.inside, AT_R, 1, WING_WIDEN[call.inside] ?? 1),
    // The backside wing is the outside man on his own side, so his routes run
    // at tree width — no stretch, unlike the called wing inside the split end.
    L: call.backside === undefined ? L_BACKSIDE_OUT : routeOn(call.backside, AT_L, -1),
  }

  const base = call.protection === 'dropback' ? DROPBACK_JOBS : SPRINT_JOBS

  const assignments = {
    ...base,
    ...digitAssignments(call),
    ...authoring.assignments,
  } as Record<OffPosId, Assignment>

  return {
    id: authoring.id ?? `audible-${call.protection}${call.dash ? '-dash' : ''}-${digitsOf(call)}-red`,
    name: `Audible ${call.dash ? 'Dash ' : ''}${digitsOf(call)}`,
    callName: callNameOf(call, 'red'),
    family: 'pass',
    formation: 'red',
    direction: 'right',
    ballCarrier: 'Q',
    description: authoring.description ?? describeCall(call, 'red'),
    assignments,
    vs:
      call.protection === 'dropback'
        ? dropbackPlans(skill, call.dash === true)
        : sprintPlans(skill, call.dash === true),
    reviewNotes: authoring.reviewNotes ?? sharedReviewNotes,
  }
}

/**
 * Build any call, either formation. This is the whole point of the file:
 * /audible calls it with whatever the kid says out loud.
 *
 * Black is generated by mirroring Red — our three fronts are left/right
 * symmetric and varsity p1 draws Black as an exact mirror — so the only
 * things that change by hand are the id, the protection WORD (Ram/Bull,
 * Sprint Right/Sprint Left name directions, not sides of a play) and the prose.
 */
export function buildAudible(
  call: AudibleCall,
  formation: 'red' | 'black',
  authoring: AudibleAuthoring = {},
  blackAuthoring: AudibleAuthoring = {},
): Play {
  const redPlay = buildAudibleRed(call, authoring)
  if (formation === 'red') return redPlay

  return mirrorPlay(redPlay, {
    id:
      blackAuthoring.id ??
      (authoring.id
        ? authoring.id.replace(/-red$/, '-black')
        : `audible-${call.protection}${call.dash ? '-dash' : ''}-${digitsOf(call)}-black`),
    callName: callNameOf(call, 'black'),
    formation: 'black' as FormationId,
    description: blackAuthoring.description ?? describeCall(call, 'black'),
    reviewNotes: blackAuthoring.reviewNotes ?? redPlay.reviewNotes,
  })
}

// ---------------------------------------------------------------------------
// THE THREE EXAMPLES — the calls the scans actually drew, with their prose.
// ---------------------------------------------------------------------------

/** What /audible shows in its "Examples" fieldset. */
export interface AudibleExample {
  /** Stable key for the button, and the digits the kid says: '33'. */
  digits: string
  call: AudibleCall
  /** One line for the button — what the two digits buy you. */
  blurb: string
  red: Play
  black: Play
}

function example(
  call: AudibleCall,
  blurb: string,
  redAuthoring: AudibleAuthoring,
  blackAuthoring: AudibleAuthoring,
): AudibleExample {
  return {
    digits: digitsOf(call),
    call,
    blurb,
    red: buildAudible(call, 'red', redAuthoring),
    black: buildAudible(call, 'black', redAuthoring, blackAuthoring),
  }
}

/** 1 — RED RAM 33 · dropback · the simplest call in the system. */
const audible33 = example(
  { protection: 'dropback', outside: 3, inside: 3 },
  'Both digits the same. The easiest call there is.',
  {
    id: 'audible-33-red',
    description:
      'The easiest call in the system, and the one to learn it on. "Red" is the formation. "Ram" is the protection — the line slides RIGHT and Super sets off the inside hip of the LEFT tackle, the tackle away from the slide. Then the digits, read outside-to-in on the split-end side: the FIRST 3 belongs to X, the outside man, and the SECOND 3 belongs to R, the wing inside him. Three on the tree is a hitch, so both of them run one — six yards, stop, come back. Y blocks, like he does on every pass call, and the backside wing runs his standing rule — a 2, speed out the other way. Two digits, ball out in three steps.',
    assignments: {
      X: a(
        'First digit: 3 — hitch.',
        'Six yards, stop, and come back downhill at the quarterback. Sit down in the grass and give him your numbers. This ball comes out fast — be ready on your third step back.',
      ),
      R: a(
        'Second digit: 3 — hitch.',
        'You are the inside man, so you get the second digit. Same route as X: six yards, stop, come back to the quarterback. Do not drift toward him sideways — come straight downhill.',
      ),
    },
    reviewNotes: [
      'Concept transcribed from varsity p16, panel "(x2) - 33, (x3) - 333" — two receivers on the surface, both with a vertical stem and a short hook back toward the ball. Protection from p15.',
      'Vs the 4-4 this call leaves both walked-up outside backers unblocked. That is not an error — it is the whole reason 33 exists. Eight men in the box means somebody comes free, so the ball has to be gone at six yards. Worth saying to the kids in exactly those words.',
      ...sharedReviewNotes,
    ],
  },
  {
    id: 'audible-33-black',
    description:
      'The same call out of Black — and the piece of it that changes is worth a whole meeting. Black flips the formation, so the split-end side is now LEFT: X is still the outside man and now L, the left wing, is the man inside him. The digits do not change (X first, wing second, still outside-to-in), but the protection word does, because Ram and Bull name real directions and not sides of a play. We always slide toward the split end, so left-handed it is BULL — slide LEFT, Super off the inside hip of the RIGHT tackle. This picture is the one varsity actually drew on their pass-protection page.',
    reviewNotes: [
      'Generated by mirroring Red Ram 33 (app/utils/mirror.ts) with no hand corrections — our three fronts are left/right symmetric and p1 draws Black as an exact mirror of Red.',
      "The only non-geometric change is the protection WORD: Ram (slide right) becomes Bull (slide left). This mirrored picture — five linemen sliding left with Super off the right tackle's inside hip — is exactly what is drawn on varsity p15.",
      ...sharedReviewNotes,
    ],
  },
)

/** 2 — RED RAM 12 · dropback · two digits that work together. */
const audible12 = example(
  { protection: 'dropback', outside: 1, inside: 2 },
  'A slant and a speed out — two routes off one call.',
  {
    id: 'audible-12-red',
    description:
      'Same formation, same protection, two different digits — and this is where the system starts paying. "Red" is the formation, "Ram" slides the line right with Super off the left tackle\'s inside hip. Then read the digits outside-to-in: the 1 is X\'s, so the outside man runs a SLANT inside; the 2 is R\'s, so the wing runs a SPEED OUT to the sideline. Two routes crossing in opposite directions off one two-digit call. Notice the outside digit is not the deep one — the number tells you the route, never the depth.',
    assignments: {
      X: a(
        'First digit: 1 — slant.',
        'Three hard steps upfield to make him turn his hips, then plant your outside foot and cut inside on an angle. Look for the ball the instant you break — the wing is clearing the man underneath you.',
      ),
      R: a(
        'Second digit: 2 — speed out.',
        'Five yards, roll your shoulders and break flat for the sideline. You start eight yards inside X, so you have a long way to run — go get to the sideline. Your route is what pulls the flat defender out from under the slant.',
      ),
      Q: a(
        'Five-step drop. Outside digit first: slant, then out.',
        'The two digits are a pair. Look at the slant first; if the backer sits inside on it, the out is wide open underneath and the ball goes there. Ball out on your fifth step, no hitch.',
      ),
    },
    reviewNotes: [
      'Concept transcribed from varsity p16, panel "(x2) - 12, (x3) - 112". On the scan the outside receiver stems up and cuts inside on an angle (1, slant) and the man inside him breaks flat to the sideline and finishes OUTSIDE the split end\'s alignment (2, speed out). Protection from p15.',
      "THE OUT'S LANDMARK WAS RE-MEASURED off the scan. It used to stop just short of X's alignment, which made the two routes look like they were running to the same place. On p16 the wing's out clearly finishes OUTSIDE the split end, so it now runs to about 13 yards from the ball — a yard past X. If you would rather the wing stop at the numbers instead of the sideline, that is the one number to change.",
      'The (x3) version on that panel is "112" and its third route was too faint to trace confidently on the scan. It is not transcribed here — we never have a three-receiver surface out of Red or Black anyway.',
      ...sharedReviewNotes,
    ],
  },
  {
    id: 'audible-12-black',
    description:
      'Twelve out of Black. Split-end side is left now, so the 1 goes to X on the left and the 2 goes to L, the left wing — still first digit outside, second digit in. Protection flips with the formation: BULL, slide LEFT, Super off the inside hip of the RIGHT tackle.',
    reviewNotes: [
      'Generated by mirroring Red Ram 12 with no hand corrections. Ram becomes Bull because those words name directions, not sides of the play.',
      ...sharedReviewNotes,
    ],
  },
)

/** 3 — RED SPRINT RIGHT 54 · the book's own printed example. */
const audible54 = example(
  { protection: 'sprint', outside: 5, inside: 4 },
  "The book's own printed example: curl and wheel off a sprint.",
  {
    id: 'audible-54-red',
    description:
      'This is the call varsity prints in their own book as the example, word for word: "Red — Sprint Rt 54 — Reach To The Right — 54 = WR Curl, Wing Wheel." Take it apart — and note that we say it spelled out, "Sprint Right", not "Sprint Rt". "Red" is the formation. "Sprint Right" is the protection and the quarterback\'s path — every lineman REACHES to the right and Super comes out of the backfield to block the playside edge, while the quarterback gains depth and then sprints downhill toward the sideline. Then the digits, outside-to-in on the split-end side: 5 is X\'s, so the outside man runs a CURL; 4 is R\'s, so the wing runs a WHEEL up the sideline behind him. Same two digits, same reading order as a dropback call — only the protection word changed.',
    assignments: {
      X: a(
        'First digit: 5 — curl.',
        'Ten yards straight up, then curl back inside toward the quarterback and find the open grass. He is sprinting at you, so keep working back to him — on a sprint-out the curl is a moving target, not a spot.',
      ),
      R: a(
        'Second digit: 4 — wheel.',
        'Start flat like you are running an out and sell it, then turn it up the sideline and RUN. You have to get outside the curl before you turn up — that is what makes the two routes stack instead of collide. Eyes back over your outside shoulder.',
      ),
      Q: a(
        'Sprint to the call side. Curl first, then the wheel over the top.',
        'Gain depth for three steps, then downhill at the sideline. Outside digit first: the curl is your rhythm throw. If the corner jumps it, the wheel is running up behind him and you throw it over the top. If neither is there, get to the sideline and run.',
      ),
    },
    reviewNotes: [
      'This play is the book\'s own worked example. The call and its decode are quoted verbatim from varsity p17 ("PLAY CALL EXAMPLE — Red - Sprint Rt 54 — Reach To The Right — 54 = WR - Curl, Wing - Wheel"); the routes are traced off p18, panel "(x2) - 54, (x3) - 542"; the protection is traced off p17\'s drawing.',
      "p17's protection arrows traced one at a time: each lineman's arc leaves his outside shoulder, runs along the line to the call side, and hooks up one gap over with a block bar — left tackle up over the guard, guard over the center, center onto the shaded nose, right guard into the guard-tackle gap, right tackle up outside himself. Super's long arc leaves the backfield, runs flat to the call side and caps with a bar beyond the tackle. That is transcribed literally, front by front.",
      'AMBIGUOUS MARK ON p18 — both "54" panels have a short DASHED orange arrow hanging off the top of the wheel and pointing back down toward the sideline. It is not a route (it starts where the wheel arrowhead already is) and it is not in any legend on the page. Best guess is the intended throw over the top of the corner. Nothing is drawn for it here. Tell us what it is and we will draw it.',
      "THE QUARTERBACK ON p18 vs p17 — p17 says \"Gain Depth, Sprint Downhill Toward Sideline\" and the path here is authored to that. The little black line-and-open-circle drawn out of the backfield on p18's sprint panels is much SHORTER, ending only a couple of yards outside the center. We read that as a cramped schematic rather than the real landmark, and went with p17's words. Flag it if the sprint is really meant to stop that tight.",
      'The wheel is drawn on p18 breaking flat first and turning up OUTSIDE the curl, which is the whole point of the combo — if the wing turns up inside the curl the two routes run into each other. That is why his flat release is stretched here.',
      ...sharedReviewNotes,
    ],
  },
  {
    id: 'audible-54-black',
    description:
      'Fifty-four to the left. Black puts the split end on the left, so "Sprint Left" — reach to the LEFT, Super to the left edge, quarterback sprints left. The digits are untouched: 5 is still X\'s curl because he is still the outside man, 4 is still the wing\'s wheel because he is still the man inside. That is the point of the system — the numbers never change sides, only the direction word does.',
    reviewNotes: [
      'Generated by mirroring Red Sprint Right 54 with no hand corrections. "Sprint Right" becomes "Sprint Left"; the digits are unchanged, which is the teaching point. We say the direction spelled out — Sprint Right out of Red, Sprint Left out of Black — rather than the book\'s abbreviated "Sprint Rt".',
      'A left-handed quarterback sprinting left is a different athletic problem than sprinting right. Nothing in the varsity book addresses it. Flag if you want a note on the play page about who we can and cannot run this with.',
      ...sharedReviewNotes,
    ],
  },
)

/** The three baked-in examples, in teaching order. */
export const audibleExamples: AudibleExample[] = [audible33, audible12, audible54]

/** Every example play, both formations — what the book and the quiz see. */
export const audiblePlays: Play[] = audibleExamples.flatMap((e) => [e.red, e.black])
