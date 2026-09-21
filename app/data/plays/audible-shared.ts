/**
 * THE AUDIBLE'S SHARED PARTS — the protection, the tag, the route helper.
 *
 * Three formations can say an audible (Red/Black, Split Wide, Tight) and each
 * has its own builder, because the CALL is a different shape in each: two
 * digits out of Red and Black, four out of Split Wide and Tight. But the words
 * that are not digits are the same everywhere, and they live here so the three
 * builders share them instead of importing from each other.
 *
 * THE PROTECTION — SAY NOTHING AND THE LINE BLOCKS STRAIGHT UP
 * ---------------------------------------------------------------------------
 * Coach Ryan, verbatim: "We don't have to call out a protection where we push
 * left or right. If we don't say anything, you just block straight up like a
 * normal pass protection, create a pocket."
 *
 * So STRAIGHT is the default and it is not a word anybody says — it is what a
 * call with no protection word in it means:
 *
 *     (nothing) = every lineman blocks the man in front of HIM. No lean.
 *     RAM       = the line slides RIGHT
 *     BULL      = the line slides LEFT
 *
 * Ram and Bull are only said when the coach wants the whole line moving one
 * way together. Everything else about the set is the same either way: on a
 * pass the five linemen PASS BLOCK and nothing else. Short kick-step back off
 * the ball, hands inside, pocket around the quarterback. They never go more
 * than a yard past the line — that is ineligible receiver downfield, a penalty
 * on us — and they never go get a linebacker.
 *
 * That is the whole vocabulary. Ram and Bull name a DIRECTION, never a
 * formation and never a side of a play, so "Ram" means the same thing out of
 * Red, Black, Split Wide and Tight. Formation and protection are two separate
 * choices: Red 33, Red Bull 33 and Black Ram 54 are all real calls.
 *
 * SUPER — Coach Ryan, verbatim: "The Superback always stays back and protects.
 * It's what's called a chip block. You find the nearest incoming defender and
 * block them. It's not very complicated." He never has the defensive end —
 * the line has those. The Dash tag is the one thing that takes him out of it.
 */

import type { Action, CallPart, OffPosId, Pt } from '../../types/football'
import { routes } from '../routes'

// ---------------------------------------------------------------------------
// Sides
// ---------------------------------------------------------------------------

/** Left or right, the two answers to every direction question in this system. */
export type Side = 'right' | 'left'

export const OPPOSITE: Record<Side, Side> = { right: 'left', left: 'right' }

/** The side as it is said out loud. */
export const SIDE_WORD: Record<Side, string> = { right: 'Right', left: 'Left' }

// ---------------------------------------------------------------------------
// The protection
// ---------------------------------------------------------------------------

/**
 * The three protections. 'none' is the DEFAULT — nobody says a word, every
 * lineman blocks the man in front of him and they build a pocket. Ram and Bull
 * are the two words that slide the line, and they are only said when the coach
 * wants it slid.
 */
export type Protection = 'none' | 'ram' | 'bull'

/** What the protection is CALLED on the pad. "Straight" is never said out loud. */
export const PROTECTION_LABELS: Record<Protection, string> = {
  none: 'Straight',
  ram: 'Ram',
  bull: 'Bull',
}

/** The word that actually goes in the call — nothing at all for the default. */
export const protectionWordOf = (protection: Protection): string =>
  protection === 'none' ? '' : PROTECTION_LABELS[protection]

/** "-ram" / "-bull", and nothing for the default — the slug a play id gets. */
export const protectionSlugOf = (protection: Protection): string =>
  protection === 'none' ? '' : `-${protection}`

/**
 * Which way the line slides. NULL is the default: no slide at all, every man
 * on the man in front of him. This is the only thing Ram and Bull mean.
 */
export const slideOf = (protection: Protection): Side | null =>
  protection === 'none' ? null : protection === 'ram' ? 'right' : 'left'

/** +1 for the right side of the ball, −1 for the left. */
export const signOf = (side: Side): 1 | -1 => (side === 'right' ? 1 : -1)

/** +1 right, −1 left, 0 straight up — how far over a set leans, if at all. */
export const leanSign = (slide: Side | null): 1 | 0 | -1 => (slide ? signOf(slide) : 0)

/** "RIGHT" / "LEFT" / "STRAIGHT UP" — the set as it is shouted. */
export const slideWordOf = (slide: Side | null): string =>
  slide ? slide.toUpperCase() : 'STRAIGHT UP'

