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

import type { Action, Assignment, CallPart, OffPosId, Pt } from '../../types/football'
import { routes } from '../routes'
import { GUN_CALL_PART } from './gun-shared'

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

// ---------------------------------------------------------------------------
// THE GUN — the same audible, with the backfield re-formed around the QB.
// ---------------------------------------------------------------------------

/**
 * Any Red, Black or Split Wide audible can be said from the gun — "Red Gun Ram
 * 33", "Split Wide Gun 95-59" — and Tight cannot. The word goes right after
 * the formation. The LINE NEVER CHANGES: same pass set, same Ram/Bull/straight,
 * same rule about never going past the line. What changes is where three or
 * four kids start (app/data/shotgun.ts): the quarterback is 3 yards back,
 * Super is a yard LEFT of him and a yard behind in every gun set, the wing
 * beside him is a yard RIGHT of him and a yard behind, and the other wing is
 * out in the open slot. Everything below is drawn from THOSE spots.
 *
 * DRAFT — Coach Ryan has ruled the alignments and the call word; the football
 * for the audible from the gun (the drop, Super's edge, the Dash paths) is
 * authored here and flagged in every gun play's reviewNotes.
 */

/** "Gun", the word after the formation — same CallPart the gun runs use. */
export const gunCallPart = (): CallPart => GUN_CALL_PART

/**
 * THE DROP FROM THE GUN IS SHORTER — he already has 3 yards. Quick digits
 * (hitch, slant, speed out, curl) are CATCH AND THROW: one step to set the
 * feet and the ball is out. The deep ones are a THREE-step drop from the gun,
 * where under center they were five. Both start at the gun spot (0, −3).
 */
export const Q_DROP_GUN_QUICK: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.1, y: -3.6 },
      { x: -0.2, y: -4.1 },
    ],
  },
]

export const Q_DROP_GUN_3: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.2, y: -4 },
      { x: -0.4, y: -5.6 },
    ],
  },
]

/** The drop the digits ask for, from the gun. */
export const qDropGun = (digits: number[]): Action[] =>
  isQuickCall(digits) ? Q_DROP_GUN_QUICK : Q_DROP_GUN_3

/** The gun drop as a rule line, to match what is drawn. */
export const dropWordsGun = (digits: number[]): string =>
  isQuickCall(digits) ? 'Catch and throw — one step from the gun' : 'Three-step drop from the gun'

/** The quarterback's job from the gun. `extra` is a formation's own last line. */
export const gunQuarterbackJob = (digits: number[], extra = ''): Assignment =>
  isQuickCall(digits)
    ? {
        rule: `${dropWordsGun(digits)}.`,
        detail: `You are already 3 yards back, so there is no drop to take: catch the snap, one step to set your feet, and throw. These digits are quick routes — the ball is out on the receiver's break. If the rush is coming it is still one step; you do not have anywhere farther to go. ${extra}`.trim(),
      }
    : {
        rule: `${dropWordsGun(digits)}.`,
        detail: `You are already 3 yards back, so the five steps you would take under center are THREE from here: catch it, three steps straight back off the midline, feet set on the last one, then throw. These digits need the time. If the defense is getting in quickly, cut it to one step and get the ball out. ${extra}`.trim(),
      }

/**
 * SUPER STAYS, FROM THE GUN. He is a yard left of the quarterback and a yard
 * behind him in every gun set, so the LEFT edge is the one he can see — he
 * checks it first, then chips the nearest man who comes free. Drawn as a short
 * step up and out to his left from (−1, −4), capped with the block bar.
 */
export const superStayGun = (): Action[] =>
  setBlock([
    { x: -1.4, y: -3.2 },
    { x: -1.9, y: -2.2 },
  ])

/**
 * DASH FROM THE GUN. Same flat, same landmark as under center (about 10 yards
 * out, 2 past the line), but he starts a yard LEFT of the quarterback: Dash
 * Left releases straight out to the left flat; Dash Right means crossing
 * BEHIND the quarterback first, then bending out to the right flat.
 */
export const dashSuperGun = (side: DashSide): Action[] => [
  {
    kind: 'route',
    path:
      side === 'left'
        ? [
            { x: -3.4, y: -4.2 },
            { x: -6, y: -3.1 },
            { x: -8.6, y: -1 },
            { x: -10.2, y: 2 },
          ]
        : [
            // A yard deeper first, so he passes behind the wing at (1, −4) too.
            { x: 0.4, y: -5.2 },
            { x: 3.4, y: -5 },
            { x: 6.4, y: -2.6 },
            { x: 8.6, y: -1 },
            { x: 10.2, y: 2 },
          ],
  },
]

/** Super's job from the gun — stay and protect, or the Dash tag. */
export const gunSuperJob = (dash?: DashSide): Assignment => {
  if (!dash) {
    return {
      rule: 'Stay back and protect from your gun spot. Check the LEFT edge first, then chip the nearest man who comes free.',
      detail:
        'From the gun you are a yard left of the quarterback and a yard behind him, so the left edge is the one you can see — look there first. You still do not have a gap and you do not have a side: find the nearest incoming defender and block him. You never have the end; the line has him every single time. If nobody comes, stay home.',
    }
  }
  return dash === 'left'
    ? {
        rule: 'DASH LEFT — you are not blocking. Release from your gun spot to the LEFT flat.',
        detail:
          'You are already on the left, so go: straight out of the backfield, get to about three yards deep in the left flat, numbers back to the quarterback. Nobody is blocking your spot now, so RUN — the sooner you are a target, the sooner the ball can come out.',
      }
    : {
        rule: 'DASH RIGHT — you are not blocking. Cross BEHIND the quarterback to the RIGHT flat.',
        detail:
          'You are a yard left of the quarterback, so Dash Right means crossing behind him first — stay BEHIND him, never in front of the throw — then bend out to about three yards deep in the right flat, numbers back to him. Nobody is blocking your spot now, so RUN.',
      }
}

/**
 * The gun REVIEW NOTES every gun audible carries on top of its own — every
 * football decision in this section, for Coach Ryan.
 */
export const gunReviewNotes: string[] = [
  'DRAFT — THE GUN AUDIBLE: same call with "Gun" said right after the formation ("Red Gun Ram 33", "Split Wide Gun 95-59"). The line never changes — same pass set, same Ram/Bull/straight, nobody past the line. Only the backfield moves, to the gun spots in app/data/shotgun.ts. No gun out of Tight.',
  'DRAFT — THE DROP FROM THE GUN: he already has 3 yards, so quick digits (hitch, slant, speed out, curl) are catch and throw — one step — and the deep ones are a THREE-step drop from the gun instead of five. Say the word if you want the deep drop to stay at five from the gun.',
  'DRAFT — SUPER STAYS FROM HIS GUN SPOT, a yard left of the quarterback and a yard behind him in every gun set, so he checks the LEFT edge first and then chips the nearest man who comes free. Same rule, same no-gap-no-side, he still never has the end.',
  'DRAFT — DASH FROM THE GUN: Dash Left releases straight to the left flat (he is already on the left). Dash Right crosses BEHIND the quarterback, then bends to the right flat. Both finish at the same flat landmark as under center.',
]
