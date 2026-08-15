/**
 * VEER — varsity page 5 (main diagram + assignment table) and page 6
 * (vs Even / vs Odd, both directions).
 *
 * THE CALL MODEL (Ryan, 2026-08-14 — supersedes the 2026-08-13 note):
 *   - Direction is play identity: Veer Right and Veer Left are two plays.
 *   - Formation (Red/Black) is ORTHOGONAL — each direction runs out of either.
 *   - "Indy" and "Hoosier" are AUDIBLES yelled at the line, not play names:
 *     Indy = the play now goes LEFT, Hoosier = RIGHT. Huddle: "Red, Veer
 *     Right"; QB sees the safety cheating right, yells "INDY INDY" → the play
 *     becomes Veer Left out of Red — same formation, flipped direction.
 *   That wiring lives on each play as `audibleFlipId` (same formation,
 *   opposite direction) and `formationTwinId` (same direction, other
 *   formation), with the audible words in `DIRECTION_AUDIBLES`
 *   (app/utils/playbook.ts).
 *
 * FOUR plays, two hand-authored pictures:
 *   - veerRightRed  — hand-authored from the scans. Playside surface is the
 *     wing-only right side. Roles: PST=RT · PSG=RG · BSG=LG · BST=LT ·
 *     PSW=R · pitch man=L · Y=backside TE · X=playside split end.
 *   - veerLeftRed   — hand-authored (2026-08-14) from varsity's role rules:
 *     the TE-side veer. Roles: PST=LT · PSG=LG · BSG=RG · BST=RT · PSW=L ·
 *     pitch man=R (motions right-to-left) · Y=PLAYSIDE TE · X=backside.
 *   - veerRightBlack = mirrorPlay(veerLeftRed) — Black puts the TE right, so
 *     right out of Black is the TE-side picture flipped.
 *   - veerLeftBlack  = mirrorPlay(veerRightRed) — wing-side picture flipped.
 *
 * The read key is the FIRST MAN OUTSIDE the playside tackle — the end
 * (`E-R`/`E-L`) vs every front we run against. Ryan ruled 2026-08-15 that this
 * holds vs the 5-2 too: the tackle head up on the PST is NOT the read, he gets
 * base-blocked by the playside tackle.
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
// VEER RIGHT out of RED — skill actions, identical against all three fronts.
// ---------------------------------------------------------------------------

/**
 * S: dive at the crack (inside leg) of the playside guard, mesh with Q.
 * The scan draws this as a short, clearly angled arrow whose head sits ON the
 * playside guard about ¾ yard behind the LOS — that is the aiming point, not a
 * vertical climb up the middle. We carry it a little past the LOS because he is
 * the ball carrier, but the angle is the guard's inside leg.
 */
const S_DIVE: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: 0.4, y: -3.1 },
      { x: 0.9, y: -1.6 },
      { x: 1.3, y: -0.3 },
      { x: 2, y: 2 },
      { x: 2.6, y: 4.5 },
    ],
  },
]

/**
 * Q: step playside, ride the mesh flat at his own depth, then break upfield at
 * about 45° OUTSIDE the wing — the scan's keep arrow ends wide and shallow
 * (roughly four line-splits outside the ball, barely past the LOS), pressing
 * the pitch, not climbing straight up the C gap.
 */
const Q_READ: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 1, y: -1.8 },
      { x: 2.6, y: -1.9 },
      { x: 4, y: -1.6 },
      { x: 5.4, y: -0.4 },
      { x: 6.4, y: 1.4 },
    ],
  },
]

/**
 * L: the squiggle on the scan. Pre-snap motion through the heels of Super,
 * then arc out and stay 5 yards outside / 1 yard behind the quarterback.
 */
const L_PITCH: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: -4, y: -2.6 },
      { x: -2, y: -4.2 },
      { x: 0, y: -5 },
      { x: 2, y: -4.6 },
      { x: 3.8, y: -3.8 },
    ],
  },
  {
    kind: 'pitch',
    path: [
      { x: 6, y: -3 },
      { x: 8.6, y: -2 },
      { x: 11.4, y: 0.2 },
    ],
  },
]

/** X: playside — go get the corner. */
const X_CORNER: Action[] = block('C-R')

/**
 * Y on the backside Rip. His arrow leaves the tight end going up and INSIDE
 * (toward the ball), curving like the scan, and his bar sets around 3 yards —
 * he is the backside anchor of the wall.
 */
const Y_RIP: Action[] = [
  {
    kind: 'block',
    path: [
      { x: -4.35, y: 0.9 },
      { x: -4.05, y: 2 },
      { x: -3.6, y: 3 },
    ],
  },
]

