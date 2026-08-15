/**
 * BUCK SWEEP out of TIGHT — the left/right pair, authored 2026-08-15.
 *
 * WHICH PICTURE THIS STARTS FROM. Buck Sweep has two hand-authored pictures in
 * app/data/plays/buck-sweep.ts: the TE-side sweep (buckSweepLeftRed, varsity
 * page 8's main diagram — TE + wing on the playside) and the split-end-side
 * sweep (buckSweepRightRed, page 9). Tight puts a tight end AND a wing on both
 * edges, so BOTH directions out of Tight are the TE-side picture — page 8's.
 * Buck Sweep Left out of Tight is therefore buckSweepLeftRed's playside
 * verbatim: Tight's Y (−4.5), L (−5.7, −1), LT/LG/C/RG/RT and S all stand
 * exactly where Red's do, so every down block, both pull paths, the midline
 * fake and the quarterback's mesh-and-boot carry over stroke for stroke.
 *
 * WHAT TIGHT CHANGES — the backside, and only the backside:
 *   - X is not a split end out at +12 running a free route. In Tight he is the
 *     RIGHT TIGHT END at +4.5 (Ryan, 2026-08-15: "X" is WR vernacular; aligned
 *     tight he is technically a tight end and gets a tight end's job). So he
 *     takes the backside tight end's job THIS FAMILY already teaches — the
 *     page-8 table's "Y — Backside: Rip - Climb", resolved per front exactly
 *     the way buckSweepRightRed resolves it for its own backside tight end,
 *     mirrored: wall off the end vs the even fronts, rip inside him and climb
 *     to the backside backer vs the 5-2.
 *   - The orbiting ball carrier starts a step wider. Red's backside wing R
 *     sits at +4.2; Tight's sits at +5.7, so the first point of his orbit
 *     squiggle is widened (4.6 instead of 4.0). Nothing else about the orbit,
 *     the give, or the turn-up moves.
 * The backside LINE work needs no change at all: buckSweepLeftRed already has
 * RT ripping to B-R vs the even fronts and taking T-R vs the 5-2, which is the
 * exact mirror of what buckSweepRightRed asks of its backside tackle behind a
 * backside tight end. The two backsides agree, so nothing was invented.
 *
 * Roles, Tight left:
 *   PST = LT · PSG = LG (the KICK puller) · C = C · BSG = RG (the WRAP puller)
 *   BST = RT · PSW = L · BSW = R (orbit motion — the BALL CARRIER)
 *   Y = PLAYSIDE tight end · X = BACKSIDE tight end (Rip - Climb)
 *   S = the buck fake down the midline · Q = quarterback
 *
 * DIRECTION IS PLAY IDENTITY; Indy (left) / Hoosier (right) are audibles
 * yelled at the line, wired through `audibleFlipId`. Tight is a balanced set
 * that mirrors onto itself, so — exactly like the Split Wide pairs and the
 * Tight veer pair — there is NO `formationTwinId`: a 1×2 left/right pair, not
 * a 2×2 square.
 *
 * THE RIGHT-HAND PLAY IS GENERATED. Because Tight is exactly symmetric and all
 * three fronts are left/right symmetric, Buck Sweep Right out of Tight is the
 * left play mirrored — mirrorPlay() plus the X↔Y entry exchange a balanced
 * one-formation set requires (see mirrorTightPlay below and the same helper in
 * app/data/plays/split-wide.ts). Reviewing the left play reviews both.
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
// Skill actions — identical against all three fronts, carried over from
// buckSweepLeftRed except for the orbit's widened first step.
// ---------------------------------------------------------------------------

/**
 * R: orbit motion through the heels of Super, take the give, and read the
 * WRAPPING guard — turn up inside the kick-out, not around it. Tight's right
 * wing starts at (+5.7, −1) instead of Red's (+4.2, −1), so the first point of
 * the squiggle is widened; the flat run at five yards and the turn-up are the
 * page-8 yards unchanged.
 */
const R_SWEEP: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 4.6, y: -2.7 },
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
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Front plans — Buck Sweep Left out of Tight
// ---------------------------------------------------------------------------

