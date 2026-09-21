/**
 * THE AUDIBLE — the numbered passing system, as a machine.
 *
 * This file used to hold three hand-authored "free call" plays. It now holds
 * the SYSTEM those three plays were examples of: `buildAudible()` turns any
 * call — formation plus protection plus two digits — into a real Play the
 * diagram can draw. The three examples from the scans are still here; they are
 * the first three calls fed to the machine, plus the hand-written coaching
 * prose that the generic builder cannot know.
 *
 * That is what makes /audible work: a kid can call something nobody has ever
 * drawn and the screen shows him what it looks like.
 *
 * THE SYSTEM, in one paragraph
 * ---------------------------------------------------------------------------
 * Every route on the tree has a digit:
 *
 *     0 block · 1 slant · 2 speed out · 3 hitch · 4 wheel
 *     5 curl  · 6 comeback · 7 post · 8 corner · 9 fade
 *
 * A call is FORMATION + DIGITS, with a protection word in the middle only when
 * the line is being slid. The digits are read OUTSIDE-TO-IN on the
 * wide-receiver side. In Red the wide receiver (X) is the outside man and R, the right wing, is the
 * man inside him, so the first digit is always X's and the second is always the
 * inside wing's. In Black it is the mirror: X is still the outside man, and L,
 * the left wing, is inside him.
 *
 * SAY NOTHING AND THE LINE BLOCKS STRAIGHT UP
 * ---------------------------------------------------------------------------
 * Coach Ryan: "We don't have to call out a protection where we push left or
 * right. If we don't say anything, you just block straight up like a normal
 * pass protection, create a pocket." So "Red 33" is a whole call — no word in
 * the middle, every lineman on the man in front of him.
 *
 * The two words that DO slide the line are RAM (right) and BULL (left)
 * (app/data/plays/audible-shared.ts), said only when the coach wants it slid,
 * and either one can be said out of either formation. Red Bull and Black Ram
 * are real calls. Super stays back and picks up the nearest man who comes free
 * no matter which of the three it is.
 *
 * WHO CARRIES A DIGIT TODAY
 * ---------------------------------------------------------------------------
 * As the system stands, the digits go to three men: the wide receiver and the
 * two wings. Y, the tight end, is a zero on the calls we have — which is part
 * of why 0 is on the tree at all.
 *
 * OPEN: we are exploring how to call the Y to a route in this audible system.
 * It may be a fourth number. Awaiting confirmation, so nothing here sends him
 * out yet.
 *
 * TWO DIGITS, OR THREE
 * ---------------------------------------------------------------------------
 * Our normal call is TWO digits, and then the backside wing has a standing
 * rule: he runs a 2, a speed out, the OPPOSITE way. Call a THIRD digit and that
 * rule is off — the third digit is his, and he runs it off his own side.
 *
 * THE DASH TAG
 * ---------------------------------------------------------------------------
 * "Dash" rides where the protection word would be, or right after it, and it
 * NAMES A SIDE — Red Dash Right 33, Black Bull Dash Left 54. It means Super
 * does not block: he releases out of the backfield to the flat on the side you called. Either side can be
 * called out of either formation, so Dash Right is the right flat in Red AND in
 * Black. It works on either protection, and it trades a blocker for a fourth
 * target.
 *
 * THE EXAMPLES
 * ---------------------------------------------------------------------------
 *   Red Ram 33 — both digits the same. The simplest call there is.
 *   Red Ram 12 — two digits that work together: the slant runs in behind the
 *                out.
 *   Red Ram 54 — curl and wheel.
 *
 * Each of those three is authored out of Red and mirrored into Black, and the
 * page's formation toggle picks which one you are looking at — the PROTECTION
 * rides along unchanged, because it is a separate choice. A fourth example
 * rides along that came out of a DIFFERENT machine:
 *
 *   Split Wide 95-59 — Coach Ryan's own call, four digits for four
 *                     receivers out of Split Wide. Out of that formation every
 *                     receiver carries a digit, which is a different enough
 *                     call to get its own builder — see
 *                     app/data/plays/audible-split-wide.ts, with this call's
 *                     prose in app/data/plays/split-wide-9559.ts. /audible's
 *                     formation picker is what chooses between the two.
 */

