/**
 * CRUSH — varsity page 7, top-left panel, captioned "OUTSIDE VEER".
 *
 * THE CALL MODEL (Ryan, 2026-08-14 — supersedes the 2026-08-13 note that
 * treated Indy/Hoosier as direction words in the play name):
 *   - Direction is play identity: Crush Left and Crush Right are two plays.
 *   - Formation (Red/Black) is ORTHOGONAL — each direction runs out of either.
 *   - "Indy" and "Hoosier" are AUDIBLES yelled at the line, not play names:
 *     Indy = the play now goes LEFT, Hoosier = RIGHT. Huddle: "Red, Crush
 *     Left"; QB sees the corner rolled up, yells "HOOSIER HOOSIER" → the play
 *     becomes Crush Right out of Red — same formation, flipped direction.
 *   That wiring lives on each play as `audibleFlipId` (same formation,
 *   opposite direction) and `formationTwinId` (same call, other formation),
 *   with the audible words in `DIRECTION_AUDIBLES` (app/utils/playbook.ts).
 *
 * FOUR plays, two hand-authored pictures:
 *   - crushLeftRed   — hand-authored from the page-7 panel, which draws Crush
 *     out of Red going LEFT, to Y and the L wing. Outside veer wants a tight
 *     end to block the first man and a wing to work off him, so the scan's
 *     picture is the TE-side picture.
 *   - crushRightRed  — hand-authored (2026-08-14) from the role rules: the
 *     WEAK/split-side outside veer. The scan never draws this direction, so
 *     it is our translation of playside/backside roles to the side where Y
 *     is absent — RT inherits the block Y makes on the left. Needs Ryan.
 *   - crushRightBlack = mirrorPlay(crushLeftRed) — Black puts the TE right,
 *     so right out of Black is the TE-side picture flipped.
 *   - crushLeftBlack  = mirrorPlay(crushRightRed) — the weak-side picture
 *     flipped.
 *
 * Resolving varsity's playside/backside rows to actual players, Crush Left Red:
 *   PST = LT · PSG = LG · C = C · BSG = RG · BST = RT
 *   PSW = L (playside wing) · BSW = R (backside wing — PITCH MAN)
 *   Y = playside tight end · X = backside split end
 *   S = dive back · Q = quarterback
 *
 * WHAT MAKES IT "OUTSIDE" VEER, and how it differs from Veer:
 *   - The dive aims OUTSIDE the playside tackle (the C gap) instead of at the
 *     playside guard's crack.
 *   - The read key is ONE MAN WIDER. Inside veer reads the first man on or
 *     outside the playside tackle; Crush BLOCKS that man and reads the next
 *     defender out — the one who has to support the pitch.
 *   - On the TE side, Y works INSIDE (down/climb) and the wing pins; on the
 *     weak side the tackle takes Y's man and the wing still pins.
 *
 * Arrow-by-arrow transcription of the page-7 panel (its front is the varsity
 * "50" look — E outside the tight end, T head up on the playside tackle, N on
 * the center — which is exactly our 5-2, so the left play's `vs['52']` is the
 * literal copy):
 *   L  — runs up OUTSIDE the circled E, then turns back INSIDE and caps a
 *        block bar in front of the playside backer. This is the varsity PSW
 *        rule written out on page 5: "1st: Tight off the Read Key to Pin LB.
 *        2nd: If missed, hit near color." The same shape is drawn on the
 *        Speedo panel and on both Veer panels of page 6 — the wing pins the
 *        backer, he does NOT arc to the corner.
 *   Y  — red arc up and INSIDE over the top of LT, ending in an arrowhead
 *        (a climb, not a block bar) → climbs to the playside backer.
 *   LT — short vertical stem capped on the T head up on him → base block.
 *   LG — short stem up and inside capped just outside the N → down block.
 *   C  — vertical stem capped on the N → the center and playside guard are
 *        both on the nose.
 *   RG — long curve up and playside ending in an ARROWHEAD → climb to a backer.
 *   RT — stem up and inside onto the down lineman in his inside gap.
 *   Q  — FLAT arrow to the playside ending just outside the tight end, at
 *        backfield depth. The panel never turns him upfield.
 *   S  — arrow up and playside into the line. It stops at the mesh, behind
 *        the line — it is the ride, not the whole run.
 *   R  — orbit squiggle through the heels of Super, then flat and wide away,
 *        staying at backfield depth (no upfield turn).
 *   X  — blue block marks on the corner over him.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'
import { mirrorPlay } from '../../utils/mirror'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

// ---------------------------------------------------------------------------
// CRUSH LEFT out of RED — the scan's picture: the TE-side outside veer.
// Skill actions — identical against all three fronts.
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
 * happens if the read tells him to. Keeping it flat also keeps the mesh
 * legible: Q crosses Super's path at about (−2, −1.2).
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
 * R: the pitch man. Orbit motion through the heels of Super, then run flat and
 * hold the varsity 5-by-1 relationship (page 5, BSW: "Motion through heels of
 * Super to keep 5x1 Pitch relationship with QB"). The panel draws this second
 * half flat and deep — the pitch man never crosses the line ahead of the ball,
 * he stays five outside and one behind where the quarterback ends up (−5, −1.2).
 */
