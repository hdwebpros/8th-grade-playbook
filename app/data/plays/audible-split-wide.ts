/**
 * THE AUDIBLE, OUT OF SPLIT WIDE — four digits, one per receiver.
 *
 * app/data/plays/audible.ts is the machine for Red and Black: two digits (three
 * with the backside wing), X and the wings carry them, Y is a zero. Split Wide
 * detaches FOUR men, so out of this formation every receiver gets a number and
 * nobody has a standing rule. That is a different enough call that it gets its
 * own machine rather than a pile of special cases inside the other one.
 *
 * Coach Ryan's own call, Split Wide Bull 95-59, is the worked example — it is
 * this builder plus hand-written prose, over in split-wide-9559.ts. The caller
 * pad on /audible builds the rest.
 *
 * FOUR DIGITS, READ RIGHT TO LEFT
 * ---------------------------------------------------------------------------
 *     X  (wide right, +13)   first digit
 *     R  (right slot, +8.5)  second digit
 *     ------------------------------- the hyphen is the middle of the field
 *     L  (left slot, −8.5)   third digit
 *     Y  (wide left, −13)    fourth digit
 *
 * Written "95-59" with the hyphen splitting the right pair from the left pair,
 * which also means each side reads outside-in — the same direction the Red and
 * Black calls read.
 *
 * THE PROTECTION
 * ---------------------------------------------------------------------------
 * Per Coach Ryan the Split Wide protection is STRETCH BOOT'S, not the varsity
 * p15 slide: every lineman takes the man in front of him, gets to his outside
 * shoulder, drives him toward the call side, and HOLDS — never back into the
 * quarterback, never downfield. So this file imports `driveBlock` from
 * stretch-boot.ts instead of redrawing it. "Bull" leans the line LEFT, "Ram"
 * leans it RIGHT, and Super sets on the inside hip of the tackle AWAY from the
 * lean, which is the same rule the Red/Black dropback calls give him.
 *
 * Against the two even fronts the center is the one uncovered lineman and steps
 * BACK to help and eat a blitz; against the 5-2 everybody has a man at once and
 * anybody extra is Super's, alone.
 */

import type {
  Action,
  Assignment,
  CallPart,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
  Pt,
} from '../../types/football'
import { routes } from '../routes'
import { splitWide } from '../split-wide-formation'
import { driveBlock } from './stretch-boot'

// ---------------------------------------------------------------------------
// The call
// ---------------------------------------------------------------------------

/** Which way the line leans. "Bull" is left, "Ram" is right. */
export type Lean = 'left' | 'right'

/**
 * A Split Wide call: which way the line leans, and four digits read RIGHT TO
 * LEFT across the formation — X, R, L, Y.
 */
export interface SplitWideCall {
  lean: Lean
  digits: [number, number, number, number]
}

export const LEAN_LABELS: Record<Lean, string> = { left: 'Bull', right: 'Ram' }

/** "95-59" — the hyphen splits the right pair from the left pair. */
export const splitWideDigitsOf = (call: SplitWideCall): string => {
  const [x, r, l, y] = call.digits
  return `${x}${r}-${l}${y}`
}

/** "Split Wide Bull 95-59" — the whole thing as it is said in the huddle. */
export const splitWideCallName = (call: SplitWideCall): string =>
  `Split Wide ${LEAN_LABELS[call.lean]} ${splitWideDigitsOf(call)}`

/** The same call, word by word, with what each word tells the huddle. */
export const splitWideCallParts = (call: SplitWideCall): CallPart[] => [
  { word: 'Split Wide', label: 'formation' },
  { word: LEAN_LABELS[call.lean], label: 'protection — which way the line leans' },
  { word: splitWideDigitsOf(call), label: 'routes — right to left: X, R, L, Y' },
]

// ---------------------------------------------------------------------------
// Small authoring helpers
// ---------------------------------------------------------------------------

