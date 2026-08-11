/**
 * SPLIT WIDE BULL 95-59 — the audible system said out of Split Wide.
 *
 * Coach Ryan's call, verbatim: "Split Wide Bull 95-59. Formation is split wide.
 * Blockers block to the left (Bull), same as stretch-boot-red. Routes are for
 * the 4 receivers RtoL, Fade (Go), curl, curl, fade (Go)."
 *
 * FOUR DIGITS, ONE PER RECEIVER, READ RIGHT TO LEFT
 * ---------------------------------------------------------------------------
 * Split Wide detaches four men, so there are four digits and every one of them
 * belongs to a receiver — nobody is a zero and nobody has a standing rule.
 * Said right to left across the formation, the way Coach Ryan called it:
 *
 *     X  (wide right, +13)   9 — fade
 *     R  (right slot, +8.5)  5 — curl
 *     ------------------------------- the hyphen is the middle of the field
 *     L  (left slot, −8.5)   5 — curl
 *     Y  (wide left, −13)    9 — fade
 *
 * Two fades outside, two curls inside: the fades run the corners off and the
 * curls sit down in the space they leave. It is the same picture on both sides
 * of the ball, which is exactly why a kid can learn it in one rep — and it is
 * also why the digits happen to read the same either direction.
 *
 * THIS CALL IS OFF THE MACHINE
 * ---------------------------------------------------------------------------
 * `buildAudible()` in app/data/plays/audible.ts builds Red/Black calls: two or
 * three digits, X and the wings, Y a zero. This one is a fourth example that
 * the machine cannot make — different formation, four digits, four receivers —
 * so it is hand-authored here and shown on /audible next to the three the
 * machine builds. See the review notes: turning it into something the caller
 * pad can generate is a real decision, not an oversight.
 *
 * PROTECTION — BULL, AND IT IS STRETCH BOOT'S PROTECTION
 * ---------------------------------------------------------------------------
 * Per Coach Ryan: the blockers block to the LEFT, the same way they do on
 * Stretch Boot. So this file imports `driveBlock` from stretch-boot.ts rather
 * than redrawing it — every lineman takes the man in front of him, gets to his
 * outside shoulder, drives him LEFT, and HOLDS: no collapsing back into the
 * quarterback, no drifting downfield (a penalty on a pass play). Against the
 * even fronts the center is the one uncovered lineman and steps BACK to help
 * and eat a blitz; against the 5-2 everybody has a man immediately.
 *
 * Note this is NOT the Ram/Bull slide drawn on varsity p15 — that one slides
 * the whole line into the gap on the call side. Coach Ryan pointed at Stretch
 * Boot, so Stretch Boot's man-in-front-of-you-lean-left rule is what is drawn,
 * and the word "Bull" here names the direction the line leans. Flagged.
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
import { routes } from '../routes'
import { splitWide } from '../split-wide-formation'
import { driveBlock } from './stretch-boot'

/** A set step into an empty gap you own, capped with the block bar. */
const setBlock = (path: Pt[]): Action[] => [{ kind: 'block', path }]

const ROUTE_BY_NUM = new Map(routes.map((r) => [r.num, r]))

/**
 * Hang a numbered route off the tree (app/data/routes.ts) on a receiver.
 * `side` is +1 when his sideline is to the offense's right, because the tree is
 * drawn once with +x toward the receiver's OUTSIDE.
 *
 * Nothing is widened here, unlike the Red/Black audibles: in Split Wide the
 * slots are already 8½ yards out and both of their routes break INSIDE, so
 * there is no ground to make up sideways.
 */
function routeOn(num: number, from: Pt, side: 1 | -1): Action[] {
  const def = ROUTE_BY_NUM.get(num)
  if (!def) throw new Error(`split-wide 95-59: no route numbered ${num}`)
  return [{ kind: 'route', path: def.path.map((p) => ({ x: from.x + p.x * side, y: p.y })) }]
}

/** Split Wide alignments — the origins the routes are hung on. */
const AT_X: Pt = { x: 13, y: 0 }
const AT_R: Pt = { x: 8.5, y: -1 }
const AT_L: Pt = { x: -8.5, y: -1 }
const AT_Y: Pt = { x: -13, y: 0 }

// ---------------------------------------------------------------------------
// The four routes: 9 5 - 5 9, right to left.
// ---------------------------------------------------------------------------

const ROUTES = {
  X: routeOn(9, AT_X, 1),
  R: routeOn(5, AT_R, 1),
  L: routeOn(5, AT_L, -1),
  Y: routeOn(9, AT_Y, -1),
} satisfies Partial<Record<OffPosId, Action[]>>