/**
 * The protection word in a spoken call — null on the default, because there is
 * no word to say and nothing for the huddle to remember.
 */
export const protectionPart = (protection: Protection): CallPart | null =>
  protection === 'none'
    ? null
    : {
        word: PROTECTION_LABELS[protection],
        label: `protection — the line slides ${slideOf(protection)!.toUpperCase()}`,
      }

// ---------------------------------------------------------------------------
// The Dash tag
// ---------------------------------------------------------------------------

/** Which flat "Dash" sends Super to. The tag always names a side. */
export type DashSide = Side

/** "Dash Right", or nothing when the tag was not called. */
export const dashTagOf = (dash?: DashSide): string => (dash ? `Dash ${SIDE_WORD[dash]}` : '')

/** "-dash-right", or nothing — the slug the tag adds to a play id. */
export const dashSlugOf = (dash?: DashSide): string => (dash ? `-dash-${dash}` : '')

/** The tag in a spoken call. */
export const dashPart = (dash: DashSide): CallPart => ({
  word: dashTagOf(dash),
  label: `Super runs instead of blocking — to the ${dash} flat`,
})

// ---------------------------------------------------------------------------
// Small authoring helpers
// ---------------------------------------------------------------------------

/** A block aimed at a defender — no path, so it can never strand a diagram. */
export const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

/**
 * A block with nobody in the gap: a short set step into the gap you own,
 * capped with the block bar. Used where the front leaves a lineman uncovered
 * and the protection still makes that gap his.
 */
export const setBlock = (path: Pt[]): Action[] => [{ kind: 'block', path }]

const ROUTE_BY_NUM = new Map(routes.map((r) => [r.num, r]))

export const routeNameOf = (num: number): string => ROUTE_BY_NUM.get(num)?.name ?? `Route ${num}`
export const routeDetailOf = (num: number): string => ROUTE_BY_NUM.get(num)?.description ?? ''

/**
 * Put a numbered route from app/data/routes.ts onto a receiver.
 *
 * `side` is +1 when the receiver's sideline is to the offense's right (the
 * tree is drawn once with +x toward the receiver's OUTSIDE and flipped for
 * the other side of the formation, per app/data/routes.ts).
 *
 * The route is the tree's route, off the man's own alignment — nothing is
 * stretched or reshaped by the formation he is in.
 *
 * Zero is not a route, it is a block, so it comes back with the block kind —
 * otherwise a called 0 would draw a two-yard "route" into a defender.
 */
export function routeOn(num: number, from: Pt, side: 1 | -1): Action[] {
  const def = ROUTE_BY_NUM.get(num)
  if (!def) throw new Error(`audible: no route numbered ${num}`)
  return [
    {
      kind: num === 0 ? 'block' : 'route',
      path: def.path.map((p) => ({ x: from.x + p.x * side, y: p.y })),
    },
  ]
}

// ---------------------------------------------------------------------------
// The five linemen + the tight end.
// ---------------------------------------------------------------------------

/**
 * THE PASS SET — the only thing a lineman does on an audible.
 *
 * Coach Ryan, verbatim: "Whenever a lineman goes past the line of scrimmage by
 * more than a yard, it is called an ineligible receiver downfield and it's a
 * penalty on us. So all pass plays, the linemen do a pass block. You can still
 * block people to the right or to the left, which is RAM or BULL, but other
 * than that they don't block upfield." And, on the default: "If we don't say
 * anything, you just block straight up like a normal pass protection, create a
 * pocket."
 *
 * So the picture is the same for all five, on every front, out of every
 * formation: a short kick-step BACK off the ball, capped with the block bar.
 * The bar's deepest point is about a third of a yard past the line — nobody is
 * ever downfield and nobody ever goes hunting a linebacker. The ONLY thing a
 * protection word changes is whether the hands and shoulders then work over to
 * a side; with no word called the set goes straight back and the five of them
 * are a pocket.
 *
 * `x` is the lineman's own spot, `slide` is +1 for Ram (right), −1 for Bull
 * (left) and 0 for the default — straight up on the man in front of him, no
 * lateral lean at all — and `reach` is how far over he works when there is a
 * slide, shorter for the center, who can have a nose head-up on him.
 */
