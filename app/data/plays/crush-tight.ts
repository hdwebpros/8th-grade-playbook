/**
 * CRUSH out of TIGHT — the outside veer run out of the 2-tight-end set
 * (app/data/tight-formation.ts). Hand-authored 2026-08-15.
 *
 * WHERE THE PICTURE COMES FROM. Page 7 draws Crush out of RED going LEFT, to
 * Y and the L wing — the TE-side outside veer (app/data/plays/crush.ts,
 * `crushLeftRed`). Tight's LEFT surface is geometrically IDENTICAL to Red's:
 * Y on the line at −4.5, the L wing at (−5.7, −1), Q under center, Super 4.5
 * deep. So Crush Left out of Tight is the scan's panel, stroke for stroke —
 * the dive, the flat quarterback arrow, the wing's release-and-pin, the tight
 * end's inside climb, and all three front plans on the playside carry over
 * verbatim.
 *
 * WHAT TIGHT CHANGES — the BACKSIDE, and only the backside. Red splits X out
 * at +12, where his job is "go get the corner on your side." Tight brings him
 * home as the RIGHT tight end at +4.5, so he takes the job the Crush family
 * already gives a BACKSIDE tight end: base the end on or outside you and hold
 * him, nothing chases us from behind. That is Y's assignment on every front of
 * `crushRightRed` — this file mirrors it onto X rather than borrowing Veer's
 * Rip cutoff, because Crush has its own backside-TE picture and Crush's
 * backside linemen do not pull.
 *
 * Roles, Crush Left out of Tight:
 *   PST = LT · PSG = LG · C = C · BSG = RG · BST = RT
 *   PSW = L (playside wing) · BSW = R (backside wing — PITCH MAN)
 *   Y = PLAYSIDE tight end · X = BACKSIDE tight end
 *   S = dive back · Q = quarterback
 *
 * Direction is play identity; Indy (left) / Hoosier (right) are the line
 * audibles, wired through `audibleFlipId`. Tight is a balanced set that
 * mirrors onto itself, so — exactly like the Split Wide pairs — there is NO
 * `formationTwinId`: a 1×2 left/right pair, not a 2×2 square.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'
import { mirrorTightPlay } from '../../utils/mirror'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

// The balanced-set mirror (X↔Y entry exchange) lives in app/utils/mirror.ts —
// see `mirrorTightPlay` there for why Tight can't use plain `mirrorPlay`.

// ---------------------------------------------------------------------------
// CRUSH LEFT out of TIGHT — skill actions, identical against all three fronts.
// Super, the quarterback and the wings stand where they do in Red, so these
// are crushLeftRed's strokes; only the pitch man's first motion point moves,
// because Tight's R wing starts at +5.7 instead of Red's +4.2.
// ---------------------------------------------------------------------------

/**
 * S: the outside-veer dive. Aim OUTSIDE the playside tackle — the crack
 * between LT and Y — not at the guard. Compare Veer, where he aims at the
 * playside guard.
 */
const S_DIVE: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -0.4, y: -3.6 },
      { x: -1.2, y: -2.4 },
      { x: -2, y: -1.2 },
      { x: -3, y: 0.2 },
      { x: -3.8, y: 2.5 },
      { x: -4.3, y: 5.5 },
    ],
  },
]

/**
 * Q: open playside, ride the mesh, then run FLAT down the line to the read.
 * The page-7 panel draws this arrow dead flat, ending just outside the tight
 * end at backfield depth — it never turns upfield, because the keep only
 * happens if the read tells him to. The mesh sits at about (−2, −1.2).
 */
const Q_READ: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.9, y: -1.35 },
      { x: -2.2, y: -1.3 },
      { x: -3.6, y: -1.25 },
      { x: -5, y: -1.2 },
    ],
  },
]

/**
 * R: the pitch man. Orbit motion through the heels of Super, then flat and
 * deep, holding the varsity 5-by-1 off where the quarterback's arrow ends
 * (−5, −1.2). First point widened to (4.6, −2.7) because Tight's right wing
 * starts a yard and a half wider than Red's.
 */
const R_PITCH: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 4.6, y: -2.7 },
      { x: 2, y: -4.2 },
      { x: 0, y: -5 },
      { x: -2, y: -4.6 },
      { x: -4, y: -3.8 },
    ],
  },
  {
    kind: 'pitch',
    path: [
      { x: -6.3, y: -3.3 },
      { x: -8.3, y: -2.7 },
      { x: -10, y: -2.2 },
    ],
  },
]