import type {
  Action,
  Assignment,
  CallPart,
  FormationId,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
  Pt,
} from '../../types/football'
import { mirrorPlay } from '../../utils/mirror'
import type { DashSide, Protection, Side } from './audible-shared'
import {
  OPPOSITE,
  dropWords,
  dashPart,
  dashSlugOf,
  dashSuper,
  dashTagOf,
  protectionPart,
  protectionSlugOf,
  protectionWordOf,
  redLine,
  routeDetailOf,
  routeNameOf,
  routeOn,
  slideOf,
  slideWordOf,
  qDrop,
  superStay,
} from './audible-shared'
import type { SplitWideCall } from './audible-split-wide'
import { splitWideDigitsOf } from './audible-split-wide'
import { splitWide9559 } from './split-wide-9559'

/** Red alignments (app/data/formations.ts) — the origins routes are hung on. */
const AT_X: Pt = { x: 12, y: 0 }
const AT_R: Pt = { x: 4.2, y: -1 }
const AT_L: Pt = { x: -5.7, y: -1 }

// ---------------------------------------------------------------------------
// The backside wing — a standing rule when the call is only two digits.
// ---------------------------------------------------------------------------

/**
 * Coach Ryan's rule: the wing away from the action runs a 2 — a speed out, the
 * OPPOSITE way — whenever the call is two digits.
 *
 * If a THIRD digit is called it is his, and it replaces this.
 */
const L_BACKSIDE_OUT: Action[] = routeOn(2, AT_L, -1)

// ---------------------------------------------------------------------------
// Assignment text — the front-independent teaching table.
// ---------------------------------------------------------------------------

const a = (rule: string, detail: string): Assignment => ({ rule, detail })

/**
 * Everything that is the same on every call, written in RED positions.
 *
 * `word` and `SLIDE` are the protection AS CALLED, so the words are right in
 * both formations — and when nothing was called there is no word at all and
 * everybody blocks the man in front of him. `drawSlide` is the direction this
 * play is DRAWN going, which is the called side for Red and its opposite for
 * the Red play that gets mirrored into Black — that is what keeps a position's
 * role (who is the last man on the slide) landing on the right kid after the
 * mirror. It is null on the default call, where nobody has a slide side.
 */
