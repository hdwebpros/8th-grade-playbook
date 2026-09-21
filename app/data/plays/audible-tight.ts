/**
 * THE AUDIBLE, OUT OF TIGHT — four digits, one per eligible.
 *
 * Tight (app/data/tight-formation.ts) is Red with the wide receiver brought all
 * the way home: a tight end outside EACH tackle and a wing outside each tight
 * end. Nobody is detached and there is no strong side, so the Red/Black rules —
 * "the first digit is X's because he is the widest man", "Y is a zero", "the
 * backside wing runs his standing out" — have nothing to hang on. Four men are
 * eligible and all four can go, exactly like Split Wide, so Tight borrows Split
 * Wide's CALL (four digits) and Red's PROTECTION (the Ram/Bull slide).
 *
 * FOUR DIGITS, "XR-LY"
 * ---------------------------------------------------------------------------
 *     X  (right tight end,  +4.5)   first digit
 *     R  (right wing,       +5.7)   second digit
 *     ------------------------------- the hyphen is the middle of the field
 *     L  (left wing,        −5.7)   third digit
 *     Y  (left tight end,   −4.5)   fourth digit
 *
 * Written "95-59", said "nine five, five nine", the hyphen splitting the right
 * pair from the left pair. Same four letters in the same order as a Split Wide
 * call.
 *
 * WHY THE LETTERS AND NOT THE ALIGNMENT — the one judgment call in this file.
 * In Tight the WING is outside the tight end on his side, so reading each side
 * strictly outside-in would be "RX-LY", with the wing's digit first. That was
 * the other candidate. This file says X R - L Y instead, because one rule then
 * holds everywhere in the system: THE FIRST DIGIT IS ALWAYS X'S. It is his in
 * Red, his in Black, his in Split Wide, and his here — the kid wearing the
 * letter never has to ask which number is his when the formation changes. The
 * price is that in Tight the digits are not a clean sweep across the field, so
 * every label on the page has to say plainly WHO each digit belongs to rather
 * than "the widest man". It is in the review notes; one word from Coach Ryan
 * flips it to RX-LY and the pad's slots with it.
 *
 * THE PROTECTION IS A PASS SET, SAME AS EVERY OTHER AUDIBLE
 * ---------------------------------------------------------------------------
 * The five linemen pass block: short kick-step back off the ball, and then
 * either straight up on the man in front of them — the default, what you get
 * when nobody says a word, five sets and a pocket — or hands over to the slide
 * side when the word IS said: RAM sets right, BULL sets left. Nobody goes more
 * than a yard past the line either way, because that is ineligible receiver downfield and a
 * penalty on us. They share `passLine` in app/data/plays/audible-shared.ts with
 * Red, Black and Split Wide rather than redrawing it. Y has no block here: in
 * Tight the tight end is out on a route instead of closing the backside edge.
 *
 * WHICH LEAVES THE ENDS TO THE TACKLES. In Red, Y blocks the end beside him.
 * Take both tight ends out and each end is simply the tackle's man — Coach
 * Ryan's rule is that the line blocks the ends on every play and Super never
 * does. Super just stays back and chips the nearest man who comes free.
 *
 * DASH still works: "Dash Right" / "Dash Left", after the protection word or in
 * its place when none was called, sends
 * Super to that flat instead of blocking, which in Tight means nobody at all is
 * left over. Five receivers, five blockers, get rid of it.
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
import { tight } from '../tight-formation'
import type { DashSide, Protection, Side } from './audible-shared'
import {
  dashSuper,
  dashSlugOf,
  dashTagOf,
  dropWords,
  passLine,
  protectionSlugOf,
  protectionWordOf,
  qDrop,
  routeOn,
  slideOf,
  superStay,
} from './audible-shared'

// ---------------------------------------------------------------------------
// The call
// ---------------------------------------------------------------------------

/**
 * A Tight call: the protection — 'none' by default, no word said and a straight
 * pass set, plus the same two sliding words as every other formation, Ram (the
 * line goes RIGHT) and Bull (LEFT) — four digits read X, R, L, Y, and the
 * optional Dash tag.
 */
export interface TightCall {
  protection: Protection
  digits: [number, number, number, number]
  /** "Dash Right" / "Dash Left" — Super releases to that flat instead of blocking. */
  dash?: DashSide
}

