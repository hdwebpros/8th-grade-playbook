/**
 * CRUSH from the GUN — "Red Gun Crush Right", etc. Four plays built from the
 * four under-center Crush plays with `gunPlay` (see gun-shared.ts for Coach
 * Ryan's 2026-09-21 rules). The line, X and Y keep every job they have under
 * center; only the backfield and the two wings change.
 *
 * Gun spots (app/data/shotgun.ts): Q (0,−3) · Super (−1,−4) · the wing beside
 * the quarterback (1,−4) — R in Red, L in Black · the slot wing a yard off
 * the line at (−8.5,−1) in Red, (8.5,−1) in Black.
 *
 * What changes from under center:
 *   - NO MOTION. The pitch man is already in the backfield.
 *   - PLAYSIDE BACK GETS THE BALL. Running right, the wing beside the
 *     quarterback dives (R in Red, L in Black); running left, Super dives.
 *     The other back is the pitch man: he runs behind the quarterback and
 *     holds the varsity 5-by-1 relationship off where the quarterback ends.
 *   - The dive is still OUTSIDE the playside tackle — the C gap — which is
 *     what makes it Crush and not Veer. From a yard beside and a yard behind
 *     the quarterback the back crosses his face at about (±1.6, −2.7), so
 *     the mesh is deeper than under center (there it was at (±2, −1.2)).
 *   - The quarterback catches the snap at −3 and runs the same flat path to
 *     the read — he just starts from deeper, so the arrow ends at (±5.5,
 *     −1.6) instead of (±5, −1.2). The read key is the base's read key on
 *     every front: one man wider than Veer's.
 *   - THE PLAYSIDE WING IS GONE FROM THE EDGE. Under center he released past
 *     the read and pinned the playside backer. Who has that backer now is
 *     decided per front below and flagged DRAFT in each play's reviewNotes.
 *   - THE SLOT WING has a real job: playside he stalks the corner (the man
 *     nobody blocked on the TE side under center); backside he takes the
 *     walked-up backer in a 4-4 and cuts off the safety on his side in the
 *     4-3 and the 5-2 — a man the base plans left free.
 *
 * Every path here is drawn from the GUN starts (absolute yards, excluding the
 * player's own spot — the renderer prepends it). Aiming points:
 *   dive   → C gap at the line (±3.3, −0.2), then bends upfield to (±4.4, 5.5)
 *   Q      → flat, ends just outside the tackle's block at (±5.5, −1.6)
 *   pitch  → behind the quarterback's heels, ends 5 wide × 1 back of Q's end:
 *            (±10.5, −2.6)
 */

import type { Action, Assignment, OffPosId, Play, Pt } from '../../types/football'
import { crushLeftBlack, crushLeftRed, crushRightBlack, crushRightRed } from './crush'
import { gunPlay } from './gun-shared'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

/** Negate x, keep y — the left-side backfield is the right side flipped. */
const flipX = (pts: Pt[]): Pt[] => pts.map((p) => ({ x: p.x === 0 ? 0 : -p.x, y: p.y }))

// ---------------------------------------------------------------------------
// Backfield paths, RIGHT. Left is the same shape negated: Super dives from
// (−1,−4) exactly the way the wing dives from (1,−4), and the wing pitches
// from (1,−4) exactly the way Super pitches from (−1,−4).
// ---------------------------------------------------------------------------

/**
 * The dive, from the back beside the quarterback at (1,−4): across the
 * quarterback's face, into the C gap outside the playside tackle at about
 * (3.3,−0.2), then downhill.
 */
const DIVE_RIGHT: Pt[] = [
  { x: 1.6, y: -2.9 },
  { x: 2.4, y: -1.7 },
  { x: 3.3, y: -0.2 },
  { x: 3.9, y: 2.5 },
  { x: 4.4, y: 5.5 },
]

/**
 * The quarterback, from (0,−3): step playside, ride the mesh where the dive
 * crosses him (about (1.6,−2.7)), then run FLAT toward the read. Same rule as
 * the base: the arrow never turns upfield — keep or pitch lives in the read.
 */
const Q_RIGHT: Pt[] = [
  { x: 0.9, y: -2.75 },
  { x: 2.4, y: -2.4 },
  { x: 4, y: -2 },
  { x: 5.5, y: -1.6 },
]