function lineJobs(protection: Protection, drawSlide: Side | null, digits: number[]) {
  const DROP = dropWords(digits)
  const word = protectionWordOf(protection)
  const SLIDE = slideWordOf(slideOf(protection))

  /** Nothing called: straight up on the man in front of you, and make a pocket. */
  const straight = (extra: string): Assignment =>
    a(
      'Pass block STRAIGHT UP. The man in front of you is yours.',
      `No protection word was called, so nobody slides: you block the man lined up in front of you. Short kick-step BACK off the ball, hands inside, let him come to you, and stay square — the five of us step back together and that is what makes the pocket the quarterback throws from. Never turn your shoulders, never chase a man who goes away from you, and NEVER go past the line after a linebacker — a lineman more than a yard downfield on a pass is a penalty on us. ${extra}`,
    )

  /** Ram or Bull was called, so the whole line goes that way together. */
  const sliding = (extra: string): Assignment =>
    a(
      `${word} — pass block, set ${SLIDE}. Take the man in your gap on the slide side.`,
      `This is a pass, so you PASS BLOCK: short step back off the ball, hands inside, and let him come to you. We only hear ${word} when Coach wants the line moved: it means the whole line sets ${SLIDE.toLowerCase()} together and each of us has the gap on that side of him. If a down lineman is in your gap he is yours; if it is empty, set in it anyway and take the first jersey that shows up. Never turn your shoulders, never chase a man who goes away from you, and NEVER go past the line after a linebacker — a lineman more than a yard downfield on a pass is a penalty on us. ${extra}`,
    )

  /** In red coordinates the tight end is on the LEFT, so LT always has help outside. */
  const edge =
    'You have the man on your outside shoulder. Kick back, get depth, and turn the rusher around the pocket instead of into it. Push him past the quarterback, never let him under you.'
  const inside =
    'Your gap is the one inside you, toward the guard — set in it and take the man who is in it. The end outside you is the tight end\'s, so do not go chasing him.'

  /** The same two jobs said with no slide in them, for the straight call. */
  const edgeStraight =
    'You are the last man on your side, so the end on your outside shoulder is the man in front of you. Kick back, get depth, and turn him around the pocket instead of into it — never let him under you.'
  const insideStraight =
    'The end outside you belongs to the tight end, so do not chase him. Take whoever is on you, wall him off, and keep the pocket wide.'

  /** LT and RT, whichever way this play is drawn — and with no lean at all. */
  const tackle = (isEdge: boolean): Assignment =>
    drawSlide === null
      ? straight(isEdge ? edgeStraight : insideStraight)
      : sliding(isEdge ? edge : inside)

  return {
    Y: a(
      'Zero — block. You have the end on your side.',
      "On the calls we have, the digits go to the wide receiver and the two wings, so yours is a zero: stay in and block. Inside foot back, take the end outside our tackle and ride him past the quarterback. If he tries to cross your face, you have him — never let him inside. (We are working on a way to call you to a route in this system, maybe as a fourth number — until that is confirmed, block.)",
    ),
    LT: tackle(drawSlide !== 'right'),
    LG: drawSlide === null
      ? straight('The man over you is yours. If nobody is over you, set back anyway, eyes inside, and take the first jersey that shows in the gap next to the center.')
      : sliding('Your gap is the one between you and the center. If it is empty, set in it anyway.'),
    C: drawSlide === null
      ? a(
          'Snap, then pass block STRAIGHT UP. A nose on you is yours.',
          'Snap it and get your hands up the same instant. A man on your nose is yours — hold him, give no ground, and do not let him walk you back into the quarterback. If nobody is over you, take one short step back, stay square, and help whichever guard has the bigger man. Never go past the line after a backer.',
        )
      : a(
          `Snap, then pass block, set ${SLIDE}. Take the man in your gap on the slide side.`,
          'Snap it and get your slide-side hand and foot moving the same instant, working back off the ball, not out at it. Your gap is between you and the guard on the slide side. Stay square, never turn your shoulders, and stay behind the line — no chasing a backer.',
        ),
    RG: drawSlide === null
      ? straight('The man over you can slant either way. Hands on his near number, feet moving, and wall him off — you do not follow him anywhere, you hold your spot in the pocket.')
      : sliding('The man over you can slant either way; step with the slide, get your hands on his near number and wall him.'),
    RT: tackle(drawSlide === 'right'),
    S: a(
      'Stay back and protect. Chip the nearest man who comes free.',
      'You do not have a gap and you do not have a side — you sit back there and pick up any blitz or anybody who gets through. Find the nearest incoming defender and block him. You never have the end; the line has him every single time. If nobody comes, stay home. It is not complicated.',
    ),
    Q: a(
      `${DROP}.`,
      `Straight back off the midline, ball at your chest. The drop is yours to pick: a quick, fast-developing play is a three-step drop, a deep post or go route is five. These digits are a ${DROP.toLowerCase()}. If the defense is getting in quickly, stick to three-step drops and get the ball out quickly. Feet set on the last step, then throw.`,
    ),
    L: a(
      'Backside wing — two digits called, so you run the 2. Speed out, AWAY.',
      'Nobody said a third number, so you have the standing rule: a speed out the OPPOSITE way from the call. Five yards, roll your shoulders, break flat for YOUR sideline. You are the outlet if the quarterback comes off the digits, and you pull a defender away from them either way.',
    ),
  } satisfies Partial<Record<OffPosId, Assignment>>
}

// ---------------------------------------------------------------------------
// Front plan builders
// ---------------------------------------------------------------------------

/** Skill actions = the called digits + the backside wing. */
type Skill = Partial<Record<OffPosId, Action[]>>

/**
 * The three front plans, drawn in RED coordinates.
 *
 * The picture is the same against all three: the line pass blocks whoever is in
 * front of it — leaning with the call when there is one, straight up when there
 * is not — and Super stays back. The front only
 * changes which jersey shows up in a man's gap, never anybody's job, so no
 * front has assignments of its own. `drawDash` is the side to DRAW Super to —
 * undefined means no tag, so he blocks.
 */
function frontPlans(
  skill: Skill,
  drawSlide: Side | null,
  drawDash: DashSide | undefined,
  digits: number[],
): Record<FrontId, FrontPlan> {
  const Q_DROP = qDrop(digits)
  const S = drawDash ? dashSuper(drawDash) : superStay()

  /** The five pass sets plus Y, the same picture on every front. */
  const line = redLine(drawSlide)
  const actions = { ...line, ...skill, S, Q: Q_DROP }

  return {
    '44': { actions },
    '43': { actions },
    '52': { actions },
  }
}

// ---------------------------------------------------------------------------
// Shared review notes — every judgment call in this file, for Coach Ryan.
// ---------------------------------------------------------------------------

