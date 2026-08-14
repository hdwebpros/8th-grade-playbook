/**
 * BUCK SWEEP — varsity page 8 (main diagram + the full assignment table) and
 * page 9 (Buck Left vs Odd / vs Even, Buck Right vs Odd / vs Even).
 *
 * THE CALL MODEL (Ryan, 2026-08-14 — supersedes the 2026-08-13 note):
 *   - Direction is play identity: Buck Sweep Left and Buck Sweep Right are two
 *     plays.
 *   - Formation (Red/Black) is ORTHOGONAL — each direction runs out of either.
 *   - "Indy" and "Hoosier" are AUDIBLES yelled at the line, not play names:
 *     Indy = the play now goes LEFT, Hoosier = RIGHT. Huddle: "Red, Buck
 *     Left"; QB sees the edge stacked, yells "HOOSIER HOOSIER" → the play
 *     becomes Buck Right out of Red — same formation, flipped direction.
 *   That wiring lives on each play as `audibleFlipId` (same formation,
 *   opposite direction) and `formationTwinId` (same direction, other
 *   formation), with the audible words in `DIRECTION_AUDIBLES`
 *   (app/utils/playbook.ts).
 *
 * FOUR plays, two hand-authored pictures:
 *   - buckSweepLeftRed  — hand-authored from page 8's main diagram (the sweep
 *     run AT the tight end). Roles: PST=LT · PSG=LG (kick) · BSG=RG (wrap) ·
 *     BST=RT · PSW=L · BSW=R (orbit — the BALL CARRIER) · Y=playside TE ·
 *     X=backside split end.
 *   - buckSweepRightRed — hand-authored (2026-08-14) from page 9's Buck Right
 *     panels: the sweep AWAY from the tight end, to the split-end side. Roles:
 *     PST=RT · PSG=RG (kick) · BSG=LG (wrap) · BST=LT · PSW=R · BSW=L (orbit —
 *     the BALL CARRIER) · Y=BACKSIDE TE · X=PLAYSIDE split end (MDM).
 *   - buckSweepRightBlack = mirrorPlay(buckSweepLeftRed) — Black puts the TE
 *     right, so right out of Black is the TE-side picture flipped.
 *   - buckSweepLeftBlack  = mirrorPlay(buckSweepRightRed) — the split-end-side
 *     picture flipped.
 *
 * The page-8 table, verbatim, is the spine of this file:
 *   PST  Gap - Down - Climb
 *   PSG  Pull - Kick 1st Color Outside Down. Aim: your outside shoulder/head
 *        to his inside hip
 *   C    Gap - Down - Climb
 *   BSG  Pull - Wrap for 1st Color in the Alley. Aim: butt of the kick puller
 *   BST  Rip - Climb
 *   Y    Playside: Gap - Down - Climb   Backside: Rip - Climb
 *   PSW  Gap - Down - Climb
 *   BSW  Orbit Motion through the heels of the Super. Mesh: Give (chest square
 *        to sideline). Ball read: wrapping guard
 *   S    Run the Midline. Sell mesh with hands. Cut off any free defenders.
 *   Q    Open up away from call working to mesh at 5 yards behind you. Carry
 *        out boot away from call.
 *   WR   Playside: MDM   Backside: Free route
 *
 * Arrow-by-arrow from page 9 (Buck Left vs Odd is the cleanest panel):
 *   L  — line up and INSIDE, capped with a block bar on the edge defender
 *        aligned between him and the tight end → he blocks DOWN, he does not
 *        block out. The kick-out belongs to the pulling guard.
 *   Y  — short line up and inside, capped on the down lineman in his inside
 *        gap → down block.
 *   LT — line up and away from the ball ending on a backer → he is uncovered
 *        in the odd panel, so he climbs.
 *   C  — short hook capped on the nose.
 *   LG — flat path behind the line at about a yard of depth, stopping just
 *        outside the tight end (x ≈ −5) and capped there with a block bar
 *        drawn PERPENDICULAR to the flat path → the kick. He never turns up:
 *        the kick happens behind the line of scrimmage.
 *   RG — flat path behind the line (it runs right through the quarterback's
 *        heels), staying flat to about x ≈ −2.5, then a diagonal turn UP into
 *        the alley, capped around x ≈ −4 two to three yards downfield → the
 *        wrap. He turns up INSIDE the kick puller.
 *   RT — line ripping playside and climbing.
 *   S  — one long straight line from his alignment through the center to about
 *        three yards past the line of scrimmage → the midline.
 *   R  — orbit squiggle right-to-left underneath Super, flat at five yards to
 *        about x ≈ −2.5, then a hard turn up with an arrowhead → he has the
 *        ball. Measured off the scan he turns up INSIDE the tight end, tight
 *        behind the wrapping guard — not around the kick block.
 *
 * And from page 9's Buck RIGHT panels (the split-end-side sweep):
 *   L  — the orbit squiggle now starts at the LEFT wing, runs left-to-right
 *        under Super, and the dotted turn-up arrow rises just INSIDE the right
 *        wing's block, tight behind the wrap — same relationship, other side.
 *   R  — a short stroke capped on the end at his shoulder → the playside wing
 *        still never blocks out; the edge man beyond him belongs to the kick.
 *   Y  — a curving rip stroke up and playside → backside Rip - Climb.
 *   X  — a long arc upfield capped with a bar → PLAYSIDE now: MDM, the stalk
 *        on the corner.
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
// BUCK SWEEP LEFT out of RED — the tight-end-side sweep, hand-authored from
// page 8. Backfield identical against all three fronts.
// ---------------------------------------------------------------------------

/**
 * R: orbit motion through the heels of Super, take the give, and read the
 * WRAPPING guard — turn up inside the kick-out, not around it.
 */