/** A set step into an empty gap you own, capped with the block bar. */
const setBlock = (path: Pt[]): Action[] => [{ kind: 'block', path }]

const ROUTE_BY_NUM = new Map(routes.map((r) => [r.num, r]))

const routeNameOf = (num: number): string => ROUTE_BY_NUM.get(num)?.name ?? `Route ${num}`
const routeDetailOf = (num: number): string => ROUTE_BY_NUM.get(num)?.description ?? ''

/**
 * Hang a numbered route off the tree (app/data/routes.ts) on a receiver.
 * `side` is +1 when his sideline is to the offense's right, because the tree is
 * drawn once with +x toward the receiver's OUTSIDE.
 *
 * Nothing is widened here, unlike the Red/Black audibles. There the wing starts
 * eight yards inside the split end and has to make that ground up sideways; in
 * Split Wide every receiver is already outside on his own side, so each route
 * runs at its tree width off his own alignment.
 *
 * Zero is not a route, it is a block, so it comes back with the block kind —
 * otherwise a called 0 would draw a two-yard "route" into a defender.
 */
function routeOn(num: number, from: Pt, side: 1 | -1): Action[] {
  const def = ROUTE_BY_NUM.get(num)
  if (!def) throw new Error(`split-wide audible: no route numbered ${num}`)
  return [
    {
      kind: num === 0 ? 'block' : 'route',
      path: def.path.map((p) => ({ x: from.x + p.x * side, y: p.y })),
    },
  ]
}

/**
 * The four receivers in call order — right to left across the formation, which
 * is the order the digits are said. `where` is how the kid finds himself in the
 * call; it is the whole reason four digits is teachable.
 */