const sharedReviewNotes = [
  'DIGIT ORDER — the digits are read outside-to-in on the wide-receiver side: the first is X\'s, the second belongs to the wing inside him.',
  'TWO DIGITS OR THREE — the normal call is two digits, X first and the wing inside him second. A third digit belongs to the BACKSIDE wing and cancels his standing out. That is Coach Ryan\'s rule, given directly, and it is what the caller on /audible now offers.',
  'STRAIGHT IS THE DEFAULT — your words: "We don\'t have to call out a protection where we push left or right. If we don\'t say anything, you just block straight up like a normal pass protection, create a pocket." So the pad opens on Straight, no word goes in the call ("Red 33"), and every lineman sets on the man in front of him with no lean — a short kick-step back, tackles still on the ends, Super still back chipping.',
  'RAM AND BULL ARE ONLY SAID WHEN YOU WANT THE LINE SLID, and they are not the formation — your words: "It\'s just bull and ram, nothing else. You can do bull or ram protection on any formation. So you can do black ram and red bull." RAM goes RIGHT, BULL goes LEFT, and the formation picker and the protection picker are two separate buttons. The old build tied them together (Red was always Ram, Black always Bull) and offered a third protection, Sprint; both are gone.',
  'THE LINE PASS BLOCKS ON EVERY AUDIBLE — your rule, verbatim: "When you pass block, you just pass block who\'s in front of you. The line don\'t do anything crazy, they just block straight or the left or the right. The defensive end should be blocked every single time." So all five are drawn the same way on every front and in every formation: a short step back off the ball, then hands and shoulders over to the slide side, with the block bar capping about a third of a yard past the line. Nobody climbs to a backer, and the tackles (or Y, in Red and Black) always have the ends.',
  'SUPER JUST STAYS BACK — your words: "The Superback always stays back and protects. It\'s what\'s called a chip block. You find the nearest incoming defender and block them." He has no gap, no hip and no side, and he never blocks an end. The old build gave him an alignment rule off the tackle away from the slide; that is gone.',
  'NO PER-FRONT RULES — the line and Super do the same thing against the 4-4, the 4-3 and the 5-2. The front changes which jersey shows up in a gap, not the job, so the front picker no longer rewrites anybody\'s assignment.',
  'THE BACKSIDE WING\'S STANDING RULE IS A 2 — Coach Ryan\'s rule: on a two-digit call the wing away from the action runs a speed out the OPPOSITE way. Confirm this is still how you want it said.',
  'DASH NAMES A SIDE — "Dash Right" or "Dash Left", said after the protection word or in its place when none was called, means Super releases instead of blocking and goes out on a flat route to the side you called. Either side is callable out of either formation and on either protection. The flat landmark drawn here (about 10 yards out, 2 yards past the line) is authored — say the word if you want him flatter or deeper.',
  'THE QUARTERBACK PICKS THE DROP — your rule: quick, fast-developing plays are a three-step drop, a deep post or go is five, and if the defense is getting in quickly he stays at three and gets the ball out. The page reads the digits and draws the drop that matches; nothing tells him who to throw to.',
  'ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts, run off each man\'s own alignment with nothing stretched. A 0 draws as a block, not a route.',
]

// ---------------------------------------------------------------------------
// THE MACHINE — one call in, one Play out.
// ---------------------------------------------------------------------------

/** A digit off the route tree: 0–9. */
export type Digit = number

/**
 * A call: the protection, and the digits read outside-to-in on the
 * wide-receiver side. `outside` is always X's; `inside` is always the called
 * wing's; the optional third digit is the BACKSIDE wing's. The FORMATION is not
 * in here — it is chosen separately and handed to `buildAudible`.
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
  /**
   * "Dash Right" / "Dash Left": Super releases to the flat on THAT side instead
   * of blocking. Either side is callable out of either formation.
   */
  dash?: DashSide
}

/** Hand-written prose the generic builder cannot know. Optional. */
export interface AudibleAuthoring {
  id?: string
  summary?: string
  description?: string
  /** Overrides on top of the generated table — keyed by RED position ids. */
  assignments?: Partial<Record<OffPosId, Assignment>>
  reviewNotes?: string[]
}

/** Every live digit in a call — what decides the drop. */
const digitList = (call: AudibleCall): number[] =>
  [call.outside, call.inside, call.backside].filter((d): d is Digit => d !== undefined)

/** "33", "54", "542" — the digits as they are said in the huddle. */
export const digitsOf = (call: AudibleCall): string =>
  `${call.outside}${call.inside}${call.backside ?? ''}`

/**
 * "Red 33", "Red Bull 33", "Black Ram Dash Left 54". The protection word is in
 * the call only when one was called — say nothing and the line blocks straight
 * up, so the default call is just the formation and the digits. Dash rides
 * after the protection word, or in its place when there is none.
 */
