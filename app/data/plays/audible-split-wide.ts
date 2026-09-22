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
 *     R  (right wing, +8.5)  second digit
 *     ------------------------------- the hyphen is the middle of the field
 *     L  (left wing, −8.5)   third digit
 *     Y  (wide left, −13)    fourth digit
 *
 * Written "95-59" with the hyphen splitting the right pair from the left pair,
 * which also means each side reads outside-in — the same direction the Red and
 * Black calls read.
 *
 * THE PROTECTION
 * ---------------------------------------------------------------------------
 * A PASS SET, the same one every other audible uses. Coach Ryan's rule: a
 * lineman more than a yard past the line on a pass is an ineligible receiver
 * downfield and a penalty on us, so on these calls nobody drives anybody
 * upfield and nobody goes after a backer. All five take a short kick-step BACK
 * off the ball. Say nothing — the default — and that is the whole job: each man
 * blocks the one in front of him and the five of them make a pocket. Say a word
 * and they work their hands over together instead: "Ram" sets the line RIGHT,
 * "Bull" sets it LEFT. Shares `passLine` from audible-shared.ts with Red, Black
 * and Tight. (The Boot drive block still belongs to the RUN plays in
 * stretch-boot.ts; it is not used here any more.) Super stays back and chips
 * the nearest man who comes free, the same rule he has on every other audible.
 *
 * The picture is the same against all three fronts: the front changes which
 * jersey shows up in a man's gap, never anybody's job.
 *
 * THE GUN
 * ---------------------------------------------------------------------------
 * "Split Wide Gun 95-59" — one word after the formation. Split Wide has no
 * wings to move, so only the quarterback (3 yards back, a shorter drop) and
 * Super (a yard left of him and a yard behind) re-origin; the four receivers,
 * their digits and the line are untouched. `gunSplitWideAudible` below puts
 * the gun on a built play, and `formationFor` (app/data/shotgun.ts) resolves
 * the alignment it is drawn on.
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
import type { Protection, Side } from './audible-shared'
import {
  dropWords,
  gunCallPart,
  gunQuarterbackJob,
  gunReviewNotes,
  gunSuperJob,
  isQuickCall,
  passLine,
  protectionSlugOf,
  protectionWordOf,
  qDrop,
  qDropGun,
  slideOf,
  superStay,
  superStayGun,
} from './audible-shared'
import { gunIdOf } from './gun-shared'
import { routes } from '../routes'
import { splitWide } from '../split-wide-formation'

// ---------------------------------------------------------------------------
// The call
// ---------------------------------------------------------------------------

/**
 * A Split Wide call: the protection — 'none' by default, which is no word at
 * all and a straight pass set, plus the two words that slide the line, Ram
 * (RIGHT) and Bull (LEFT) — and four digits read RIGHT TO LEFT across the
 * formation: X, R, L, Y.
 */
export interface SplitWideCall {
  protection: Protection
  digits: [number, number, number, number]
  /** Said from the GUN: "Split Wide Gun 95-59". Only Q and Super move. */
  gun?: boolean
}

/** "95-59" — the hyphen splits the right pair from the left pair. */
export const splitWideDigitsOf = (call: SplitWideCall): string => {
  const [x, r, l, y] = call.digits
  return `${x}${r}-${l}${y}`
}

/**
 * "Split Wide 95-59", "Split Wide Bull 95-59", "Split Wide Gun 95-59" — as it
 * is said in the huddle. "Gun" comes right after the formation.
 */
export const splitWideCallName = (call: SplitWideCall): string =>
  [
    'Split Wide',
    call.gun ? gunCallPart().word : '',
    protectionWordOf(call.protection),
    splitWideDigitsOf(call),
  ]
    .filter(Boolean)
    .join(' ')

/** The same call, word by word, with what each word tells the huddle. */
export const splitWideCallParts = (call: SplitWideCall): CallPart[] => {
  const parts: CallPart[] = [{ word: 'Split Wide', label: 'formation' }]
  if (call.gun) parts.push(gunCallPart())
  // Nothing said, nothing to explain: no word means the straight pass set.
  const slide = slideOf(call.protection)
  if (slide) {
    parts.push({
      word: protectionWordOf(call.protection),
      label: `protection — the line slides ${slide.toUpperCase()}`,
    })
  }
  parts.push({ word: splitWideDigitsOf(call), label: 'routes — right to left: X, R, L, Y' })
  return parts
}

