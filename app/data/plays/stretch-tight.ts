/**
 * STRETCH out of TIGHT — the outside-zone family run from the 2-tight-end set
 * (app/data/tight-formation.ts). Hand-authored 2026-08-15.
 *
 * WHERE THE PICTURE COMES FROM. Tight is Red with the split end brought all
 * the way home, so it hands us two surfaces the Stretch family has already
 * drawn, one on each side:
 *   - the PLAYSIDE of Stretch Left out of Red (app/data/plays/stretch.ts,
 *     hand-authored off varsity page-12): Y on the line at −4.5, the L wing at
 *     (−5.7, −1). Tight puts those two men on exactly those spots, so every
 *     playside stroke, target and coaching point carries over verbatim —
 *     including S's measured bucket/mesh/bend-up and Q's mesh, because Super
 *     (0, −4.5) and the quarterback (0, −1.3) also stand where Red puts them.
 *   - the BACKSIDE of Stretch Right out of Red (page-13's "Stretch Right"
 *     panel), mirrored. That panel's backside is a tight end at −4.5 with a
 *     wing at −5.7 — the exact mirror of Tight's backside here (X at +4.5,
 *     R at +5.7). So the backside is the panel's answer flipped: the wing bars
 *     the edge man next to him and the tight end scrambles up and inside on a
 *     cutoff, sealing the back door together.
 *
 * WHAT TIGHT CHANGES. Red's Stretch has a split end playing MDM — "find the
 * deep man who can run this down and go get him". Tight has no split end: X is
 * the RIGHT TIGHT END, on the line at +4.5 (Ryan, 2026-08-15: "X" is
 * wide-receiver vernacular, but aligned like this he is technically a tight
 * end and gets a tight end's job, never a split end's). So the MDM row is gone
 * and X takes the backside tight end's CUTOFF the family already teaches —
 * the same trade veer-tight-right/left made when the split end's "work to the
 * safety" job became the second tight end's Rip. Nobody blocks a safety on
 * this play in this set; see the review notes.
 *
 * Roles, Tight LEFT (the hand-authored direction):
 *   PST = LT · PSG = LG · C = C · BSG = RG · BST = RT
 *   PSW = L (playside wing) · BSW = R (backside wing, bars the edge man)
 *   Y = PLAYSIDE tight end · X = BACKSIDE tight end (cutoff)
 *   S = ball carrier · Q = quarterback
 *
 * Direction is play identity; Indy (left) / Hoosier (right) are line audibles,
 * wired through `audibleFlipId`. Tight is a balanced set that mirrors onto
 * itself, so — exactly like the Split Wide and Veer-Tight pairs — there is NO
 * `formationTwinId`: a 1×2 left/right pair, not a 2×2 square.
 *
 * The RIGHT-hand play is GENERATED: mirrorPlay plus the X↔Y exchange a
 * balanced one-formation set requires (see `mirrorTightPlay` below and the
 * same helper in app/data/plays/split-wide.ts). The mirror was eyeballed
 * stroke by stroke and is football-correct here: Tight is exactly symmetric
 * and all three of our fronts are left/right symmetric.
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
// Skill actions — identical against all three fronts.
// ---------------------------------------------------------------------------

/**
 * S: the page-12 measured path, verbatim. Slow bucket step back and away,
 * through the mesh at (−2.5, −2.9), to an aiming point OUTSIDE the playside
 * tackle — x = −3.8, between LT (−3.0) and Y (−4.5). Then the dead-vertical
 * BEND-UP the scan draws. The scan's second arrow (bounce outside the end man)
 * lives in his assignment text, same convention as the rest of the family.
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

/**
 * X on the backside cutoff — the second tight end is what Tight buys us back
 * here. Up and INSIDE, bar around 2.3 yards, walling off the inside chase
 * behind RT's step-down. This is stretch-right-red's hand-authored Y cutoff
 * stroke (the page-13 panel's red scramble arrow) mirrored onto +x, at the
 * identical alignment.
 */