const R_SWEEP: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 4, y: -2.7 },
      { x: 2.4, y: -4.5 },
      { x: 0.4, y: -5.3 },
    ],
  },
  {
    kind: 'carry',
    path: [
      { x: -1.8, y: -5.1 },
      { x: -3.2, y: -4.9 },
      { x: -4.1, y: -3.8 },
      { x: -4.5, y: -2 },
      { x: -4.4, y: 1 },
      { x: -4.2, y: 4.8 },
    ],
  },
]

/** S: run the midline. Straight up the middle, selling the mesh with his hands. */
const S_MIDLINE: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 0, y: -3.2 },
      { x: 0, y: -1.6 },
      { x: 0, y: 0.4 },
      { x: 0, y: 3.4 },
    ],
  },
]

/** Q: open AWAY from the call, mesh five yards deep, then boot away. */
const Q_MESH: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.9, y: -2.3 },
      { x: 0.7, y: -3.7 },
      { x: -0.5, y: -4.8 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: 1.6, y: -4.4 },
      { x: 3.6, y: -3.8 },
      { x: 5.6, y: -2.8 },
      { x: 7.2, y: -1.4 },
    ],
  },
]

/** X: backside — free route. Run the corner off and take him with you. */
const X_FREE: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 12, y: 3 },
      { x: 11.2, y: 7 },
      { x: 9.6, y: 11 },
    ],
  },
]

/** LG: pull flat, get outside the tight end, kick the first color out. */
const LG_KICK: Action = {
  kind: 'run',
  path: [
    { x: -2.2, y: -1.1 },
    { x: -3.6, y: -1.3 },
    { x: -4.6, y: -1.2 },
    { x: -5.4, y: -0.9 },
  ],
}

/** RG: pull flat, aim at the kick puller's butt, turn up in the alley. */
const RG_WRAP: Action = {
  kind: 'run',
  path: [
    { x: 1, y: -1.3 },
    { x: -0.6, y: -1.8 },
    { x: -2.4, y: -1.7 },
    { x: -3.6, y: -0.5 },
    { x: -4.1, y: 1.6 },
  ],
}