// ---------------------------------------------------------------------------
// Small authoring helpers
// ---------------------------------------------------------------------------

const ROUTE_BY_NUM = new Map(routes.map((r) => [r.num, r]))

const routeNameOf = (num: number): string => ROUTE_BY_NUM.get(num)?.name ?? `Route ${num}`
const routeDetailOf = (num: number): string => ROUTE_BY_NUM.get(num)?.description ?? ''

/**
 * Hang a numbered route off the tree (app/data/routes.ts) on a receiver.
 * `side` is +1 when his sideline is to the offense's right, because the tree is
 * drawn once with +x toward the receiver's OUTSIDE.
 *
 * Nothing is reshaped: each route runs at its tree width off his own alignment.
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
    where: 'R, the RIGHT WING',
  },
  {
    pos: 'L' as OffPosId,
    at: { x: -8.5, y: -1 } as Pt,
    side: -1 as const,
    ord: 'Third',
    where: 'L, the LEFT WING',
  },
  {
    pos: 'Y' as OffPosId,
    at: { x: -13, y: 0 } as Pt,
    side: -1 as const,
    ord: 'Fourth',
    where: 'the widest man on the LEFT',
  },
]

// ---------------------------------------------------------------------------
// THE MACHINE — one call in, one Play out.
// ---------------------------------------------------------------------------

/** Hand-written prose the generic builder cannot know. Optional. */
export interface SplitWideAuthoring {
  id?: string
  name?: string
  summary?: string
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
  'STRAIGHT IS THE DEFAULT HERE TOO — your words: "We don\'t have to call out a protection where we push left or right. If we don\'t say anything, you just block straight up like a normal pass protection, create a pocket." A Split Wide call with no protection word is "Split Wide 95-59", and the five sets are drawn with no lean at all.',
  'THE PROTECTION IS A PASS SET, NOT THE BOOT DRIVE. Your rule: "when you pass block, you just pass block who\'s in front of you... they just block straight or the left or the right." So these calls no longer borrow the Boot drive block — all five linemen take a short step back, work their hands to the call side when Ram or Bull is called, and nobody goes past the line. Split Wide, Red, Black and Tight now share one helper (`passLine` in app/data/plays/audible-shared.ts), so Ram and Bull mean exactly the same thing in all four formations. The Boot drive block is untouched where it belongs, on the RUN plays in stretch-boot.ts.',
  'SUPER IS THE SIXTH BLOCKER and he does what he does on every other call: stays back, finds the nearest incoming defender and chips him. He has no alignment rule and he never has an end. There is no Dash tag on the Split Wide pad yet — say the word if you want it here.',
  'NO PER-FRONT RULES — the line and Super do the same thing against the 4-4, the 4-3 and the 5-2. The front changes which jersey shows up in a gap, not the job, so the front picker no longer rewrites anybody\'s assignment.',
  'THE QUARTERBACK PICKS THE DROP — quick, fast-developing plays are three steps, a deep post or go is five, and if the defense is getting in quickly he stays at three and gets the ball out. Nothing here tells him who to throw to.',
  'ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts with nothing stretched — each route runs at tree width off the man\'s own alignment. A 0 draws as a block, not a route.',
  'ALIGNMENT, 2026-09-17, your words: "N is directly over C. DT should be directly over the last letter on the guard (either the L or the G in RG). DE should be directly over the edge of the circle on the OT." All three fronts are drawn that way now.',
  'Formation is app/data/split-wide-formation.ts — Y wide left at 13, L wing at 8.5 left, R wing at 8.5 right, X wide right at 13, wings a yard off the ball, Super 4½ deep, seven on the line so it is legal. Same confirmation still open as on the rest of the Split Wide package: 8½ and 13 are big splits for 8th graders.',
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
  // Build it under center, then put the gun on it — the gun only moves Q and
  // Super, so everything else is the under-center play verbatim.
  const under = buildUnderCenter({ ...call, gun: false }, authoring)
  return call.gun ? gunSplitWideAudible(under, call) : under
}

/**
 * THE GUN, put on a built Split Wide audible: id "-gun", `variant: 'gun'`,
 * "Gun" in the call, the quarterback's shorter drop from (0, −3) and Super's
 * chip from (−1, −4). The four receivers and the line are untouched.
 */