/**
 * The pitch man, from Super's spot at (−1,−4): behind the quarterback's heels
 * and out to the 5-by-1 — five outside and one behind where the quarterback's
 * arrow ends (5.5,−1.6) → (10.5,−2.6). He never gets ahead of the ball.
 */
const PITCH_RIGHT: Pt[] = [
  { x: 0.8, y: -4.7 },
  { x: 3, y: -4.5 },
  { x: 5.5, y: -3.9 },
  { x: 8, y: -3.3 },
  { x: 10.5, y: -2.6 },
]

const DIVE_LEFT = flipX(DIVE_RIGHT)
const Q_LEFT = flipX(Q_RIGHT)
const PITCH_LEFT = flipX(PITCH_RIGHT)

const carry = (path: Pt[]): Action[] => [{ kind: 'carry', path }]
const run = (path: Pt[]): Action[] => [{ kind: 'run', path }]
const pitch = (path: Pt[]): Action[] => [{ kind: 'pitch', path }]

// ---------------------------------------------------------------------------
// Shared words.
// ---------------------------------------------------------------------------

const coachNotes = [
  'Playside back gets it - dive off the tackle\'s outside hip.',
  'Pitch man: behind the quarterback, five wide, one back.',
  'Read the second man outside the tackle. He crashes - pull it. He sits - give it.',
]

const DIVE: Assignment = {
  rule: 'Dive OUTSIDE the playside tackle.',
  detail:
    'You are a yard beside the quarterback and a yard behind him, and you get the ball. Come across his face and aim for the playside tackle\'s outside hip — the C gap — not the guard. Soft fold on the mesh, eyes on the ball: if it stays, it is yours, run downhill. If he pulls it, keep sprinting and take a tackler with you.',
}

const PITCH_MAN: Assignment = {
  rule: 'Pitch man. Behind the quarterback, then five wide and one back.',
  detail:
    'No motion — you are already in the backfield. On the snap run behind the quarterback\'s heels and out to the pitch spot: five yards outside him and one yard behind him, the whole way down the line. Never get ahead of the ball. Eyes on it, hands up and soft.',
}

const QB: Assignment = {
  rule: 'Catch it, mesh with the back beside you, read the key: dive, keep, or pitch.',
  detail:
    'Catch the snap and step playside. The dive back is coming across your face from beside you, not from behind, so put the ball in his belly early and ride him. Then run FLAT down the line — do not turn upfield until the read tells you to. Your key is one man WIDER than on Veer: the first man outside our tackle\'s block, the one who has to support the pitch. If he takes the dive: give it. If he sits: pull it and get up in the C gap. If he takes you: pitch it — your pitch man is behind you, five wide.',
}

/** Playside slot wing: the corner is the near color out there. */
const SLOT_PLAYSIDE: Assignment = {
  rule: 'Playside slot — stalk the corner.',
  detail:
    'You are the wide man on the play side now. Release straight at the corner over you, break down and stalk him: stay between him and the ball. If the pitch comes, that block is the sideline.',
}

/** Backside slot wing: the front-independent rule. */
const SLOT_BACKSIDE: Assignment = {
  rule: 'Backside slot — walked-up backer if there is one, otherwise cut off the safety.',
  detail:
    'The play is going away from you, but do not watch it. In a 4-4 the outside backer is walked up right in front of you: take him. Against a 4-3 or a 5-2 run to the safety on your side and get in his path so he cannot run the alley to the ball.',
}

const SLOT_BACKSIDE_44: Assignment = {
  rule: 'Backside — block the walked-up backer.',
  detail:
    'The outside backer is walked up right in front of you on the back side. Take him: helmet on his playside number and do not let him chase down the line.',
}

const SLOT_BACKSIDE_SAFETY: Assignment = {
  rule: 'Backside — cut off the safety on your side.',
  detail:
    'Nobody is walked up on you. Run at the safety on your side and get in his way — he is the man who runs the alley and cleans up a long run from behind.',
}

const C_CLIMB_44: Assignment = {
  rule: 'Step playside. Uncovered — climb to the playside backer.',
  detail:
    'Nobody on your nose in an even front. Under center the wing pinned the playside backer; from the gun that wing is in the backfield, so he is YOURS. Step playside and put your helmet on him — he is the man who fills on the dive. The free safety goes free; the pitch beats him.',
}

// ---------------------------------------------------------------------------
// RED GUN CRUSH RIGHT — the weak side (Y is left in Red). R, beside the
// quarterback, dives; Super is the pitch man; L is the BACKSIDE slot.
// ---------------------------------------------------------------------------