/**
 * 4-4. The walked-up backer on the edge is the kick-out. Everybody inside him
 * blocks down; the wrap puller takes the safety filling the alley. Backside:
 * RT rips and climbs to B-R, X walls off the backside end.
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
    X: block('E-R'),
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
    X: {
      rule: 'Backside — rip, wall off the end.',
      detail:
        'You are the backside tight end in this set. The play goes away from you: step playside, rip across the end\'s face and wall him off — he is the first man who chases this down from behind. The tackle inside you has the backer.',
    },
  },
}

/**
 * 4-3. Nothing is walked up on the edge, so the kick puller turns straight up
 * and takes the first color in the alley — the playside safety — and the wrap
 * puller gets the Mike. Backside is the same division of labor as the 4-4.
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
    X: block('E-R'),
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
    X: {
      rule: 'Backside — rip, wall off the end.',
      detail: 'Step playside, rip across the end\'s face and cut off the chase from behind.',
    },
  },
}

/**
 * 5-2 (odd). The nose is on the center, their tackles are head up on our
 * tackles, and there is nothing on the playside edge, so the kick puller turns
 * up on the corner. On the backside their end sits a yard outside X, so — as
 * on the family's split-end-side picture — X rips INSIDE him and climbs to the
 * backside backer while RT bases the man head up on him.
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
    X: block('B-R'),
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
    X: {
      rule: 'Backside — rip, climb to the backer.',
      detail:
        'Step playside, rip inside the end and climb to the backside backer — our tackle has the man head up on him, so the backer is yours. The end a yard outside you is chasing from behind and runs himself out of the play.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table (varsity p8, translated) — roles
// resolved for BUCK SWEEP LEFT out of Tight. Word for word the page-8 table as
// buckSweepLeftRed carries it, with X's row rewritten: he is a tight end here,
// not a split end, so his row is the tight end's row read from the back side.
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
      'The play comes your way on this one. Block your gap first, then down on the first man inside you, then climb to a backer. (When it goes the other way you rip playside and climb — same as the backside tackle.)',
  },
  X: {
    rule: 'Backside: Rip — Climb. (Playside: Gap — Down — Climb.)',
    detail:
      'You are a tight end in this set, not a split end — you get a tight end\'s job. The play goes away from you here, so rip playside and climb: take the man crossing your face, or if our tackle already has him, climb to the backer chasing from behind. Nothing catches us from the back side. (When the play comes your way: gap first, then down, then climb.)',
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
}

const coachNotes = [
  'The dive fake is the play - sell it every time.',
  'Wing: be patient behind the pullers, then cut up hard.',
]

const reviewNotes = [
  "NEW PLAY (2026-08-15) — NEEDS COACH RYAN'S CHECK. Buck Sweep Left out of Tight was authored by starting from the hand-authored buck-sweep-left-red (page 8's main diagram, the TE-side sweep). Tight's left surface — Y at −4.5, wing L at −5.7, the five linemen, Super and the quarterback — is geometrically IDENTICAL to Red's, so every down block, both pull paths, the midline fake and the mesh-and-boot carry over verbatim, including every judgment call already flagged on that play's own review list (the wing blocks DOWN not out; the kick puller's target per front; the wrap puller's target per front; the center's block-back; the quarterback opening away). What changed is the backside, and only the backside.",
  'WHICH PICTURE — a ruling worth confirming. Buck Sweep has two hand-authored pictures: page 8 (at the tight end) and page 9 (away from the tight end, to the split end). Tight has a tight end AND a wing on both edges, so we treated BOTH Tight directions as the page-8, TE-side picture. That is the whole reason to be in Tight, but it does mean Tight never gets the page-9 edge answers (wing pinning the end, X stalking a corner) — confirm that is what you want.',
  'THE ONE REAL CHANGE — X is a tight end here, not a split end. In Red he is split at +12 running a free route that takes the corner away. In Tight he sits at +4.5, so he takes the backside tight end job the page-8 table already writes down ("Y — Backside: Rip - Climb"), resolved per front exactly the way the family\'s own split-end-side picture (buck-sweep-right-red) resolves it for ITS backside tight end, mirrored: vs the 4-4 and 4-3 the end is right on his face, so he spends the rip ON him and walls off the chase while our tackle climbs to the backer; vs the 5-2 the tackles are head up (our tackle bases his man), so X rips INSIDE the end and climbs to the backside backer, leaving the end to chase from a yard outside. That is the same backside answer the family already ships — nothing new was invented — but it is the piece to eyeball.',
  'THE BACKSIDE LINE NEEDED NO CHANGE, and that is a small piece of evidence the reading above is right: buck-sweep-left-red already has RT ripping to B-R vs the even fronts and taking T-R vs the 5-2, which is exactly the mirror of what buck-sweep-right-red asks of its backside tackle standing next to a backside tight end. The two hand-authored pictures agree on the backside; Tight just inherits it.',
  'CONSEQUENCE — nobody runs the corner off anymore. Red-left sent X on a backside free route to carry the corner away from the play. Tight has no detached receiver, so the backside corner and safety are simply unblocked (they are a long way from a sweep going the other direction). Flag if you would rather X release deep on the back side instead of ripping.',
  'ORBIT GEOMETRY — the ball carrier starts a step wider. Tight\'s backside wing is at ±5.7 where Red\'s is at 4.2, so the first point of the orbit squiggle was widened (4.6 instead of 4.0) and nothing else moved: he still runs flat at five yards to about two and a half yards outside the ball and turns up INSIDE the tight end, tight behind the wrapping guard, at about 4.4 yards wide. Same relationship page 8 draws.',
  'BALANCED SET — no formationTwinId, matching the Split Wide and Tight-veer rulings: Tight mirrors onto itself, so there is no Red/Black-style formation twin, just the left/right pair linked by audibleFlipId (Indy = left, Hoosier = right at the line, per DIRECTION_AUDIBLES).',
  'THE RIGHT-HAND PLAY IS GENERATED, not hand-authored: buck-sweep-right-tight = mirrorTightPlay(buck-sweep-left-tight) — mirrorPlay() plus the X↔Y entry exchange this balanced one-formation set requires (X and Y are mirror-image POSITIONS that keep their spots, so their entries must trade places when everything else flips — the bug the Split Wide dive hit). Tight is drawn exactly symmetric and all three fronts are left/right symmetric, so no hand corrections were needed. Reviewing the left play reviews both, and if any answer above changes, the right play changes with it automatically.',
  'FOOTBALL NOTE FOR REVIEW — Tight makes the kick puller\'s long runs shorter in spirit but not on paper. Vs the 4-3 he still turns up on the playside safety and vs the 5-2 still on the corner, exactly as in Red, because the extra tight end is on the BACK side, not the play side. If having a second tight end on the field should change either of those targets, say so and we retarget them here without touching the Red plays.',
]

export const buckSweepLeftTight: Play = {
  id: 'buck-sweep-left-tight',
  name: 'Buck Sweep',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Buck', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'tight',
  direction: 'left',
  ballCarrier: 'R',
  audibleFlipId: 'buck-sweep-right-tight',
  summary: 'Play action handoff to the wing, who gets outside the line and cuts up.',
  description:
    'Our Wing-T sweep out of the two-tight-end set. Everybody on the play side blocks down, both guards pull — the left guard kicks the edge out, the right guard wraps up into the alley — Super runs the midline to freeze the linebackers, and the right wing orbits, takes the ball and follows the wrapping guard. Because Tight has a tight end on BOTH edges, X anchors the back side with the rip cutoff instead of splitting out, and the defense cannot set its front to the strength — there is one on each side.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes,
}

/**
 * BUCK SWEEP RIGHT out of TIGHT — the left play mirrored. Tight is balanced and
 * all three fronts are left/right symmetric, so this is one mirrorTightPlay()
 * call with zero hand corrections: RG becomes the kick puller, LG the wrap
 * puller, L the orbiting ball carrier, R the playside wing, X the playside
 * tight end and Y the backside rip.
 */
export const buckSweepRightTight: Play = mirrorTightPlay(buckSweepLeftTight, {
  id: 'buck-sweep-right-tight',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Buck', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  audibleFlipId: 'buck-sweep-left-tight',
  description:
    'The same Wing-T sweep the other way out of the two-tight-end set. The right guard kicks, the left guard wraps, Super runs the midline, and the LEFT wing orbits, takes the ball and follows the wrap. X is the playside tight end blocking down, Y anchors the back side with the rip cutoff — the identical picture, flipped, which is exactly why we get in Tight.',
  reviewNotes: [
    ...reviewNotes,
    'GENERATED: this play is mirrorTightPlay(buck-sweep-left-tight) — the straight mirror plus the X↔Y entry exchange the balanced set needs, with no hand corrections to the football. Tight is drawn exactly symmetric and all three fronts are left/right symmetric, so review the left-hand play and you have reviewed this one. The prose was NOT hand-translated: assignment text is the left play\'s wording re-keyed onto the mirrored players, so any sentence that names a direction should be read as its mirror.',
  ],
})

export const buckSweepTightPlays: Play[] = [buckSweepRightTight, buckSweepLeftTight]
