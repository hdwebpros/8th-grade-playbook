/**
 * STRETCH — varsity scans page-12.jpg (main diagram + assignment table) and
 * page-13.jpg (six formation variants, landscape, rotate +90 to read).
 *
 * NOTE ON PAGE NUMBERS: HANDOFF.md's page map says "11–12 Stretch". The actual
 * JPEGs are off by one in this range — page-11.jpg is JET, page-12.jpg is the
 * STRETCH main page, page-13.jpg is the STRETCH variants page. Everything below
 * is transcribed from page-12 and page-13.
 *
 * THE CALL MODEL (Ryan, 2026-08-14 — supersedes "names follow the formation"):
 *   - Direction is play identity: Stretch Left and Stretch Right are two plays.
 *   - Formation (Red/Black) is ORTHOGONAL — each direction runs out of either.
 *   - "Indy" and "Hoosier" are AUDIBLES yelled at the line, not play names:
 *     Indy = the play now goes LEFT, Hoosier = RIGHT. Huddle: "Red, Stretch,
 *     Left"; QB sees the edge stacked, yells "HOOSIER HOOSIER" → the play
 *     becomes Stretch Right out of Red — same formation, flipped direction.
 *   That wiring lives on each play as `audibleFlipId` (same formation,
 *   opposite direction) and `formationTwinId` (same call, other formation),
 *   with the audible words in `DIRECTION_AUDIBLES` (app/utils/playbook.ts).
 *
 * FOUR plays, two hand-authored pictures:
 *   - stretchLeftRed   — hand-authored from page-12 (the main diagram, which
 *     draws Stretch out of our Red alignment running LEFT, at the tight end
 *     and wing). The strong-side stretch.
 *   - stretchRightRed  — hand-authored (2026-08-14) from page-13's "Stretch
 *     Right" panel: the SAME Red alignment with the ball run RIGHT — the
 *     weak/split-end side. Y and the L wing are backside (cutoff), R is the
 *     playside wing, X is playside but still plays MDM.
 *   - stretchRightBlack = mirrorPlay(stretchLeftRed) — Black flips Y and the
 *     L wing to the right, so right out of Black is the strong-side picture.
 *   - stretchLeftBlack  = mirrorPlay(stretchRightRed) — weak-side flipped.
 *
 * Resolving varsity's playside/backside rows to actual players, Red LEFT:
 *   PST = LT · PSG = LG · C = C · BSG = RG · BST = RT
 *   PSW = L (playside wing) · BSW = R (backside wing)
 *   Y = playside tight end · X = backside split end (the "WR / MDM" row)
 *   S = ball carrier · Q = quarterback
 *
 * The varsity assignment table, verbatim:
 *   PST  Gap to Climb - 45 Outside Step
 *   PSG  Gap to Climb - 45 Outside Step
 *   C    Gap to Climb - 45 Outside Step
 *   BSG  Gap to Climb - 45 Inside Step
 *   BST  Gap to Climb - 45 Inside Step
 *   Y    Playside: Gap to Climb - 45 Outside Step   Backside: Cutoff
 *   PSW  Gap to Climb - 45 Outside Step
 *   BSW  Cutoff
 *   S    Slow Bucket Step - Aiming Point Outside Tackle - Receive Handoff From
 *        QB - Key: End Man on LOS
 *   Q    Open to the mesh. Work 45 for depth behind Inside Leg of Tackle for Mesh
 *   WR   MDM
 *
 * ARROWS AS DRAWN on page-12 (this is the literal transcription; the drawn
 * defense is an ODD front — three down linemen E/N/E with the nose head-up on
 * the center, edge backers B and S, inside backers W and M — which maps onto
 * our 5-2 as: drawn E(left)→T-L, N→N, E(right)→T-R, B→E-L, S→E-R, W→B-L,
 * M→B-R, $→F-L, F→F-R):
 *   LT   stem straight up, block bar ON the down lineman over him
 *   LG   arcs playside-outward and helps on that same down lineman
 *   C    reaches playside, hook/bar ON the nose
 *   RG   steps inside/playside, works to the nose with the center (scoop)
 *   RT   steps DOWN inside, bar on the INSIDE shoulder of the man over him
 *   Y    reaches up and outside, bar ON the playside edge defender
 *   L    arcs up and outside past everybody, bar pointed at the playside CORNER
 *   R    climbs straight up, bar ON the backside inside backer
 *   X    long line back across the field, bar ON the deep safety (MDM)
 *   S    bucket step, mesh, then TWO arrows off the aiming point — one bending
 *        up at the C gap and one bouncing outside. Same read, two answers.
 *
 * MEASURED GEOMETRY off page-12 (offensive line spacing = 1.5 yd = 23.3 px in
 * the 1275-wide scan; the C square is x=0, the OL row is y=0):
 *   Q at (0, −1.2) · mesh circle at (−2.5, −2.9) — i.e. behind the INSIDE leg
 *   of the playside tackle, exactly as the table says.
 *   S at (0, −4.0); his line dips back/away, runs through the mesh, and reaches
 *   the aiming point at (−3.8, −1.9). The bend-up arrow is then DEAD VERTICAL
 *   at x = −3.8 up to y = +3.2 — that is between Y (−4.5) and LT (−3.0), i.e.
 *   literally OUTSIDE THE PLAYSIDE TACKLE, not out at the wing.
 *   The second (bounce) arrow leaves the same aiming point and finishes at
 *   about (−7.0, +0.8), outside the wing.
 *   L's block bar is drawn at (−7.9, +2.0), heading up and OUT — short of the
 *   corner letter at (−9.4, +3.9) but pointed at nobody else (the $ safety is
 *   at (−6.1, +7.6), straight up from L, and the arc bows away from him).
 *
 * ALSO DRAWN, and easy to miss: two black DOTTED arrows capped with block bars,
 * climbing off the double-teams to the second level — one from the E over the
 * playside tackle up to W (the playside inside backer), one from the nose
 * climbing straight up. These are the "climb" half of "gap to CLIMB": the
 * LT/LG combo comes off onto W. Coded as a chained second block on LG in the
 * 5-2 plan. On page-12 the nose climb is drawn short and lands on no letter —
 * but page-13's "Stretch Right" panel draws BOTH climbs landing (on W and M),
 * which is how the right-hand play below resolves them.
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
// STRETCH LEFT out of RED — page-12's main diagram, hand-authored.
// Skill actions — identical against all three fronts.
// ---------------------------------------------------------------------------

/**
 * S: slow bucket step back and away, through the mesh, to an aiming point
 * OUTSIDE the playside tackle — x = −3.8, between LT (−3.0) and Y (−4.5),
 * which is where page-12 puts it. Then he keys the end man on the line and
 * this path shows the BEND-UP: the scan's dead-vertical arrow off that aiming
 * point. The scan's second arrow (bounce outside) lives in the assignment text.
 */