const SKILL = {
  S: S_DIVE,
  Q: Q_READ,
  L: L_PITCH,
  X: X_CORNER,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Line work shared by the two EVEN fronts (4-4 and 4-3), drawn to Ryan's
// red-line markup of the scan (2026-08-10): the blocks build one rising WALL.
// Every path curves, every bar cuts back toward the backside, and the
// climbers set their bars around the 3–4 yard mark.
//   Backside: LT steps down and takes the down man on the guard; LG climbs
//             to the wall at the backside backer; Y rips inside and anchors
//             the backside of the wall.
//   Playside: RG bases the down man, RT veers inside and climbs to the wall.
// ---------------------------------------------------------------------------

// Each blocker is ONE continuous `block` action — a chained run + block would
// draw a stray arrowhead halfway up the line where the run segment ends.
const EVEN_LINE = {
  Y: Y_RIP,
  // LT pulls: steps down the line behind the guard, comes around the far
  // (playside) side of the man on him, and washes him AWAY from the play —
  // the bar lands on the DT's playside shoulder, pushing backside.
  // Down-lineman bars set a yard PAST the LOS: we block down and drive them
  // back off the line, never stalemate on it.
  LT: [
    {
      kind: 'block',
      path: [
        { x: -1.8, y: 0.1 },
        { x: -0.8, y: 0.5 },
        { x: -0.6, y: 1.2 },
        { x: -1, y: 1.7 },
      ],
    },
  ],
  RG: [
    {
      kind: 'block',
      path: [
        { x: 2.1, y: 0.4 },
        { x: 2.3, y: 1.1 },
        { x: 2, y: 1.6 },
      ],
    },
  ],
  // The wing pins the SAME way vs both even fronts: barely around the read
  // key's outside hip, bar cutting back inside on the first backer that
  // shows. Vs the 4-4 the walked-up outside backer is IGNORED, like the read
  // key — the option handles both.
  R: [
    {
      kind: 'block',
      path: [
        { x: 4.8, y: 0.1 },
        { x: 5.4, y: 1.6 },
        { x: 5.3, y: 3.3 },
        { x: 4.75, y: 4.1 },
      ],
    },
  ],
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Veer Right front plans
// ---------------------------------------------------------------------------

const vs44: FrontPlan = {
  readKey: 'E-R',
  // Two men on the playside edge are deliberately unblocked — the read-key
  // end and the walked-up outside backer. The option handles both; the
  // diagram rings them dashed so nobody thinks it's a missed assignment.
  ignored: ['E-R', 'O-R'],
  actions: {
    ...SKILL,
    ...EVEN_LINE,
    // Uncovered: get vertical, curve back, and set the bar on the wall around
    // 3–4 yards — on nobody in particular, exactly like the scan.
    C: [
      {
        kind: 'block',
        path: [
          { x: 0.2, y: 1 },
          { x: 0.1, y: 2.2 },
          { x: -0.4, y: 3.3 },
        ],
      },
    ],
    LG: [
      {
        kind: 'block',
        path: [
          { x: -1.2, y: 0.9 },
          { x: -1.5, y: 2.2 },
          { x: -1.7, y: 3.3 },
        ],
      },
    ],
    RT: [
      {
        kind: 'block',
        path: [
          { x: 3.1, y: 1 },
          { x: 2.7, y: 2.6 },
          { x: 2.2, y: 3.5 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Uncovered — get vertical and wall off.',
      detail:
        'Nobody on your nose in an even front. Step playside, climb to the second level, and wall off the first jersey that shows. Your block is the middle of the wall — do not chase anybody deep.',
    },
    RT: {
      rule: 'Step inside, veer inside — up to the backer.',
      detail: 'The end outside you is the read key: leave him alone. Release inside him and climb to the backer over the guard.',
    },
    R: {
      rule: 'Tight off the read key — pin the first backer.',
      detail: 'The read key AND the walked-up backer outside you are both left alone — the option takes care of them. Squeeze tight around the read key, barely off his outside hip, and pin the first backer that shows, pushing him back toward the inside. Rule two: if you miss him, hit the near color — find an opponent and block.',
    },
    LT: {
      rule: 'Rip — pull behind the guard, wash his man away from the play.',
      detail: 'Even front, so it\'s Rip. Pull down the line behind the guard, come around the FAR side of the tackle on him, and push him away from the playside — your block lands on his playside shoulder, driving him back where we came from. The guard climbs to the wall.',
    },
    LG: {
      rule: 'Rip — climb to the wall at the backside backer.',
      detail: 'The tackle outside you takes the man on your nose, so you climb. Get to the second level, bend back toward the backside, and set your block on the backer around three to four yards — that is your piece of the wall.',
    },
  },
}

const vs43: FrontPlan = {
  readKey: 'E-R',
  actions: {
    ...SKILL,
    ...EVEN_LINE,
    C: [
      {
        kind: 'block',
        path: [
          { x: 0.2, y: 1 },
          { x: 0.1, y: 2.4 },
          { x: -0.3, y: 3.8 },
        ],
      },
    ],
    LG: [
      {
        kind: 'block',
        path: [
          { x: -1.2, y: 0.9 },
          { x: -1.9, y: 2.4 },
          { x: -3.4, y: 4 },
        ],
      },
    ],
    RT: [
      {
        kind: 'block',
        path: [
          { x: 3.1, y: 1.2 },
          { x: 3, y: 2.6 },
          { x: 2.6, y: 3.7 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Uncovered — get vertical to the Mike.',
      detail: 'Even front again, and the Mike is stacked head up on you. Step playside, get vertical, and put your hat on him.',
    },
    RT: {
      rule: 'Step inside, veer inside — climb to the wall.',
      detail: 'Release inside the read key and climb. The Sam is the wing\'s man to pin, so you wall off the first jersey that shows inside him — set your block on the wall around three to four yards.',
    },
    R: {
      rule: 'Tight off the read key — pin the Sam.',
      detail: 'Squeeze tight around the read key — barely off his outside hip — and pin the Sam, pushing him back toward the inside. Rule two: if you miss him, hit the near color — find an opponent and block.',
    },
    LT: {
      rule: 'Rip — pull behind the guard, wash his man away from the play.',
      detail: 'Even front, so it\'s Rip. Pull down the line behind the guard, come around the FAR side of the tackle on him, and push him away from the playside. The guard climbs behind you.',
    },
    LG: {
      rule: 'Rip — climb to the wall at the backside backer.',
      detail: 'The tackle outside you takes the man on your nose, so you climb and bend back to the backer away from the play. The Will is wider in this front, so you have farther to run — go get him.',
    },
  },
}

const vs52: FrontPlan = {
  // Ryan's 2026-08-15 ruling: vs the 5-2 the read key is the FIRST MAN
  // OUTSIDE the playside tackle — the end, same as the even fronts — NOT the
  // tackle head up on RT. RT bases that head-up man instead.
  readKey: 'E-R',
  actions: {
    ...SKILL,
    Y: Y_RIP,
    // Same wall as the even fronts. The scoop puts LG on the nose and frees
    // the center to climb; every bar cuts backside now that the wing pins
    // instead of kicking out. Bars on down linemen set a yard past the LOS —
    // block down, drive them back.
    LT: [
      {
        kind: 'block',
        path: [
          { x: -2.5, y: 0.3 },
          { x: -2.2, y: 1 },
          { x: -2.5, y: 1.6 },
        ],
      },
    ],
    LG: [
      {
        kind: 'block',
        path: [
          { x: -0.6, y: 0.3 },
          { x: 0.6, y: 1 },
          { x: 0.35, y: 1.6 },
        ],
      },
    ],
    C: [
      {
        kind: 'block',
        path: [
          { x: 0.5, y: 0.8 },
          { x: -0.3, y: 2.2 },
          { x: -1.4, y: 3.5 },
        ],
      },
    ],
    // RG uncovered: climb to the playside backer, bar bending back into the
    // wall around 3–4 yards — with RT basing the head-up tackle, the backer
    // is the guard's man now.
    RG: [
      {
        kind: 'block',
        path: [
          { x: 1.8, y: 1 },
          { x: 2.1, y: 2.4 },
          { x: 1.6, y: 3.5 },
        ],
      },
    ],
    // RT bases the tackle head up on him — hat across his playside number,
    // bar a yard past the LOS, driving him back. The end outside is the read.
    RT: [
      {
        kind: 'block',
        path: [
          { x: 2.9, y: 0.4 },
          { x: 3.3, y: 1.1 },
          { x: 3, y: 1.6 },
        ],
      },
    ],
    // Wing: rule one, same pin stroke as the even fronts — tight off the
    // read-key end's outside hip, bar cutting back inside on the first
    // backer that shows.
    R: [
      {
        kind: 'block',
        path: [
          { x: 5.4, y: 0.1 },
          { x: 6, y: 1.6 },
          { x: 5.9, y: 3.3 },
          { x: 5.35, y: 4.1 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Covered — Scoop with the backside guard.',
      detail: "Odd front: the nose is head up on you. Step playside and take his playside number until the backside guard takes him over — then climb to the wall, bending back to the backside backer around three to four yards. That's Scoop.",
    },
    LG: {
      rule: 'Odd — Scoop with C.',
      detail: 'Step playside and take the nose over so the center can climb. Get your hat on his playside number and push him back toward the backside. If the nose slants away from us, he is yours alone and the center climbs early.',
    },
    LT: {
      rule: 'Rip — take the man on you.',
      detail: 'The tackle is head up on you. Step playside, get your hat across his playside number, and push him back toward the backside — nothing chases us from behind.',
    },
    RG: {
      rule: 'Step inside. Uncovered — climb to the playside backer.',
      detail: 'Nobody on you in a 5-2, and the tackle takes the man head up on him — so the playside backer is YOURS. Climb to him, bend back into the wall, and set your block around three to four yards.',
    },
    RT: {
      rule: 'Base — the tackle head up on you.',
      detail: 'The read key is the END outside you, not the man on your nose. The tackle head up on you gets BLOCKED: step playside, get your hat across his playside number, and drive him back off the line — your bar sets about a yard past it.',
    },
    R: {
      rule: 'Tight off the read key — pin the backer.',
      detail: 'The end is the read key — leave him alone. Squeeze tight around his outside hip, same as the even fronts, and pin the first backer that shows, pushing him back toward the inside. Rule two: if you miss him, hit the near color — find an opponent and block.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table (varsity p5, cleaned up) — Veer Right.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  RT: {
    rule: 'Never block the read key. Even: veer inside. Odd: base the man on you.',
    detail:
      'The read key is the first man OUTSIDE you — never block him. Even front: step inside with your playside foot, release inside the end, and take the first backer you see. Odd front: the man head up on you is NOT the read — base him, hat across his playside number, and drive him back off the line.',
  },
  RG: {
    rule: 'Step inside. Covered: base. Uncovered: base the backer.',
    detail: 'If a man is on you, take him. If nobody is on you, step playside and go get a linebacker.',
  },
  C: {
    rule: 'Step playside. Covered: base. Uncovered: get vertical.',
    detail: 'Playside foot first, every time. Covered means block him. Uncovered means climb straight up the middle to the second level.',
  },
  LG: {
    rule: 'Even: Rip with the tackle outside you. Odd: Scoop with C.',
    detail: 'Look at the center\'s nose. Nobody there (even) — Rip: the tackle steps down for the man on you, and you climb to the wall at the backside backer. A nose guard there (odd) — Scoop it with the center.',
  },
  LT: {
    rule: 'Rip with the guard inside you.',
    detail: 'Your first step is DOWN the line behind the guard, never out. Pull around the far side of the man on him, get your hat on his playside number, and push him away from the play; nothing chases us from behind.',
  },
  Y: {
    rule: 'Backside: Rip. (Playside: base the first man outside the read key.)',
    detail:
      'On the back side you Rip: step playside, get inside the end, and cut off the chase. If the play ever comes your way, you base the first defender outside the read key.',
  },
  R: {
    rule: 'Tight off the read key — pin the backer.',
    detail: 'Rule one: squeeze barely around the read key\'s outside hip and PIN the first backer — push him back toward the inside, never chase him upfield. Rule two: if you miss him, hit the near color — find an opponent and block.',
  },
  L: {
    rule: 'Pitch man. Motion through the heels of Super.',
    detail:
      'Pre-snap motion through the heels of Super, then arc and hold a 5-by-1 pitch relationship with the quarterback — five yards outside him, one yard behind. Eyes on the ball the whole way, hands up and soft.',
  },
  S: {
    rule: 'Dive — aim at the crack of the playside guard.',
    detail:
      'Aim for the crack of the playside guard. Soft fold on the mesh, wave read on the ball: if it stays, it is yours — run downhill. If he pulls it, keep sprinting and take a tackler with you.',
  },
  Q: {
    rule: 'Step playside. Read the key: dive, keep, or pitch.',
    detail:
      'Step to playside and pivot on your back foot. Extend the ball behind your back hip. Eyes on the read key — the first man OUTSIDE the playside tackle; vs every front we see, that is the end. If he takes the dive: give it. If he sits: pull it and get vertical in the C gap. If he takes you: press the pitch.',
  },
  X: {
    rule: 'Playside: block the corner.',
    detail:
      'You are the only man out there. Get to the corner\'s outside number and stay on him — that block is the difference between eight yards and a touchdown. On the back side: run your route or work to the safety.',
  },
}

const reviewNotes = [
  "Indy vs Hoosier: RE-RESOLVED (Ryan, 2026-08-14) — they are direction AUDIBLES yelled at the line, not play names. Indy = the play now goes LEFT, Hoosier = RIGHT. Direction is play identity (Veer Right and Veer Left are two plays), formation is orthogonal (each direction runs out of Red or Black). Wired as `audibleFlipId` on each play; the words live in DIRECTION_AUDIBLES (app/utils/playbook.ts). This supersedes the 2026-08-13 note that treated Indy/Hoosier as call names on the Red/Black pair.",
  "The wall (Ryan's red-line markup of the scan, 2026-08-10): the teaching point of veer blocking is one rising WALL. Every blocker's line now CURVES like the original drawing, and every block besides Y's cuts back toward the backside; the climbers — Y, LG, C, and RT — all set their bars around the 3–4 yard mark; the playside wing is NOT a climber, he squeezes around the read key and pins the backer back inside. Y is the mirror image: he rips up and INSIDE (toward the ball) and anchors the backside of the wall at about 3 yards instead of barring on the end. On the Rip that means LT PULLS — down the line behind the guard, around the far side of the DT, bar on the DT's playside shoulder washing him away from the play — and LG climbs to the wall at the backside backer, the reverse of how the first pass authored it. Every blocker is drawn as one continuous curved block stroke; chaining a run into a block puts a stray arrowhead mid-line.",
  "Playside wing (fixed again, Ryan 2026-08-10): rule one everywhere — tight off the read key to pin the LB. He squeezes BARELY around the read key's outside hip (to the right on Red) and pins with his bar pushing back toward the inside, never a deep climb — the SAME stroke vs both even fronts. Vs the 4-4 the playside edge has TWO ignored defenders: the read-key end and the walked-up outside backer; the option handles both, and the wing pins the first backer that shows. Vs the 4-3 the pin lands on the Sam — which ANSWERS the old open question: the Sam is the wing's man, so RT walls off the first jersey inside him instead. Rule two only if he misses: hit the near color — find an opponent and block. The old 4-3 picture ran the wing ten yards deep to the safety; gone.",
  "Ignored defenders (new convention, Ryan 2026-08-10): a FrontPlan can now list `ignored` defender ids — men the scheme deliberately leaves unblocked. They draw with a small dashed grey ring (the read key keeps its red READ ring instead), and the print book's legend explains it. Veer vs the 4-4 rings the walked-up outside backer; the read-key end is listed too but already carries the READ ring. Mirrors automatically.",
  "5-2 read key RESOLVED (Ryan, 2026-08-15): for ALL veer plays vs the 5-2 the read key is the FIRST MAN OUTSIDE the playside tackle — the end (E-R here) — NOT the tackle head up on the PST. Our front does not move (T stays head up on RT); the read and the blocking do: RT bases the head-up tackle (hat across his playside number, bar a yard past the LOS), RG's climb is re-aimed at the playside backer, and the wing's kick-out of the end is gone — he reverts to rule one, pinning tight off the read key like the even fronts. Every front now reads the end.",
  "p6's two 'vs Odd' panels draw the same backside picture as the 'vs Even' panels — the guard-tackle strokes look copied across. Vs our 5-2 the LT has a man head up on him, so he takes him (varsity's BST rule) instead of stepping down the way the even-front picture shows.",
  "The varsity even front on p6 puts its extra down lineman on the PLAYSIDE guard; our 4-4 and 4-3 use symmetric tackles on both guards so the play mirrors cleanly. The rules resolve the same way, but the picture is not a pixel copy of the scan.",
  "Super's dive (fixed): the scan's dive arrow is SHORT — the arrowhead sits on the playside guard about ¾ yard behind the LOS, which is the aiming point ('crack of PSG'). Ours ran to six yards downfield off a two-yard lateral gain, which drew as a near-vertical climb over the center's head. The path is now angled harder at the guard's inside leg and trimmed to 4½ yards downfield. He is the ball carrier, so we still draw him past the LOS where varsity stops at the mesh.",
  "Quarterback's keep (fixed): the scan rides him FLAT at his own depth to about four line-splits outside the ball and only then breaks upfield at roughly 45°, ending wide and barely past the LOS — 'press the pitch'. Ours turned up early and finished 3½ yards deep and inside the wing, which read as a C-gap dive rather than an option keep. The break point and endpoint now match the drawing.",
  "Pitch man (fixed): with the keep re-measured, L's arc was re-hung to hold the stated 5-by-1 (about five yards outside the quarterback, one yard behind him) at the end of both paths. The scan's pitch arrow actually finishes even wider and still BEHIND the line; we let ours cross the LOS so the diagram shows where the ball goes.",
  "Center vs the 4-4 (fixed — the wall): his old block ran ten yards to the free safety, a vertical spike straight through the middle of the wall. He now curves up and back toward the backside and sets his bar on the wall at about 3½ yards, on nobody in particular — exactly how the scan draws 'Uncovered: Get Vertical'. The free safety is deliberately left unblocked in this picture.",
  "Vs the 5-2 (rebuilt to the wall 2026-08-10, re-read 2026-08-15): same picture as the even fronts — one rising wall, every bar cutting backside. The scoop resolves with LG taking the nose over (low bar on his playside number) and the CENTER climbing off it, bending back to the backside backer at about 3½ yards. Under the 2026-08-15 read ruling: RT bases the tackle head up on him (bar a yard past the LOS), RG's climb is aimed at the playside backer instead of mid-wall on nobody, and the wing PINS tight off the read-key end — the kick-out picture is gone, so no bar pushes away from the wall anymore. Y still anchors the backside at 3. Every defender inside is still covered exactly once, the read-key end unblocked.",
  "Down-lineman bars sit a yard OFF the line (Ryan, 2026-08-10): every block on a down lineman — the even-front LT pull and RG base, and the 5-2's LT base and LG scoop — sets its bar about a yard past the LOS, beyond the defender's alignment, not at it. The picture is the teaching point: we block DOWN(field) and drive them back off the line; a bar on the LOS reads as a stalemate.",
]

export const veerRightRed: Play = {
  id: 'veer-right-red',
  name: 'Veer',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Veer', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'S',
  formationTwinId: 'veer-right-black',
  audibleFlipId: 'veer-left-red',
  summary: 'Triple option that follows the guard. DE is key.',
  description:
    'Our bread and butter. Super dives at the crack of the playside guard, the quarterback reads one man and gives, keeps, or pitches, and the backside wing motions across to ride in pitch relationship. Up front the line veers inside and climbs downfield, building a wall for the ball to run behind. Three plays in one — the defense picks which one we run.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}

// ---------------------------------------------------------------------------
// VEER LEFT out of RED — the TE-side veer, hand-authored 2026-08-14.
//
// This is the newly modeled "Indy out of Red" picture that varsity page 6's
// BOTTOM panels show: the tight end stays left and the run goes left. It is
// NOT a mirror of Veer Right out of Red — mirroring Red-Right yields
// Black-Left. With Y and the left wing L both on the playside, the blocking
// surface changes: Y works his playside rule ("base the first man outside the
// read key") and the wing works OUTSIDE Y's block. Built best-effort from the
// role rules in the teaching table above; NEEDS Ryan's check against the
// page 6 bottom panels. Judgment calls are enumerated in reviewNotes.
//
// Roles, Red left:
//   PST = LT · PSG = LG · C = C · BSG = RG · BST = RT
//   PSW = L (playside wing) · R = backside wing — the PITCH MAN
//   Y = PLAYSIDE tight end · X = backside split end (works to the safety)
//   S = dive back · Q = quarterback
// ---------------------------------------------------------------------------

/** S: dive at the crack of LG — the mirror geometry of the right-hand dive. */
const S_DIVE_LEFT: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -0.4, y: -3.1 },
      { x: -0.9, y: -1.6 },
      { x: -1.3, y: -0.3 },
      { x: -2, y: 2 },
      { x: -2.6, y: 4.5 },
    ],
  },
]

/** Q: step LEFT, ride the mesh flat, break upfield at ~45° outside the wing. */
const Q_READ_LEFT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -1, y: -1.8 },
      { x: -2.6, y: -1.9 },
      { x: -4, y: -1.6 },
      { x: -5.4, y: -0.4 },
      { x: -6.4, y: 1.4 },
    ],
  },
]

/**
 * R is the pitch man now: pre-snap motion right-to-left through the heels of
 * Super, then arc out left holding the 5-by-1 with the quarterback — the exact
 * mirror of L's squiggle on the right-hand play.
 */
const R_PITCH_LEFT: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 4, y: -2.6 },
      { x: 2, y: -4.2 },
      { x: 0, y: -5 },
      { x: -2, y: -4.6 },
      { x: -3.8, y: -3.8 },
    ],
  },
  {
    kind: 'pitch',
    path: [
      { x: -6, y: -3 },
      { x: -8.6, y: -2 },
      { x: -11.4, y: 0.2 },
    ],
  },
]

/**
 * X backside vs the 4-4's single-high safety: release inside and work to the
 * free safety — a work-to path, not a corner block (he is a full field away
 * from the play).
 */
const X_SAFETY_44: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 10.5, y: 1.2 },
      { x: 8.8, y: 3 },
      { x: 7, y: 5 },
      { x: 5.2, y: 7 },
    ],
  },
]