/**
 * X: the BACKSIDE tight end. Crush's own backside-TE rule (crushRightRed's Y,
 * every front): base the end on or outside you and hold him. In Red this man
 * is split out and chases a corner; in Tight he is a tight end and blocks like
 * one.
 */
const X_BACKSIDE_END: Action[] = block('E-R')

/**
 * L: the wing's release. Varsity PSW rule, page 5: "1st: Tight off the Read
 * Key to Pin LB. 2nd: If missed, hit near color." Up just OUTSIDE the read
 * key, then back INSIDE onto the backer — the arrow drawn on the Crush panel.
 * The turn-in point moves with the read key, so each front gets its own path.
 */
const L_PIN_52: Action = {
  kind: 'run',
  path: [
    { x: -6.3, y: 0.2 },
    { x: -6.4, y: 2.1 },
    { x: -5.5, y: 3.3 },
  ],
}

/** 4-4: the read is the walked-up outside backer, so the wing runs wider before he pins. */
const L_PIN_44: Action = {
  kind: 'run',
  path: [
    { x: -7, y: 0.3 },
    { x: -7.5, y: 2.6 },
    { x: -6.4, y: 4 },
  ],
}

/**
 * 4-3: the playside backer IS the read key, so there is no backer left to pin
 * — the wing falls through to the second half of his rule and hits the near
 * color, the corner.
 */
const L_NEAR_COLOR_43: Action = {
  kind: 'run',
  path: [
    { x: -6.4, y: 0.4 },
    { x: -6.8, y: 2.8 },
    { x: -7.4, y: 5 },
  ],
}

/** Y: inside release, over the top of the tackle's block, then climb. */
const Y_INSIDE: Action = {
  kind: 'run',
  path: [
    { x: -3.9, y: 0.7 },
    { x: -3.2, y: 2.2 },
  ],
}