const BACKFIELD = {
  R: R_SWEEP,
  S: S_MIDLINE,
  Q: Q_MESH,
  X: X_FREE,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Buck Sweep Left front plans
// ---------------------------------------------------------------------------

/**
 * 4-4. The walked-up backer on the edge is the kick-out. Everybody inside him
 * blocks down; the wrap puller takes the safety filling the alley.
 */
const vs44: FrontPlan = {
  actions: {
    ...BACKFIELD,
    L: block('E-L'),
    Y: block('B-L'),
    LT: block('T-L'),
    C: block('T-R'),
    LG: [LG_KICK, ...block('O-L')],
    RG: [RG_WRAP, ...block('F')],
    RT: block('B-R'),
  },
  assignments: {
    L: {
      rule: 'Down — take the end inside you.',
      detail:
        'Do not block out. Step down inside and put your hat on the end. The guard is coming around you to kick the man outside — if you block out, you block him into the guard and the play dies.',
    },
    Y: {
      rule: 'Down first — nobody there, climb to the backer.',
      detail:
        'The tackle already has the down man inside you, so get off the ball and climb to the backer. He is the one who runs this play down if you miss him.',
    },
    LT: {
      rule: 'Down — take the tackle over the guard.',
      detail:
        'Our guard is pulling, so the man over him is yours. Step down inside, get your hat across his playside number and pin him. This is the most important down block on the play.',
    },
    C: {
      rule: 'Uncovered playside — block back.',
      detail:
        'Nobody in your playside gap, and the backside guard has pulled. Step playside, then take the down man on the back side. If you miss him he runs the sweep down from behind.',
    },
    LG: {
      rule: 'Pull — kick the walked-up backer.',
      detail:
        'Pull flat, get outside the tight end and kick the first color outside our down blocks — the backer on the edge. Outside shoulder and head to his inside hip, and drive him toward the sideline.',
    },
    RG: {
      rule: 'Pull — wrap for the safety in the alley.',
      detail:
        'Aim at the butt of the kick puller, turn up inside him and block the first color in the alley. In a 4-4 that is the free safety coming downhill.',
    },
    RT: {
      rule: 'Rip — climb to the backside backer.',
      detail: 'Step playside, rip through and cut off the backer chasing from behind.',
    },
  },
}

/**
 * 4-3. Nothing is walked up on the edge, so the kick puller turns straight up
 * and takes the first color in the alley — the playside safety — and the wrap
 * puller gets the Mike.
 */
const vs43: FrontPlan = {
  actions: {
    ...BACKFIELD,
    L: block('E-L'),
    Y: block('B-L'),
    LT: block('T-L'),
    C: block('T-R'),
    LG: [LG_KICK, ...block('F-L')],
    RG: [RG_WRAP, ...block('M')],
    RT: block('B-R'),
  },
  assignments: {
    L: {
      rule: 'Down — take the end inside you.',
      detail: 'Step down inside and pin the end. Never block out — the guard is kicking around you.',
    },
    Y: {
      rule: 'Down first — nobody there, climb to the outside backer.',
      detail:
        'The outside backer is sitting head up on you at four and a half yards. Get off the ball clean and go get him.',
    },
    LT: {
      rule: 'Down — take the tackle over the guard.',
      detail: 'Our guard pulled. Step down inside, get your hat across the tackle and pin him.',
    },
    C: {
      rule: 'Uncovered playside — block back.',
      detail: 'Step playside, then take the down man on the back side that the pulling guard left behind.',
    },
    LG: {
      rule: 'Pull — nobody to kick, turn up on the first color.',
      detail:
        'Pull flat and get outside the tight end. In a 4-3 nobody is standing on that edge, so turn up and block the first color in the alley — the safety on your side. Do not drift; get north as soon as you clear the tight end.',
    },
    RG: {
      rule: 'Pull — wrap for the Mike.',
      detail: 'Aim at the butt of the kick puller, turn up inside him and take the Mike coming over the top.',
    },
    RT: {
      rule: 'Rip — climb to the backside backer.',
      detail: 'Step playside, rip through and cut off the chase.',
    },
  },
}

/**
 * 5-2 (odd) — closest to the page-9 "vs Odd" panel. The nose is on the center,
 * their tackle is head up on our tackle, and there is nothing on the edge, so
 * the kick puller turns up on the corner.
 */
const vs52: FrontPlan = {
  actions: {
    ...BACKFIELD,
    L: block('E-L'),
    Y: block('B-L'),
    LT: block('T-L'),
    C: block('N'),
    LG: [LG_KICK, ...block('C-L')],
    RG: [RG_WRAP, ...block('F-L')],
    RT: block('T-R'),
  },
  assignments: {
    L: {
      rule: 'Down — take the end inside you.',
      detail:
        'The end lines up between you and the tight end. He is yours. Step down inside, hat across his playside number, and pin him in.',
    },
    Y: {
      rule: 'Down first — nobody there, climb to the backer.',
      detail:
        'Their tackle is head up on our tackle, so he is not yours. Get off the ball and climb to the backer inside.',
    },
    LT: {
      rule: 'Base the man on you.',
      detail:
        'Odd front: their tackle is head up on you. Step playside, get your hat across him and wall him off. Nothing crosses your face.',
    },
    C: {
      rule: 'Covered — block the nose.',
      detail:
        'The nose is head up on you and both guards are pulling. You are alone on him — playside foot first, hat on his playside number, and do not lose him.',
    },
    LG: {
      rule: 'Pull — turn up and kick the corner.',
      detail:
        'Pull flat, clear the tight end. In a 5-2 there is nobody on the edge, so the corner is the man who has to come up and make the tackle. Kick him out and run the sweep inside your block.',
    },
    RG: {
      rule: 'Pull — wrap for the safety in the alley.',
      detail: 'Butt of the kick puller, turn up inside him, and take the safety filling the alley.',
    },
    RT: {
      rule: 'Rip — take the man on you.',
      detail: 'Their tackle is head up on you. Rip playside across his face and wall him off from the chase.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table (varsity p8, translated) — Buck Left.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  LT: {
    rule: 'Gap — Down — Climb.',
    detail:
      'In that order, every time. Somebody in your playside gap? Take him. Nobody there? Block down on the first man inside you — usually the man over the guard, because the guard is pulling. Nobody there either? Climb to a linebacker.',
  },
  LG: {
    rule: 'Pull — kick the first color outside our down blocks.',
    detail:
      'Open playside and pull FLAT — do not go deep, do not go around the world. Get outside the tight end and kick the first jersey outside our down blocks. Aim your outside shoulder and head at his inside hip and run him toward the sideline. If nobody is there, turn straight up and take the first color you see.',
  },
  C: {
    rule: 'Gap — Down — Climb.',
    detail:
      'Playside foot first. If the nose is on you, he is yours and you have no help — both guards are gone. If nothing is playside, block BACK on the down man the pulling guard left behind.',
  },
  RG: {
    rule: 'Pull — wrap for the first color in the alley.',
    detail:
      'You are the second puller. Aim at the BUTT of the kick puller, turn up inside him, and block the first color in the alley. The runner is following you — wherever you turn up is where he runs.',
  },
  RT: {
    rule: 'Rip — climb.',
    detail:
      'Step playside and rip through the man on you. Take anything crossing your face, then climb and cut off the backer chasing from behind. Nothing catches us from the back side.',
  },
  Y: {
    rule: 'Playside: Gap — Down — Climb. Backside: Rip — Climb.',
    detail:
      'On the play side, block your gap first, then down on the first man inside you, then climb to a backer. On the back side you rip playside and climb — same as the backside tackle.',
  },
  L: {
    rule: 'Gap — Down — Climb.',
    detail:
      'Playside wing. Block DOWN, never out. The first defender inside you is yours. The pulling guard is coming around behind you to kick the man outside — if you block out you wreck the whole play.',
  },
  R: {
    rule: 'Orbit motion. You have the ball.',
    detail:
      'Orbit through the heels of Super. Take the give with your chest square to the sideline, then read the WRAPPING guard — wherever he turns up, you turn up. Do not bounce it outside your kick block, and do not cut it back until you have run past the wrap.',
  },
  S: {
    rule: 'Run the midline. Sell the mesh.',
    detail:
      'Straight up the middle, full speed, hands out like you have the ball. Your fake is what holds the linebackers for the half-count we need. After that, cut off any free defender you can find.',
  },
  Q: {
    rule: 'Open away from the call. Mesh at five yards. Boot away.',
    detail:
      'Open up AWAY from the call and work back to a mesh five yards behind where you started. Give it to the wing with your chest square to him, then carry out your boot away from the call like you kept it — that fake is worth a defender.',
  },
  X: {
    rule: 'Playside: block the most dangerous man. Backside: free route.',
    detail:
      'On the back side, release clean and run the corner off — take him with you and out of the play. On the play side you block the most dangerous man, which is almost always the corner.',
  },
}

const reviewNotes = [
  "DIRECTION. Page 8's main diagram is Buck Sweep to the LEFT out of Red — to the tight end — so that is the picture this play carries. Page 9 also draws Buck RIGHT out of Red, away from the tight end; as of 2026-08-14 that IS a separate play in the book (buck-sweep-right-red), and Indy/Hoosier audible between the two directions at the line.",
  "THE PLAYSIDE WING BLOCKS DOWN, NOT OUT. Page 9's odd panel clearly caps his block on the defender INSIDE him, and the kick-out belongs to the playside guard. That is the single most common thing a 13-year-old gets backwards on this play, so it is spelled out in his detail text. Confirm that is how you teach it.",
  "SCAN AMBIGUITY ON THE EDGE. Measured off page 8, the wing's block bar and the kick puller's block bar land on nearly the same spot — both within half a yard of the walked-up edge backer (the green B, which is our E-L in the 5-2). One of them has to be on somebody else. We resolved it the way the table reads: the wing takes him (Gap - Down - Climb finds him in the wing's inside gap) and the guard kicks the next color outside. If you teach it the other way — guard kicks the edge man, wing climbs past him to the alley/strong safety — say so and we will swap those two targets in all three fronts.",
  "BALL-CARRIER DEPTH AND TIGHTNESS (changed). We had the wing bellying out to about six yards wide and turning up OUTSIDE the kick block. Measured against page 8 that was wrong: on the scan he runs flat at five yards to about two and a half yards outside the ball, then turns up INSIDE the tight end, tight behind the wrapping guard. Both pull paths were tightened to match (the kick now stays flat and stops just outside the tight end instead of turning up at six yards wide; the wrap now turns up at about four yards wide instead of five). This is the change a coach should eyeball first.",
  "THE KICK PULLER'S TARGET CHANGES BY FRONT and this is our football call, not something the scan draws against our fronts. 4-4: he kicks the walked-up outside backer (the Sam, or the Will when our strength is the other way) — a real kick-out. 4-3 and 5-2: nobody is standing on that edge, so he turns straight up and takes the first color in the alley — we sent him to the playside safety in the 4-3 and to the corner in the 5-2. Please confirm those two, especially the 5-2 (asking a guard to kick a corner is a long run).",
  "THE WRAP PULLER'S TARGET likewise: 4-4 free safety, 4-3 Mike, 5-2 playside safety. The rule in his assignment ('first color in the alley') is the thing to teach; the specific man is our reading of each front.",
  "THE CENTER. Page 9 caps his block on the nose in the odd panel. Against our even fronts nobody is on his nose and the backside guard has pulled, so we have him block BACK on the down man over the vacated guard. That is standard buck-sweep center play but it is not literally drawn anywhere — confirm.",
  "Q'S FOOTWORK. The table says 'Open up away from call working to mesh at 5 yards behind you.' We drew that as a reverse pivot away from the call, back to a five-yard mesh, then the boot away. If your quarterbacks open TO the call instead, tell us and the path changes.",
  "S RUNS THE MIDLINE and is drawn as a fake, not a carry — one straight line up the middle. He is the 'buck' in Buck Sweep. The scan draws it as one long straight line through the center, which is what we copied.",
  "LONG BLOCK BARS IN THE 4-3 AND 5-2. Because those two fronts leave nobody standing on the playside edge, the kick puller's target is a long way from where he pulls to (the playside safety in the 4-3, the corner in the 5-2), and the same is true of the wrap puller's free safety in the 4-4. The diagram therefore draws those three blocks as long lines running well downfield, which is honest about the assignment but does not look like the scan, where every block bar sits within about three yards of the ball. If you would rather the kick and wrap simply turn up and take the first color in the alley without naming a man that far away, tell us and we will retarget them.",
  "X on the back side is drawn as a free route, per the WR row in the table ('Backside: Free route'). We made it a vertical that runs the corner off. Note that page 8 actually draws him with a short stem and then a FORK — one arrow breaking in and up, one arrow flat to the outside — which is the scan's way of saying 'free route, take what he gives you'. We could not draw a fork with one path, so we shipped the vertical. If you want the fork in the book, say so.",
]

export const buckSweepLeftRed: Play = {
  id: 'buck-sweep-left-red',
  name: 'Buck Sweep',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Buck', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'left',
  ballCarrier: 'R',
  formationTwinId: 'buck-sweep-left-black',
  audibleFlipId: 'buck-sweep-right-red',
  summary: 'Play action handoff to the wing, who gets outside the line and cuts up.',
  description:
    'Our Wing-T sweep. Everybody on the play side blocks down, both guards pull — one kicks the edge out, one wraps up into the alley — Super runs the midline to freeze the linebackers, and the backside wing orbits, takes the ball and follows the wrapping guard.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}

// ---------------------------------------------------------------------------
// BUCK SWEEP RIGHT out of RED — the split-end-side sweep, hand-authored
// 2026-08-14 from page 9's Buck Right panels.
//
// This is NOT a mirror of Buck Left out of Red — mirroring Red-Left yields
// Black-Right. In Red the tight end Y aligns LEFT, so running right sweeps
// AWAY from him: the playside surface is only RT and the wing R (one fewer
// down blocker), X is suddenly a PLAYSIDE receiver with an MDM block, and Y
// joins the backside wall. Built from the page-9 Buck Right panels plus the
// page-8 role table with the playside/backside rows re-resolved; judgment
// calls are enumerated in reviewNotes.
//
// Roles, Red right:
//   PST = RT · PSG = RG (the KICK puller) · C = C · BSG = LG (the WRAP puller)
//   BST = LT · PSW = R · BSW = L (orbit motion — the BALL CARRIER)
//   Y = BACKSIDE tight end (Rip - Climb) · X = PLAYSIDE split end (MDM)
//   S = the buck fake down the midline · Q = quarterback
// ---------------------------------------------------------------------------

/**
 * L: orbit motion through the heels of Super, left-to-right, take the give and
 * read the WRAPPING guard — the page-9 panels draw his dotted turn-up rising
 * just inside the right wing's block, tight behind the wrap.
 */
const L_SWEEP_RIGHT: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: -4, y: -2.7 },
      { x: -2.4, y: -4.5 },
      { x: -0.4, y: -5.3 },
    ],
  },
  {
    kind: 'carry',
    path: [
      { x: 1.8, y: -5.1 },
      { x: 3.2, y: -4.9 },
      { x: 4.1, y: -3.8 },
      { x: 4.5, y: -2 },
      { x: 4.4, y: 1 },
      { x: 4.2, y: 4.8 },
    ],
  },
]