const X_CUTOFF: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 4.1, y: 0.6 },
      { x: 3.5, y: 1.5 },
      { x: 3.1, y: 2.3 },
    ],
  },
]

const SKILL = {
  S: S_STRETCH,
  Q: Q_MESH,
  X: X_CUTOFF,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Front plans. Playside is LEFT: Y and the L wing. Backside is RT, X and R.
// ---------------------------------------------------------------------------

/**
 * 5-2 (ODD) — the front the varsity scan itself draws, so the playside here is
 * a one-for-one copy of page-12's arrows: LT reaches the head-up tackle, LG
 * combos and climbs to the playside backer, C reaches the nose, the wing goes
 * all the way to the corner. The backside follows page-13's panel mirrored:
 * RG scoops the nose with C and then climbs off it to the backside backer (the
 * panel's second dotted climb, which page-12 left hanging), RT cuts off, the R
 * wing bars the end next to him, and X seals inside.
 */
const vs52: FrontPlan = {
  actions: {
    ...SKILL,
    Y: block('E-L'),
    L: block('C-L'),
    LT: block('T-L'),
    LG: [...block('T-L'), ...block('B-L')],
    C: block('N'),
    RG: [...block('N'), ...block('B-R')],
    RT: block('T-R'),
    R: block('E-R'),
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
      rule: '45 inside step — scoop the nose with C, then climb.',
      detail:
        'Step inside at 45 and get your shoulder into the nose. Once the center owns him, come off flat to the backside backer — he is the man who chases this down from behind.',
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
    R: {
      rule: 'Backside wing: cutoff — bar the end next to you.',
      detail:
        'The end on the line is right on your inside. Step down and wall him off so nothing chases the play from behind.',
    },
    X: {
      rule: 'Backside tight end: cutoff.',
      detail:
        'You are the back-side tight end in this set — not a receiver, and there is nobody to run out and cover. Step down inside and wall off anything trying to chase. You and the wing seal the back door together.',
    },
  },
}

/**
 * 4-4 (EVEN). The scan has no vs-front pages for Stretch, so this plan applies
 * the drawn rules to the 4-4: reach playside, the back side steps DOWN inside,
 * the playside wing takes the widest force man, and the backside tight end and
 * wing seal — the wing on the end in his gap, X inside him.
 */
const vs44: FrontPlan = {
  actions: {
    ...SKILL,
    Y: block('E-L'),
    L: block('O-L'),
    LT: block('B-L'),
    LG: block('T-L'),
    C: block('T-L'),
    RG: block('T-R'),
    RT: block('T-R'),
    R: block('E-R'),
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
    R: {
      rule: 'Backside wing: cutoff — bar the end next to you.',
      detail:
        'The end sits in the gap right on your inside. Step down and wall him off so nothing chases the play from behind.',
    },
    X: {
      rule: 'Backside tight end: cutoff.',
      detail:
        'Step down inside and wall off anything trying to chase. You and the wing seal the back door together — this side of the ball never fans out.',
    },
  },
}

/** 4-3 (EVEN). Same four down linemen as the 4-4; the second level differs. */
const vs43: FrontPlan = {
  actions: {
    ...SKILL,
    Y: block('E-L'),
    L: block('B-L'),
    LT: block('M'),
    LG: block('T-L'),
    C: block('T-L'),
    RG: block('T-R'),
    RT: block('T-R'),
    R: block('E-R'),
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
    R: {
      rule: 'Backside wing: cutoff — bar the end next to you.',
      detail:
        'The end on the line is right on your inside. Step down and wall him off so nothing chases the play from behind.',
    },
    X: {
      rule: 'Backside tight end: cutoff.',
      detail:
        'Step down inside and wall off anything trying to chase. You and the wing seal the back door together.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table (varsity page-12's rows), with the
// roles resolved for STRETCH LEFT out of Tight.
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
    rule: 'Playside tight end: gap to climb — 45 outside step.',
    detail:
      'The play comes right at you. Reach the first man outside you and turn him in — that sets the edge, and Super bends up inside your block or bounces around it.',
  },
  X: {
    rule: 'Backside tight end: cutoff.',
    detail:
      'In this set you are a tight end, not a receiver — you are on the line next to the tackle and the play runs away from you. Cut off: step down inside and wall off anything trying to chase. (If the play ever comes your way, you reach the first man outside you and turn him in.)',
  },
  L: {
    rule: 'Playside wing: gap to climb — 45 outside step.',
    detail:
      'Step outside at 45 and block the widest man who can make the tackle in the alley. Some fronts that is a walked-up backer; against a 5-2 it is the corner. Stay on him — this is the block that breaks the play.',
  },
  R: {
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
}

const reviewNotes = [
  "NEW PICTURE (2026-08-15) — NEEDS COACH RYAN'S CHECK. Stretch out of Tight is built from two already-hand-authored halves: the PLAYSIDE of Stretch Left out of Red (varsity page-12, and Tight puts Y at −4.5 and the L wing at (−5.7, −1) exactly where Red does, so every playside stroke, target and coaching point carries over verbatim), and the BACKSIDE of Stretch Right out of Red (page-13's panel) mirrored, because that panel's backside surface — tight end at −4.5, wing at −5.7 — is the exact mirror of Tight's backside here. Nothing on the playside is new football; the backside is the page-13 answer flipped.",
  'BALANCED SET, NO TWIN: Tight mirrors onto itself, so — like Split Wide and the Veer-Tight pair — there is no formationTwinId. stretch-left-tight and stretch-right-tight are a 1×2 left/right pair linked by audibleFlipId (Indy = left, Hoosier = right, yelled at the line; the words live in DIRECTION_AUDIBLES, app/utils/playbook.ts).',
  "THE ONE REAL CHANGE — X is a tight end here, not a split end. Red's Stretch gives the split end the 'WR / MDM' row: find the deep man and block him. Tight has nobody split, and per your 2026-08-15 ruling X aligned at +4.5 is technically a TIGHT END and gets a tight end's job. So he takes the backside cutoff the family already teaches — the same trade Veer out of Tight made (split end's 'work to the safety' → second tight end's Rip). His stroke is stretch-right-red's hand-authored Y cutoff scramble (up and inside, bar at ~2.3 yards) mirrored onto +x at the identical alignment.",
  'CONSEQUENCE OF THAT TRADE — NOBODY PLAYS MDM. With no split end, no safety gets blocked on any front. On the Red version the split end was the only man who ever ran at one. What Tight buys instead is a second body sealing the back side, which is why the cutback is cleaner and the chase is slower. Confirm you are happy trading the MDM block for the extra seal, or tell us who should climb to the safety (the backside wing is the only candidate who is not already busy).',
  "JUDGMENT CALL — backside wing on the EDGE MAN, not the backer. Stretch Left out of Red sends the backside wing climbing to the backside inside backer (B-R), and its review list flags the alternative: bar the tight edge man instead, which is what page-13's panel actually draws when the backside has a tight end and a wing on it. Tight's backside IS that surface, so this file follows page 13: R bars E-R in all three fronts, X seals inside him. That is the same answer stretch-right-red shipped.",
  'JUDGMENT CALL — the backside inside backer (B-R) is UNBLOCKED in the 4-4 and 4-3. With R on the edge man and X sealing inside, nobody climbs to him; he has to chase the stretch from behind through two cutoffs. Only the 5-2 covers him, because there RG comes off the nose scoop onto him — page-13\'s second dotted climb. Identical to the hole stretch-right-red left, and the fixes are the same: X climbs instead of sealing, or the wing goes back to the backer.',
  "JUDGMENT CALL — second-level climbs in the 5-2 are chained blocks, both of them: LG combos the down man with LT and climbs to B-L (page-12's clear dotted climb), RG scoops the nose with C and climbs to B-R (the climb page-12 draws short and leaves hanging, which page-13 lands). Confirm you want both, especially RG's — page-12 alone would leave him plain on the nose.",
  "Playside wing (L) per front, inherited unchanged from Stretch Left out of Red: the corner (C-L) vs the 5-2, the walked-up force man (O-L) vs the 4-4, the outside backer (B-L) vs the 4-3. Same rule, different answer per front — and against the even fronts the playside corner goes unblocked. That was already on the Red review list; it rides along here.",
  "S's path and Q's mesh are page-12's MEASURED geometry, unchanged: bucket → mesh at (−2.5, −2.9), aiming point (−3.8, −1.9) between LT and Y, then dead vertical. The diagram can only carry one carry path, so it shows the BEND-UP and the 'or bounce it around him' lives in S's assignment text — same convention as the rest of the family. Q's line stops at the mesh; no boot fake is drawn on any Stretch page.",
  'GENERATED SIBLING: Stretch Right out of Tight is mirrorTightPlay(stretchLeftTight) — mirrorPlay plus the X↔Y exchange this balanced set requires (Split Wide hit the same bug: plain mirrorPlay leaves X and Y keyed where they are, which strands the playside tight end\'s reach on the man standing backside). The mirror was checked stroke by stroke: Tight is exactly symmetric and all three fronts are left/right symmetric, so no hand corrections were needed. Review the left play and you have reviewed the right one.',
  'Unblocked defenders, by front — 4-4: B-R, O-R, both corners; 4-3: B-R, C-L, C-R and both safeties; 5-2: C-L, C-R and both safeties. None are listed in `ignored` because Stretch has no option to "handle" them — they are men the zone outruns. Say the word if you want dashed rings on any of them.',
]

export const stretchLeftTight: Play = {
  id: 'stretch-left-tight',
  name: 'Stretch',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Stretch', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'tight',
  direction: 'left',
  ballCarrier: 'S',
  audibleFlipId: 'stretch-right-tight',
  summary: 'Direct handoff to Super, who runs outside the tackle.',
  description:
    'Outside zone to the left out of the two-tight-end set. Everybody up front takes a 45-degree step to the play side and runs the defense sideways; Super takes a slow bucket step, aims OUTSIDE the playside tackle, and reads the end man — bend it up inside him or bounce it around him. Tight gives this play a tight end on BOTH edges: Y and the left wing set the edge we are running to, and X and the right wing seal the back door behind us, so the cutback is real and nothing catches us from behind.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}

/**
 * STRETCH RIGHT out of TIGHT — the mirror of the play above, and nothing more.
 * Tight is drawn exactly balanced and all three fronts are left/right
 * symmetric, so this is one mirrorTightPlay() call: every stroke flips, LT↔RT /
 * LG↔RG / L↔R and the -L/-R defender ids swap, and the X↔Y entries trade
 * places because in this one balanced set they are mirror-image positions that
 * keep their spots. X becomes the playside tight end reaching the end, Y the
 * backside tight end sealing inside.
 */
export const stretchRightTight: Play = mirrorTightPlay(stretchLeftTight, {
  id: 'stretch-right-tight',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Stretch', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  audibleFlipId: 'stretch-left-tight',
  description:
    'Outside zone to the right out of the two-tight-end set — the same play, other side of the ball. X and the right wing set the edge we are running to, Y and the left wing seal the back door, and Super still buckets, aims outside the playside tackle, and reads the end man: bend it up or bounce it.',
  reviewNotes: [
    ...reviewNotes,
    'GENERATED: this play is mirrorTightPlay(stretchLeftTight) with no hand corrections — the mirror plus the X↔Y exchange. Every judgment call above applies here with left and right swapped: X reaches the end and the right wing takes the corner / force man / outside backer, while Y and the left wing cut off, and the unblocked backside backer in the even fronts is B-L.',
  ],
})

export const stretchTightPlays: Play[] = [stretchRightTight, stretchLeftTight]