export function callNameOf(call: AudibleCall, formation: 'red' | 'black'): string {
  const form = formation === 'red' ? 'Red' : 'Black'
  return [form, protectionWordOf(call.protection), dashTagOf(call.dash), digitsOf(call)]
    .filter(Boolean)
    .join(' ')
}

/** The same call, word by word, with what each word tells the huddle. */
export function callPartsOf(call: AudibleCall, formation: 'red' | 'black'): CallPart[] {
  const parts: CallPart[] = [
    { word: formation === 'red' ? 'Red' : 'Black', label: 'formation' },
  ]
  // No word on the default protection — there is nothing said to explain.
  const prot = protectionPart(call.protection)
  if (prot) parts.push(prot)
  if (call.dash) parts.push(dashPart(call.dash))
  parts.push({
    word: digitsOf(call),
    label:
      call.backside === undefined ? 'routes — X, then the wing' : 'routes — X, wing, backside wing',
  })
  return parts
}

/**
 * The two receiver jobs, written straight off the route tree. Every audible
 * gets these; the three examples then paste their hand-written versions over
 * the top.
 */
function digitAssignments(call: AudibleCall): Partial<Record<OffPosId, Assignment>> {
  const jobs: Partial<Record<OffPosId, Assignment>> = {
    X: a(
      `First digit: ${call.outside} — ${routeNameOf(call.outside).toLowerCase()}.`,
      `You are the outside man on the wide-receiver side, so the FIRST digit is always yours. ${routeDetailOf(call.outside)}`,
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
    const SIDE = call.dash.toUpperCase()
    jobs.S = a(
      `${dashTagOf(call.dash).toUpperCase()} — you are not blocking. Release to the ${SIDE} flat.`,
      `Dash means you leave the backfield, and the word after it tells you which way: get out to the ${SIDE} and get to about three yards deep in the flat, numbers back to the quarterback. Nobody is blocking your gap now, so RUN — the sooner you are a target, the sooner the ball can come out.`,
    )
  }

  return jobs
}

/** The generic, no-prose description of a call — used when nothing is authored. */
function describeCall(call: AudibleCall, formation: 'red' | 'black'): string {
  const wing = formation === 'red' ? 'R, the right wing' : 'L, the left wing'
  const backWing = formation === 'red' ? 'L, the left wing' : 'R, the right wing'
  const slide = slideOf(call.protection)
  const protectionSentence =
    slide === null
      ? 'Nobody called a protection, so the line blocks straight up: every lineman takes the man in front of him, kick-steps back and builds a pocket'
      : `"${protectionWordOf(call.protection)}" slides the line ${slide.toUpperCase()}`
  const superJob = call.dash
    ? `sends Super out of the backfield to the ${call.dash.toUpperCase()} flat — "${dashTagOf(call.dash)}" means he releases instead of blocking, and the word after Dash is the side he goes to`
    : 'keeps Super back to pick up anybody who gets through'
  const backside =
    call.backside === undefined
      ? `${backWing}, runs his standing rule — a 2, speed out, the opposite way`
      : `the third digit, the ${call.backside}, belongs to ${backWing}, so he runs a ${routeNameOf(call.backside).toLowerCase()} off his own side instead of his standing out`
  return (
    `${callNameOf(call, formation)}. ${protectionSentence}, ${superJob}, and the quarterback takes a ${dropWords(digitList(call)).toLowerCase()}. ` +
    `Then the digits, read outside-to-in on the wide-receiver side: the ${call.outside} belongs to X, the outside man, ` +
    `so he runs a ${routeNameOf(call.outside).toLowerCase()}; the ${call.inside} belongs to ${wing}, the man inside him, ` +
    `so he runs a ${routeNameOf(call.inside).toLowerCase()}. Y blocks on this call — a way to send him on a route is still being worked out — and ${backside}.`
  )
}

/**
 * Build any call, either formation. This is the whole point of the file:
 * /audible calls it with whatever the kid says out loud.
 *
 * Black is generated by mirroring Red — our three fronts are left/right
 * symmetric and varsity p1 draws Black as an exact mirror — so the only things
 * that change by hand are the id and the prose. The protection WORD does not
 * change: Ram is Ram out of either formation.
 *
 * THE SIDES ARE THE ONE THING THE MIRROR WOULD GET WRONG. "Ram" means the line
 * goes RIGHT and "Dash Right" means the RIGHT flat no matter which formation
 * said it, but mirroring negates every x — so the Red play we feed the mirror
 * is DRAWN with the opposite slide and the opposite dash, and the mirror puts
 * both back where the call said. The straight call has no side to get wrong:
 * it mirrors to itself, five men on the five men in front of them. Every word — the call name, the id, the line's
 * rules, Super's assignment — still says the side that was actually called.
 */
export function buildAudible(
  call: AudibleCall,
  formation: 'red' | 'black',
  authoring: AudibleAuthoring = {},
  blackAuthoring: AudibleAuthoring = {},
): Play {
  const flip = formation === 'black'
  const slide = slideOf(call.protection)
  // A straight call has no side, so it mirrors to itself — Black straight is
  // Black straight.
  const drawSlide: Side | null = slide && flip ? OPPOSITE[slide] : slide
  const drawDash: DashSide | undefined = call.dash
    ? flip
      ? OPPOSITE[call.dash]
      : call.dash
    : undefined

  const skill: Skill = {
    X: routeOn(call.outside, AT_X, 1),
    R: routeOn(call.inside, AT_R, 1),
    L: call.backside === undefined ? L_BACKSIDE_OUT : routeOn(call.backside, AT_L, -1),
  }

  const assignments = {
    ...lineJobs(call.protection, drawSlide, digitList(call)),
    ...digitAssignments(call),
    ...authoring.assignments,
  } as Record<OffPosId, Assignment>

  const idFor = (form: 'red' | 'black') =>
    `audible-${form}${protectionSlugOf(call.protection)}${dashSlugOf(call.dash)}-${digitsOf(call)}`

  const drawn: Play = {
    id: authoring.id ?? idFor('red'),
    name: `Audible ${dashTagOf(call.dash) ? `${dashTagOf(call.dash)} ` : ''}${digitsOf(call)}`,
    callName: callNameOf(call, 'red'),
    call: callPartsOf(call, 'red'),
    family: 'pass',
    formation: 'red',
    // Straight protection has no direction in it; the badges want one anyway,
    // so a Dash tag picks it and otherwise it is the formation's own side.
    direction: drawSlide ?? (drawDash ?? 'right'),
    ballCarrier: 'Q',
    summary:
      authoring.summary ?? 'Called-at-the-line pass. Drop back; the digits hand out the routes.',
    description: authoring.description ?? describeCall(call, 'red'),
    assignments,
    vs: frontPlans(skill, drawSlide, drawDash, digitList(call)),
    reviewNotes: authoring.reviewNotes ?? sharedReviewNotes,
  }

  if (!flip) return drawn

  return mirrorPlay(drawn, {
    id:
      blackAuthoring.id ??
      (authoring.id ? authoring.id.replace(/-red-/, '-black-') : idFor('black')),
    callName: callNameOf(call, 'black'),
    call: callPartsOf(call, 'black'),
    formation: 'black' as FormationId,
    summary: blackAuthoring.summary ?? drawn.summary,
    description: blackAuthoring.description ?? describeCall(call, 'black'),
    reviewNotes: blackAuthoring.reviewNotes ?? drawn.reviewNotes,
  })
}

// ---------------------------------------------------------------------------
// THE EXAMPLES — the calls the scans actually drew, with their prose.
// ---------------------------------------------------------------------------

/**
 * What /audible shows in its "Examples" fieldset.
 *
 * Most examples are a Red/Black PAIR out of the machine, and the page's
 * formation toggle picks which one you are looking at. One of them —
 * Split Wide 95-59 — lives in another formation entirely, so an example
 * can also be LOCKED to one formation and ignore that toggle.
 */
export interface AudibleExample {
  /** Stable key for the button, and the digits the kid says: '33', '95-59'. */
  digits: string
  /** One line for the button — what the digits buy you. */
  blurb: string
  /** The Red/Black machine call. Absent when the example is not one. */
  call?: AudibleCall
  /** The Split Wide machine call, for examples that live in that formation. */
  swCall?: SplitWideCall
  /** Set when this example lives in ONE formation and the toggle does not apply. */
  lockedFormation?: FormationId
  /** The play to draw for whichever side of the toggle the page is showing. */
  playFor: (formation: 'red' | 'black') => Play
  /** The call as it is said out loud, for that same side. */
  callNameFor: (formation: 'red' | 'black') => string
  /** Every play this example contributes to the book. */
  plays: Play[]
}

function example(
  call: AudibleCall,
  blurb: string,
  redAuthoring: AudibleAuthoring,
  blackAuthoring: AudibleAuthoring,
): AudibleExample {
  const red = buildAudible(call, 'red', redAuthoring)
  const black = buildAudible(call, 'black', redAuthoring, blackAuthoring)
  return {
    digits: digitsOf(call),
    blurb,
    call,
    playFor: (formation) => (formation === 'red' ? red : black),
    callNameFor: (formation) => callNameOf(call, formation),
    plays: [red, black],
  }
}

/**
 * An example out of a formation the Red/Black machine does not build: one play,
 * one formation, and the Split Wide call behind it, so "Call your own" can open
 * on that exact call.
 */
function splitWideExample(blurb: string, call: SplitWideCall, play: Play): AudibleExample {
  return {
    digits: splitWideDigitsOf(call),
    blurb,
    swCall: call,
    lockedFormation: play.formation,
    playFor: () => play,
    callNameFor: () => play.callName ?? play.name,
    plays: [play],
  }
}

/** 1 — RED RAM 33 · the simplest call in the system. */
const audible33 = example(
  { protection: 'ram', outside: 3, inside: 3 },
  'Both digits the same. The easiest call there is.',
  {
    id: 'audible-red-ram-33',
    description:
      'The easiest call in the system, and the one to learn it on. "Red" is the formation. "Ram" is the protection — the line slides RIGHT and Super stays back to pick up anybody who gets through. Then the digits, read outside-to-in on the wide-receiver side: the FIRST 3 belongs to X, the outside man, and the SECOND 3 belongs to R, the right wing, the man inside him. Three on the tree is a hitch, so both of them run one — six yards, stop, come back. Y blocks, like he does on every pass call, and L, the left wing, runs his standing rule — a 2, speed out the other way. Two digits, ball out in three steps.',
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
      'Vs the 4-4 this call leaves both walked-up outside backers unblocked. That is not an error — it is the whole reason 33 exists. Eight men in the box means somebody comes free, so the ball has to be gone at six yards. Worth saying to the kids in exactly those words.',
      ...sharedReviewNotes,
    ],
  },
  {
    id: 'audible-black-ram-33',
    description:
      'The same call out of Black — and the piece of it that changes is worth a whole meeting. Black flips the formation, so the wide-receiver side is now LEFT: X is still the outside man and now L, the left wing, is the man inside him. The digits do not change (X first, wing second, still outside-to-in). Neither does the protection: "Ram" still means the line slides RIGHT, because Ram and Bull name real directions and have nothing to do with which formation you are in. Say "Black Bull 33" instead and you get the identical two routes with the line going the other way — the formation and the protection are two separate choices.',
    reviewNotes: [
      'Generated by mirroring the Red build (app/utils/mirror.ts) with no hand corrections — our three fronts are left/right symmetric and p1 draws Black as an exact mirror of Red. The Red play that gets mirrored is DRAWN with the opposite slide so that "Ram" still comes out going right in Black.',
      'The protection word does NOT change with the formation any more. That was the old model (Red = Ram, Black = Bull) and it is gone: Black Ram and Red Bull are both legal calls.',
      ...sharedReviewNotes,
    ],
  },
)