/** Q: open AWAY from the call — to the left now — mesh at five, boot left. */
const Q_MESH_RIGHT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.9, y: -2.3 },
      { x: -0.7, y: -3.7 },
      { x: 0.5, y: -4.8 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: -1.6, y: -4.4 },
      { x: -3.6, y: -3.8 },
      { x: -5.6, y: -2.8 },
      { x: -7.2, y: -1.4 },
    ],
  },
]

/** RG: pull flat, clear the wing's block, kick the first color out. */
const RG_KICK_RIGHT: Action = {
  kind: 'run',
  path: [
    { x: 2.2, y: -1.1 },
    { x: 3.6, y: -1.3 },
    { x: 4.6, y: -1.2 },
    { x: 5.4, y: -0.9 },
  ],
}

/** LG: pull flat, aim at the kick puller's butt, turn up in the alley. */
const LG_WRAP_RIGHT: Action = {
  kind: 'run',
  path: [
    { x: -1, y: -1.3 },
    { x: 0.6, y: -1.8 },
    { x: 2.4, y: -1.7 },
    { x: 3.6, y: -0.5 },
    { x: 4.1, y: 1.6 },
  ],
}

// X is playside in every front: MDM, the stalk on the corner — the long
// capped arc the page-9 Buck Right panels draw for him.
const BACKFIELD_RIGHT = {
  L: L_SWEEP_RIGHT,
  S: S_MIDLINE,
  Q: Q_MESH_RIGHT,
  X: block('C-R'),
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Buck Sweep Right front plans
// ---------------------------------------------------------------------------

/**
 * 4-4. The walked-up backer on the edge is the kick-out, same as going left.
 * With no tight end playside there is one fewer down blocker, so the wrap
 * puller's "first color in the alley" is the playside inside backer scraping
 * over — not the free safety.
 */
const vs44Right: FrontPlan = {
  actions: {
    ...BACKFIELD_RIGHT,
    R: block('E-R'),
    RT: block('T-R'),
    C: block('T-L'),
    RG: [RG_KICK_RIGHT, ...block('O-R')],
    LG: [LG_WRAP_RIGHT, ...block('B-R')],
    LT: block('B-L'),
    Y: block('E-L'),
  },
  assignments: {
    R: {
      rule: 'Gap — pin the end on your shoulder.',
      detail:
        'With no tight end out here the end sits almost on top of you. He is in your playside gap, so he is yours: hat across him and pin him IN. Never block out past him — the guard is kicking the man outside you.',
    },
    RT: {
      rule: 'Down — take the tackle over the guard.',
      detail:
        'Our guard is pulling, so the man over him is yours. Step down inside, get your hat across his playside number and pin him. This is the most important down block on the play.',
    },
    C: {
      rule: 'Uncovered playside — block back.',
      detail:
        'Nobody in your playside gap, and the backside guard has pulled. Step playside, then take the down man on the back side. If you miss him he runs the sweep down from behind.',
    },
    RG: {
      rule: 'Pull — kick the walked-up backer.',
      detail:
        'Pull flat, clear the wing and kick the first color outside our down blocks — the backer standing on the edge. Outside shoulder and head to his inside hip, and drive him toward the sideline.',
    },
    LG: {
      rule: 'Pull — wrap for the backer in the alley.',
      detail:
        'Aim at the butt of the kick puller, turn up inside him and block the first color in the alley. Going away from the tight end that is the playside inside backer scraping over the top.',
    },
    LT: {
      rule: 'Rip — climb to the backside backer.',
      detail: 'Step playside, rip through and cut off the backer chasing from behind.',
    },
    Y: {
      rule: 'Backside — rip, wall off the end.',
      detail:
        'The play goes away from you. Step playside, rip across the end\'s face and wall him off — he is the first man who chases this down from behind.',
    },
    X: {
      rule: 'Playside — block the most dangerous man.',
      detail: 'That is the corner on your side. Stalk him, get your hat on his outside number, and stay on him.',
    },
  },
}

/**
 * 4-3. Nothing is walked up on the edge. With no tight end to climb to the
 * Sam, the kick puller turns up and takes him as the first color outside the
 * down blocks; the wrap puller gets the Mike.
 */
const vs43Right: FrontPlan = {
  actions: {
    ...BACKFIELD_RIGHT,
    R: block('E-R'),
    RT: block('T-R'),
    C: block('T-L'),
    RG: [RG_KICK_RIGHT, ...block('B-R')],
    LG: [LG_WRAP_RIGHT, ...block('M')],
    LT: block('B-L'),
    Y: block('E-L'),
  },
  assignments: {
    R: {
      rule: 'Gap — pin the end on your shoulder.',
      detail:
        'The end is right on you. Hat across him and pin him in. Never block out — the guard is kicking around you.',
    },
    RT: {
      rule: 'Down — take the tackle over the guard.',
      detail: 'Our guard pulled. Step down inside, get your hat across the tackle and pin him.',
    },
    C: {
      rule: 'Uncovered playside — block back.',
      detail: 'Step playside, then take the down man on the back side that the pulling guard left behind.',
    },
    RG: {
      rule: 'Pull — nobody to kick, turn up on the outside backer.',
      detail:
        'Pull flat and clear the wing. In a 4-3 nobody is standing on that edge, so turn up and take the outside backer on your side — with no tight end over there, nobody else gets to him. Do not drift; get north as soon as you clear the wing.',
    },
    LG: {
      rule: 'Pull — wrap for the Mike.',
      detail: 'Aim at the butt of the kick puller, turn up inside him and take the Mike coming over the top.',
    },
    LT: {
      rule: 'Rip — climb to the backside backer.',
      detail: 'Step playside, rip through and cut off the chase.',
    },
    Y: {
      rule: 'Backside — rip, wall off the end.',
      detail: 'Step playside, rip across the end\'s face and cut off the chase from behind.',
    },
    X: {
      rule: 'Playside — block the most dangerous man.',
      detail: 'That is the corner on your side. Stalk him and stay on him.',
    },
  },
}

/**
 * 5-2 (odd). Their end sits a full yard outside the wing, so this front flips
 * the edge: the wing has nobody to pin — he climbs to the backer — and the
 * kick puller gets a REAL kick-out on the end (no long run to a corner like
 * the tight-end side). The wrap puller takes the playside safety in the alley.
 */
const vs52Right: FrontPlan = {
  actions: {
    ...BACKFIELD_RIGHT,
    R: block('B-R'),
    RT: block('T-R'),
    C: block('N'),
    RG: [RG_KICK_RIGHT, ...block('E-R')],
    LG: [LG_WRAP_RIGHT, ...block('F-R')],
    LT: block('T-L'),
    Y: block('B-L'),
  },
  assignments: {
    R: {
      rule: 'Nobody to down — climb to the backer.',
      detail:
        'The end is a yard OUTSIDE you — blocking him would be blocking out, and he belongs to the kick puller anyway. Nothing in your gap, nothing to down, so climb: get up to the backer inside and pin him.',
    },
    RT: {
      rule: 'Base the man on you.',
      detail:
        'Odd front: their tackle is head up on you. Step playside, get your hat across him and wall him off. Nothing crosses your face.',
    },
    C: {
      rule: 'Covered — block the nose.',
      detail:
        'The nose is head up on you and both guards are pulling. You are alone on him — playside foot first, hat on his playside number, and do not lose him.',
    },
    RG: {
      rule: 'Pull — kick the end.',
      detail:
        'Pull flat, clear the wing, and kick the end standing on the edge. Outside shoulder and head to his inside hip, drive him toward the sideline — the sweep runs inside your block.',
    },
    LG: {
      rule: 'Pull — wrap for the safety in the alley.',
      detail: 'Butt of the kick puller, turn up inside him, and take the safety filling the alley.',
    },
    LT: {
      rule: 'Rip — take the man on you.',
      detail: 'Their tackle is head up on you. Rip playside across his face and wall him off from the chase.',
    },
    Y: {
      rule: 'Backside — rip, climb to the backer.',
      detail:
        'Step playside, rip inside the end and climb to the backside backer — our tackle has the man on him, so the backer is yours.',
    },
    X: {
      rule: 'Playside — block the most dangerous man.',
      detail: 'That is the corner on your side. Stalk him and stay on him.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for BUCK RIGHT.
// ---------------------------------------------------------------------------

const assignmentsRight: Record<OffPosId, Assignment> = {
  RT: {
    rule: 'Gap — Down — Climb.',
    detail:
      'In that order, every time. Somebody in your playside gap? Take him. Nobody there? Block down on the first man inside you — usually the man over the guard, because the guard is pulling. Nobody there either? Climb to a linebacker.',
  },
  RG: {
    rule: 'Pull — kick the first color outside our down blocks.',
    detail:
      'Open playside and pull FLAT — do not go deep, do not go around the world. Clear the wing and kick the first jersey outside our down blocks. Aim your outside shoulder and head at his inside hip and run him toward the sideline. If nobody is there, turn straight up and take the first color you see.',
  },
  C: {
    rule: 'Gap — Down — Climb.',
    detail:
      'Playside foot first. If the nose is on you, he is yours and you have no help — both guards are gone. If nothing is playside, block BACK on the down man the pulling guard left behind.',
  },
  LG: {
    rule: 'Pull — wrap for the first color in the alley.',
    detail:
      'You are the second puller. Aim at the BUTT of the kick puller, turn up inside him, and block the first color in the alley. The runner is following you — wherever you turn up is where he runs.',
  },
  LT: {
    rule: 'Rip — climb.',
    detail:
      'Step playside and rip through the man on you. Take anything crossing your face, then climb and cut off the backer chasing from behind. Nothing catches us from the back side.',
  },
  Y: {
    rule: 'Backside: Rip — Climb. (Playside: Gap — Down — Climb.)',
    detail:
      'The play goes away from you on this one. Rip playside and climb — take the man crossing your face or get to the backside backer, same as the backside tackle. (When the play comes your way: gap first, then down, then climb.)',
  },
  R: {
    rule: 'Gap — Down — Climb.',
    detail:
      'Playside wing. Block DOWN, never out. If a man sits in your gap or on your shoulder, pin him in; if the edge is clean, climb to the backer. The pulling guard is coming around behind you to kick the man outside — if you block out you wreck the whole play.',
  },
  L: {
    rule: 'Orbit motion. You have the ball.',
    detail:
      'Orbit through the heels of Super. Take the give with your chest square to the sideline, then read the WRAPPING guard — wherever he turns up, you turn up. Do not bounce it outside your kick block, and do not cut it back until you have run past the wrap.',
  },
  S: {
    rule: 'Run the midline. Sell the mesh.',
    detail:
      'Straight up the middle, full speed, hands out like you have the ball. Your fake is what holds the linebackers for the half-count we need. After that, cut off any free defender you can find.',
  },
  Q: {
    rule: 'Open away from the call. Mesh at five yards. Boot away.',
    detail:
      'Open up AWAY from the call and work back to a mesh five yards behind where you started. Give it to the wing with your chest square to him, then carry out your boot away from the call like you kept it — that fake is worth a defender.',
  },
  X: {
    rule: 'Playside: block the most dangerous man. Backside: free route.',
    detail:
      'The play comes to YOUR side on this one. Block the most dangerous man, which is almost always the corner — stalk him, hat on his outside number, stay on him. (On the back side you release clean and run the corner off.)',
  },
}

const reviewNotesRight = [
  "NEW PICTURE (2026-08-14) — NEEDS COACH RYAN'S CHECK. This is Buck Sweep RIGHT out of Red — page 9's 'Buck Right vs Even / vs Odd' panels — the sweep AWAY from the tight end, to the split-end side. It is NOT a mirror of Buck Left out of Red (mirroring that gives Black-Right). It was authored from those two panels plus the page-8 role table with playside/backside re-resolved: L is the orbiting ball carrier, RG kicks, LG wraps, R is the playside wing, X is a PLAYSIDE blocker, and Y joins the backside wall. Needs checking stroke by stroke.",
  "Indy/Hoosier are direction AUDIBLES (Ryan, 2026-08-14): Indy = left, Hoosier = right, yelled at the line. 'Red, Buck Left' + 'HOOSIER HOOSIER' becomes THIS play. Wired via audibleFlipId; the words live in DIRECTION_AUDIBLES (app/utils/playbook.ts).",
  "JUDGMENT CALL — THE WING vs THE END. Red's right side has no tight end, so the wing R (x 4.2) and the defensive end nearly share a spot. Vs the even fronts (end at 4.8, on his outside shoulder) we read Gap-Down-Climb as GAP: R pins the end in, and the kick goes to the next color outside. Vs the 5-2 (end at 5.2, a full yard outside) pinning him would be blocking out, so R CLIMBS to the playside backer and the kick puller takes the end — a real kick-out. That 0.4-yard alignment difference flips the whole edge; confirm both reads.",
  "JUDGMENT CALL — KICK TARGET PER FRONT: 4-4 the walked-up Sam (O-R), same as the tight-end side. 4-3: nobody on the edge, so he turns up on the outside backer B-R — NOT the safety like the left version, because with no tight end to climb to the Sam, the kick is the only man who gets there. 5-2: the end E-R (see previous note) — a shorter, cleaner kick than the left version's corner kick.",
  "JUDGMENT CALL — WRAP TARGET PER FRONT: 4-4 the playside inside backer B-R scraping over (NOT the free safety like the left version — with one fewer down blocker nobody else has him), 4-3 the Mike, 5-2 the playside safety F-R. 'First color in the alley' is still the rule being taught.",
  "JUDGMENT CALL — THE FREE MEN. 4-4: the free safety F is UNBLOCKED (the wrap now spends himself on the scraping backer); the ball carrier has to beat him behind the wall of down blocks, or X abandons the corner for him. 4-3: the playside safety F-R is unblocked (X stalks the corner instead). If you want X on the safety and the corner run off by alignment, say so and we retarget his MDM per front. Backside free men: 4-4 O-L and C-L; 4-3 C-L and F-L; 5-2 E-L, C-L and F-L — same class of leave-alones as the left version's backside.",
  "JUDGMENT CALL — Y ON THE BACKSIDE: his rule is Rip — Climb. Vs the even fronts the end E-L is right on his face, so we spend the rip ON him (wall off the chase) and let LT climb to the backside backer. Vs the 5-2 the tackles are head up (LT bases his man), so Y rips inside the end and CLIMBS to the backside backer B-L, leaving E-L to chase from a yard outside — the same man the left version leaves free on its backside. If you'd rather Y always climb and let the end run, or always wall the end, say so.",
  "BALL-CARRIER TURN-UP measured off page 9's Buck Right panels: the dotted arrow rises just inside the right wing's block, tight behind the wrapping guard — we drew it at x ≈ 4.4, the exact mirror of the left version's relationship (turn up inside the edge down-block, outside the wrap by half a yard). The orbit starts from L at −5.7, a step wider than R's orbit on the left version, so the first motion point was nudged, not negated.",
  "X'S MDM BLOCK is drawn as a targeted block on the corner C-R in all three fronts — the long capped arc the panels show. His detail text says 'almost always the corner'; if some front should send him to a safety instead, that's the free-men note above.",
  "Q OPENS AWAY FROM THE CALL — to the LEFT now — meshes at five yards and boots left. Exact negation of the left version's footwork; same confirm as there (if your quarterbacks open TO the call, both paths change).",
  "S'S MIDLINE and the front-independent Gap-Down-Climb / pull texts are shared with the left version word for word — only the players wearing each role changed (RT↔LT, RG↔LG, R↔L, Y and X swapping playside/backside).",
]

export const buckSweepRightRed: Play = {
  id: 'buck-sweep-right-red',
  name: 'Buck Sweep',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Buck', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'L',
  formationTwinId: 'buck-sweep-right-black',
  audibleFlipId: 'buck-sweep-left-red',
  summary: 'Play action handoff to the wing, who gets outside the line and cuts up.',
  description:
    'The same Wing-T sweep run AWAY from the tight end. Both guards still pull — the right guard kicks, the left guard wraps — Super runs the midline, and now it is the LEFT wing who orbits, takes the ball and follows the wrap. With no tight end playside the wing and the split end do the edge work: the wing pins or climbs, and X stalks the corner.',
  assignments: assignmentsRight,
  vs: { '44': vs44Right, '43': vs43Right, '52': vs52Right } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: reviewNotesRight,
}

/**
 * Buck Sweep Right out of BLACK — the mirror of Buck Left out of Red. Black
 * puts the tight end and a wing to the RIGHT, so running right out of Black is
 * the tight-end-side picture flipped: RG becomes the kick puller, LG the wrap
 * puller, L the orbiting ball carrier and R the playside wing. Everything on
 * buckSweepLeftRed's review list applies here mirrored.
 */
export const buckSweepRightBlack: Play = mirrorPlay(buckSweepLeftRed, {
  id: 'buck-sweep-right-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Buck', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  formationTwinId: 'buck-sweep-right-red',
  audibleFlipId: 'buck-sweep-left-black',
  description:
    'Buck Sweep to the right out of Black — at the tight end, because Black flips Y to the right. Same down blocks, same kick and wrap, other side of the ball: the right guard kicks, the left guard wraps, and L is the wing with the ball.',
  reviewNotes: [
    ...reviewNotes,
    'Buck Sweep Right out of Black is generated by mirroring Buck Sweep Left out of Red (app/utils/mirror.ts) with no hand corrections — page 1 draws Black as Red\'s exact mirror and all three fronts are symmetric. If any answer above changes, this play changes with it automatically.',
  ],
})

/**
 * Buck Sweep Left out of BLACK — the mirror of Buck Right out of Red. Black
 * puts the tight end right, so sweeping left out of Black is the
 * split-end-side picture flipped: LG kicks, RG wraps, R orbits with the ball,
 * L is the playside wing, and X — split left in Black — stalks the corner on
 * his side. Everything on buckSweepRightRed's review list applies mirrored.
 */
export const buckSweepLeftBlack: Play = mirrorPlay(buckSweepRightRed, {
  id: 'buck-sweep-left-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Buck', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  formationTwinId: 'buck-sweep-left-red',
  audibleFlipId: 'buck-sweep-right-black',
  description:
    'Buck Sweep to the left out of Black — away from the tight end, since Black flips Y to the right. The left guard kicks, the right guard wraps, R orbits and takes the ball, and X — split left in Black — stalks the corner playside.',
  reviewNotes: [
    ...reviewNotesRight,
    'Buck Sweep Left out of Black is generated by mirroring Buck Sweep Right out of Red (app/utils/mirror.ts) with no hand corrections. If any of the Red-right answers above change, this play changes with it automatically.',
  ],
})

export const buckSweepPlays: Play[] = [
  buckSweepRightRed,
  buckSweepRightBlack,
  buckSweepLeftRed,
  buckSweepLeftBlack,
]