/** Five-step drop, straight back, drifting a hair away from Super's set. */
const Q_DROP: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.3, y: -3.7 },
      { x: -0.5, y: -6.2 },
    ],
  },
]

/**
 * Super: the line leans LEFT, so he sets at the inside hip of the RIGHT
 * tackle — the tackle away from the lean — and takes the first man through
 * there. Same rule the Red/Black dropback audibles give him ("off hip of tackle
 * away", varsity p15), and the same short set-step picture: nobody is standing
 * there pre-snap, so it is a set block rather than a block on a named man.
 */
const S_HIP: Action[] = setBlock([
  { x: 1.1, y: -3.5 },
  { x: 2.3, y: -2.1 },
])

const SKILL = { ...ROUTES, Q: Q_DROP, S: S_HIP } satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Front plans — Stretch Boot's protection, front for front.
// ---------------------------------------------------------------------------

/** The center's job vs an even front: step BACK, help a guard, eat any blitz. */
const C_STEP_BACK = setBlock([{ x: -0.5, y: -0.9 }])

const vs44: FrontPlan = {
  actions: {
    ...SKILL,
    LT: driveBlock(-4.8, 'E-L'),
    LG: driveBlock(-1.6, 'T-L'),
    C: C_STEP_BACK,
    RG: driveBlock(1.6, 'T-R'),
    RT: driveBlock(4.8, 'E-R'),
  },
  assignments: {
    C: {
      rule: 'Nobody in front of you — step BACK, help a guard, eat any blitz.',
      detail:
        'No one is on your nose in this front. Snap it and take one short step back — never forward, that is a penalty on a pass play. Eyes up: this front has two backers stacked inside, and if one of them comes he is yours. If nobody comes, push in and help whichever guard is losing his fight.',
    },
    S: {
      rule: 'Set on the right tackle’s inside hip. Two backers inside — one of them may come.',
      detail:
        'The 4-4 keeps eight men close to the ball, so somebody usually comes. Get to the tackle’s inside hip fast, chest square, and take the first man through. Do not go looking for work outside — the tackle has that man.',
    },
  },
}

const vs43: FrontPlan = {
  actions: {
    ...SKILL,
    LT: driveBlock(-4.8, 'E-L'),
    LG: driveBlock(-1.6, 'T-L'),
    C: C_STEP_BACK,
    RG: driveBlock(1.6, 'T-R'),
    RT: driveBlock(4.8, 'E-R'),
  },
  assignments: {
    C: {
      rule: 'Nobody in front of you — step BACK, help a guard, eat any blitz.',
      detail:
        'No one is on your nose. Snap it and take one short step back — never forward, that is a penalty on a pass play. The Mike is stacked straight over the ball: if he comes, he is yours. If he drops, push in and help whichever guard is losing his fight.',
    },
  },
}

/**
 * 5-2 (odd): five down men, so every lineman has a guy immediately — tackles on
 * the ends, guards on the men between them and the tackles, center on the nose.
 * Nobody is free, which also means the extra rusher, if there is one, is Super's.
 */