/** X backside vs the two-high fronts (4-3, 5-2): work to the near safety. */
const X_SAFETY_TWO_HIGH: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 10.8, y: 1.4 },
      { x: 9.6, y: 3.4 },
      { x: 8.4, y: 5.4 },
      { x: 7.2, y: 7.4 },
    ],
  },
]

const SKILL_LEFT = {
  S: S_DIVE_LEFT,
  Q: Q_READ_LEFT,
  R: R_PITCH_LEFT,
} satisfies Partial<Record<OffPosId, Action[]>>

// Backside line for the even fronts — the Rip, mirror-image roles of the
// right-hand play: RT pulls down the line behind RG, washes the DT away from
// the play (bar a yard past the LOS on his playside shoulder), and RG climbs
// to the wall at the backside backer. Bars cut back toward the backside,
// which is now the RIGHT (+x).
const EVEN_BACKSIDE_LEFT = {
  RT: [
    {
      kind: 'block',
      path: [
        { x: 1.8, y: 0.1 },
        { x: 0.8, y: 0.5 },
        { x: 0.6, y: 1.2 },
        { x: 1, y: 1.7 },
      ],
    },
  ],
  LG: [
    // PSG bases the down man on him (T-L) — bar a yard past the LOS.
    {
      kind: 'block',
      path: [
        { x: -2.1, y: 0.4 },
        { x: -2.3, y: 1.1 },
        { x: -2, y: 1.6 },
      ],
    },
  ],
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Veer Left front plans
// ---------------------------------------------------------------------------

const vs44Left: FrontPlan = {
  readKey: 'E-L',
  // No `ignored` list: unlike the right-hand 4-4 picture, only the read key
  // is left unblocked — with Y on the playside, the walked-up outside backer
  // is BASED by the tight end instead of ignored. That extra blocker is the
  // whole point of running at the tight end.
  actions: {
    ...SKILL_LEFT,
    ...EVEN_BACKSIDE_LEFT,
    X: X_SAFETY_44,
    // Y playside: base the first man outside the read key — here the
    // walked-up outside backer. Drive him out of the alley; his is a base
    // bar pushing away from the wall, like a kick-out.
    Y: [
      {
        kind: 'block',
        path: [
          { x: -5, y: 0.7 },
          { x: -5.5, y: 1.6 },
          { x: -6.1, y: 2.6 },
          { x: -6.6, y: 3.2 },
        ],
      },
    ],
    // L: outside Y's block — every backer inside is covered, so he walls the
    // alley: bar around 4 yards cutting back inside on the first pursuit.
    L: [
      {
        kind: 'block',
        path: [
          { x: -6.8, y: 0.3 },
          { x: -7.5, y: 1.9 },
          { x: -7.6, y: 3.4 },
          { x: -7, y: 4.2 },
        ],
      },
    ],
    // LT veers inside the read key, climbs to the backer over the guard.
    LT: [
      {
        kind: 'block',
        path: [
          { x: -3.1, y: 1 },
          { x: -2.7, y: 2.6 },
          { x: -2.2, y: 3.5 },
        ],
      },
    ],
    // C uncovered: climb, bend back toward the (right) backside, bar mid-wall.
    C: [
      {
        kind: 'block',
        path: [
          { x: -0.2, y: 1 },
          { x: -0.1, y: 2.2 },
          { x: 0.4, y: 3.3 },
        ],
      },
    ],
    // RG climbs to the backside backer — his piece of the wall.
    RG: [
      {
        kind: 'block',
        path: [
          { x: 1.2, y: 0.9 },
          { x: 1.5, y: 2.2 },
          { x: 1.7, y: 3.3 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Uncovered — get vertical and wall off.',
      detail:
        'Nobody on your nose in an even front. Step playside, climb to the second level, and wall off the first jersey that shows. Your block is the middle of the wall — do not chase anybody deep.',
    },
    LT: {
      rule: 'Step inside, veer inside — up to the backer.',
      detail: 'The end outside you is the read key: leave him alone. Release inside him and climb to the backer over the guard.',
    },
    Y: {
      rule: 'Playside — base the first man outside the read key.',
      detail: 'The end on your nose is the read key: never block him. Release outside him and BASE the walked-up backer — drive him out of the alley. On the wing-side veer we leave that man to the option; running at you, he is yours.',
    },
    L: {
      rule: 'Work outside Y — wall the alley.',
      detail: 'Every backer inside is covered, so swing outside the tight end\'s block, climb to about four yards, and wall off the first pursuit that shows, pushing him back inside. Rule two: hit the near color — find an opponent and block.',
    },
    RT: {
      rule: 'Rip — pull behind the guard, wash his man away from the play.',
      detail: 'Even front, so it\'s Rip. Pull down the line behind the guard, come around the FAR side of the tackle on him, and push him away from the playside — your block lands on his playside shoulder, driving him back where we came from. The guard climbs to the wall.',
    },
    RG: {
      rule: 'Rip — climb to the wall at the backside backer.',
      detail: 'The tackle outside you takes the man on your nose, so you climb. Get to the second level, bend back toward the backside, and set your block on the backer around three to four yards — that is your piece of the wall.',
    },
    X: {
      rule: 'Backside — work to the safety.',
      detail: 'You are away from the play. Release inside and work to the free safety — cut off the last man between the pitch and the end zone.',
    },
  },
}

const vs43Left: FrontPlan = {
  readKey: 'E-L',
  actions: {
    ...SKILL_LEFT,
    ...EVEN_BACKSIDE_LEFT,
    X: X_SAFETY_TWO_HIGH,
    // Y: the first man outside the read key is the playside backer sitting
    // over your head — climb and base him.
    Y: [
      {
        kind: 'block',
        path: [
          { x: -4.7, y: 1 },
          { x: -4.5, y: 2.6 },
          { x: -4.2, y: 4 },
        ],
      },
    ],
    // L: outside Y's block, pin the first color filling the alley — in this
    // front that is the near safety coming down. Bar cuts back inside.
    L: [
      {
        kind: 'block',
        path: [
          { x: -6.5, y: 0.2 },
          { x: -7, y: 1.8 },
          { x: -7, y: 3.3 },
          { x: -6.4, y: 4.4 },
        ],
      },
    ],
    // LT veers inside the read key; the playside backer is Y's man, so he
    // walls off the first jersey that shows inside — bar mid-wall.
    LT: [
      {
        kind: 'block',
        path: [
          { x: -3.1, y: 1.2 },
          { x: -3, y: 2.6 },
          { x: -2.6, y: 3.7 },
        ],
      },
    ],
    // C: the Mike is stacked head up — get vertical to him.
    C: [
      {
        kind: 'block',
        path: [
          { x: -0.2, y: 1 },
          { x: -0.1, y: 2.4 },
          { x: 0.3, y: 3.8 },
        ],
      },
    ],
    // RG: climb and bend back to the wider backside backer.
    RG: [
      {
        kind: 'block',
        path: [
          { x: 1.2, y: 0.9 },
          { x: 1.9, y: 2.4 },
          { x: 3.4, y: 4 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Uncovered — get vertical to the Mike.',
      detail: 'Even front again, and the Mike is stacked head up on you. Step playside, get vertical, and put your hat on him.',
    },
    LT: {
      rule: 'Step inside, veer inside — climb to the wall.',
      detail: 'Release inside the read key and climb. The playside backer is the tight end\'s man, so you wall off the first jersey that shows inside him — set your block on the wall around three to four yards.',
    },
    Y: {
      rule: 'Playside — base the first man outside the read key.',
      detail: 'That is the playside backer sitting over your head. Release outside the read key, climb, and base him — turn him out of the lane.',
    },
    L: {
      rule: 'Work outside Y — pin the alley filler.',
      detail: 'The backers inside are covered, so swing outside the tight end\'s block and pin the first color that fills the alley — in this front that is the near safety coming down. Rule two: hit the near color — find an opponent and block.',
    },
    RT: {
      rule: 'Rip — pull behind the guard, wash his man away from the play.',
      detail: 'Even front, so it\'s Rip. Pull down the line behind the guard, come around the FAR side of the tackle on him, and push him away from the playside. The guard climbs behind you.',
    },
    RG: {
      rule: 'Rip — climb to the wall at the backside backer.',
      detail: 'The tackle outside you takes the man on your nose, so you climb and bend back to the backer away from the play. He is wider in this front, so you have farther to run — go get him.',
    },
    X: {
      rule: 'Backside — work to the safety.',
      detail: 'You are away from the play. Release inside and work to the near safety on your side — cut off the deep pursuit.',
    },
  },
}

const vs52Left: FrontPlan = {
  // Ryan's 2026-08-15 ruling: the read key vs the 5-2 is the FIRST MAN
  // OUTSIDE the playside tackle — the end E-L, same as the even fronts —
  // NOT the tackle head up on LT. LT bases that head-up man instead.
  readKey: 'E-L',
  actions: {
    ...SKILL_LEFT,
    X: X_SAFETY_TWO_HIGH,
    // Y: the end just outside your shoulder is the READ — never block him.
    // Release tight off his outside hip and pin the first jersey that fills,
    // pushing back inside: the same pin shape the wing draws off the even
    // read keys, hung off E-L's hip.
    Y: [
      {
        kind: 'block',
        path: [
          { x: -5.4, y: 0.1 },
          { x: -6, y: 1.6 },
          { x: -5.9, y: 3.3 },
          { x: -5.35, y: 4.1 },
        ],
      },
    ],
    // L: wrap outside Y's pin and pin the next filler — modeled as the near
    // safety coming down, the same stroke as the 4-3 picture.
    L: [
      {
        kind: 'block',
        path: [
          { x: -6.5, y: 0.2 },
          { x: -7, y: 1.8 },
          { x: -7, y: 3.3 },
          { x: -6.4, y: 4.4 },
        ],
      },
    ],
    // LT bases the tackle head up on him — hat across his playside number,
    // bar a yard past the LOS, driving him back. The end outside is the read.
    LT: [
      {
        kind: 'block',
        path: [
          { x: -2.9, y: 0.4 },
          { x: -3.3, y: 1.1 },
          { x: -3, y: 1.6 },
        ],
      },
    ],
    // LG uncovered: climb to the playside backer — with LT basing the
    // head-up tackle, the backer is the guard's man. Bar bends back into
    // the wall around 3–4 yards.
    LG: [
      {
        kind: 'block',
        path: [
          { x: -1.8, y: 1 },
          { x: -2.1, y: 2.4 },
          { x: -1.6, y: 3.5 },
        ],
      },
    ],
    // Scoop, mirror roles: RG takes the nose over so C can climb.
    RG: [
      {
        kind: 'block',
        path: [
          { x: 0.6, y: 0.3 },
          { x: -0.6, y: 1 },
          { x: -0.35, y: 1.6 },
        ],
      },
    ],
    C: [
      {
        kind: 'block',
        path: [
          { x: -0.5, y: 0.8 },
          { x: 0.3, y: 2.2 },
          { x: 1.4, y: 3.5 },
        ],
      },
    ],
    // RT: BST vs odd — take the man head up on you.
    RT: [
      {
        kind: 'block',
        path: [
          { x: 2.5, y: 0.3 },
          { x: 2.2, y: 1 },
          { x: 2.5, y: 1.6 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Covered — Scoop with the backside guard.',
      detail: "Odd front: the nose is head up on you. Step playside and take his playside number until the backside guard takes him over — then climb to the wall, bending back to the backside backer around three to four yards. That's Scoop.",
    },
    RG: {
      rule: 'Odd — Scoop with C.',
      detail: 'Step playside and take the nose over so the center can climb. Get your hat on his playside number and push him back toward the backside. If the nose slants away from us, he is yours alone and the center climbs early.',
    },
    RT: {
      rule: 'Rip — take the man on you.',
      detail: 'The tackle is head up on you. Step playside, get your hat across his playside number, and push him back toward the backside — nothing chases us from behind.',
    },
    LG: {
      rule: 'Step inside. Uncovered — climb to the playside backer.',
      detail: 'Nobody on you in a 5-2, and the tackle takes the man head up on him — so the playside backer is YOURS. Climb to him, bend back into the wall, and set your block around three to four yards.',
    },
    LT: {
      rule: 'Base — the tackle head up on you.',
      detail: 'The read key is the END outside you, not the man on your nose. The tackle head up on you gets BLOCKED: step playside, get your hat across his playside number, and drive him back off the line — your bar sets about a yard past it.',
    },
    Y: {
      rule: 'Tight off the read key — pin the first filler.',
      detail: 'The end just outside your shoulder is the READ KEY — never block him. Release tight off his outside hip, same as the wing does off the even read keys, and pin the first jersey that fills, pushing him back inside. Both backers are covered underneath you.',
    },
    L: {
      rule: 'Work outside Y — pin the next filler.',
      detail: 'The tight end pins off the read key, so wrap outside his block and pin the next color that fills — in this front that is the near safety coming down. Rule two: hit the near color — find an opponent and block.',
    },
    X: {
      rule: 'Backside — work to the safety.',
      detail: 'You are away from the play. Release inside and work to the near safety on your side — cut off the deep pursuit.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for VEER LEFT.
// ---------------------------------------------------------------------------

const assignmentsLeft: Record<OffPosId, Assignment> = {
  LT: {
    rule: 'Never block the read key. Even: veer inside. Odd: base the man on you.',
    detail:
      'The read key is the first man OUTSIDE you — never block him. Even front: step inside with your playside foot, release inside the end, and take the first backer you see. Odd front: the man head up on you is NOT the read — base him, hat across his playside number, and drive him back off the line.',
  },
  LG: {
    rule: 'Step inside. Covered: base. Uncovered: base the backer.',
    detail: 'If a man is on you, take him. If nobody is on you, step playside and go get a linebacker.',
  },
  C: {
    rule: 'Step playside. Covered: base. Uncovered: get vertical.',
    detail: 'Playside foot first, every time. Covered means block him. Uncovered means climb straight up the middle to the second level.',
  },
  RG: {
    rule: 'Even: Rip with the tackle outside you. Odd: Scoop with C.',
    detail: 'Look at the center\'s nose. Nobody there (even) — Rip: the tackle steps down for the man on you, and you climb to the wall at the backside backer. A nose guard there (odd) — Scoop it with the center.',
  },
  RT: {
    rule: 'Rip with the guard inside you.',
    detail: 'Your first step is DOWN the line behind the guard, never out. Pull around the far side of the man on him, get your hat on his playside number, and push him away from the play; nothing chases us from behind.',
  },
  Y: {
    rule: 'Playside: base the first man outside the read key.',
    detail:
      'The play comes your way. Never block the read key — release past him and BASE the first defender outside him: the walked-up backer or the playside backer, whichever this front puts there. If the front puts nobody there (the 5-2), stay tight off the read key\'s hip and pin the first color that fills. (On the back side you Rip: step playside, get inside, and cut off the chase.)',
  },
  L: {
    rule: 'Playside wing — work outside Y\'s block.',
    detail: 'The tight end takes the first man outside the read key, so you work OUTSIDE his block: wrap tight off it and pin the first color that shows, pushing him back inside — never a deep chase. Rule two: hit the near color — find an opponent and block.',
  },
  R: {
    rule: 'Pitch man. Motion through the heels of Super.',
    detail:
      'Pre-snap motion across the formation through the heels of Super, then arc and hold a 5-by-1 pitch relationship with the quarterback — five yards outside him, one yard behind. Eyes on the ball the whole way, hands up and soft.',
  },
  S: {
    rule: 'Dive — aim at the crack of the playside guard.',
    detail:
      'Aim for the crack of the playside guard. Soft fold on the mesh, wave read on the ball: if it stays, it is yours — run downhill. If he pulls it, keep sprinting and take a tackler with you.',
  },
  Q: {
    rule: 'Step playside. Read the key: dive, keep, or pitch.',
    detail:
      'Step to playside and pivot on your back foot. Extend the ball behind your back hip. Eyes on the read key — the first man OUTSIDE the playside tackle; vs every front we see, that is the end. If he takes the dive: give it. If he sits: pull it and get vertical in the C gap. If he takes you: press the pitch.',
  },
  X: {
    rule: 'Backside: work to the safety.',
    detail:
      'You are away from the play on this one. Release inside and work to the safety — cut off the last man between the pitch and the end zone. (Playside you block the corner.)',
  },
}

const reviewNotesLeft = [
  "NEW PICTURE (2026-08-14) — NEEDS COACH RYAN'S CHECK. This is the newly modeled 'Indy out of Red' that varsity page 6's BOTTOM panels show: the tight end stays left and the run goes LEFT, putting Y AND the left wing on the playside. It is NOT a mirror of Veer Right out of Red (mirroring that gives Black-Left); it was authored best-effort from the role rules in the teaching table — 'Y playside: base the first man outside the read key', the wing working outside him — and needs checking against those panels stroke by stroke.",
  "Indy/Hoosier are direction AUDIBLES (Ryan, 2026-08-14): Indy = left, Hoosier = right, yelled at the line. 'Red, Veer Right' + 'INDY INDY' becomes THIS play. Wired via audibleFlipId; the words live in DIRECTION_AUDIBLES (app/utils/playbook.ts).",
  "Read key per front — RESOLVED (Ryan, 2026-08-15): the read is the FIRST MAN OUTSIDE the playside tackle in EVERY front — the end E-L, vs the 5-2 too (not the tackle head up on LT, as first drafted). Y releases past the read key in every front and never blocks him.",
  "JUDGMENT CALL — vs the 4-4, the walked-up outside backer is now BLOCKED, not ignored: he is the first man outside the read key, so Y bases him and drives him out of the alley. That is why this front plan has NO `ignored` list where the right-hand play ignores two men — the extra playside blocker is the point of running at the tight end. Y's bar pushes away from the wall (a base/kick-out picture), the one exception besides kick-outs to bars cutting backside.",
  "JUDGMENT CALL — vs the 4-3, the first man outside the read key is the playside backer over Y's head, so Y climbs and bases HIM; LT, whose right-hand mirror climbs to that backer, instead walls off the first jersey inside (bar mid-wall on nobody in particular, like the uncovered center). The wing then has no backer left to pin, so he pins the first color filling the alley — modeled as the near safety coming down. Confirm that division of labor: the alternative is LT to the backer and Y straight to the safety.",
  "Vs the 5-2 — REWORKED to Ryan's 2026-08-15 read ruling: the read key is the end E-L, so Y's base of the end is GONE (he is deliberately unblocked). LT bases the tackle head up on him (bar a yard past the LOS), LG's climb is re-aimed at the playside backer, Y pins tight off the read key's hip (the wing's even-front pin shape hung off E-L), and the wing wraps outside Y and pins the next filler. Both inside backers stay covered exactly once (LG to the playside backer, C off the scoop to the backside backer); no bar pushes away from the wall anymore.",
  "JUDGMENT CALL — the playside corner (C-L) is unblocked in every front: there is no receiver to that side (X is split right, backside), and the wing's rule keeps him on the alley, not a ten-yard chase to the corner. The pitch man has to beat the corner with speed. Flag if Ryan wants the wing on the corner instead.",
  "X backside: 'work to the safety' per his rule — drawn as a work-to run path (no block bar) toward the free safety (4-4) / near safety (4-3, 5-2). Not a corner block; he is a full field from the play.",
  "The wall identity carries over from Veer Right (Ryan's 2026-08-10 markup): one rising wall, every blocker a single continuous curved block stroke, climbers' bars at 3–4 yards, down-lineman bars a yard past the LOS, bars cutting back toward the backside (now the RIGHT) except Y's base/kick-outs and the wing's pins. The backside Rip is the exact mirror role-swap: RT pulls behind RG and washes the DT away; RG climbs to the backside backer. Vs the 5-2 RT takes the man head up on him and RG scoops the nose with C.",
  "Geometry: S's dive, Q's keep, and the pitch relationship are the true mirrors of the right-hand play (dive at the crack of LG, keep breaking at ~45° outside the wing, pitch man holding 5-by-1) — those were kept as exact negations. Y's, L's, and X's strokes are newly drawn because the TE-side surface has no right-hand counterpart.",
]

export const veerLeftRed: Play = {
  id: 'veer-left-red',
  name: 'Veer',
  call: [
    { word: 'Red', label: 'formation' },
    { word: 'Veer', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'red',
  direction: 'left',
  ballCarrier: 'S',
  formationTwinId: 'veer-left-black',
  audibleFlipId: 'veer-right-red',
  summary: 'Triple option that follows the guard. DE is key.',
  description:
    'Veer run at the tight end side. Same three-way option — dive, keep, pitch — but with Y and the wing both on the playside the surface changes: the tight end bases the first man outside the read key, the wing works outside his block, and R motions across to be the pitch man. The extra blocker at the point is why we audible into this when the defense cheats away from Y.',
  assignments: assignmentsLeft,
  vs: { '44': vs44Left, '43': vs43Left, '52': vs52Left } satisfies Record<FrontId, FrontPlan>,
  reviewNotes: reviewNotesLeft,
}

/**
 * Veer Right out of BLACK — the mirror of Veer Left out of Red. Black puts
 * the tight end and a wing to the RIGHT, so running right out of Black is the
 * TE-side picture: mirrorPlay flips every stroke, swaps LT↔RT/LG↔RG/L↔R and
 * the -L/-R defender ids, and re-keys the assignments onto the mirrored
 * players. Everything on veerLeftRed's review list applies here mirrored.
 */
export const veerRightBlack: Play = mirrorPlay(veerLeftRed, {
  id: 'veer-right-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Veer', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  formationTwinId: 'veer-right-red',
  audibleFlipId: 'veer-left-black',
  description:
    'Veer right out of Black — the tight end side, because Black flips Y to the right. Y and the right wing are both playside: Y bases the first man outside the read key, R works outside his block, and L motions across as the pitch man.',
  reviewNotes: [
    ...reviewNotesLeft,
    'Veer Right out of Black is generated by mirroring Veer Left out of Red (app/utils/mirror.ts) with no hand corrections — Black is drawn on page 1 as Red\'s exact mirror. If any of the Red-left answers above change, this play changes with it automatically.',
  ],
})

/**
 * Veer Left out of BLACK — the mirror of Veer Right out of Red, checked panel
 * by panel against varsity page 6's left-hand diagrams (2026-08-13 pass; no
 * hand corrections were needed — both fronts are left/right symmetric).
 * The wing-only surface: PSW is L, the pitch man is R motioning right-to-left,
 * the read key becomes E-L in every front, Y rips on the backside, and
 * X — split left in Black — blocks the corner on his side.
 */
export const veerLeftBlack: Play = mirrorPlay(veerRightRed, {
  id: 'veer-left-black',
  formation: 'black',
  call: [
    { word: 'Black', label: 'formation' },
    { word: 'Veer', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  formationTwinId: 'veer-left-red',
  audibleFlipId: 'veer-right-black',
  description:
    'Veer to the left out of Black — the wing side, since Black flips the tight end away to the right. Same read, same pitch relationship as Veer Right out of Red, other side of the ball: R is the pitch man now and L is the wing who pins.',
  reviewNotes: [
    ...reviewNotes,
    'Veer Left out of Black is generated by mirroring Veer Right out of Red (app/utils/mirror.ts) with no hand corrections. If any of the Red-right answers above change, this play changes with it automatically.',
  ],
})

export const veerPlays: Play[] = [veerRightRed, veerRightBlack, veerLeftRed, veerLeftBlack]