const R_PITCH: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 4, y: -2.6 },
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

/** X: backside — go get the corner on your side. */
const X_CORNER: Action[] = block('C-R')

/**
 * L: the wing's release. Varsity PSW rule, page 5: "1st: Tight off the Read
 * Key to Pin LB. 2nd: If missed, hit near color." So the path runs up just
 * OUTSIDE the read key and then turns back INSIDE onto the backer — which is
 * exactly the arrow drawn on the Crush panel, on Speedo, and on both Veer
 * panels of page 6. The turn-in point moves with the read key, so each front
 * gets its own path.
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
  X: X_CORNER,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Crush Left front plans
// ---------------------------------------------------------------------------

/**
 * 4-4. The end is head up on our tight end, so Y blocks him and the READ moves
 * out to the walked-up backer.
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
      detail: 'Step playside first. Nothing in your gap, so climb and cut off the backer chasing from behind.',
    },
  },
}

/**
 * 4-3. Same idea, but nobody is walked up on the edge — the outside backer at
 * four and a half yards is the man who has to support, so he is the read.
 */
const vs43: FrontPlan = {
  readKey: 'B-L',
  actions: {
    ...SKILL,
    Y: block('E-L'),
    L: [L_NEAR_COLOR_43, ...block('C-L')],
    LT: block('M'),
    LG: block('T-L'),
    C: block('T-R'),
    RG: block('B-R'),
    RT: block('E-R'),
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
      rule: 'Step playside. Uncovered — block back.',
      detail:
        'Nobody on you. Step playside, then take the down man on the back side away from the play. If you miss him he runs the dive down from behind.',
    },
    RG: {
      rule: 'Uncovered — climb to the backside backer.',
      detail: 'The center has the man in your inside gap. Step playside and cut off the backer chasing.',
    },
    RT: {
      rule: 'Base the end on you.',
      detail: 'Backside end is outside you. Take him and hold him — nothing chases us from behind.',
    },
  },
}