/** "95-59" — the hyphen splits the right pair from the left pair. */
export const tightDigitsOf = (call: TightCall): string => {
  const [x, r, l, y] = call.digits
  return `${x}${r}-${l}${y}`
}

/** "Tight 33-33", "Tight Ram Dash Right 95-59" — as it is said in the huddle. */
export const tightCallName = (call: TightCall): string =>
  ['Tight', protectionWordOf(call.protection), dashTagOf(call.dash), tightDigitsOf(call)]
    .filter(Boolean)
    .join(' ')

/** The same call, word by word, with what each word tells the huddle. */
export const tightCallParts = (call: TightCall): CallPart[] => {
  const parts: CallPart[] = [{ word: 'Tight', label: 'formation' }]
  // Nothing said, nothing to explain: no word means the straight pass set.
  const slide = slideOf(call.protection)
  if (slide) {
    parts.push({
      word: protectionWordOf(call.protection),
      label: `protection — the line slides ${slide}`,
    })
  }
  if (call.dash) {
    parts.push({
      word: dashTagOf(call.dash),
      label: `Super runs instead of blocking — to the ${call.dash} flat`,
    })
  }
  parts.push({
    word: tightDigitsOf(call),
    label: 'routes — X, right wing, then left wing, Y',
  })
  return parts
}

// ---------------------------------------------------------------------------
// The four eligibles, in call order
// ---------------------------------------------------------------------------

/**
 * `where` is how a kid finds himself in the call, and in Tight it has to name
 * the man, not the spot — the wing is OUTSIDE his tight end here, so "the
 * widest man" would hand the first digit to the wrong player.
 */
const RECEIVERS = [
  {
    pos: 'X' as OffPosId,
    at: { x: 4.5, y: 0 } as Pt,
    side: 1 as const,
    ord: 'First',
    where: 'the RIGHT tight end, tight outside the right tackle',
  },
  {
    pos: 'R' as OffPosId,
    at: { x: 5.7, y: -1 } as Pt,
    side: 1 as const,
    ord: 'Second',
    where: 'the RIGHT WING, just outside X and a step off the ball',
  },
  {
    pos: 'L' as OffPosId,
    at: { x: -5.7, y: -1 } as Pt,
    side: -1 as const,
    ord: 'Third',
    where: 'the LEFT WING, just outside Y and a step off the ball',
  },
  {
    pos: 'Y' as OffPosId,
    at: { x: -4.5, y: 0 } as Pt,
    side: -1 as const,
    ord: 'Fourth',
    where: 'the LEFT tight end, tight outside the left tackle',
  },
]

const ROUTE_BY_NUM = new Map(routes.map((r) => [r.num, r]))
const routeNameOf = (num: number): string => ROUTE_BY_NUM.get(num)?.name ?? `Route ${num}`
const routeDetailOf = (num: number): string => ROUTE_BY_NUM.get(num)?.description ?? ''

// ---------------------------------------------------------------------------
// The protection, borrowed from the Red/Black machine
// ---------------------------------------------------------------------------

type Line = Partial<Record<OffPosId, Action[]>>

/**
 * THE LINE PASS BLOCKS, AND THAT IS ALL IT DOES. Both tight ends are out on
 * routes, so the five linemen are the whole protection: each one takes a short
 * kick-step back off the ball and blocks the man in front of him, or works his
 * hands over to the slide side when a word was called — Ram right, Bull left —
 * and nobody goes past the line. Coach Ryan's rule: a
 * lineman more than a yard downfield on a pass is an ineligible receiver
 * downfield, a penalty on us, so there is no climbing to a backer on any front.
 * The front only changes WHO shows up in each man's gap, not the set, so the
 * same five sets are drawn against the 4-4, the 4-3 and the 5-2.
 */
const lineFor = (slide: Side | null): Line => passLine(slide)

// ---------------------------------------------------------------------------
// THE MACHINE — one call in, one Play out.
// ---------------------------------------------------------------------------