const vs52: FrontPlan = {
  actions: {
    ...SKILL,
    LT: driveBlock(-5.2, 'E-L'),
    LG: driveBlock(-3, 'T-L'),
    C: driveBlock(0, 'N'),
    RG: driveBlock(3, 'T-R'),
    RT: driveBlock(5.2, 'E-R'),
  },
  assignments: {
    C: {
      rule: 'A man is right on your nose — he is yours. Drive him left with everybody else.',
      detail:
        'Snap the ball and get into him the same instant. Get to his outside shoulder and push him left with the rest of the line. He is trying to walk you backward into the quarterback — do not let him. Hold your spot.',
    },
    LG: {
      rule: 'The big man just outside you is yours — block him, lean left, and HOLD.',
      detail:
        'In this front their big man lines up between you and your tackle, and your tackle is stepping past him to the end — so he is YOURS. Get into him fast, steer him left with everybody else, and give no ground. Never chase downfield; that is a penalty on a pass play.',
    },
    RG: {
      rule: 'The big man just outside you is yours — block him, lean left, and HOLD.',
      detail:
        'Same job as the other guard, other side. Your tackle steps out to the end, so the big man between you two is yours. Get into him, push him left, and hold — Super is setting right behind your outside shoulder and he cannot block your man for you.',
    },
    LT: {
      rule: 'Their outside man is yours — outside shoulder, drive him left.',
      detail:
        'Step out to the man on the end of their line. Helmet to his outside shoulder and drive him left with everybody else. Hold — no ground given, no going downfield.',
    },
    RT: {
      rule: 'Their outside man is yours — outside shoulder, drive him left.',
      detail:
        'Step out to the man on the end of their line and drive him left. This is the blind side on a five-step drop, so it is the block that has to hold longest — the fades take time to get down the field.',
    },
    S: {
      rule: 'Five rushers, five linemen — the extra man is yours every snap on this front.',
      detail:
        'Everybody up front already has a man, so anyone else who comes is yours and yours alone. Set on the right tackle’s inside hip, eyes inside-out, and go get him. Most often it is a backer running through the middle. Do not leave early — nobody is behind you.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  X: {
    rule: 'First digit: 9 — fade. You are the widest man on the right.',
    detail:
      'Straight up the field, leaning toward the sideline. Run past him and go get the ball over your outside shoulder. Even when it does not come to you, your job is done: the corner has to run with you, and the room he leaves behind is exactly where R is curling up.',
  },
  R: {
    rule: 'Second digit: 5 — curl.',
    detail:
      'Ten yards straight up, then curl back inside toward the quarterback and find the open grass. Do not stop on a spot and stand there — work back downhill to him and show him your numbers. X has taken the corner deep, so the window is right where you are sitting.',
  },
  L: {
    rule: 'Third digit: 5 — curl. Same route as R, other side.',
    detail:
      'Ten up, curl back inside toward the quarterback, find the grass. You and R are running the identical route from both sides — whichever one of you the backers leave alone is the one who gets the ball, so never assume it is the other guy.',
  },
  Y: {
    rule: 'Fourth digit: 9 — fade. You are the widest man on the left.',
    detail:
      'Same fade X is running, other sideline. Straight up leaning out, and go get it over your outside shoulder. Two fades means neither corner can help inside on the curls — run it hard even on the snaps you know it is not coming.',
  },
  LT: {
    rule: 'Bull — block the man in front of you, lean LEFT. HOLD, and never downfield.',
    detail:
      'Same protection you run on Stretch Boot: take the man in front of you, get your helmet to his outside shoulder, and drive him left with the rest of the line. Hold your ground — do not get pushed back into the quarterback, and never chase downfield, that is a penalty on a pass play.',
  },
  LG: {
    rule: 'Bull — block the man in front of you, lean LEFT. HOLD, and never downfield.',
    detail:
      'Lean left with everybody else and take the man in front of you. The whole line moving one way together is what makes this hold: your man cannot cross your face if you get to his outside shoulder first.',
  },
  C: {
    rule: 'Snap, then block the man in front of you — or step BACK and help if nobody is there.',
    detail:
      'Snap it and go to work the same instant. A man on your nose is yours — hold him, give no ground. If nobody is in front of you, take one short step BACK (never forward — penalty), look for a blitzer, and help the guard next to you who needs it.',
  },
  RG: {
    rule: 'Bull — block the man in front of you, lean LEFT. HOLD, and never downfield.',
    detail:
      'Take the man in front of you and steer him left. Do not turn and chase a man who goes away from you — Super is set behind your outside shoulder for exactly that.',
  },
  RT: {
    rule: 'Bull — block the man in front of you, lean LEFT. HOLD, and never downfield.',
    detail:
      'You are the blind side on a five-step drop and the fades take time, so your block has to last longest. Helmet to his outside shoulder, drive him left, and hold. Super is at your inside hip if somebody comes underneath.',
  },
  S: {
    rule: 'Off the inside hip of the RIGHT tackle — the tackle away from the lean. First man through is yours.',
    detail:
      'Four receivers are out, so you are the only help the line has. The line is leaning left, which leaves the right side thinner — set at the right tackle’s inside hip, chest square, eyes inside-out, and take the first man who comes through there. If nobody comes, STAY HOME. You are the last thing between a blitzer and the quarterback and there is no checkdown on this play.',
  },
  Q: {
    rule: 'Five-step drop. Curls first, fades if a corner jumps one.',
    detail:
      'Straight back off the midline, five steps, ball at your chest. Your first look is the two curls — they are the rhythm throw and they come open at ten. Pick the side where the backer has widened or where the corner has turned and run with the fade. If a corner sits down on a curl instead of running with the fade, throw the fade over the top of him. Feet set on the last step and let it go — Super is blocking, so there is no checkdown: if nothing is there, throw it away or run.',
  },
}

const reviewNotes = [
  'DRAFT — Coach Ryan must approve this football before it reaches a player.',
  'YOUR CALL, TRANSCRIBED: "Split Wide Bull 95-59 … blockers block to the left (Bull), same as stretch-boot-red … routes are for the 4 receivers RtoL, Fade (Go), curl, curl, fade (Go)." Read right to left across the formation: X (wide right) 9 fade, R (right slot) 5 curl, L (left slot) 5 curl, Y (wide left) 9 fade. Confirm "right to left" means across the formation from the offense\'s point of view — from the sideline it reverses, and because this particular call is symmetric you would never catch the mistake on this play, only on the next one.',
  'FOUR DIGITS IS A NEW THING IN THE SYSTEM. Every other call in the book is two digits (three with the backside wing), with the digits belonging to X and the wings and Y as a zero. Split Wide detaches four men, so this call gives every one of them a number and nobody has a standing rule. That is a genuinely bigger idea than it looks: it is the answer to the open Y question in app/data/plays/audible.ts, just arrived at from a different direction. Say the word and we will make FOUR digits the rule in Split Wide and wire the /audible caller pad to build them, instead of this one call being hand-drawn.',
  'THE HYPHEN. Written as "95-59" the way you said it, with the hyphen splitting the right pair from the left pair — which also means each side reads outside-in, the same direction the Red/Black calls read. If the kids should say "ninety-five fifty-nine" as one four-digit number with no break, tell us and the label loses the hyphen everywhere.',
  'PROTECTION IS STRETCH BOOT\'S, NOT THE p15 SLIDE. You said "same as stretch-boot-red", so this file imports the same `driveBlock` helper from app/data/plays/stretch-boot.ts — every lineman takes the man in front of him, gets to his outside shoulder, drives him LEFT, holds, and never goes downfield. Vs the 4-4 and 4-3 the center is uncovered and steps BACK to help and eat a blitz; vs the 5-2 everybody has a man immediately. That is a DIFFERENT protection from the "Bull" on varsity p15, which slides the whole line into the gap on the call side. We kept your word "Bull" because it names the direction the line leans, but two protections sharing one word will confuse a 13-year-old — worth either a second word or a decision that Bull always means this.',
  'SUPER IS THE SIXTH BLOCKER and he is drawn off the inside hip of the RIGHT tackle — the tackle away from the lean — which is the rule the Red/Black dropback audibles already give him (varsity p15, "SUPER — OFF HIP OF TACKLE AWAY"). You did not say what he does on this call. The alternatives: (a) he scans the whole line like he does on Split Wide Chip rather than owning one hip; (b) he releases to the flat, which is the "Dash" tag and would make it a five-man route with no help at all. Drafted as the hip because four receivers are already out and the line is leaning away from the right side.',
  'NO CHECKDOWN. Four receivers run deep-ish routes (curls at ten, fades) and Super blocks, so there is nothing underneath. The quarterback\'s assignment says so out loud — throw it away or run. If you want an outlet, the cheapest change is Super on the Dash tag out to the right flat, and then the protection is a man short.',
  'ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts with no stretching: the 5 breaks inside so the slots have no ground to make up sideways, and the 9 runs at tree width off a 13-yard split, finishing about 15 yards from the ball — the same fade picture Split Wide Chip already draws for X. Depths are the tree\'s: curls at ten, fades leaning out from eight.',
  'THE TWO CURLS SIT AT THE SAME DEPTH ON BOTH SIDES, which is the point — it is one picture the kid reads twice, once per side. It also means the middle of the field is empty on this call: nothing crosses, nothing sits inside the hashes. Against a front that drops a backer straight into the middle that is free grass we are not using. Flag it if you want one of the 5s to become something else (a 3 hitch underneath, or a 7 post) and it stops being symmetric.',
  'DIRECTION is set to "left" in the data because the line leans left; the football itself is balanced. That only affects playside/backside badges in the UI. And because the call is symmetric, this play has no mirror twin — mirroring it would produce the identical picture with the protection leaning right, which would be a different call ("Ram 95-59") and not a translation of this one. Say the word if you want that one too.',
  'Formation is app/data/split-wide-formation.ts off varsity page 4 — Y wide left at 13, L slot at 8.5 left, R slot at 8.5 right, X wide right at 13, slots a yard off the ball, Super 4½ deep, seven on the line so it is legal. Same confirmation still open as on the rest of the Split Wide package: 8½ and 13 are big splits for 8th graders.',
]

export const splitWideBull9559: Play = {
  id: 'split-wide-9559',
  name: 'Split Wide 95-59',
  callName: 'Split Wide Bull 95-59',
  family: 'pass',
  formation: splitWide.id,
  direction: 'left',
  ballCarrier: 'Q',
  description:
    'The audible system said out of Split Wide, with a digit for every one of the four receivers instead of two. Right to left: fade, curl, curl, fade. "Bull" is the protection — the line blocks the men in front of it and leans LEFT, the same way it does on Stretch Boot, and Super sets on the right tackle\'s inside hip to take anyone who comes through the thin side. The two fades run the corners off and the two curls sit down at ten in the room they leave. Same picture on both sides of the ball: the quarterback takes five steps, picks the curl the defense left alone, and throws the fade over the top of any corner who cheats up on it.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}