const S_STRETCH: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: 0.3, y: -4.9 },
      { x: -1.2, y: -3.9 },
      { x: -2.5, y: -2.9 },
      { x: -3.8, y: -1.9 },
      { x: -3.8, y: 0.6 },
      { x: -3.8, y: 3.2 },
    ],
  },
]

/** Q: open playside, work 45 for depth behind the inside leg of the tackle. */
const Q_MESH: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -1.3, y: -2.1 },
      { x: -2.5, y: -2.9 },
    ],
  },
]

const BACKS = {
  S: S_STRETCH,
  Q: Q_MESH,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Stretch Left front plans. Playside is LEFT.
// ---------------------------------------------------------------------------

/**
 * 5-2 (ODD) — this is the front the scan itself draws, so this plan is a
 * one-for-one transcription of page-12's arrows.
 */
const vs52: FrontPlan = {
  actions: {
    ...BACKS,
    Y: block('E-L'),
    L: block('C-L'),
    LT: block('T-L'),
    // Combo, then climb: page-12 draws a dotted arrow with a block bar coming
    // off this double-team up to W (our B-L). Chained blocks render exactly
    // that — LG to the down man, then off him to the backer.
    LG: [...block('T-L'), ...block('B-L')],
    C: block('N'),
    RG: block('N'),
    RT: block('T-R'),
    R: block('B-R'),
    X: block('F-R'),
  },
  assignments: {
    LT: {
      rule: '45 outside step — reach the man on you.',
      detail:
        'The tackle is head up on you in a 5-2. Playside foot first at 45 degrees, get your hat across his playside number and run your feet. The guard is coming to help.',
    },
    LG: {
      rule: '45 outside step — combo the down man, then climb to the backer.',
      detail:
        'Nobody on you. Step playside at 45 and put your inside hand on the down man the tackle is reaching. Stay on him until the tackle owns him, then come off flat for the inside backer — he is the one who fills this play.',
    },
    C: {
      rule: '45 outside step — reach the nose.',
      detail:
        'Odd front: the nose is head up on you. Playside step, get your helmet to his playside number and do not let him cross your face. The backside guard is scooping behind you.',
    },
    RG: {
      rule: '45 inside step — scoop the nose with C.',
      detail:
        'Step inside at 45 and get your shoulder into the nose. If the nose fights across the center, he is yours alone. This is the block that keeps the play from getting hit in the back.',
    },
    RT: {
      rule: '45 inside step — cut off the man on you.',
      detail:
        'Step DOWN inside, not out. Get your head across his playside shoulder and wall him off. You never fan out on him — nothing chases us from behind.',
    },
    L: {
      rule: 'Gap to climb — go get the corner.',
      detail:
        'The 5-2 has nobody walked up outside the tight end, so your gap is empty and you climb all the way to the corner. That block turns eight yards into a touchdown.',
    },
  },
}

/**
 * 4-4 (EVEN). The scan has no vs-front pages for Stretch, so this plan applies
 * the drawn rules to the 4-4: reach playside, back side steps DOWN inside,
 * the wing takes the widest force man, the backside wing climbs to the
 * backside backer, the split end takes the deep safety.
 */
const vs44: FrontPlan = {
  actions: {
    ...BACKS,
    Y: block('E-L'),
    L: block('O-L'),
    LT: block('B-L'),
    LG: block('T-L'),
    C: block('T-L'),
    RG: block('T-R'),
    RT: block('T-R'),
    R: block('B-R'),
    X: block('F'),
  },
  assignments: {
    Y: {
      rule: '45 outside step — reach the end on you.',
      detail:
        'In a 4-4 the end is on your outside shoulder. Playside step at 45, hat across his outside number, and turn him in. If he beats you outside, run him past the play and the back bends up.',
    },
    LT: {
      rule: '45 outside step — climb to the playside backer.',
      detail:
        'Nobody on you. Step playside at 45, get past the down man the guard is reaching, and put your hat on the backer inside. He is the guy who fills for the stretch.',
    },
    LG: {
      rule: '45 outside step — reach the man on you.',
      detail:
        'The tackle is head up. Playside foot first, get your helmet to his playside number and run him toward the sideline. The center is stepping over to help.',
    },
    C: {
      rule: '45 outside step — help the playside guard.',
      detail:
        'Even front, nobody on your nose. Step playside at 45 into the guard\'s hip and take over the down man if he slants back inside. That combo is what makes the front move sideways.',
    },
    RG: {
      rule: '45 inside step — cut off the man on you.',
      detail:
        'Step DOWN inside at 45. Do not let the tackle cross your face into the hole. If he slants away, ride him and stay square.',
    },
    RT: {
      rule: '45 inside step — step down and help the guard.',
      detail:
        'Backside rule is inside step, always. You go DOWN toward the guard, not out on the end behind you. Get your head across the down man and seal the back side.',
    },
    L: {
      rule: 'Gap to climb — block the force man.',
      detail:
        'In a 4-4 the walked-up backer outside is the force man. Step outside at 45 and get on him. If he runs upfield past you, wash him past and turn up on the next color.',
    },
  },
}

/** 4-3 (EVEN). Same four down linemen as the 4-4; the second level is different. */
const vs43: FrontPlan = {
  actions: {
    ...BACKS,
    Y: block('E-L'),
    L: block('B-L'),
    LT: block('M'),
    LG: block('T-L'),
    C: block('T-L'),
    RG: block('T-R'),
    RT: block('T-R'),
    R: block('B-R'),
    X: block('F-R'),
  },
  assignments: {
    Y: {
      rule: '45 outside step — reach the end on you.',
      detail:
        'The end is on your outside shoulder. Playside step at 45, hat across his outside number, turn him in. This block sets the edge for the whole play.',
    },
    LT: {
      rule: '45 outside step — climb to the Mike.',
      detail:
        'Nobody on you and the outside backer belongs to the wing. Step playside at 45, get up on the Mike, and stay with him — he is running sideways with the ball.',
    },
    LG: {
      rule: '45 outside step — reach the man on you.',
      detail:
        'Playside foot first at 45, helmet to his playside number, run your feet toward the sideline. The center is coming over to help.',
    },
    C: {
      rule: '45 outside step — help the playside guard.',
      detail:
        'Nobody on your nose. Step playside into the guard\'s hip and take the down man over if he works back inside.',
    },
    RG: {
      rule: '45 inside step — cut off the man on you.',
      detail: 'Step DOWN inside. Do not let the tackle cross your face and chase the ball.',
    },
    RT: {
      rule: '45 inside step — step down and help the guard.',
      detail:
        'Inside step, every time. Head across the down man, seal the back side, and let the end behind you chase.',
    },
    L: {
      rule: 'Gap to climb — block the outside backer.',
      detail:
        'In a 4-3 the backer on your side is the first man in the alley. Step outside at 45 and get on him before he can run to the sideline.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table (varsity page-12), Stretch Left.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  LT: {
    rule: 'Gap to climb — 45 outside step.',
    detail:
      'Playside foot first, at 45 degrees, every single time. Take the man in your playside gap. If your gap is empty, climb to the first backer.',
  },
  LG: {
    rule: 'Gap to climb — 45 outside step.',
    detail:
      'Same step as the tackle. Covered means reach him: hat across his playside number. Uncovered means step playside into the next man and help before you climb.',
  },
  C: {
    rule: 'Gap to climb — 45 outside step.',
    detail:
      'Playside step at 45. Covered (a nose on you) means reach his playside number and never let him cross your face. Uncovered means step over and help the playside guard.',
  },
  RG: {
    rule: 'Gap to climb — 45 INSIDE step.',
    detail:
      'Back side is an inside step. You step DOWN toward the ball, not out. Take whatever shows in that inside gap and never let a man cross your face to chase.',
  },
  RT: {
    rule: 'Gap to climb — 45 INSIDE step.',
    detail:
      'Inside step, down toward the guard. You do not fan out on the man behind you — he is chasing from behind and he loses. Seal the back side and stay square.',
  },
  Y: {
    rule: 'Playside: gap to climb, 45 outside step. Backside: cutoff.',
    detail:
      'On the play side you reach the first man outside you and turn him in — that sets the edge. On the back side you cut off: step down inside and wall off anything trying to chase.',
  },
  L: {
    rule: 'Playside wing: gap to climb — 45 outside step.',
    detail:
      'Step outside at 45 and block the widest man who can make the tackle in the alley. Some fronts that is a walked-up backer; against a 5-2 it is the corner. Stay on him — this is the block that breaks the play.',
  },
  R: {
    rule: 'Backside wing: cutoff.',
    detail:
      'Climb straight up and cut off the backside backer before he can run the ball down from behind. Take the shortest line to his outside shoulder.',
  },
  S: {
    rule: 'Slow bucket step. Aiming point OUTSIDE the tackle. Key the end man on the line.',
    detail:
      'Bucket step — first step back and away, slow, let the line move. Take the handoff and press flat at a point OUTSIDE the playside tackle. Now read the end man on the line of scrimmage: if he stays wide, bend it up inside him; if he squeezes down, keep going and bounce it around him. One aiming point, two answers.',
  },
  Q: {
    rule: 'Open to the mesh. Work 45 for depth behind the inside leg of the tackle.',
    detail:
      'Open playside and work back at 45 degrees so the mesh happens behind the inside leg of the playside tackle. Deep enough that the back can run flat, ball out early, then get out of his way and carry out your fake.',
  },
  X: {
    rule: 'MDM — block the most dangerous man.',
    detail:
      'Find the deep man who can run this down from your side and go get him. Do not run at him, run to a spot in front of him and stay between him and the football.',
  },
}

const coachNotes = [
  'Super: full speed to the edge, one cut, straight upfield. No dancing.',
  'Linemen: win the race - get your head across to the playside.',
]

const reviewNotes = [
  "Page numbers: HANDOFF.md's map says Stretch is pages 11–12, but the actual JPEGs are off by one here — page-11.jpg is JET, page-12.jpg is the STRETCH main page, page-13.jpg is the STRETCH variants page. This file is transcribed from 12 and 13.",
  "Direction is play identity (RESOLVED, Ryan 2026-08-14): the scan draws Stretch out of our RED alignment running LEFT — to the tight end and wing — so this picture is Stretch LEFT out of Red ('Red, Stretch, Left'). Indy/Hoosier are direction AUDIBLES (Indy = left, Hoosier = right), wired via audibleFlipId; page 13's right-going weak-side picture is now its own play, stretch-right-red. This supersedes the old 'names follow the formation' framing.",
  "Page-13 is NOT a vs-front page. It is six FORMATION variants (Stretch Left/Right, I Stretch Left/Right, Gun Stretch Left/Right) against the same defense. Our package has no I or Gun, so the varsity book gives us the arrows against exactly ONE front.",
  "Correction to an earlier read of page 13: its 'Stretch Right' panel is NOT the mirrored formation. Re-measured, that panel keeps the SAME alignment as 'Stretch Left' (Y and the L wing to the left, R wing right, X split right) and simply runs the ball to the RIGHT — a weak-side stretch out of Red. Under the direction model that panel is a play we DO carry: it is authored in this file as stretch-right-red. Black therefore stays a pure mirror of the corresponding Red play, which is football-correct because all three of our fronts are left/right symmetric, but it is a mirror we derived, not one the book confirms.",
  "Fixed after a literal re-measure of page-12: Super's bend-up arrow is DEAD VERTICAL at about 3.8 yards outside the ball — between the tight end (−4.5) and the playside tackle (−3.0), i.e. right off the tackle's outside shoulder. Our old path pressed all the way out to −5.5 (the wing) and then drifted, which drew a sweep, not a stretch. Path retuned to bucket → mesh at (−2.5, −2.9) → aiming point (−3.8, −1.9) → straight up. Q's mesh was also 0.6 yd too deep and now lands where the scan draws the mesh circle, behind the tackle's inside leg.",
  "Added after the re-measure: page-12 draws two black DOTTED arrows capped with block bars, climbing off the double-teams to the second level. The clear one comes off the playside double-team up to W (our B-L), so LG in the 5-2 plan is now a chained block — down man first, then off to B-L. The second dotted arrow climbs off the nose but is drawn short and lands on no letter (M is already the backside wing's man), so nothing was coded for it here. Page 13's 'Stretch Right' panel draws both climbs landing on backers, and stretch-right-red codes them that way.",
  "The one front the scan draws is an ODD look — three down linemen with a nose head-up on the center, two edge backers, two inside backers. We mapped it onto our 5-2 (drawn E→T-L/T-R, N→N, B→E-L, S→E-R, W→B-L, M→B-R) and the 5-2 plan in this file is a one-for-one copy of the drawn arrows. The 4-4 and 4-3 plans apply the same written rules to those fronts — they are football, not transcription. Please eyeball those two.",
  "Backside wing (R) 'Cutoff': the scan draws his arrow climbing up and over to the backside INSIDE backer (M), and that is what we coded for all three fronts. But the drawn defense's backside edge man (S) is walked out to about +6.3 and 2 yards deep — nobody is tight on R — whereas all three of OUR fronts put a defender right on that edge (E-R at +4.8 / +5.2, only a yard outside the wing). Page 13's weak-side 'Stretch Right' panel is the case that matches ours: there the backside wing has a tight edge defender (B) next to him and he blocks HIM rather than climbing — and stretch-right-red codes its backside wing that way. So on THIS play: R on the backside backer (as coded, literal to the main drawing) or on E-R (matching page 13 and the tighter fronts we actually see)? One-line change per front.",
  "Playside wing (L), measured: his block bar is drawn at about (−7.9, +2.0) — up and OUT, past everybody, but stopping well short of the corner letter at (−9.4, +3.9) and bowing away from the $ safety at (−6.1, +7.6). No defender sits under that bar, so we read it as 'the corner / the man in the alley' and target C-L. Our 5-2 puts C-L a good bit deeper than the drawn bar, so our line to him is longer than the scan's. Flagging rather than guessing at a different target.",
  "Playside wing (L): the scan sends him past everybody to the CORNER, because the drawn front had only one edge defender and the tight end took him. Against our 4-4 he instead takes the walked-up S backer and against our 4-3 the outside backer — the first man in the alley — and the corner goes unblocked. Same rule, different answer per front. Confirm.",
  "S's path: the scan draws TWO arrows off the aiming point — one bending up inside the end man and one bouncing outside him. The data can only carry one carry path, so the diagram shows the BEND-UP and the 'or bounce it' lives in his assignment text. Say the word if you'd rather see the bounce drawn.",
  "Q: the scan's quarterback line stops at the mesh — no boot fake is drawn on the Stretch page (Jet and Rocket both say 'carry out boot fake', Stretch's table does not). We drew it literally, stopping at the mesh, and put 'carry out your fake' in the coaching detail. Waggle is the play that punishes a defense for chasing that fake, so you may want it drawn.",
  "RG vs the 4-4 and 4-3: 'gap to climb, 45 INSIDE step' with a tackle head-up on him resolves to cutting that man off, which is what we coded. The RT then also steps down onto that same man rather than fanning out to the end behind him — that is the backside rule you called out on Veer, applied here. Confirm the double is what you want, or tell us where the tackle should end up instead.",
]

export const stretchLeftRed: Play = {
  id: 'stretch-left-red',
  name: 'Stretch',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Stretch', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'left',
  ballCarrier: 'S',
  formationTwinId: 'stretch-left-black',
  audibleFlipId: 'stretch-right-red',
  summary: 'Direct handoff to Super, who runs outside the tackle.',
  description:
    'Outside zone at the tight end and wing. Everybody up front takes a 45-degree step to the play side and runs the defense sideways; Super takes a slow bucket step, aims OUTSIDE the playside tackle, and reads the end man on the line — bend it up inside him or bounce it around him. We are not blocking a hole, we are moving a wall and letting the back pick the crack.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes,
}

// ---------------------------------------------------------------------------
// STRETCH RIGHT out of RED — the weak-side stretch, hand-authored 2026-08-14
// from page-13's "Stretch Right" panel.
//
// That panel keeps the exact Red alignment (Y and the L wing left, R wing
// right, X split right) and runs the ball RIGHT. The zone roles translate but
// the PLAYERS filling them change, which is why this is not a mirror:
//   PST = RT · PSG = RG · C = C · BSG = LG · BST = LT
//   PSW = R · BSW = L · Y = BACKSIDE tight end (cutoff) · X = playside split
//   end, still the "WR / MDM" row · S = ball carrier · Q = quarterback
//
// ARROWS AS DRAWN on the page-13 panel (same odd defense as page-12):
//   C    reaches playside, bar ON the nose
//   RG   works playside to the E over the tackle (combo); a dotted climb with
//        a bar comes off that combo and LANDS ON M (playside inside backer)
//   RT   on the E with the guard; a dotted climb off the nose lands on W
//   LG/LT step DOWN inside — cutoff strokes with arrowheads, no fan-out
//   Y    red arrow up and INSIDE, open arrowhead, no bar — a cutoff scramble
//   L    red stroke to a bar ON the tight backside edge man (their B)
//   R    red arc out at 45, bar ON the walked-up playside edge man (their S)
//   X    long line working back INSIDE to a bar on the deep safety (MDM)
//   S    bucket, mesh behind RT's inside leg, DEAD-VERTICAL bend-up just
//        outside RT — the exact mirror of page-12's measured geometry
//   Q    opens right to the same mesh spot
// ---------------------------------------------------------------------------

/** S: the page-12 measured path, mirrored — page-13's panel draws the same. */
const S_STRETCH_RIGHT: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -0.3, y: -4.9 },
      { x: 1.2, y: -3.9 },
      { x: 2.5, y: -2.9 },
      { x: 3.8, y: -1.9 },
      { x: 3.8, y: 0.6 },
      { x: 3.8, y: 3.2 },
    ],
  },
]