const redRightBackfield: Partial<Record<OffPosId, Action[]>> = {
  R: carry(DIVE_RIGHT),
  Q: run(Q_RIGHT),
  S: pitch(PITCH_RIGHT),
}

export const crushRightRedGun: Play = gunPlay(crushRightRed, {
  ballCarrier: 'R',
  formationTwinId: 'crush-right-black-gun',
  audibleFlipId: 'crush-left-red-gun',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Crush Right from the gun: no motion, and the back beside the quarterback — R — is the dive. He crosses the quarterback\'s face into the C gap off the right tackle, Super swings behind the quarterback as the pitch man, and L, out in the left slot, works the back side. Same read as under center: one man wider than Veer.',
  coachNotes,
  assignments: {
    R: DIVE,
    S: PITCH_MAN,
    Q: QB,
    L: SLOT_BACKSIDE,
  },
  actions: redRightBackfield,
  vs: {
    '44': {
      // The wing's pin on B-R is gone; the uncovered center climbs to him
      // instead of the free safety. L takes the backside walked-up backer the
      // base left free.
      actions: { L: block('O-L'), C: block('B-R') },
      assignments: { R: DIVE, L: SLOT_BACKSIDE_44, C: C_CLIMB_44 },
    },
    '43': {
      // The playside backer IS the read and the center already has the Mike;
      // the safety the wing hit as "near color" now goes free.
      actions: { L: block('F-L') },
      assignments: { R: DIVE, L: SLOT_BACKSIDE_SAFETY },
    },
    '52': {
      // Every playside lineman is covered in the 5-2 and the wing who pinned
      // the backer is in the backfield: B-R is left to the pursuit on purpose.
      actions: { L: block('F-L') },
      assignments: { R: DIVE, L: SLOT_BACKSIDE_SAFETY },
      ignored: ['B-R'],
    },
  },
  reviewNotes: [
    'DRAFT — Gun version of crush-right-red (the weak side). Football decisions below are ours, per Ryan\'s "draw something up" on 2026-09-21; everything on the base play\'s review list still applies.',
    'DRAFT — PLAYSIDE BACKER vs the 4-4: the wing who pinned B-R is now the dive back, so the CENTER climbs to B-R instead of the free safety (uncovered center, step playside, get vertical — the first man he meets is that backer). The lone free safety F is now unblocked; the pitch has to beat him. Alternative: keep C on F and leave B-R to the dive back\'s cut.',
    'DRAFT — PLAYSIDE BACKER vs the 4-3: no change needed — B-R is the read key and the Mike is the center\'s climb. What is lost is the wing\'s "near color" block on the safety (F-R); he goes free.',
    'DRAFT — PLAYSIDE BACKER vs the 5-2: LEFT UNBLOCKED (in `ignored`). RT has the end, RG the 3-technique, C is alone on the nose, and the wing who pinned B-R is in the backfield; nobody can reach him. Options if you want him blocked: (a) read the END (E-R) like Veer and let RT climb to B-R — undoes the base\'s one-wider read on this side; (b) "load" the pitch man onto him and make it a double option. We drew neither.',
    'DRAFT — SLOT WING (L, backside): 4-4 blocks the walked-up backer O-L, who the base left free; 4-3 and 5-2 cut off the safety on his side (F-L, drawn as $ against Red). Alternative: the backside corner, which is closer but rarely makes the tackle on a run away.',
    'DRAFT — MESH POINT is about (1.6,−2.7): the dive crosses the quarterback\'s face a yard and a half deeper than under center. The quarterback\'s flat arrow ends at (5.5,−1.6) and the pitch man ends at (10.5,−2.6), 5 by 1 off it.',
    'DRAFT — The pitch man\'s whole path is drawn as the pitch relationship (dotted) since there is no motion phase to separate from it.',
  ],
})

// ---------------------------------------------------------------------------
// RED GUN CRUSH LEFT — the tight-end side. Super dives; R, beside the
// quarterback, is the pitch man; L is the PLAYSIDE slot.
// ---------------------------------------------------------------------------

const redLeftBackfield: Partial<Record<OffPosId, Action[]>> = {
  S: carry(DIVE_LEFT),
  Q: run(Q_LEFT),
  R: pitch(PITCH_LEFT),
}