const SKILL = {
  S: S_DIVE,
  Q: Q_READ,
  R: R_PITCH,
  X: X_BACKSIDE_END,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Crush Left out of Tight — front plans
// ---------------------------------------------------------------------------

/**
 * 4-4. The end is head up on our tight end, so Y blocks him and the READ moves
 * out to the walked-up backer. The playside is the page-7 rule set unchanged;
 * on the back side X now bases the end that Red left alone, and the backside
 * tackle keeps his climb.
 */
const vs44: FrontPlan = {
  readKey: 'O-L',
  actions: {
    ...SKILL,
    Y: block('E-L'),
    L: [L_PIN_44, ...block('B-L')],
    LT: block('B-L'),
    LG: block('T-L'),
    C: block('F'),
    RG: block('T-R'),
    RT: block('B-R'),
  },
  assignments: {
    Y: {
      rule: 'Base the man on you.',
      detail:
        'The end is head up on you in a 4-4. Take him — that is what moves the read out to the backer behind him. Get your hat on his playside number and do not let him cross your face.',
    },
    L: {
      rule: 'Tight off the read — pin the backer.',
      detail:
        'Release outside and run straight past the read key (never touch him — he is the walked-up outside backer in this front), then whip back inside and pin the backer. You and the tackle are both on him: whoever gets there first takes him, the other one hits the next jersey that shows.',
    },
    LT: {
      rule: 'Uncovered — step playside, climb to the backer.',
      detail:
        'Nobody on you. Step playside off the guard\'s hip and put your hat on the backer inside. He is the man who fills on the dive.',
    },
    LG: {
      rule: 'Covered — base him.',
      detail: 'The tackle is head up on you. Take his playside number and wall him inside.',
    },
    C: {
      rule: 'Step playside. Uncovered — get vertical.',
      detail:
        'Nobody on your nose in an even front. Step playside, run vertical up the middle and take the free safety — the man nobody else has.',
    },
    RG: {
      rule: 'Covered — base him.',
      detail: 'A man is on you on the back side. Take him and never let him chase down the line.',
    },
    RT: {
      rule: 'Uncovered — step playside, climb to the backside backer.',
      detail:
        'Step playside first. The tight end outside you has the end, so nothing is in your gap — climb and cut off the backer chasing from behind.',
    },
    X: {
      rule: 'Backside — base the end on you.',
      detail:
        'You are a tight end in this set, and the play runs away from you. Take the end head up on you and stay on him until the whistle. In Red you would be split out chasing a corner; here you shut the back door.',
    },
  },
}

/**
 * 4-3. Nobody is walked up on the edge, so the outside backer at four and a
 * half is the read. On the back side the extra tight end pays off twice: X
 * bases the end, which frees RT to climb to the backer, which frees the guard
 * to base the man on his nose and the CENTER to get vertical.
 */
const vs43: FrontPlan = {
  readKey: 'B-L',
  actions: {
    ...SKILL,
    Y: block('E-L'),
    L: [L_NEAR_COLOR_43, ...block('C-L')],
    LT: block('M'),
    LG: block('T-L'),
    C: block('F-L'),
    RG: block('T-R'),
    RT: block('B-R'),
  },
  assignments: {
    Y: {
      rule: 'Base the man on you.',
      detail:
        'The end is head up on you. Block him. The read is the backer behind him — leave that man alone, he is the quarterback\'s.',
    },
    L: {
      rule: 'No backer to pin — hit the near color.',
      detail:
        'Your rule is tight off the read key and pin a backer, but in this front the backer we are reading IS that man, and the Mike is already blocked. So run past the read (never touch him) and take the near color — the corner.',
    },
    LT: {
      rule: 'Uncovered — step playside, climb to the Mike.',
      detail: 'Nobody on you. Step playside and climb straight to the Mike stacked over the ball.',
    },
    LG: {
      rule: 'Covered — base him.',
      detail: 'The tackle is on your nose. Take his playside number.',
    },
    C: {
      rule: 'Step playside. Uncovered — get vertical to the safety.',
      detail:
        'Nobody on you, and nobody needs you to block back — the backside guard has the down man and the tight end has the end. So step playside and run all the way to the deep safety on our side. That is the man who finally makes the tackle if we get a crease.',
    },
    RG: {
      rule: 'Covered — base him.',
      detail: 'The tackle is on your nose on the back side. Take him and never let him chase down the line.',
    },
    RT: {
      rule: 'Uncovered — step playside, climb to the backside backer.',
      detail: 'The tight end outside you has the end. Step playside and cut off the backer chasing us from behind.',
    },
    X: {
      rule: 'Backside — base the end on you.',
      detail:
        'The play runs away from you. Take the end on your side and hold him — nothing catches us from behind.',
    },
  },
}

/**
 * 5-2 — the arrow-for-arrow copy of the page-7 panel on the playside. The end
 * aligns OUTSIDE our tight end, so Y works inside and the end himself is the
 * read. On the back side X bases the end outside him and everything else is
 * the panel unchanged.
 */
const vs52: FrontPlan = {
  readKey: 'E-L',
  actions: {
    ...SKILL,
    Y: [Y_INSIDE, ...block('B-L')],
    L: [L_PIN_52, ...block('B-L')],
    LT: block('T-L'),
    LG: block('N'),
    C: block('N'),
    RG: block('B-R'),
    RT: block('T-R'),
  },
  assignments: {
    Y: {
      rule: 'Inside release — climb to the playside backer.',
      detail:
        'The end outside you is the read key: do not touch him. Step inside, run over the top of the tackle\'s block and put your hat on the backer. That block is what springs the keep.',
    },
    L: {
      rule: 'Tight off the read — pin the backer.',
      detail:
        'Release outside and run straight past the end we are reading — never touch him. As soon as you clear him, turn back inside and pin the playside backer. The tight end is climbing to that same man from the inside: whoever gets him, the other one takes the next jersey that shows.',
    },
    LT: {
      rule: 'Base the man on you.',
      detail:
        'Odd front: their tackle is head up on you. Step playside, get your hat across him and wall him off from the ball.',
    },
    LG: {
      rule: 'Down — take the nose with the center.',
      detail:
        'Step inside and get your shoulder on the nose\'s playside number. The center is on him too — you two are one block until the nose is moved, then whoever is free climbs.',
    },
    C: {
      rule: 'Covered — block the nose.',
      detail: 'He is head up on you. Take him, and let the guard take his playside half.',
    },
    RG: {
      rule: 'Uncovered — climb to the backside backer.',
      detail: 'Nobody on you in a 5-2. Step playside, then climb and cut off the backer chasing from behind.',
    },
    RT: {
      rule: 'Base the man on you.',
      detail: 'Their tackle is head up on you on the back side. Take him and stay on him.',
    },
    X: {
      rule: 'Backside — base the end outside you.',
      detail:
        'The end sits just outside your shoulder and the play is going the other way. Take him and hold him — he is the man with the best angle to chase us down.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table — Crush Left out of Tight.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  LT: {
    rule: 'Covered: base. Uncovered: step playside and climb.',
    detail:
      'You are the playside tackle. If a man is on you, take him — the dive is coming off your outside hip and he cannot be there. If nobody is on you, step playside and go get a linebacker.',
  },
  LG: {
    rule: 'Covered: base. Uncovered: down, then help on the nose.',
    detail:
      'Playside guard. Take the man on you. If nobody is on you, step inside and get on the nose with the center.',
  },
  C: {
    rule: 'Covered: base the nose. Uncovered: step playside and get vertical.',
    detail:
      'Playside foot first, every time. Covered means block him. Uncovered means climb straight up the middle and take the deepest man nobody else has.',
  },
  RG: {
    rule: 'Covered: base. Uncovered: climb to the backside backer.',
    detail: 'If a man is on you, take him. If not, step playside and cut off the backer who chases us from behind.',
  },
  RT: {
    rule: 'Backside — covered: base. Uncovered: climb to the backside backer.',
    detail:
      'The tight end outside you has the end on this play, so if nobody is on your nose you climb and cut off the chase. If a man is head up on you, take him and stay on him.',
  },
  Y: {
    rule: 'Block the man on you. Nobody on you — inside release and climb.',
    detail:
      'Playside tight end. If a defender is head up on you, base him and the read moves out to the next man. If he is aligned outside you, he IS the read — release inside him and climb to the backer.',
  },
  X: {
    rule: 'Backside: base the man on or outside you.',
    detail:
      'You are a tight end in this set, not a split end — you block like one. The play runs away from you: take the end on or outside you and stay on him until the whistle, because he is the man with the angle to catch us from behind. (Run Crush the other way and you have the playside tight end\'s job instead.)',
  },
  L: {
    rule: 'Tight off the read key — pin the backer. Missed him? Near color.',
    detail:
      'You are the playside wing, and this is the varsity rule word for word. Release outside and run TIGHT past the read key without touching him, then turn back inside and pin the playside linebacker. If that backer is already blocked — or he is the man we are reading — hit the near color instead: the first jersey that shows outside.',
  },
  R: {
    rule: 'Pitch man. Orbit motion through the heels of Super.',
    detail:
      'Pre-snap motion through the heels of Super, then run flat and hold five yards outside the quarterback and one yard behind him — 5 by 1, the whole way. Stay behind him: never get ahead of the ball. Eyes on it the whole way, hands up and soft.',
  },
  S: {
    rule: 'Dive OUTSIDE the playside tackle.',
    detail:
      'This is not Veer. Aim for the crack between the playside tackle and the tight end, not at the guard. Soft fold on the mesh, wave read on the ball: if it stays, it is yours — run downhill. If he pulls it, keep sprinting and take a tackler with you.',
  },
  Q: {
    rule: 'Open playside. Read the key: dive, keep, or pitch.',
    detail:
      'Step playside and pivot on your back foot. Extend the ball behind your back hip. Run FLAT down the line — the panel never turns you upfield until the read tells you to. Your key is one man WIDER than on Veer: the first man outside our tight end\'s block, the one who has to support the pitch. If he takes the dive: give it. If he sits: pull it and get up in the C gap. If he takes you: pitch it.',
  },
}

const reviewNotes = [
  "NEW PLAY (2026-08-15) — NEEDS COACH RYAN'S CHECK. Crush Left out of Tight is the page-7 panel (crushLeftRed, the TE-side outside veer) run out of the two-tight-end set. Tight's LEFT surface is identical to Red's — Y on the line at −4.5, the L wing at (−5.7, −1) — so every playside stroke, read key and rule is crushLeftRed's verbatim, INCLUDING the judgment calls already flagged on that play (the wing pinning the backer instead of arcing to the corner, the two men on the playside backer vs the 5-2, the flat quarterback arrow, the 5-by-1 pitch). Reviewing this play is really reviewing the backside.",
  "THE ONE REAL CHANGE — X is a TIGHT END here, not a split end. In Red he is detached at +12 and his job is 'go get the corner on your side.' In Tight he is on the line at +4.5, so he takes the job the Crush family already gives a backside tight end: base the end on or outside you and hold him, every front, exactly as Y does on every front of crushRightRed. NOTE this deliberately does NOT copy the Veer-out-of-Tight answer (a Rip cutoff climb): Crush's backside linemen do not pull, and crush.ts's own backside-TE picture is a base block. Confirm you want the Crush answer and not the Veer one.",
  "JUDGMENT CALL — vs the 4-3 the whole backside is REPLUMBED, and this is the part most worth your eyes. In Red-left the backside is: RT on the end, RG climbing to the backside backer, C blocking back on the down man. Here X takes the end, which frees RT — so RT climbs to the backside backer (B-R), RG bases the down man head up on him (T-R), and the CENTER, with nothing to block back on, steps playside and runs to the deep safety on our side (F-L). Every backside defender is now blocked once and the center is chasing a safety at eleven yards. If that is too far to send a center, the fallback is C on the Mike and LT on the playside safety, or simply leaving the safety alone and having C step playside and help on the nose.",
  "vs the 4-4 and the 5-2 NOTHING moved but X. In both fronts crushLeftRed already had the backside guard and tackle busy (44: RG bases T-R, RT climbs to B-R; 52: RG climbs to B-R, RT bases T-R), so X basing the end is a straight ADD — vs the 4-4 the backside end E-R was completely unblocked in Red and now he is covered. That is the clean gain of the set.",
  "WHAT IT COSTS — the backside CORNER (C-R). In Red, X's whole job was that corner; in Tight nobody touches him in any front. On an outside veer going the other way that is a cheap trade (he is the farthest defender from the ball), but it is a real change from the Red picture and it is worth saying out loud. Also still unblocked, exactly as in Red: the read key itself, and vs the 4-4 the backside walked-up backer (O-R).",
  "READ KEYS are crushLeftRed's unchanged: 4-4 → the walked-up outside backer (O-L), because the end is head up on Y and Y blocks him; 4-3 → the outside backer (B-L) at four and a half; 5-2 → the END (E-L) outside Y, the literal scan picture. Nothing about the second tight end changes who the quarterback is reading.",
  "BALANCED SET — no formationTwinId, matching the Split Wide and Veer-out-of-Tight rulings: Tight mirrors onto itself, so there is no Red/Black-style formation twin, just this left/right pair linked by audibleFlipId (Indy = left, Hoosier = right at the line, per DIRECTION_AUDIBLES in app/utils/playbook.ts).",
  "PITCH MAN GEOMETRY — Tight's R wing starts at (+5.7, −1) instead of Red's (+4.2, −1), so the first point of the orbit squiggle was widened to (4.6, −2.7) — the same one-point fix veer-left-tight made. The rest of the motion, the 5-by-1 pitch phase ending at (−10, −2.2), Super's dive and the quarterback's flat arrow are carried over from crushLeftRed unchanged.",
]

export const crushLeftTight: Play = {
  id: 'crush-left-tight',
  name: 'Crush',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Crush', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'tight',
  direction: 'left',
  ballCarrier: 'S',
  audibleFlipId: 'crush-right-tight',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Outside veer to the left out of the two-tight-end set. Same triple option as Veer, one gap wider: Super dives outside the playside tackle, Y works his man rule at the point, the L wing releases past the read to pin the backer, and the quarterback reads the man who has to support the pitch. Because Tight has a tight end on BOTH edges, X shuts the back door instead of splitting out — and the defense cannot set its front to a strength that is not there.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}

// ---------------------------------------------------------------------------
// CRUSH RIGHT out of TIGHT — generated. Tight is drawn exactly symmetric and
// all three fronts are left/right symmetric, so this is one mirrorTightPlay()
// call with no hand corrections: X becomes the playside tight end working his
// man rule at the point, Y becomes the backside tight end basing the end, R is
// the wing who pins, L motions across as the pitch man.
// ---------------------------------------------------------------------------

export const crushRightTight: Play = mirrorTightPlay(crushLeftTight, {
  id: 'crush-right-tight',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Crush', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  audibleFlipId: 'crush-left-tight',
  description:
    'Outside veer to the right out of the two-tight-end set — the same picture the other way. X is the tight end at the point of attack, the R wing releases past the read and pins the backer, Super dives off the right tackle\'s outside hip, and L motions across to be the pitch man while Y bases the backside end.',
  reviewNotes: [
    ...reviewNotes,
    'GENERATED: this play is mirrorTightPlay(crushLeftTight) — mirrorPlay (app/utils/mirror.ts) plus the X↔Y exchange this balanced set requires, because in Tight X and Y are mirror-image POSITIONS that keep their spots (Y always the left tight end, X always the right one) and so their entries must trade places when everything else flips. Without that swap the backside tight end would inherit the playside tight end\'s job on the far side of the field — the same bug Split Wide Dive Left shipped with once. Tight is drawn exactly balanced and all three fronts are left/right symmetric, so nothing needed a hand correction: review the left-handed play and you have reviewed this one.',
  ],
})

export const crushTightPlays: Play[] = [crushLeftTight, crushRightTight]