const RECEIVERS = [
  {
    pos: 'X' as OffPosId,
    at: { x: 13, y: 0 } as Pt,
    side: 1 as const,
    ord: 'First',
    where: 'the widest man on the RIGHT',
  },
  {
    pos: 'R' as OffPosId,
    at: { x: 8.5, y: -1 } as Pt,
    side: 1 as const,
    ord: 'Second',
    where: 'the right slot',
  },
  {
    pos: 'L' as OffPosId,
    at: { x: -8.5, y: -1 } as Pt,
    side: -1 as const,
    ord: 'Third',
    where: 'the left slot',
  },
  {
    pos: 'Y' as OffPosId,
    at: { x: -13, y: 0 } as Pt,
    side: -1 as const,
    ord: 'Fourth',
    where: 'the widest man on the LEFT',
  },
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

/** The center's job vs an even front: step BACK, help a guard, eat any blitz. */
const C_STEP_BACK = setBlock([{ x: -0.5, y: -0.9 }])

// ---------------------------------------------------------------------------
// THE MACHINE — one call in, one Play out.
// ---------------------------------------------------------------------------

/** Hand-written prose the generic builder cannot know. Optional. */
export interface SplitWideAuthoring {
  id?: string
  name?: string
  description?: string
  /** Overrides on top of the generated table. */
  assignments?: Partial<Record<OffPosId, Assignment>>
  /** Overrides on top of the generated PER-FRONT table, where a front changes a job. */
  frontAssignments?: Partial<Record<FrontId, Partial<Record<OffPosId, Assignment>>>>
  reviewNotes?: string[]
}

const sharedReviewNotes = [
  'DRAFT — Coach Ryan must approve this football before it reaches a player.',
  "FOUR DIGITS IS THE SPLIT WIDE RULE. Every Red and Black call is two digits (three with the backside wing), the digits belonging to X and the wings with Y as a zero. Split Wide detaches four men, so out of this formation every receiver gets a number and nobody has a standing rule. Read RIGHT TO LEFT across the formation from the offense's point of view: X, R, L, Y.",
  'THE HYPHEN. Written "95-59" with the hyphen splitting the right pair from the left pair, which also makes each side read outside-in, the same direction the Red/Black calls read. If the kids should say it as one four-digit number with no break, the label loses the hyphen everywhere.',
  'PROTECTION IS STRETCH BOOT\'S, NOT THE p15 SLIDE. Coach Ryan\'s instruction was "same as stretch-boot-red", so this shares the same `driveBlock` helper from app/data/plays/stretch-boot.ts — every lineman takes the man in front of him, gets his outside shoulder, drives him toward the lean, holds, and never goes downfield. That is a DIFFERENT protection from the "Ram / Bull" on varsity p15, which slides the whole line into the gap on the call side. The words are kept because they name the direction the line leans, but two protections sharing one word will confuse a 13-year-old — worth either a second word or a decision that Ram and Bull always mean this out of Split Wide.',
  'SUPER IS THE SIXTH BLOCKER, set off the inside hip of the tackle AWAY from the lean — the rule the Red/Black dropback calls already give him (varsity p15, "SUPER — OFF HIP OF TACKLE AWAY"). With four receivers out he is the only help the line has, and there is no Dash tag offered out of Split Wide because releasing him would leave five blockers and no help at all. Say the word if you want Dash here anyway.',
  'NO CHECKDOWN unless a digit buys one. Four receivers and Super blocking means whatever is underneath is whatever the digits put there — call a 2 or a 3 somewhere if the quarterback needs an outlet.',
  'ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts with no stretching. In Red and Black the wing has to widen his out and his wheel because he starts eight yards inside the split end; in Split Wide everybody is already outside on his own side, so each route runs at tree width off his own alignment. A 0 draws as a block, not a route.',
  "VS THE 5-2 IS THE DIFFERENT PICTURE — five down men means every lineman has a man immediately and nobody is free, so anyone extra is Super's, alone. Eyeball those diagrams first.",
  'Formation is app/data/split-wide-formation.ts off varsity page 4 — Y wide left at 13, L slot at 8.5 left, R slot at 8.5 right, X wide right at 13, slots a yard off the ball, Super 4½ deep, seven on the line so it is legal. Same confirmation still open as on the rest of the Split Wide package: 8½ and 13 are big splits for 8th graders.',
]

/**
 * Build a Split Wide audible. `authoring` pastes hand-written prose over the
 * generated table — that is all the difference between a call a kid invents on
 * the pad and Coach Ryan's own 95-59.
 */
export function buildSplitWideAudible(
  call: SplitWideCall,
  authoring: SplitWideAuthoring = {},
): Play {
  const leanSign: 1 | -1 = call.lean === 'left' ? -1 : 1
  const LEAN = call.lean.toUpperCase() // LEFT / RIGHT
  const word = LEAN_LABELS[call.lean] // Bull / Ram
  /** The tackle away from the lean — Super's hip, and the thin side. */
  const awayTackle = call.lean === 'left' ? 'RIGHT' : 'LEFT'
  const hipSign: 1 | -1 = call.lean === 'left' ? 1 : -1

  /** Super: the inside hip of the tackle away from the lean. */
  const S_HIP: Action[] = setBlock([
    { x: 1.1 * hipSign, y: -3.5 },
    { x: 2.3 * hipSign, y: -2.1 },
  ])

  const skill: Partial<Record<OffPosId, Action[]>> = { Q: Q_DROP, S: S_HIP }
  for (const [i, r] of RECEIVERS.entries()) {
    skill[r.pos] = routeOn(call.digits[i]!, r.at, r.side)
  }

  const drive = (defX: number, targetId: string) => driveBlock(defX, targetId, leanSign)

  const evenLine = {
    LT: drive(-4.8, 'E-L'),
    LG: drive(-1.6, 'T-L'),
    C: C_STEP_BACK,
    RG: drive(1.6, 'T-R'),
    RT: drive(4.8, 'E-R'),
  }

  const oddLine = {
    LT: drive(-5.2, 'E-L'),
    LG: drive(-3, 'T-L'),
    C: drive(0, 'N'),
    RG: drive(3, 'T-R'),
    RT: drive(5.2, 'E-R'),
  }

  const lineJob = (extra: string): Assignment => ({
    rule: `${word} — block the man in front of you, lean ${LEAN}. HOLD, and never downfield.`,
    detail: `Same protection you run on Stretch Boot: take the man in front of you, get your helmet to his outside shoulder, and drive him ${call.lean} with the rest of the line. Hold your ground — do not get pushed back into the quarterback, and never chase downfield, that is a penalty on a pass play. ${extra}`,
  })

  /** One receiver's job, straight off the route tree. */
  const receiverJob = (i: number): Assignment => {
    const r = RECEIVERS[i]!
    const d = call.digits[i]!
    if (d === 0) {
      return {
        rule: `${r.ord} digit: 0 — block. No route for you on this call.`,
        detail: `A zero means stay in and help. You are ${r.where}, so come back in and take the first man who threatens the edge on your side. Four digits were called and yours was the one that keeps a blocker home.`,
      }
    }
    return {
      rule: `${r.ord} digit: ${d} — ${routeNameOf(d).toLowerCase()}.`,
      detail: `The call is said right to left across the formation and you are ${r.where}, so the ${r.ord.toLowerCase()} number is yours. ${routeDetailOf(d)}`,
    }
  }

  const assignments: Record<OffPosId, Assignment> = {
    X: receiverJob(0),
    R: receiverJob(1),
    L: receiverJob(2),
    Y: receiverJob(3),
    LT: lineJob('You are on the end of the line — turn a rusher around the pocket, never into it.'),
    LG: lineJob(
      'The whole line moving one way together is what makes this hold: your man cannot cross your face if you get to his outside shoulder first.',
    ),
    C: {
      rule: 'Snap, then block the man in front of you — or step BACK and help if nobody is there.',
      detail:
        'Snap it and go to work the same instant. A man on your nose is yours — hold him, give no ground. If nobody is in front of you, take one short step BACK (never forward — penalty), look for a blitzer, and help the guard next to you who needs it.',
    },
    RG: lineJob(
      `Do not turn and chase a man who goes away from you — Super is set behind the ${awayTackle.toLowerCase()} tackle for exactly that.`,
    ),
    RT: lineJob(
      'The four routes take time to get down the field, so this block has to last. Helmet to his outside shoulder, drive, and hold.',
    ),
    S: {
      rule: `Off the inside hip of the ${awayTackle} tackle — the tackle away from the lean. First man through is yours.`,
      detail: `Four receivers are out, so you are the only help the line has. The line is leaning ${call.lean}, which leaves the ${awayTackle.toLowerCase()} side thinner — set at that tackle's inside hip, chest square, eyes inside-out, and take the first man who comes through. If nobody comes, STAY HOME. You are the last thing between a blitzer and the quarterback.`,
    },
    Q: {
      rule: 'Five-step drop. Work the digits, side to side.',
      detail:
        'Straight back off the midline, five steps, ball at your chest. Four digits means four live receivers, so the call itself tells you the picture — pick your side before the snap off how they line up, then take the man the defense left alone. Feet set on the last step and let it go. Super is blocking, so if nothing is there, throw it away or run.',
    },
  }

  const front = (
    id: FrontId,
    line: typeof evenLine,
    extra: Partial<Record<OffPosId, Assignment>>,
  ): FrontPlan => ({
    actions: { ...skill, ...line },
    assignments: { ...extra, ...authoring.frontAssignments?.[id] },
  })

  const evenCenter: Assignment = {
    rule: 'Nobody in front of you — step BACK, help a guard, eat any blitz.',
    detail:
      'No one is on your nose in this front. Snap it and take one short step back — never forward, that is a penalty on a pass play. Eyes up: if a backer comes, he is yours. If nobody comes, push in and help whichever guard is losing his fight.',
  }

  const oddOverrides: Partial<Record<OffPosId, Assignment>> = {
    C: {
      rule: `A man is right on your nose — he is yours. Drive him ${call.lean} with everybody else.`,
      detail:
        'Snap the ball and get into him the same instant. Get to his outside shoulder and push him with the rest of the line. He is trying to walk you backward into the quarterback — do not let him. Hold your spot.',
    },
    LG: {
      rule: `The big man just outside you is yours — block him, lean ${LEAN}, and HOLD.`,
      detail:
        'In this front their big man lines up between you and your tackle, and your tackle is stepping past him to the end — so he is YOURS. Get into him fast, steer him with everybody else, and give no ground. Never chase downfield; that is a penalty on a pass play.',
    },
    RG: {
      rule: `The big man just outside you is yours — block him, lean ${LEAN}, and HOLD.`,
      detail:
        'Same job as the other guard, other side. Your tackle steps out to the end, so the big man between you two is yours. Get into him, push him with the line, and hold.',
    },
    LT: {
      rule: `Their outside man is yours — outside shoulder, drive him ${call.lean}.`,
      detail:
        'Step out to the man on the end of their line. Helmet to his outside shoulder and drive him with everybody else. Hold — no ground given, no going downfield.',
    },
    RT: {
      rule: `Their outside man is yours — outside shoulder, drive him ${call.lean}.`,
      detail:
        'Step out to the man on the end of their line and drive him. The routes take time to get down the field, so this is the block that has to hold longest.',
    },
    S: {
      rule: 'Five rushers, five linemen — the extra man is yours every snap on this front.',
      detail: `Everybody up front already has a man, so anyone else who comes is yours and yours alone. Set on the ${awayTackle.toLowerCase()} tackle's inside hip, eyes inside-out, and go get him. Most often it is a backer running through the middle. Do not leave early — nobody is behind you.`,
    },
  }

  const digits = splitWideDigitsOf(call)

  return {
    id: authoring.id ?? `split-wide-audible-${call.lean}-${call.digits.join('')}`,
    name: authoring.name ?? `Split Wide ${digits}`,
    callName: splitWideCallName(call),
    call: splitWideCallParts(call),
    family: 'pass',
    formation: splitWide.id,
    direction: call.lean,
    ballCarrier: 'Q',
    description: authoring.description ?? describeSplitWide(call),
    assignments: { ...assignments, ...authoring.assignments },
    vs: {
      '44': front('44', evenLine, { C: evenCenter }),
      '43': front('43', evenLine, { C: evenCenter }),
      '52': front('52', oddLine, oddOverrides),
    } satisfies Record<FrontId, FrontPlan>,
    reviewNotes: authoring.reviewNotes ?? sharedReviewNotes,
  }
}

/** The generic, no-prose decode of a call — used when nothing is authored. */
function describeSplitWide(call: SplitWideCall): string {
  const word = LEAN_LABELS[call.lean]
  const awayTackle = call.lean === 'left' ? 'right' : 'left'
  const parts = RECEIVERS.map((r, i) => {
    const d = call.digits[i]!
    return d === 0
      ? `${r.pos}, ${r.where}, has a zero and stays in to block`
      : `the ${d} belongs to ${r.pos}, ${r.where}, so he runs a ${routeNameOf(d).toLowerCase()}`
  })
  return (
    `${splitWideCallName(call)}. Four receivers, four digits — out of Split Wide every man gets a number. ` +
    `"${word}" is the protection: the line blocks the men in front of it and leans ${call.lean.toUpperCase()}, the same way it does on Stretch Boot, ` +
    `and Super sets on the ${awayTackle} tackle's inside hip to take anyone who comes through the thin side. ` +
    `Then the digits, said right to left across the formation: ${parts.join('; ')}. ` +
    `The quarterback takes five steps and throws to whichever one of the four the defense left alone.`
  )
}