export const passSet = (x: number, slide: 1 | 0 | -1, reach = 1): Action[] => [
  {
    kind: 'block',
    path: [
      { x: x + 0.3 * slide, y: -0.7 },
      { x: x + reach * slide, y: 0.35 },
    ],
  },
]

/**
 * All five linemen: each one blocks whoever is in front of him, and a called
 * protection leans the three inside men — Ram right, Bull left. Pass `null`
 * (the default, nothing called) and nobody leans: five straight sets, a pocket.
 *
 * THE TACKLES ALWAYS HAVE THE ENDS. Coach Ryan's rule: the defensive end is
 * blocked on every play by the line, never by Super. So when nobody is outside
 * them (Tight, Split Wide) both tackles set OUT on the end on their shoulder
 * whichever way the call went — and on the straight call too.
 */
export const passLine = (side: Side | null): Partial<Record<OffPosId, Action[]>> => {
  const s = leanSign(side)
  return {
    LT: passSet(-3, -1),
    LG: passSet(-1.5, s),
    C: passSet(0, s, 0.5),
    RG: passSet(1.5, s),
    RT: passSet(3, 1),
  }
}

/**
 * Red and Black keep the tight end IN, so their line picture is the five pass
 * sets plus Y on the end beside him. Out of Tight and Split Wide he is a
 * receiver and only the five are left.
 */
export const redLine = (side: Side | null): Partial<Record<OffPosId, Action[]>> => ({
  ...passLine(side),
  // Y is in, so the end on his side is his and the left tackle leans with the
  // call instead of kicking out to him — or sets straight up when nothing was
  // called.
  Y: block('E-L'),
  LT: passSet(-3, leanSign(side)),
})

// ---------------------------------------------------------------------------
// Super and the quarterback.
// ---------------------------------------------------------------------------

/**
 * SUPER STAYS BACK. He does not have a gap, a hip or a side — he sits in the
 * backfield, finds the nearest man who comes free, and chips him. Drawn as a
 * short step up behind the line, capped with the block bar, the same on every
 * front and out of every formation.
 */
export const superStay = (): Action[] =>
  setBlock([
    { x: 0, y: -3.6 },
    { x: 0, y: -2.3 },
  ])

/**
 * DASH — the tag that takes Super out of the protection.
 *
 * Coach Ryan's term: on Dash, Super does not block anybody. He releases out of
 * the backfield to the flat on the side the call names — Dash Right sends him
 * right, Dash Left sends him left, out of any formation and on either
 * protection. It is a route, not a block, so the diagram draws him as a
 * receiver, and it trades a blocker for a fourth target.
 *
 * One shape, drawn toward +x and negated for the left. `side` here is the side
 * to DRAW him to; a play that gets mirrored is fed the opposite one.
 */
export const dashSuper = (side: DashSide): Action[] => {
  const s = signOf(side)
  return [
    {
      kind: 'route',
      path: [
        { x: 2.6, y: -4.2 },
        { x: 5.6, y: -3.1 },
        { x: 8.6, y: -1 },
        { x: 10.2, y: 2 },
      ].map((p) => ({ x: p.x * s, y: p.y })),
    },
  ]
}

/**
 * THE DROP IS THE ROUTE'S, NOT A HABIT. Coach Ryan: quick routes — hitch,
 * slant, speed out, curl — are a THREE-step drop; the deep ones (post, fade,
 * corner, comeback, wheel) are five. If the rush is getting home, stay at
 * three. A 0 is a block, so it does not vote.
 */
const QUICK_ROUTES = new Set([1, 2, 3, 5])

/** True when every live digit in the call is a quick route. */
export const isQuickCall = (digits: number[]): boolean =>
  digits.filter((d) => d !== 0).every((d) => QUICK_ROUTES.has(d))

/** Five-step drop, straight back off the midline. */
export const Q_DROP: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.3, y: -3.7 },
      { x: -0.5, y: -6.2 },
    ],
  },
]

/** Three-step drop — the quick game. Same line, shorter. */
export const Q_DROP_3: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.2, y: -2.2 },
      { x: -0.3, y: -3.8 },
    ],
  },
]

/** The drop the digits ask for. */
export const qDrop = (digits: number[]): Action[] =>
  isQuickCall(digits) ? Q_DROP_3 : Q_DROP

/** "Three-step drop" / "Five-step drop", to match what is drawn. */
export const dropWords = (digits: number[]): string =>
  isQuickCall(digits) ? 'Three-step drop' : 'Five-step drop'