/**
 * 5-2 — the arrow-for-arrow copy of the page-7 panel. The end aligns OUTSIDE
 * our tight end, so Y works inside and the end himself is the read.
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
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table — Crush Left.
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
      'Playside foot first, every time. Covered means block him. Uncovered means climb up the middle or take the down man the play is running away from.',
  },
  RG: {
    rule: 'Covered: base. Uncovered: climb to the backside backer.',
    detail: 'If a man is on you, take him. If not, step playside and cut off the backer who chases us from behind.',
  },
  RT: {
    rule: 'Backside — take the man on or outside you.',
    detail: 'Nothing catches us from behind. Get your hat on him and stay on him until the whistle.',
  },
  Y: {
    rule: 'Block the man on you. Nobody on you — inside release and climb.',
    detail:
      'Playside tight end. If a defender is head up on you, base him and the read moves out to the next man. If he is aligned outside you, he IS the read — release inside him and climb to the backer.',
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
  X: {
    rule: 'Backside: block the corner.',
    detail:
      'You are alone out there. Get to the corner\'s inside number and stay on him so nothing chases the play from the back side.',
  },
}

const coachNotes = [
  'Same as Veer, one man wider - read the second man outside the tackle.',
  'He crashes - pull it. He sits - give it.',
  'Pitch man: stay wide, stay behind the quarterback.',
]

const reviewNotes = [
  "Indy vs Hoosier: RE-RESOLVED (Ryan, 2026-08-14) — they are direction AUDIBLES yelled at the line, not play names. Indy = the play now goes LEFT, Hoosier = RIGHT. Direction is play identity (Crush Left and Crush Right are two plays), formation is orthogonal (each direction runs out of Red or Black). Wired as `audibleFlipId` on each play; the words live in DIRECTION_AUDIBLES (app/utils/playbook.ts). This supersedes the 2026-08-13 note that treated Indy/Hoosier as direction words in the call name.",
  "THE SCAN ONLY DRAWS THE TE SIDE. Page 7 draws Crush out of Red going LEFT — to Y and the L wing — the opposite way from Veer out of the same formation. That panel is THIS play. Crush Right out of Red (the weak-side picture) is our own translation of the roles and has its own review list on that play.",
  "THE READ. Crush is captioned OUTSIDE VEER, and the circled defender on page 7 is the end aligned OUTSIDE the tight end — one man wider than the circled end on the Veer page. So the rule we teach is: Crush reads the first man outside our tight end's block. Against our 5-2 that is the end (E), which is the literal scan picture. Against the 4-4 the end is head up on Y, so Y blocks him and the read becomes the walked-up outside backer (the Sam, or the Will when our strength is the other way). Against the 4-3 there is nobody walked up, so the read is the outside backer (B) at four and a half yards. Confirm the 4-4 and 4-3 keys — they are our football call, not something the scan draws.",
  "THE PLAYSIDE WING'S BLOCK — CHANGED. We used to arc him all the way to the corner. That was wrong. Page 5 writes the rule out: PSW — '1st: Tight off the Read Key to Pin LB. 2nd: If missed, hit near color.' And every drawing agrees: on the Crush panel his arrow runs up OUTSIDE the circled end, turns back INSIDE and caps a block bar in front of the playside backer — the same shape as the Speedo panel and both Veer panels on page 6. He now pins the backer vs the 5-2 and the 4-4. Vs the 4-3 the playside backer IS the read key, so he falls through to 'near color' and takes the corner.",
  "WHAT THAT COSTS. Pinning the backer means nobody blocks the playside corner or safety on the 5-2 and the 4-4 — the pitch has to beat them with speed. That is exactly what the varsity panel draws (its $ and its C are both unblocked). If you would rather the wing keep running to the corner and give up the pin, it is a one-line change per front.",
  "TWO MEN ON THE PLAYSIDE BACKER (5-2). The panel really does draw both the tight end climbing to him from the inside and the wing pinning him from the outside, the same way it draws the center and playside guard both on the nose. We coded it that way. Teach it as 'first one there takes him, the other takes the next color' — that is the second half of the wing's own rule.",
  "BACKSIDE GUARD vs the 5-2. The scan's arrow from the backside guard is a climb (arrowhead, no block bar) that ends between the two backers. We put him on the BACKSIDE backer because the tight end is already climbing to the playside one. If you want him playside instead, the tight end goes to the safety.",
  "CENTER AND PLAYSIDE GUARD vs the 5-2 are both drawn on the nose on the scan, so both are coded on the nose. Kids should be taught it as one block with two men on it — guard takes the playside half, center takes the man, and whoever comes free climbs.",
  "The page-7 front is the varsity 50 look (end outside the tight end, tackle head up on the playside tackle, nose on the center), which our 5-2 matches almost exactly — that plan is a literal transcription. The 4-4 and 4-3 plans are the same rules resolved against our own fronts and are the parts most worth your eyes.",
  "THE QUARTERBACK'S ARROW IS FLAT. The panel draws Q dead flat from the mesh to a point just outside the tight end, at backfield depth — no upfield turn at all. We used to curl him up past the wing to five yards downfield, which drew the keep as if it had already happened. He now runs flat and stops where the panel stops him; the keep and the pitch live in the assignment text (page 5's Q rule: 'If Keep: Vertical In C-Gap. Pitch: Press The Pitch').",
  "THE PITCH PHASE IS FLAT AND DEEP. Same fix for the pitch man: the panel runs him flat behind Super's heels and off the edge without ever crossing the line, and page 5 says the relationship is 5x1 with the quarterback. His path now ends at (−10, −2.2), which is five outside and one behind where the quarterback's arrow ends — the numbers finally match the words on his card.",
  "SUPER'S ARROW. The panel stops Super's arrow at the mesh, behind the line, pointed at the playside guard's outside shoulder — it is drawing the ride, not the run. We keep drawing the whole run and still aim him OUTSIDE the playside tackle, which is what makes this outside veer instead of Veer. The mesh now happens at about (−2, −1.2), where the quarterback's flat path crosses him. Confirm the aiming point: if you want Super at the guard's crack like Veer, that is a data change, not a drawing change.",
  "Page 7 also carries DIVE ('automatic give') and SPEEDO ('keep or pitch') off the same look — audibled the same way, Indy left / Hoosier right. Separate calls, NOT in this slice. Flagging them so they don't get lost.",
]

export const crushLeftRed: Play = {
  id: 'crush-left-red',
  name: 'Crush',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Crush', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'left',
  ballCarrier: 'S',
  formationTwinId: 'crush-left-black',
  audibleFlipId: 'crush-right-red',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Outside veer at the tight end side — the scan\'s picture. Same triple option as Veer, one gap wider: Super dives outside the playside tackle, the tight end works his man rule at the point, the wing releases past the read to pin the backer, and the quarterback reads the man who has to support the pitch. Give, keep, or pitch — the defense picks.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes,
}

// ---------------------------------------------------------------------------
// CRUSH RIGHT out of RED — the weak-side outside veer, hand-authored
// 2026-08-14.
//
// The page-7 panel only draws Crush toward the tight end, so this direction is
// NOT in the scans — mirroring the left play yields Black-Right, not this. In
// Red the tight end Y stays LEFT, so running Crush right puts the split end X
// and the R wing on the playside and nobody at Y's spot. The structural
// consequence: the block Y makes on the left (base the man over him / release
// inside) has no tight end to make it, so it falls to the playside TACKLE —
// RT blocks the first down man on or outside him (Veer's read man), and the
// read stays one wider, exactly the outside-veer idea. Built best-effort from
// the role rules; NEEDS Ryan's check. Judgment calls are in reviewNotesRight.
//
// Roles, Red right:
//   PST = RT · PSG = RG · C = C · BSG = LG · BST = LT
//   PSW = R (playside wing) · BSW = L (backside wing — PITCH MAN)
//   Y = BACKSIDE tight end · X = PLAYSIDE split end
//   S = dive back · Q = quarterback
// ---------------------------------------------------------------------------

/** S: the outside-veer dive, weak side — aim outside RT, the C gap. */
const S_DIVE_RIGHT: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: 0.4, y: -3.6 },
      { x: 1.2, y: -2.4 },
      { x: 2, y: -1.2 },
      { x: 3, y: 0.2 },
      { x: 3.8, y: 2.5 },
      { x: 4.3, y: 5.5 },
    ],
  },
]