/** Hand-written prose the generic builder cannot know. Optional. */
export interface TightAuthoring {
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

const a = (rule: string, detail: string): Assignment => ({ rule, detail })

const sharedReviewNotes = [
  'DRAFT — Coach Ryan must approve this football before it reaches a player.',
  'FOUR DIGITS OUT OF TIGHT. Tight releases four eligibles — both tight ends and both wings — so like Split Wide every one of them carries a digit and nobody has a standing rule. Red and Black stay two digits (three with the backside wing) because only three men get out of those sets.',
  'DIGIT ORDER IS "XR-LY", BY LETTER — THE JUDGMENT CALL IN THIS FILE. X first, the right wing second, then the left wing, then Y, written "95-59" with the hyphen splitting the right pair from the left. That keeps one rule true everywhere: the FIRST DIGIT IS ALWAYS X\'S. The cost is that in Tight the WING lines up OUTSIDE his tight end, so on each side you say the tight end first and the wing second. The alternative, strictly outside-in on each side, would be "RX-LY". Say the word and the builder and the pad slots both flip.',
  'STRAIGHT IS THE DEFAULT OUT OF TIGHT TOO — your words: "We don\'t have to call out a protection where we push left or right. If we don\'t say anything, you just block straight up like a normal pass protection, create a pocket." So "Tight 33-33" is a whole call and the five sets are drawn with no lean.',
  'THE PROTECTION IS A PASS SET IN EVERY FORMATION. Your rule — "when you pass block, you just pass block who\'s in front of you... they just block straight or the left or the right" — means the five linemen pass block on every audible: short step back, hands over to the slide side when a word was called, nobody upfield, nobody chasing a backer. Ram right and Bull left is the only direction in it. This file shares the same `passLine` helper from app/data/plays/audible-shared.ts as Red, Black and Split Wide.',
  'THE PROTECTION WORD IS WHAT PICKS A SIDE, IN EVERY FORMATION, AND IT IS ONLY SAID WHEN YOU WANT A SIDE PICKED. Ram goes right, Bull goes left, and either one can be said out of Red, Black, Split Wide or Tight — Coach Ryan, verbatim: "You can do bull or ram protection on any formation."',
  'BOTH TIGHT ENDS RELEASE, SO THE TACKLES HAVE THE ENDS ALONE. In Red, Y blocks the end beside him; in Tight he is out on a route, so each tackle has the end on his shoulder no matter which way the call goes — per your rule, the defensive end is blocked by the line every single time. Super never goes out after one: he stays back and chips whoever comes free. If a tackle needs help out there, the answer is to call a digit as a 0 and keep that man home, which the builder already draws as a block.',
  'NO PER-FRONT RULES — the line and Super do the same thing against the 4-4, the 4-3 and the 5-2. The front changes which jersey shows up in a gap, not the job, so the front picker no longer rewrites anybody\'s assignment.',
  'DASH COSTS YOU THE LAST BLOCKER. "Dash Right" / "Dash Left", after the protection word or in its place when none was called, sends Super out on a flat route to that side, which out of Tight means five men are out and only the five linemen are blocking. It is the fastest way to get a fifth receiver out and the quickest way to get the quarterback hit. The flat landmark is the same one the Red/Black machine draws.',
  'THE QUARTERBACK PICKS THE DROP — quick, fast-developing plays are three steps, a deep post or go is five, and if the defense is getting in quickly he stays at three and gets the ball out. Nothing here tells him who to throw to.',
  'ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts with nothing stretched — each man\'s tree is drawn toward his OWN sideline off his own alignment. The wings start a yard off the ball, where they line up. A 0 draws as a block, not a route.',
  'FORMATION is app/data/tight-formation.ts: Y tight at −4.5, X tight at +4.5, wings at ±5.7 a yard off the ball, Super 4½ deep, seven on the line so it is legal. Coach Ryan has approved the set itself; this is the first PASS called out of it.',
]

/**
 * Build a Tight audible. `authoring` pastes hand-written prose over the
 * generated table, the same way the other two machines do.
 */
export function buildTightAudible(call: TightCall, authoring: TightAuthoring = {}): Play {
  const word = protectionWordOf(call.protection) // Ram / Bull, or nothing
  // Null when nothing was called: no slide, every man on the man in front of him.
  const slide: Side | null = slideOf(call.protection)
  const SLIDE = slide ? slide.toUpperCase() : 'STRAIGHT UP'
  const DROP = dropWords(call.digits)

  const skill: Line = { Q: qDrop(call.digits) }
  for (const [i, r] of RECEIVERS.entries()) {
    skill[r.pos] = routeOn(call.digits[i]!, r.at, r.side)
  }

  /**
   * Super, when no Dash was called: he stays back and chips the nearest man who
   * comes free. He never goes out after an end — the line has the ends on every
   * play.
   */
  const S_ACTIONS = call.dash ? dashSuper(call.dash) : superStay()

  // -- the front-independent teaching table ---------------------------------

  const slideJob = (extra: string): Assignment =>
    slide === null
      ? a(
          'Pass block STRAIGHT UP. The man in front of you is yours.',
          `No protection word was called, so nobody slides: short kick-step back off the ball, hands inside on the man lined up in front of you, let him come to you and stay square. The five of us setting back together is the pocket. Never turn your shoulders, never chase a man who goes away from you, and never go past the line after a backer — that is a penalty on us. ${extra}`,
        )
      : a(
          `${word} — pass block, set ${SLIDE}. Take the man in your gap on the slide side.`,
          `This is a pass, so you PASS BLOCK: short step back off the ball, hands inside, let him come to you. We only hear ${word} when Coach wants the line moved: it means the whole line sets ${slide} together and each of us has the gap on that side of him. If a down lineman is in your gap he is yours; if it is empty, set in it anyway and take the first jersey that shows up. Never turn your shoulders, never chase a man who goes away from you, and never go past the line after a backer — that is a penalty on us. ${extra}`,
        )

  /** What a tackle is told, and it is the same both sides on a straight call. */
  const tackleExtra = (isEdge: boolean): string =>
    slide === null
      ? 'The end on your outside shoulder is yours — the line has the ends every play. Kick, get depth, and turn him around the pocket instead of into it.'
      : isEdge
        ? 'You are the last man on the slide, so your gap is the OUTSIDE one. Kick, get depth, and turn the rusher around the pocket instead of into it.'
        : 'You are the back end of the slide, so your gap is the one INSIDE you, toward the guard. If the end outside you comes, he is still yours — the line has the ends every play.'

  const receiverJob = (i: number): Assignment => {
    const r = RECEIVERS[i]!
    const d = call.digits[i]!
    if (d === 0) {
      return a(
        `${r.ord} digit: 0 — block. No route for you on this call.`,
        `A zero means stay in and help. You are ${r.where}, so take the first man who threatens the edge on your side and ride him past the quarterback. Four digits were called and yours is the one that keeps a blocker home — out of Tight that is worth a lot, because everybody else is gone.`,
      )
    }
    return a(
      `${r.ord} digit: ${d} — ${routeNameOf(d).toLowerCase()}.`,
      `Four digits, one for each of the four of us, said X first, then the right wing, then the left wing, then Y. You are ${r.where}, so the ${r.ord.toLowerCase()} number is yours. Run it toward YOUR sideline. ${routeDetailOf(d)}`,
    )
  }

  const superJob: Assignment = call.dash
    ? a(
        `${dashTagOf(call.dash).toUpperCase()} — you are not blocking. Release to the ${call.dash.toUpperCase()} flat.`,
        `Dash means you leave the backfield, and the word after it tells you which way: out to the ${call.dash.toUpperCase()}, about three yards deep in the flat, numbers back to the quarterback. Out of Tight that makes FIVE of us out and nobody left over to block — so run, and be a target early. The ball has to come out fast on this one.`,
      )
    : a(
        'Stay back and protect. Chip the nearest man who comes free.',
        'Both tight ends are gone, so you are the only help the five linemen have — but you never go out after an end, because our tackles have the ends on every play. Stay back there, find the nearest incoming defender and block him: a blitzing backer, or a rusher who beats one of ours. If nobody comes, STAY HOME.',
      )

  const assignments: Record<OffPosId, Assignment> = {
    X: receiverJob(0),
    R: receiverJob(1),
    L: receiverJob(2),
    Y: receiverJob(3),
    LT: slideJob(tackleExtra(slide !== 'right')),
    LG: slideJob(
      slide === null
        ? 'If nobody is over you, set back anyway, eyes inside, and take the first jersey that shows between you and the center.'
        : 'Your gap is the one between you and the center on the slide side.',
    ),
    C: slide === null
      ? a(
          'Snap, then pass block STRAIGHT UP. A nose on you is yours.',
          'Snap it and get your hands up the same instant. A man on your nose is yours — hold him and give no ground. If nobody is over you, take one short step back, stay square, and help whichever guard has the bigger man. Never past the line.',
        )
      : a(
          `Snap, then pass block, set ${SLIDE}. Take the man in your gap on the slide side.`,
          'Snap it and get your slide-side hand and foot moving the same instant, working back off the ball instead of out at it. Your gap is the one between you and the guard on the slide side. Stay square, let him come to you, and stay behind the line.',
        ),
    RG: slideJob(
      slide === null
        ? 'Hands on his near number and wall him off. You do not follow him anywhere — you hold your spot in the pocket.'
        : 'Step with the slide, hands on his near number, and wall him off.',
    ),
    RT: slideJob(tackleExtra(slide === 'right')),
    S: superJob,
    Q: a(
      `${DROP}.`,
      `Straight back off the midline, ball at your chest. The drop is yours to pick: a quick, fast-developing play is a three-step drop, a deep post or go route is five. These digits are a ${DROP.toLowerCase()}. If the defense is getting in quickly, stick to three-step drops and get the ball out quickly. Four digits means four live receivers — take the one they left alone, and if nothing is there, throw it away.`,
    ),
  }

  /**
   * The same picture against all three fronts: the line pass blocks whoever is
   * in front of it, Super stays back. The front changes which jersey shows up
   * in a gap, never anybody's job.
   */
  const plan = (front: FrontId): FrontPlan => ({
    actions: { ...lineFor(slide), ...skill, S: S_ACTIONS },
    assignments: { ...authoring.frontAssignments?.[front] },
  })

  const dashSlug = dashSlugOf(call.dash)
  const digits = tightDigitsOf(call)

  return {
    id:
      authoring.id ??
      `audible-tight${protectionSlugOf(call.protection)}${dashSlug}-${call.digits.join('')}`,
    name: authoring.name ?? `Tight ${digits}`,
    callName: tightCallName(call),
    call: tightCallParts(call),
    family: 'pass',
    formation: tight.id,
    // Straight protection has no direction in it; the playside badges want one,
    // so a Dash tag picks it and otherwise Tight takes the book's default side.
    direction: slide ?? (call.dash ?? 'right'),
    ballCarrier: 'Q',
    summary:
      authoring.summary ??
      'Called-at-the-line pass out of Tight. Four eligibles, a digit and a route each.',
    description: authoring.description ?? describeTight(call),
    assignments: { ...assignments, ...authoring.assignments },
    vs: {
      '44': plan('44'),
      '43': plan('43'),
      '52': plan('52'),
    } satisfies Record<FrontId, FrontPlan>,
    reviewNotes: authoring.reviewNotes ?? sharedReviewNotes,
  }
}

/** The generic, no-prose decode of a call — used when nothing is authored. */
function describeTight(call: TightCall): string {
  const slide = slideOf(call.protection)
  const protectionSentence =
    slide === null
      ? 'Nobody called a protection, so the line blocks straight up: every lineman takes the man in front of him, kick-steps back and builds a pocket, and it'
      : `"${protectionWordOf(call.protection)}" is the protection: the line slides ${slide.toUpperCase()} and each lineman defends the gap on that side of him, the same slide Red and Black run, and it`
  const superJob = call.dash
    ? `sends Super out of the backfield to the ${call.dash.toUpperCase()} flat — "${dashTagOf(call.dash)}" means he releases instead of blocking, and the word after Dash is the side he goes to, which leaves nobody left over up front`
    : 'keeps Super back to chip the nearest man who comes free'
  const parts = RECEIVERS.map((r, i) => {
    const d = call.digits[i]!
    return d === 0
      ? `${r.pos}, ${r.where}, has a zero and stays in to block`
      : `the ${d} belongs to ${r.pos}, ${r.where}, so he runs a ${routeNameOf(d).toLowerCase()}`
  })
  return (
    `${tightCallName(call)}. Tight releases four men — both tight ends and both wings — so every one of them gets a digit, the same as Split Wide. ` +
    `${protectionSentence} ${superJob}. ` +
    `Then the digits, said X first, then the right wing, then the left wing, then Y: ${parts.join('; ')}. ` +
    `The quarterback drops — ${dropWords(call.digits).toLowerCase()}, off the digits — and throws to whichever of the four the defense left alone.`
  )
}