export function gunSplitWideAudible(play: Play, call: SplitWideCall): Play {
  const gunCall: SplitWideCall = { ...call, gun: true }
  const digits = call.digits
  // The WORDS come off the built play, so an authored call keeps its own
  // protection word and only gains "Gun" after the formation.
  const callName = play.callName
    ? play.callName.replace(/^Split Wide\b/, `Split Wide ${gunCallPart().word}`)
    : splitWideCallName(gunCall)
  const callParts = play.call?.length
    ? [play.call[0]!, gunCallPart(), ...play.call.slice(1)]
    : splitWideCallParts(gunCall)
  const actions: Partial<Record<OffPosId, Action[]>> = {
    Q: qDropGun(digits),
    S: superStayGun(),
  }
  const vs = Object.fromEntries(
    (Object.keys(play.vs) as FrontId[]).map((front) => {
      const plan = play.vs[front]
      return [front, { ...plan, actions: { ...plan.actions, ...actions } }]
    }),
  ) as Record<FrontId, FrontPlan>

  const drop = isQuickCall(digits) ? 'catch and throw, one step' : 'a three-step drop, not five'
  const sentence =
    `From the gun the line and all four receivers do exactly what they did. Only two kids move: ` +
    `the quarterback is already 3 yards back, so it is ${drop}, and Super is a yard left of him and a yard behind, ` +
    `where he stays and protects, checking the left edge first.`

  return {
    ...play,
    id: gunIdOf(play.id),
    variant: 'gun',
    callName,
    call: callParts,
    description: `${play.description} ${sentence}`,
    assignments: {
      ...play.assignments,
      Q: gunQuarterbackJob(
        digits,
        'Four digits means four live receivers — take the one they left alone, and if nothing is there, throw it away or run.',
      ),
      S: gunSuperJob(),
    },
    vs,
    reviewNotes: [
      ...gunReviewNotes,
      'DRAFT — SPLIT WIDE GUN moves only the quarterback and Super. There are no wings to move and no Dash tag on the Split Wide pad, so the four receivers and the line are the under-center play verbatim.',
      ...(play.reviewNotes ?? []),
    ],
  }
}