/** Q: open right, mesh behind the inside leg of the playside tackle (RT). */
const Q_MESH_RIGHT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 1.3, y: -2.1 },
      { x: 2.5, y: -2.9 },
    ],
  },
]

/**
 * Y backside cutoff: page-13 draws him scrambling up and INSIDE with an open
 * arrowhead on no particular man. Coded as a path-capped block (bar ~2.3 yd)
 * walling off the inside chase behind LT's cutoff.
 */
const Y_CUTOFF: Action[] = [
  {
    kind: 'block',
    path: [
      { x: -4.1, y: 0.6 },
      { x: -3.5, y: 1.5 },
      { x: -3.1, y: 2.3 },
    ],
  },
]

const BACKS_RIGHT = {
  S: S_STRETCH_RIGHT,
  Q: Q_MESH_RIGHT,
  Y: Y_CUTOFF,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Stretch Right front plans. Playside is RIGHT; Y and L are backside.
// ---------------------------------------------------------------------------

/**
 * 5-2 (ODD) — the closest of our fronts to the defense page-13 draws, so this
 * plan follows the panel's arrows most directly: C reaches the nose, RT/RG
 * combo the tackle with RG climbing to the playside backer (the drawn climb
 * onto M), LG scoops the nose and climbs to the backside backer (the drawn
 * climb onto W), LT cuts off, and the R wing bars the playside edge man.
 */
const vs52Right: FrontPlan = {
  actions: {
    ...BACKS_RIGHT,
    L: block('E-L'),
    LT: block('T-L'),
    LG: [...block('N'), ...block('B-L')],
    C: block('N'),
    RG: [...block('T-R'), ...block('B-R')],
    RT: block('T-R'),
    R: block('E-R'),
    X: block('F-R'),
  },
  assignments: {
    RT: {
      rule: '45 outside step — reach the man on you.',
      detail:
        'The tackle is head up on you in a 5-2. Playside foot first at 45 degrees, get your hat across his playside number and run your feet. The guard is coming to help.',
    },
    RG: {
      rule: '45 outside step — combo the down man, then climb to the backer.',
      detail:
        'Nobody on you. Step playside at 45 and put your inside hand on the down man the tackle is reaching. Stay on him until the tackle owns him, then come off flat for the inside backer — he is the one who fills this play.',
    },
    C: {
      rule: '45 outside step — reach the nose.',
      detail:
        'Odd front: the nose is head up on you. Playside step, get your helmet to his playside number and do not let him cross your face. The backside guard is scooping behind you.',
    },
    LG: {
      rule: '45 inside step — scoop the nose with C, then climb.',
      detail:
        'Step inside at 45 and get your shoulder into the nose. Once the center owns him, come off flat to the backside backer — cut off the man who chases this down from behind.',
    },
    LT: {
      rule: '45 inside step — cut off the man on you.',
      detail:
        'Step DOWN inside, not out. Get your head across his playside shoulder and wall him off. You never fan out on him — nothing chases us from behind.',
    },
    R: {
      rule: 'Gap to climb — reach the end on the edge.',
      detail:
        'With no tight end on your side, the end on the line is the edge. Step outside at 45, hat across his outside number, and turn him in — Super bends up inside your block or bounces off it.',
    },
    L: {
      rule: 'Backside wing: cutoff — bar the end next to you.',
      detail:
        'The end on the line is right on your inside. Step down and wall him off so nothing chases the play from behind.',
    },
    Y: {
      rule: 'Backside: cutoff.',
      detail:
        'Step down inside and wall off anything trying to chase. You and the wing seal the back door together.',
    },
    X: {
      rule: 'MDM — block the near safety.',
      detail:
        'You are on the play side now, but your job is still the most dangerous man: work back inside and get in front of the safety on your side.',
    },
  },
}

/**
 * 4-4 (EVEN) — the drawn rules applied to the 4-4: RT reaches the end in his
 * playside gap, RG reaches the tackle on him, C helps on that combo and
 * climbs to the playside backer, the R wing takes the walked-up force man,
 * and the back side steps down (LG cuts off, LT helps, Y and L seal).
 */
const vs44Right: FrontPlan = {
  actions: {
    ...BACKS_RIGHT,
    L: block('E-L'),
    LT: block('T-L'),
    LG: block('T-L'),
    C: [...block('T-R'), ...block('B-R')],
    RG: block('T-R'),
    RT: block('E-R'),
    R: block('O-R'),
    X: block('F'),
  },
  assignments: {
    RT: {
      rule: '45 outside step — reach the end in your gap.',
      detail:
        'No tight end on your side, so the end sits in your playside gap. Step outside at 45, get your hat across his inside number, and run him wide — Super reads your block.',
    },
    RG: {
      rule: '45 outside step — reach the man on you.',
      detail:
        'The tackle is head up. Playside foot first, get your helmet to his playside number and run him toward the sideline. The center is stepping over to help.',
    },
    C: {
      rule: '45 outside step — help the playside guard, then climb.',
      detail:
        'Even front, nobody on your nose. Step playside at 45 into the guard\'s hip, and once he owns the down man come off for the playside backer — he is the one who fills.',
    },
    LG: {
      rule: '45 inside step — cut off the man on you.',
      detail:
        'Step DOWN inside at 45. Do not let the tackle cross your face into the hole. If he slants away, ride him and stay square.',
    },
    LT: {
      rule: '45 inside step — step down and help the guard.',
      detail:
        'Backside rule is inside step, always. You go DOWN toward the guard, not out on the end behind you. Get your head across the down man and seal the back side.',
    },
    R: {
      rule: 'Gap to climb — block the force man.',
      detail:
        'In a 4-4 the walked-up backer outside is the force man. Step outside at 45 and get on him. If he runs upfield past you, wash him past and turn up on the next color.',
    },
    L: {
      rule: 'Backside wing: cutoff — bar the end next to you.',
      detail:
        'The end on the line is right on your inside. Step down and wall him off so nothing chases the play from behind.',
    },
    Y: {
      rule: 'Backside: cutoff.',
      detail:
        'Step down inside and wall off anything trying to chase. You and the wing seal the back door together.',
    },
    X: {
      rule: 'MDM — block the free safety.',
      detail:
        'Single high safety. Work back inside, get to a spot in front of him, and stay between him and the football.',
    },
  },
}

/** 4-3 (EVEN). Same down linemen as the 4-4; C climbs to the Mike instead. */
const vs43Right: FrontPlan = {
  actions: {
    ...BACKS_RIGHT,
    L: block('E-L'),
    LT: block('T-L'),
    LG: block('T-L'),
    C: [...block('T-R'), ...block('M')],
    RG: block('T-R'),
    RT: block('E-R'),
    R: block('B-R'),
    X: block('F-R'),
  },
  assignments: {
    RT: {
      rule: '45 outside step — reach the end in your gap.',
      detail:
        'The end sits in your playside gap with no tight end out there. Step outside at 45, hat across his inside number, run him wide.',
    },
    RG: {
      rule: '45 outside step — reach the man on you.',
      detail:
        'Playside foot first at 45, helmet to his playside number, run your feet toward the sideline. The center is coming over to help.',
    },
    C: {
      rule: '45 outside step — help the playside guard, then climb to the Mike.',
      detail:
        'Nobody on your nose. Step playside into the guard\'s hip, and once he owns the down man come off for the Mike — he is running sideways with the ball.',
    },
    LG: {
      rule: '45 inside step — cut off the man on you.',
      detail: 'Step DOWN inside. Do not let the tackle cross your face and chase the ball.',
    },
    LT: {
      rule: '45 inside step — step down and help the guard.',
      detail:
        'Inside step, every time. Head across the down man, seal the back side, and let the end behind you chase.',
    },
    R: {
      rule: 'Gap to climb — block the outside backer.',
      detail:
        'In a 4-3 the backer on your side is the first man in the alley. Step outside at 45 and get on him before he can run to the sideline.',
    },
    L: {
      rule: 'Backside wing: cutoff — bar the end next to you.',
      detail:
        'The end on the line is right on your inside. Step down and wall him off so nothing chases the play from behind.',
    },
    Y: {
      rule: 'Backside: cutoff.',
      detail:
        'Step down inside and wall off anything trying to chase. You and the wing seal the back door together.',
    },
    X: {
      rule: 'MDM — block the near safety.',
      detail:
        'Work back inside and get in front of the safety on your side — he is the most dangerous man once the ball turns up.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for STRETCH RIGHT.
// ---------------------------------------------------------------------------

const assignmentsRight: Record<OffPosId, Assignment> = {
  RT: {
    rule: 'Gap to climb — 45 outside step.',
    detail:
      'Playside foot first, at 45 degrees, every single time. Take the man in your playside gap. If your gap is empty, climb to the first backer.',
  },
  RG: {
    rule: 'Gap to climb — 45 outside step.',
    detail:
      'Same step as the tackle. Covered means reach him: hat across his playside number. Uncovered means step playside into the next man and help before you climb.',
  },
  C: {
    rule: 'Gap to climb — 45 outside step.',
    detail:
      'Playside step at 45. Covered (a nose on you) means reach his playside number and never let him cross your face. Uncovered means step over and help the playside guard.',
  },
  LG: {
    rule: 'Gap to climb — 45 INSIDE step.',
    detail:
      'Back side is an inside step. You step DOWN toward the ball, not out. Take whatever shows in that inside gap and never let a man cross your face to chase.',
  },
  LT: {
    rule: 'Gap to climb — 45 INSIDE step.',
    detail:
      'Inside step, down toward the guard. You do not fan out on the man behind you — he is chasing from behind and he loses. Seal the back side and stay square.',
  },
  Y: {
    rule: 'Backside: cutoff. (Playside: gap to climb, 45 outside step.)',
    detail:
      'The play runs away from you on this one. Cut off: step down inside and wall off anything trying to chase. If the play ever comes your way, you reach the first man outside you and turn him in.',
  },
  R: {
    rule: 'Playside wing: gap to climb — 45 outside step.',
    detail:
      'Step outside at 45 and block the widest man who can make the tackle in the alley. Some fronts that is a walked-up backer; against a 5-2 it is the end on the line. Stay on him — this is the block that breaks the play.',
  },
  L: {
    rule: 'Backside wing: cutoff.',
    detail:
      'Step down and bar the edge man next to you before he can chase the play from behind. Nothing crosses your face.',
  },
  S: {
    rule: 'Slow bucket step. Aiming point OUTSIDE the tackle. Key the end man on the line.',
    detail:
      'Bucket step — first step back and away, slow, let the line move. Take the handoff and press flat at a point OUTSIDE the playside tackle. Now read the end man on the line of scrimmage: if he stays wide, bend it up inside him; if he squeezes down, keep going and bounce it around him. One aiming point, two answers.',
  },
  Q: {
    rule: 'Open to the mesh. Work 45 for depth behind the inside leg of the tackle.',
    detail:
      'Open playside and work back at 45 degrees so the mesh happens behind the inside leg of the playside tackle. Deep enough that the back can run flat, ball out early, then get out of his way and carry out your fake.',
  },
  X: {
    rule: 'MDM — block the most dangerous man.',
    detail:
      'You are on the play side this time, but the job is the same: find the deep man who can run this down and go get him. Run to a spot in front of him and stay between him and the football.',
  },
}

const reviewNotesRight = [
  "NEW PICTURE (2026-08-14) — NEEDS COACH RYAN'S CHECK. This is page-13's 'Stretch Right' panel modeled as its own play: the SAME Red alignment (Y and the L wing left, R wing right, X split right) with the ball run RIGHT — the weak/split-end-side stretch. It is NOT a mirror of Stretch Left out of Red (mirroring that gives Black-Right); the zone roles translate but the players filling them change because Y is backside. Authored from the panel's arrows plus the varsity table's playside/backside rules; every judgment call is listed below.",
  "Indy/Hoosier are direction AUDIBLES (Ryan, 2026-08-14): Indy = left, Hoosier = right, yelled at the line. 'Red, Stretch, Left' + 'HOOSIER HOOSIER' becomes THIS play. Wired via audibleFlipId; the words live in DIRECTION_AUDIBLES (app/utils/playbook.ts).",
  "JUDGMENT CALL — backside edge: the panel bars the backside WING on the tight edge man next to him (their B) and scrambles Y up-and-inside with an open arrowhead on nobody. Coded exactly that way in all three fronts: L blocks E-L, Y is a path-only cutoff bar (~2.3 yd) sealing the inside chase. That settles for this play the question flagged on Stretch Left (wing on the backer vs wing on the tight edge man) in favor of the edge man.",
  "JUDGMENT CALL — the backside inside backer (B-L / Will) is UNBLOCKED in the 4-4 and 4-3: with L on the edge man and Y sealing inside, nobody climbs to him; he has to chase the stretch from behind through the cutoffs. Only the 5-2 covers him, because there LG comes off the nose scoop — the panel's dotted climb onto W. If you want an even-front body on him, the candidates are Y (climb instead of seal) or the L wing (the old Stretch Left coding).",
  "JUDGMENT CALL — second-level climbs: page-13 lands BOTH dotted climbs on backers (off the nose combo onto W, off the E combo onto M), where page-12 left the nose climb hanging. Coded as chained blocks: the playside combo climber is C in the even fronts (RT is busy with the end in his gap) but RG in the 5-2 (matching the drawn RG-to-M climb); the nose-scoop climber is LG, 5-2 only. Confirm who you want coming off each combo.",
  "JUDGMENT CALL — playside surface with no tight end: RT's 'gap to climb' reach lands on the C-gap end E-R in the even fronts and on the head-up T-R in the 5-2. The R wing's man per front: the walked-up force man O-R (4-4), the Sam B-R (4-3), and in the 5-2 the END E-R — the panel bars the wing on the walked-up playside edge man, so R reaches the end instead of climbing to the corner the way the L wing does on Stretch Left. That leaves the playside CORNER unblocked in every front here. Confirm, especially the 5-2 (wing on the end vs wing to the corner with the end as Super's unblocked read).",
  "JUDGMENT CALL — X plays MDM even though he is playside: the panel's stroke works back INSIDE to a bar on the deep safety, not out to the corner. Coded F (4-4) / F-R (4-3, 5-2). If you'd rather have X stalk the corner and let the wing's man be the alley, that's a one-line change per front.",
  "S's key: 'end man on LOS' — in these plans that man is blocked (RT's reach in the even fronts, R's reach in the 5-2), so the read is off the BLOCK: bend up inside it if the end runs wide, bounce outside if he squeezes. The drawn panel shows only the bend-up (dead vertical just outside RT); the bounce lives in the assignment text, same convention as Stretch Left.",
  "Geometry: S's bucket/mesh/bend-up and Q's mesh path are the exact x-negations of the page-12 measured paths — page-13's panel draws the same picture on the right (mesh behind RT's inside leg, vertical bend-up at about +3.8, between RT and the wing). Y's cutoff stroke is newly drawn; L, and all line blocks are targeted blocks like the rest of this file.",
  "Unblocked defenders, by front — 4-4: B-L, O-L, both corners; 4-3: B-L, C-L, C-R, F-L; 5-2: E-R is covered but C-L, C-R, F-L are not. None are listed in `ignored` because Stretch has no option to 'handle' them — they are simply men the zone outruns. Say the word if you want dashed rings on any of them.",
]

export const stretchRightRed: Play = {
  id: 'stretch-right-red',
  name: 'Stretch',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Stretch', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'S',
  formationTwinId: 'stretch-right-black',
  audibleFlipId: 'stretch-left-red',
  summary: 'Direct handoff to Super, who runs outside the tackle.',
  description:
    'Outside zone away from the tight end — the weak-side stretch. Same 45-degree steps, same slow bucket step and mesh, but the split-end side has fewer bodies: the right wing sets the edge, X works back to the safety, and Y and the left wing cut off the chase. Super still aims outside the playside tackle and reads the end man — bend it up or bounce it.',
  assignments: assignmentsRight,
  vs: { '44': vs44Right, '43': vs43Right, '52': vs52Right } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes: reviewNotesRight,
}

/**
 * Stretch Right out of BLACK — the mirror of Stretch Left out of Red. Black
 * flips Y and the L wing to the right, so right out of Black is the
 * strong-side picture: mirrorPlay flips every stroke, swaps LT↔RT/LG↔RG/L↔R
 * and the -L/-R defender ids, and re-keys the assignments onto the mirrored
 * players. Everything on stretchLeftRed's review list applies here mirrored.
 */
export const stretchRightBlack: Play = mirrorPlay(stretchLeftRed, {
  id: 'stretch-right-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Stretch', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  formationTwinId: 'stretch-right-red',
  audibleFlipId: 'stretch-left-black',
  description:
    'Stretch to the right out of Black — at the tight end and wing, since Black flips them to the right. Same 45-degree steps, same bucket step, same read on the end man — other side of the ball. R is the playside wing now and L is the one cutting off the back side.',
  reviewNotes: [
    ...reviewNotes,
    'Stretch Right out of Black is generated by mirroring Stretch Left out of Red (app/utils/mirror.ts) with no hand corrections. The varsity book has no drawing of this picture — page-13\'s "Stretch Right" is the Red alignment run weak, which is stretch-right-red — so Black rests on the fronts being symmetric. If any of the Red-left answers above change, this play changes with it automatically.',
  ],
})

/**
 * Stretch Left out of BLACK — the mirror of Stretch Right out of Red: the
 * weak-side stretch flipped, since Black puts the split end left. Y and the
 * R wing cut off the back side, L is the playside wing, X — split left —
 * still plays MDM. Everything on stretchRightRed's review list applies here
 * mirrored.
 */
export const stretchLeftBlack: Play = mirrorPlay(stretchRightRed, {
  id: 'stretch-left-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Stretch', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  formationTwinId: 'stretch-left-red',
  audibleFlipId: 'stretch-right-black',
  description:
    'Stretch to the left out of Black — away from the tight end, the weak-side picture flipped. The left wing sets the edge, X works back to the safety from his split-left spot, and Y and the right wing cut off the chase.',
  reviewNotes: [
    ...reviewNotesRight,
    'Stretch Left out of Black is generated by mirroring Stretch Right out of Red (app/utils/mirror.ts) with no hand corrections — Black is drawn on page 1 as Red\'s exact mirror. If any of the Red-right answers above change, this play changes with it automatically.',
  ],
})

export const stretchPlays: Play[] = [stretchRightRed, stretchRightBlack, stretchLeftRed, stretchLeftBlack]