/** Q: open right, ride the mesh, run FLAT down the line to the read. */
const Q_READ_RIGHT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.9, y: -1.35 },
      { x: 2.2, y: -1.3 },
      { x: 3.6, y: -1.25 },
      { x: 5, y: -1.2 },
    ],
  },
]

/**
 * L is the pitch man now: orbit motion left-to-right through the heels of
 * Super, then flat and deep, holding the 5-by-1 off where the quarterback's
 * flat arrow ends (5, −1.2) — the exact mirror of R's job on the left play.
 */
const L_PITCH_RIGHT: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: -4, y: -2.6 },
      { x: -2, y: -4.2 },
      { x: 0, y: -5 },
      { x: 2, y: -4.6 },
      { x: 4, y: -3.8 },
    ],
  },
  {
    kind: 'pitch',
    path: [
      { x: 6.3, y: -3.3 },
      { x: 8.3, y: -2.7 },
      { x: 10, y: -2.2 },
    ],
  },
]

/** X: PLAYSIDE now — block the corner over him. */
const X_CORNER_RIGHT: Action[] = block('C-R')

/**
 * R wing releases: up just OUTSIDE the read key, then back inside to pin —
 * the same page-5 rule as the left play, drawn fresh because R starts a yard
 * and a half tighter than L does and the read keys sit at different widths.
 */
const R_PIN_44: Action = {
  kind: 'run',
  path: [
    { x: 5, y: 0.3 },
    { x: 7.2, y: 2.6 },
    { x: 6.2, y: 4 },
  ],
}