function buildUnderCenter(call: SplitWideCall, authoring: SplitWideAuthoring): Play {
  // Null when nothing was called: no lean, every man on the man in front of him.
  const lean: Side | null = slideOf(call.protection)
  const LEAN = lean ? lean.toUpperCase() : 'STRAIGHT UP'
  const word = protectionWordOf(call.protection) // Ram / Bull, or nothing

  const DROP = dropWords(call.digits)
  const skill: Partial<Record<OffPosId, Action[]>> = { Q: qDrop(call.digits), S: superStay() }
  for (const [i, r] of RECEIVERS.entries()) {
    skill[r.pos] = routeOn(call.digits[i]!, r.at, r.side)
  }

  /**
   * All five pass set, the same on every front: kick-step back off the ball and
   * either take the man in front of you (nothing called) or work your hands
   * over together (Ram or Bull). Nobody past the line either way. The front
   * changes WHO is in a man's gap, not the set.
   */
  const line = passLine(lean)

  const lineJob = (extra: string): Assignment =>
    lean === null
      ? {
          rule: 'Pass block STRAIGHT UP. Take the man in front of you and HOLD.',
          detail: `No protection word was called, so nobody slides: short kick-step BACK off the ball, hands inside on the man lined up in front of you, and let him come to you. Stay square — the five of us setting back together is what makes the pocket. Never up the field: a lineman more than a yard past the line on a pass is an ineligible receiver downfield, a penalty on us, so you never chase a backer. Hold your ground and do not get pushed back into the quarterback. ${extra}`,
        }
      : {
          rule: `${word} — pass block, set ${LEAN}. Take the man in front of you and HOLD.`,
          detail: `This is a pass, so you PASS BLOCK: short step BACK off the ball, hands inside on the man in front of you, and let him come to you. We only hear ${word} when Coach wants the line moved: it sets the whole line ${lean} together, and that is the only place you go — never up the field. A lineman more than a yard past the line on a pass is an ineligible receiver downfield, a penalty on us, so you never chase a backer. Hold your ground and do not get pushed back into the quarterback. ${extra}`,
        }

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
    LT: lineJob('You are on the end of the line — kick back and turn a rusher around the pocket, never into it.'),
    LG: lineJob(
      'The whole line setting one way together is what makes this hold: your man cannot cross your face if your hands and your feet go that way first.',
    ),
    C: {
      rule: 'Snap, then pass set on the man in front of you — or set BACK and help if nobody is there.',
      detail: `Snap it and go to work the same instant. A man on your nose is yours — hands on him, hold him, give no ground. If nobody is in front of you, take one short step BACK ${lean ? 'with the call' : 'and stay square'} (never up the field — penalty), look for a blitzer, and help the guard next to you who needs it.`,
    },
    RG: lineJob('Do not turn and chase a man who goes away from you. Take the one in front of you.'),
    RT: lineJob(
      'The four routes take time to get down the field, so this block has to last. Hands inside, feet moving, and hold.',
    ),
    S: {
      rule: 'Stay back and protect. Chip the nearest man who comes free.',
      detail: 'Four receivers are out, so you are the only help the line has. You do not have a gap and you do not have a side — sit back there, find the nearest incoming defender and block him. You never have an end; the tackles have those. If nobody comes, STAY HOME. You are the last thing between a blitzer and the quarterback.',
    },
    Q: {
      rule: `${DROP}.`,
      detail: `Straight back off the midline, ball at your chest. The drop is yours to pick: a quick, fast-developing play is a three-step drop, a deep post or go route is five. These digits are a ${DROP.toLowerCase()}. If the defense is getting in quickly, stick to three-step drops and get the ball out quickly. Four digits means four live receivers — take the one they left alone, and if nothing is there, throw it away or run.`,
    },
  }

  /**
   * The same picture against all three fronts: the line pass blocks whoever is
   * in front of it, Super stays back. The front changes which jersey shows up
   * in a gap, never anybody's job.
   */
  const front = (id: FrontId): FrontPlan => ({
    actions: { ...skill, ...line },
    assignments: { ...authoring.frontAssignments?.[id] },
  })

  const digits = splitWideDigitsOf(call)

  return {
    id: authoring.id ?? `audible-split-wide${protectionSlugOf(call.protection)}-${call.digits.join('')}`,
    name: authoring.name ?? `Split Wide ${digits}`,
    callName: splitWideCallName(call),
    call: splitWideCallParts(call),
    family: 'pass',
    formation: splitWide.id,
    // Straight protection has no direction in it; the playside badges want one,
    // and this formation is balanced, so it takes the book's default side.
    direction: lean ?? 'right',
    ballCarrier: 'Q',
    summary:
      authoring.summary ?? 'Called-at-the-line pass. Four receivers, a digit and a route each.',
    description: authoring.description ?? describeSplitWide(call),
    assignments: { ...assignments, ...authoring.assignments },
    vs: {
      '44': front('44'),
      '43': front('43'),
      '52': front('52'),
    } satisfies Record<FrontId, FrontPlan>,
    reviewNotes: authoring.reviewNotes ?? sharedReviewNotes,
  }
}

/** The generic, no-prose decode of a call — used when nothing is authored. */
function describeSplitWide(call: SplitWideCall): string {
  const lean = slideOf(call.protection)
  const protectionSentence =
    lean === null
      ? 'Nobody called a protection, so the line blocks straight up: all five pass block the man in front of them, kick-stepping back into a pocket and never past the line'
      : `"${protectionWordOf(call.protection)}" is the protection: all five linemen pass block, setting ${lean.toUpperCase()} together and never past the line`
  const parts = RECEIVERS.map((r, i) => {
    const d = call.digits[i]!
    return d === 0
      ? `${r.pos}, ${r.where}, has a zero and stays in to block`
      : `the ${d} belongs to ${r.pos}, ${r.where}, so he runs a ${routeNameOf(d).toLowerCase()}`
  })
  return (
    `${splitWideCallName(call)}. Four receivers, four digits — out of Split Wide every man gets a number. ` +
    `${protectionSentence}, ` +
    `and Super stays back to chip the nearest man who comes free. ` +
    `Then the digits, said right to left across the formation: ${parts.join('; ')}. ` +
    `The quarterback drops — ${dropWords(call.digits).toLowerCase()}, off the digits — and throws to whichever one of the four the defense left alone.`
  )
}