export const crushLeftRedGun: Play = gunPlay(crushLeftRed, {
  ballCarrier: 'S',
  formationTwinId: 'crush-left-black-gun',
  audibleFlipId: 'crush-right-red-gun',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Crush Left from the gun: no motion, Super is the dive and R swings behind the quarterback as the pitch man. Super crosses the quarterback\'s face into the crack between the left tackle and the tight end; L, out in the left slot, stalks the corner instead of pinning the backer. Same read as under center: one man wider than Veer.',
  coachNotes,
  assignments: {
    S: DIVE,
    R: PITCH_MAN,
    Q: QB,
    L: SLOT_PLAYSIDE,
  },
  actions: {
    ...redLeftBackfield,
    // The slot is too wide to pin the backer; he takes the corner nobody
    // blocked on this side under center. Same job on every front.
    L: block('C-L'),
  },
  vs: {
    '44': { assignments: { L: SLOT_PLAYSIDE } },
    '43': { assignments: { L: SLOT_PLAYSIDE } },
    '52': { assignments: { L: SLOT_PLAYSIDE } },
  },
  reviewNotes: [
    'DRAFT — Gun version of crush-left-red (the tight-end side, the scan\'s picture). Football decisions below are ours, per Ryan\'s "draw something up" on 2026-09-21; everything on the base play\'s review list still applies.',
    'DRAFT — PLAYSIDE BACKER: no line change on any front. 4-4: LT already climbs to B-L (the base doubled him with the wing). 4-3: B-L is the read and LT has the Mike. 5-2: Y still climbs to B-L off his outside release (the base doubled him with the wing). The wing\'s pin was the second man on that backer; he is now single-blocked everywhere.',
    'DRAFT — SLOT WING (L, playside, 8.5 wide): stalks the corner C-L on every front. Under center nobody blocked the playside corner on this side (the base flags it as the cost of the pin). From the slot he is too wide to pin a backer and the corner is his near color. Alternative vs the 5-2: the safety on his side (F-L) in the alley.',
    'DRAFT — MESH POINT is about (−1.6,−2.7); the quarterback\'s flat arrow ends at (−5.5,−1.6) and the pitch man at (−10.5,−2.6), 5 by 1 off it.',
    'DRAFT — The pitch man\'s whole path is drawn as the pitch relationship (dotted) since there is no motion phase to separate from it.',
  ],
})

// ---------------------------------------------------------------------------
// BLACK GUN CRUSH RIGHT — the tight-end side (Y is right in Black). L, beside
// the quarterback, dives; Super is the pitch man; R is the PLAYSIDE slot.
// Built from its Black base — NOT mirrored from Red Gun (Super is on the
// quarterback's left in both sets).
// ---------------------------------------------------------------------------

const blackRightBackfield: Partial<Record<OffPosId, Action[]>> = {
  L: carry(DIVE_RIGHT),
  Q: run(Q_RIGHT),
  S: pitch(PITCH_RIGHT),
}

export const crushRightBlackGun: Play = gunPlay(crushRightBlack, {
  ballCarrier: 'L',
  formationTwinId: 'crush-right-red-gun',
  audibleFlipId: 'crush-left-black-gun',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Crush Right from Black Gun: no motion, and the back beside the quarterback — L in this set — is the dive. He crosses the quarterback\'s face into the crack between the right tackle and the tight end, Super swings behind the quarterback as the pitch man, and R, out in the right slot, stalks the corner. Same read as under center: one man wider than Veer.',
  coachNotes,
  assignments: {
    L: DIVE,
    S: PITCH_MAN,
    Q: QB,
    R: SLOT_PLAYSIDE,
  },
  actions: {
    ...blackRightBackfield,
    R: block('C-R'),
  },
  vs: {
    '44': { assignments: { R: SLOT_PLAYSIDE } },
    '43': { assignments: { R: SLOT_PLAYSIDE } },
    '52': { assignments: { R: SLOT_PLAYSIDE } },
  },
  reviewNotes: [
    'DRAFT — Gun version of crush-right-black (the tight-end side). Built from the Black base with the gun backfield drawn fresh, not mirrored from Red Gun. Football decisions below are ours, per Ryan\'s "draw something up" on 2026-09-21; everything on the base play\'s review list still applies.',
    'DRAFT — PLAYSIDE BACKER: no line change on any front. 4-4: RT already climbs to B-R. 4-3: B-R is the read and RT has the Mike. 5-2: Y still climbs to B-R off his outside release. The wing\'s pin was the second man on that backer; he is now single-blocked everywhere.',
    'DRAFT — SLOT WING (R, playside, 8.5 wide): stalks the corner C-R on every front — the man nobody blocked on this side under center. Alternative vs the 5-2: the safety on his side (F-R) in the alley.',
    'DRAFT — MESH POINT is about (1.6,−2.7); the quarterback\'s flat arrow ends at (5.5,−1.6) and the pitch man at (10.5,−2.6), 5 by 1 off it.',
    'DRAFT — The pitch man\'s whole path is drawn as the pitch relationship (dotted) since there is no motion phase to separate from it.',
  ],
})