/** 2 — RED RAM 12 · two digits that work together. */
const audible12 = example(
  { protection: 'ram', outside: 1, inside: 2 },
  'A slant and a speed out — two routes off one call.',
  {
    id: 'audible-red-ram-12',
    description:
      'Same formation, same protection, two different digits — and this is where the system starts paying. "Red" is the formation, "Ram" slides the line right and Super stays back to protect. Then read the digits outside-to-in: the 1 is X\'s, so the outside man runs a SLANT inside; the 2 is R\'s, so the right wing runs a SPEED OUT to the sideline. Two routes crossing in opposite directions off one two-digit call. Notice the outside digit is not the deep one — the number tells you the route, never the depth.',
    assignments: {
      X: a(
        'First digit: 1 — slant.',
        'Three hard steps upfield to make him turn his hips, then plant your outside foot and cut inside on an angle. Look for the ball the instant you break — the wing is clearing the man underneath you.',
      ),
      R: a(
        'Second digit: 2 — speed out.',
        'Five yards, roll your shoulders and break flat to the sideline. Fast in, fast out. Your route is what pulls the flat defender out from under the slant.',
      ),
      Q: a(
        'Three-step drop — both digits are quick routes.',
        'Quick routes, so it is a three-step drop and the ball comes out fast. Take whichever of the two is open. If they are getting in quickly, stay at three steps and get rid of it.',
      ),
    },
    reviewNotes: [
      'THE SLANT AND THE OUT CROSS — the 1 breaks in, the 2 breaks out, and both are drawn at the depths the route tree gives them. The wing runs his speed out off his own alignment, so it finishes inside X\'s spot; say the word if you want him stretched out toward the sideline instead.',
      ...sharedReviewNotes,
    ],
  },
  {
    id: 'audible-black-ram-12',
    description:
      'Twelve out of Black. Wide-receiver side is left now, so the 1 goes to X on the left and the 2 goes to L, the left wing — still first digit outside, second digit in. The protection word is untouched: Ram still slides the line RIGHT, and Super still stays back. Want it going the other way? Say Black Bull 12.',
    reviewNotes: [
      'Generated by mirroring the Red build with no hand corrections. Ram stays Ram — the word names a direction, and the formation does not pick it.',
      ...sharedReviewNotes,
    ],
  },
)