const R_PIN_52: Action = {
  kind: 'run',
  path: [
    { x: 5.7, y: 0.2 },
    { x: 6, y: 1.8 },
    { x: 5, y: 3.2 },
  ],
}

/**
 * 4-3: the playside backer IS the read key and the corner is X's man on this
 * side, so "near color" falls through to the strong safety filling the alley.
 */
const R_NEAR_COLOR_43: Action = {
  kind: 'run',
  path: [
    { x: 4.9, y: 0.4 },
    { x: 5.5, y: 2.6 },
    { x: 5.9, y: 4.6 },
  ],
}

const SKILL_RIGHT = {
  S: S_DIVE_RIGHT,
  Q: Q_READ_RIGHT,
  L: L_PITCH_RIGHT,
  X: X_CORNER_RIGHT,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Crush Right front plans
// ---------------------------------------------------------------------------

/**
 * 4-4. The end sits outside RT where Y would be — with no tight end there, RT
 * bases him (Veer's read man is OUR man on Crush) and the read moves out to
 * the walked-up backer, same as the TE side.
 */
const vs44Right: FrontPlan = {
  readKey: 'O-R',
  actions: {
    ...SKILL_RIGHT,
    RT: block('E-R'),
    R: [R_PIN_44, ...block('B-R')],
    RG: block('T-R'),
    C: block('F'),
    LG: block('T-L'),
    LT: block('B-L'),
    Y: block('E-L'),
  },
  assignments: {
    RT: {
      rule: 'Base the end on or outside you.',
      detail:
        'No tight end on this side, so the end is YOUR man — on Veer you would leave him for the read, on Crush you block him and the read moves one wider. Get your hat on his playside number; the dive is coming off your outside hip and he cannot be in it.',
    },
    R: {
      rule: 'Tight off the read — pin the backer.',
      detail:
        'Release outside and run straight past the read key (never touch him — he is the walked-up outside backer in this front), then whip back inside and pin the playside backer. You are the only man on him on this side — do not miss.',
    },
    RG: {
      rule: 'Covered — base him.',
      detail: 'The tackle is head up on you. Take his playside number and wall him inside.',
    },
    C: {
      rule: 'Step playside. Uncovered — get vertical.',
      detail:
        'Nobody on your nose in an even front. Step playside, run vertical up the middle and take the free safety — the man nobody else has.',
    },
    LG: {
      rule: 'Covered — base him.',
      detail: 'A man is on you on the back side. Take him and never let him chase down the line.',
    },
    LT: {
      rule: 'Uncovered — step playside, climb to the backside backer.',
      detail: 'The tight end has the end outside you. Step playside, climb, and cut off the backer chasing from behind.',
    },
    Y: {
      rule: 'Backside — base the end on you.',
      detail: 'You are away from the play. Take the end head up on you and stay on him — nothing chases us from behind.',
    },
  },
}

/**
 * 4-3. RT bases the end, the outside backer is the read, and with X already on
 * the corner the wing's "near color" is the strong safety coming down.
 */
const vs43Right: FrontPlan = {
  readKey: 'B-R',
  actions: {
    ...SKILL_RIGHT,
    RT: block('E-R'),
    R: [R_NEAR_COLOR_43, ...block('F-R')],
    RG: block('T-R'),
    C: block('M'),
    LG: block('T-L'),
    LT: block('B-L'),
    Y: block('E-L'),
  },
  assignments: {
    RT: {
      rule: 'Base the end on or outside you.',
      detail:
        'Block the end — the read is the backer behind him, and that man is the quarterback\'s. Do not let the end squeeze the dive.',
    },
    R: {
      rule: 'No backer to pin — hit the near color.',
      detail:
        'Your rule is tight off the read key and pin a backer, but in this front the backer we are reading IS that man, the Mike is already blocked, and the split end has the corner on this side. So run past the read (never touch him) and take the near color — the strong safety filling the alley.',
    },
    RG: {
      rule: 'Covered — base him.',
      detail: 'The tackle is on your nose. Take his playside number.',
    },
    C: {
      rule: 'Step playside. Uncovered — get vertical to the Mike.',
      detail:
        'Nobody on you, and the tackles are both based by the guards. Step playside and climb straight to the Mike stacked over the ball — he is the man who fills on the dive.',
    },
    LG: {
      rule: 'Covered — base him.',
      detail: 'The tackle is on your nose on the back side. Take him and never let him chase down the line.',
    },
    LT: {
      rule: 'Uncovered — step playside, climb to the backside backer.',
      detail: 'The tight end has the end outside you. Step playside and cut off the Will chasing from behind.',
    },
    Y: {
      rule: 'Backside — base the end on you.',
      detail: 'You are away from the play. Take the end head up on you and hold him — nothing chases us from behind.',
    },
  },
}

/**
 * 5-2. The tackle is head up on RT — Veer's read man — so RT bases him and the
 * read moves out to the end. The guard and center double the nose, the same
 * two-man block the scan draws on the TE side.
 */
const vs52Right: FrontPlan = {
  readKey: 'E-R',
  actions: {
    ...SKILL_RIGHT,
    RT: block('T-R'),
    R: [R_PIN_52, ...block('B-R')],
    RG: block('N'),
    C: block('N'),
    LG: block('B-L'),
    LT: block('T-L'),
    Y: block('E-L'),
  },
  assignments: {
    RT: {
      rule: 'Base the man on you.',
      detail:
        'Odd front: their tackle is head up on you — on Veer he is the read, on Crush he is YOUR man. Step playside, get your hat across him and wall him off from the ball. The end outside you is the read: never touch him.',
    },
    R: {
      rule: 'Tight off the read — pin the backer.',
      detail:
        'Release outside and run straight past the end we are reading — never touch him. As soon as you clear him, turn back inside and pin the playside backer. No tight end climbing to help you on this side: he is yours alone.',
    },
    RG: {
      rule: 'Down — take the nose with the center.',
      detail:
        'Step inside and get your shoulder on the nose\'s playside number. The center is on him too — you two are one block until the nose is moved, then whoever is free climbs.',
    },
    C: {
      rule: 'Covered — block the nose.',
      detail: 'He is head up on you. Take him, and let the guard take his playside half.',
    },
    LG: {
      rule: 'Uncovered — climb to the backside backer.',
      detail: 'Nobody on you in a 5-2. Step playside, then climb and cut off the backer chasing from behind.',
    },
    LT: {
      rule: 'Base the man on you.',
      detail: 'Their tackle is head up on you on the back side. Take him and stay on him.',
    },
    Y: {
      rule: 'Backside — base the end outside you.',
      detail: 'You are away from the play. Take the end just outside you and hold him — nothing chases us from behind.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for CRUSH RIGHT.
// ---------------------------------------------------------------------------

const assignmentsRight: Record<OffPosId, Assignment> = {
  RT: {
    rule: 'Block the first down man on or outside you.',
    detail:
      'You are the playside tackle with no tight end next to you. The man Veer would read is YOUR man on Crush — the end outside you in an even front, the tackle head up on you in an odd one. Block him; the read moves one wider. The dive is coming off your outside hip and your man cannot be in it.',
  },
  RG: {
    rule: 'Covered: base. Uncovered: down, then help on the nose.',
    detail:
      'Playside guard. Take the man on you. If nobody is on you, step inside and get on the nose with the center.',
  },
  C: {
    rule: 'Covered: base the nose. Uncovered: step playside and get vertical.',
    detail:
      'Playside foot first, every time. Covered means block him. Uncovered means climb up the middle to the safety or the backer stacked over the ball.',
  },
  LG: {
    rule: 'Covered: base. Uncovered: climb to the backside backer.',
    detail: 'If a man is on you, take him. If not, step playside and cut off the backer who chases us from behind.',
  },
  LT: {
    rule: 'Backside — covered: base. Uncovered: climb to the backside backer.',
    detail:
      'The tight end outside you has the end on this play, so if nobody is on your nose you climb and cut off the chase. If a man is head up on you, take him.',
  },
  Y: {
    rule: 'Backside: base the man on or outside you.',
    detail:
      'The play runs away from you on this one. Take the end on or outside you and stay on him until the whistle — nothing catches us from behind. (Playside you work your man rule at the point.)',
  },
  R: {
    rule: 'Tight off the read key — pin the backer. Missed him? Near color.',
    detail:
      'You are the playside wing, and this is the varsity rule word for word. Release outside and run TIGHT past the read key without touching him, then turn back inside and pin the playside linebacker. If that backer is already blocked — or he is the man we are reading — hit the near color instead: the first jersey that shows outside. The split end has the corner on this side.',
  },
  L: {
    rule: 'Pitch man. Orbit motion through the heels of Super.',
    detail:
      'Pre-snap motion through the heels of Super, then run flat and hold five yards outside the quarterback and one yard behind him — 5 by 1, the whole way. Stay behind him: never get ahead of the ball. Eyes on it the whole way, hands up and soft.',
  },
  S: {
    rule: 'Dive OUTSIDE the playside tackle.',
    detail:
      'This is not Veer. Aim for the playside tackle\'s outside hip — the C gap — not at the guard. Soft fold on the mesh, wave read on the ball: if it stays, it is yours — run downhill. If he pulls it, keep sprinting and take a tackler with you.',
  },
  Q: {
    rule: 'Open playside. Read the key: dive, keep, or pitch.',
    detail:
      'Step playside and pivot on your back foot. Extend the ball behind your back hip. Run FLAT down the line — never turn upfield until the read tells you to. Your key is one man WIDER than on Veer: the first man outside our tackle\'s block, the one who has to support the pitch. If he takes the dive: give it. If he sits: pull it and get up in the C gap. If he takes you: pitch it.',
  },
  X: {
    rule: 'Playside: block the corner.',
    detail:
      'The play comes your way. Get to the corner\'s inside number and stay on him — that block is the difference between the pitch dying on the sideline and going the distance.',
  },
}

const reviewNotesRight = [
  "NEW PICTURE (2026-08-14) — NEEDS COACH RYAN'S CHECK. Page 7 only draws Crush toward the tight end; this is Crush Right out of RED, the weak/split-side outside veer, which no scan draws (mirroring the left play yields Black-Right, not this). It was authored from the role rules — every football decision below is our call, not varsity's, and needs your eyes front by front.",
  "Indy/Hoosier are direction AUDIBLES (Ryan, 2026-08-14): Indy = left, Hoosier = right, yelled at the line. 'Red, Crush Left' + 'HOOSIER HOOSIER' becomes THIS play. Wired via audibleFlipId; the words live in DIRECTION_AUDIBLES (app/utils/playbook.ts).",
  "JUDGMENT CALL — WHO TAKES Y'S BLOCK: with no tight end playside, the block Y makes on the left (base the man over him) falls to RT. So RT blocks the first down man on or outside him — the end vs both even fronts, the tackle head up on him vs the 5-2 — which is exactly the man Veer would read. That keeps the outside-veer identity (block Veer's read, read one wider) but it means RT never climbs to a backer on this side. Confirm.",
  "JUDGMENT CALL — THE READ per front, applying 'first man outside our tackle's block': 4-4 → the walked-up outside backer (O-R); 4-3 → the outside backer (B-R) at four and a half; 5-2 → the END (E-R), because the read man head up on RT is now blocked. Same one-wider ladder as the TE side, one rung down because there is no Y.",
  "JUDGMENT CALL — ONE MAN ON THE PLAYSIDE BACKER. On the TE side vs the 5-2 the scan doubles the playside backer (Y climbing inside, wing pinning outside). With no Y here the wing's pin is the ONLY block on that backer, vs the 5-2 and the 4-4 both. The alternative vs the 5-2 is RG climbing to him and the center taking the nose alone — we kept the guard-center double on the nose instead because that is the two-man block the scan teaches. Confirm which you want.",
  "JUDGMENT CALL — vs the 4-3 the wing's near color is the STRONG SAFETY, not the corner: the backer he would pin is the read, the Mike is blocked by the center, and unlike the TE side the corner here is already X's man (X is playside). So R releases past the read and takes the $ filling the alley. Alternative: send him to double the corner with X and let the $ run free.",
  "JUDGMENT CALL — vs the 4-3 the MIKE is the CENTER's climb (uncovered, step playside, get vertical), where on the TE side he was LT's. Both guards are covered by the 4-3's tackles here, so the center is the only free climber; LT climbs to the backside backer (Will) instead of blocking back. Nobody blocks back on the backside down man — the guards base them. Confirm.",
  "JUDGMENT CALL — BACKSIDE: Y bases the backside end (E-L) in every front — his 'nothing chases us' job, same as RT's on the left play — and LT, freed by that, climbs to the backside backer vs both even fronts (vs the 5-2 LT is covered and bases). The 4-4's backside walked-up backer (O-L on the Will side) is UNBLOCKED, exactly as the Sam is unblocked on the left play's backside.",
  "UNBLOCKED MEN, the cost sheet: 4-4 — the read (O-R), the backside walked-up backer (O-L), and the backside corner; the free safety is the center's man. 4-3 — the read (B-R), the backside corner, and the free safety. 5-2 — the read (E-R), the backside corner, and BOTH safeties: with X on the corner and the wing on the backer, nobody touches the $ on this side. The pitch has to beat the safeties with speed, same trade the varsity panel draws on the TE side. Flag if you want the wing on the $ and the backer left to the pursuit.",
  "BALL CARRIER stays S, aiming OUTSIDE RT (the C gap off the tackle's outside hip); with no tight end the crack is between RT and the wing's release. Q's flat arrow, the mesh point (about +2, −1.2), and the pitch man's 5-by-1 (ending at +10, −2.2 off Q's +5, −1.2) are exact negations of the left play's geometry. The wing's three release paths are newly drawn — R aligns a yard and a half tighter than L does (+4.2 vs −5.7), so his stems start tighter.",
]

export const crushRightRed: Play = {
  id: 'crush-right-red',
  name: 'Crush',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Crush', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'S',
  formationTwinId: 'crush-right-black',
  audibleFlipId: 'crush-left-red',
  summary: 'Triple option that follows the tackle. Second man outside the tackle is key.',
  description:
    'Outside veer away from the tight end — the weak-side picture. Same triple option, one gap wider than Veer: Super dives off the playside tackle\'s outside hip, the tackle blocks the man Veer would read, the wing releases past the new read to pin the backer, and X — playside on this one — takes the corner. Give, keep, or pitch.',
  assignments: assignmentsRight,
  vs: { '44': vs44Right, '43': vs43Right, '52': vs52Right } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes: reviewNotesRight,
}

/**
 * Crush Right out of BLACK — the mirror of Crush Left out of Red. Black puts
 * the tight end and the wing to the RIGHT, so running right out of Black is
 * the scan's TE-side picture flipped: mirrorPlay negates every stroke, swaps
 * LT↔RT/LG↔RG/L↔R and the -L/-R defender ids, and re-keys the assignments
 * onto the mirrored players. Everything on crushLeftRed's review list applies
 * here mirrored.
 */
export const crushRightBlack: Play = mirrorPlay(crushLeftRed, {
  id: 'crush-right-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Crush', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  formationTwinId: 'crush-right-red',
  audibleFlipId: 'crush-left-black',
  description:
    'Crush right out of Black — the tight end side, because Black flips Y to the right. Same outside-veer read, same pin, other side of the ball: L is the pitch man now and R is the wing who releases past the read.',
  reviewNotes: [
    ...reviewNotes,
    'Crush Right out of Black is generated by mirroring Crush Left out of Red (app/utils/mirror.ts) with no hand corrections — all three fronts are left/right symmetric and Black is drawn on page 1 as Red\'s exact mirror. If any answer above changes, this play changes with it automatically.',
  ],
})

/**
 * Crush Left out of BLACK — the mirror of Crush Right out of Red: Black flips
 * the tight end away to the right, so left out of Black is the weak-side
 * picture. Everything on crushRightRed's review list applies here mirrored.
 */
export const crushLeftBlack: Play = mirrorPlay(crushRightRed, {
  id: 'crush-left-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Crush', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  formationTwinId: 'crush-left-red',
  audibleFlipId: 'crush-right-black',
  description:
    'Crush to the left out of Black — the weak side, since Black flips the tight end to the right. LT blocks the man Veer would read, the L wing pins, X — split left in Black — takes the corner, and R motions across as the pitch man.',
  reviewNotes: [
    ...reviewNotesRight,
    'Crush Left out of Black is generated by mirroring Crush Right out of Red (app/utils/mirror.ts) with no hand corrections. If any of the Red-right answers above change, this play changes with it automatically.',
  ],
})

export const crushPlays: Play[] = [crushRightRed, crushRightBlack, crushLeftRed, crushLeftBlack]