// ---------------------------------------------------------------------------
// BLACK GUN CRUSH LEFT — the weak side (X is left in Black). Super dives; L,
// beside the quarterback, is the pitch man; R is the BACKSIDE slot.
// ---------------------------------------------------------------------------

const blackLeftBackfield: Partial<Record<OffPosId, Action[]>> = {
  S: carry(DIVE_LEFT),
  Q: run(Q_LEFT),
  L: pitch(PITCH_LEFT),
}

export const crushLeftBlackGun: Play = gunPlay(crushLeftBlack, {
  ballCarrier: 'S',
  formationTwinId: 'crush-left-red-gun',
  audibleFlipId: 'crush-right-black-gun',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Crush Left from Black Gun: no motion, Super is the dive and L — beside the quarterback in this set — swings behind him as the pitch man. Super crosses the quarterback\'s face into the C gap off the left tackle, and R, out in the right slot, works the back side. Same read as under center: one man wider than Veer.',
  coachNotes,
  assignments: {
    S: DIVE,
    L: PITCH_MAN,
    Q: QB,
    R: SLOT_BACKSIDE,
  },
  actions: blackLeftBackfield,
  vs: {
    '44': {
      actions: { R: block('O-R'), C: block('B-L') },
      assignments: { L: PITCH_MAN, R: SLOT_BACKSIDE_44, C: C_CLIMB_44 },
    },
    '43': {
      actions: { R: block('F-R') },
      assignments: { L: PITCH_MAN, R: SLOT_BACKSIDE_SAFETY },
    },
    '52': {
      actions: { R: block('F-R') },
      assignments: { L: PITCH_MAN, R: SLOT_BACKSIDE_SAFETY },
      ignored: ['B-L'],
    },
  },
  reviewNotes: [
    'DRAFT — Gun version of crush-left-black (the weak side). Built from the Black base with the gun backfield drawn fresh, not mirrored from Red Gun. Football decisions below are ours, per Ryan\'s "draw something up" on 2026-09-21; everything on the base play\'s review list still applies.',
    'DRAFT — PLAYSIDE BACKER vs the 4-4: the wing who pinned B-L is now the pitch man, so the CENTER climbs to B-L instead of the free safety. F is unblocked; the pitch has to beat him. Alternative: keep C on F and leave B-L to the dive back\'s cut.',
    'DRAFT — PLAYSIDE BACKER vs the 4-3: no change needed — B-L is the read key and the Mike is the center\'s climb. The wing\'s "near color" block on the safety (F-L) is lost; he goes free.',
    'DRAFT — PLAYSIDE BACKER vs the 5-2: LEFT UNBLOCKED (in `ignored`). LT has the end, LG the 3-technique, C is alone on the nose, and the wing who pinned B-L is in the backfield. Options if you want him blocked: (a) read the END (E-L) like Veer and let LT climb to B-L — undoes the base\'s one-wider read on this side; (b) "load" the pitch man onto him and make it a double option. We drew neither.',
    'DRAFT — SLOT WING (R, backside): 4-4 blocks the walked-up backer O-R, who the base left free; 4-3 and 5-2 cut off the safety on his side (F-R, drawn as $ against Black). Alternative: the backside corner.',
    'DRAFT — MESH POINT is about (−1.6,−2.7); the quarterback\'s flat arrow ends at (−5.5,−1.6) and the pitch man at (−10.5,−2.6), 5 by 1 off it.',
    'DRAFT — The pitch man\'s whole path is drawn as the pitch relationship (dotted) since there is no motion phase to separate from it.',
  ],
})

export const crushGunPlays: Play[] = [
  crushRightRedGun,
  crushRightBlackGun,
  crushLeftRedGun,
  crushLeftBlackGun,
]