/** 3 — RED RAM 54 · the book's own digits: curl and wheel. */
const audible54 = example(
  { protection: 'ram', outside: 5, inside: 4 },
  'Curl and wheel — the two digits the book works out by hand.',
  {
    id: 'audible-red-ram-54',
    description:
      'Fifty-four is a curl and a wheel. Take the call apart. "Red" is the formation. "Ram" is the protection — the line slides RIGHT together and Super stays back to protect, while the quarterback drops. Then the digits, outside-to-in on the wide-receiver side: 5 is X\'s, so the outside man runs a CURL; 4 is R\'s, so the right wing runs a WHEEL up the sideline behind him. Same reading order as every other call — only the numbers changed.',
    assignments: {
      X: a(
        'First digit: 5 — curl.',
        'Ten yards straight up, then curl back inside toward the quarterback and find the open grass. Keep working back to him — a curl is a place you settle into, not a spot you stand on.',
      ),
      R: a(
        'Second digit: 4 — wheel.',
        'Start flat like you are running an out and sell it, then turn it up the sideline and RUN. Eyes back over your outside shoulder.',
      ),
      Q: a(
        'Five-step drop — the wheel is a deep route.',
        'Straight back, five steps, because a route that runs up the sideline needs the time. Take whichever man the defense left alone; if nothing is there, throw it away. If they are getting in quickly, come back to three steps and get the ball out.',
      ),
    },
    reviewNotes: [
      'THIS EXAMPLE USED TO BE A SPRINT CALL, "Red Sprint Right 54". Coach Ryan: "It\'s just bull and ram, nothing else... Remove the sprint right for protection as well." So the same two digits are now called with Ram, the line going right, and the quarterback drops back instead of sprinting. The routes are untouched.',
      'THE WHEEL RUNS AT TREE WIDTH off the wing\'s own alignment, which starts him inside X. Worth an eyeball: if you want the wing outside the curl before he turns up, his release has to be widened and that is a change to make on purpose.',
      ...sharedReviewNotes,
    ],
  },
  {
    id: 'audible-black-ram-54',
    description:
      'Fifty-four to the left. Black puts the wide receiver on the left, so 5 is still X\'s curl because he is still the outside man, and 4 is still the wing\'s wheel because L is still the man inside him. The digits never change sides. The protection does not change either — Ram is Ram, the line slides RIGHT — so out of Black this one slides AWAY from the throw. Say Black Bull 54 if you want the line going with it.',
    reviewNotes: [
      'Generated by mirroring the Red build with no hand corrections. The digits are unchanged, which is the teaching point.',
      'BLACK RAM SLIDES AWAY FROM THE ROUTES. With the protection no longer tied to the formation, this pairing is legal and callable — it is the picture to look at if you want to talk about why you would pick one word over the other. Flag it if you would rather the pad steered kids toward sliding to the throw.',
      ...sharedReviewNotes,
    ],
  },
)

/**
 * 4 — SPLIT WIDE BULL 95-59 · Coach Ryan's own call.
 *
 * The first call in the book with a digit for every receiver, and the one the
 * machine above cannot build — different formation, four digits, four routes.
 * Its own machine is app/data/plays/audible-split-wide.ts and its prose is in
 * app/data/plays/split-wide-9559.ts; here it is only dressed as an example so
 * /audible can show it beside the other three.
 */
const audible9559 = splitWideExample(
  'Four receivers, four digits: fades outside, curls inside.',
  { protection: 'bull', digits: [9, 5, 5, 9] },
  splitWide9559,
)

/** The baked-in examples, in teaching order. */
export const audibleExamples: AudibleExample[] = [
  audible33,
  audible12,
  audible54,
  audible9559,
]

/** Every example play — what the book and the quiz see. */
export const audiblePlays: Play[] = audibleExamples.flatMap((e) => e.plays)
