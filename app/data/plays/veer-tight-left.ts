/**
 * VEER LEFT out of TIGHT — the TE-side veer picture, run left out of the
 * 2-tight-end set (app/data/tight-formation.ts).
 *
 * Hand-authored 2026-08-15 by starting from veerLeftRed (app/data/plays/
 * veer.ts) — the hand-authored TE-side veer whose playside surface (Y at
 * −4.5, wing L at −5.7) is geometrically IDENTICAL in Tight, so every
 * playside stroke and rule carries over verbatim. What changes is the
 * BACKSIDE: Red splits X out at +12 (he works to the safety); Tight brings
 * him home as the RIGHT tight end at +4.5, so X takes the backside tight
 * end's job the veer already teaches — the Rip cutoff that Y runs on
 * veerRightRed, mirrored. That makes the Tight backside the exact mirror of
 * the Red-right backside picture: RT pulls behind RG washing the down man
 * away (even) / bases the man on him (odd), RG climbs (even) / scoops the
 * nose with C (odd), and the tight end rips up and inside to anchor the
 * backside of the wall at ~3 yards.
 *
 * Roles, Tight left:
 *   PST = LT · PSG = LG · C = C · BSG = RG · BST = RT
 *   PSW = L (playside wing) · R = backside wing — the PITCH MAN
 *   Y = PLAYSIDE tight end · X = BACKSIDE tight end (Rip cutoff)
 *   S = dive back · Q = quarterback
 *
 * Read key: the first man OUTSIDE the playside tackle — the end `E-L` vs
 * every front we run against (Ryan's 2026-08-15 ruling: vs the 5-2 too;
 * the tackle head up on LT is base-blocked, not read).
 *
 * Direction is play identity; Indy (left) / Hoosier (right) are line
 * audibles wired via `audibleFlipId` → 'veer-right-tight'. Tight is a
 * balanced set that mirrors onto itself, so — exactly like the Split Wide
 * pairs — there is NO `formationTwinId`.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'

// ---------------------------------------------------------------------------
// Skill actions — identical against all three fronts. S, Q, and the pitch
// relationship are carried over from veerLeftRed unchanged; R's motion start
// is re-hung for the Tight wing alignment (+5.7, −1 instead of Red's +4.2).
// ---------------------------------------------------------------------------

/** S: dive at the crack (inside leg) of the playside guard, mesh with Q. */
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
 * R is the pitch man: pre-snap motion right-to-left through the heels of
 * Super, then arc out left holding the 5-by-1 with the quarterback. Same
 * squiggle as veerLeftRed's, with the first point widened because the Tight
 * wing starts at +5.7 instead of Red's +4.2.
 */
const R_PITCH_LEFT: Action[] = [
  {
    kind: 'motion',
    path: [
      { x: 4.6, y: -2.7 },
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
 * X on the backside Rip — the backside tight end's job, the exact mirror of
 * Y's rip on veerRightRed. His arrow leaves the tight end spot (+4.5) going
 * up and INSIDE toward the ball, and his bar sets around 3 yards — he is the
 * backside anchor of the wall.
 */
const X_RIP: Action[] = [
  {
    kind: 'block',
    path: [
      { x: 4.35, y: 0.9 },
      { x: 4.05, y: 2 },
      { x: 3.6, y: 3 },
    ],
  },
]

const SKILL_LEFT = {
  S: S_DIVE_LEFT,
  Q: Q_READ_LEFT,
  R: R_PITCH_LEFT,
} satisfies Partial<Record<OffPosId, Action[]>>

// Backside line for the even fronts — the Rip, same strokes as veerLeftRed:
// RT pulls down the line behind RG, washes the DT away from the play (bar a
// yard past the LOS on his playside shoulder), and RG climbs to the wall at
// the backside backer. LG (PSG) bases the down man on him. Bars cut back
// toward the backside, which is the RIGHT (+x). X's rip completes the
// backside anchor above them.
const EVEN_BACKSIDE_LEFT = {
  X: X_RIP,
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
// Front plans — playside strokes and rules carried over from veerLeftRed
// (identical playside geometry); backside re-pointed at the Rip with X.
// ---------------------------------------------------------------------------

const vs44: FrontPlan = {
  readKey: 'E-L',
  // No `ignored` list: only the read key is left unblocked — with Y on the
  // playside, the walked-up outside backer is BASED by the tight end. That
  // extra blocker is the whole point of running at a tight end.
  actions: {
    ...SKILL_LEFT,
    ...EVEN_BACKSIDE_LEFT,
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
      detail: 'The end on your nose is the read key: never block him. Release outside him and BASE the walked-up backer — drive him out of the alley. He is why we run at you.',
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
      rule: 'Backside — Rip. Anchor the backside of the wall.',
      detail: 'You are a tight end in this set, and the play goes away from you. Step playside, get up and inside toward the ball, and cut off the chase — your block anchors the backside of the wall around three yards. Nobody crosses your face to run this down from behind.',
    },
  },
}

const vs43: FrontPlan = {
  readKey: 'E-L',
  actions: {
    ...SKILL_LEFT,
    ...EVEN_BACKSIDE_LEFT,
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
      rule: 'Backside — Rip. Anchor the backside of the wall.',
      detail: 'Play goes away from you. Step playside, get up and inside toward the ball, and cut off the chase — anchor the backside of the wall around three yards.',
    },
  },
}

const vs52: FrontPlan = {
  // Ryan's 2026-08-15 ruling: the read key vs the 5-2 is the FIRST MAN
  // OUTSIDE the playside tackle — the end E-L, same as the even fronts —
  // NOT the tackle head up on LT. LT bases that head-up man instead.
  readKey: 'E-L',
  actions: {
    ...SKILL_LEFT,
    X: X_RIP,
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
      rule: 'Backside — Rip. Anchor the backside of the wall.',
      detail: 'Play goes away from you and their end is outside your shoulder. Step playside, get up and inside toward the ball, and cut off the inside chase — anchor the backside of the wall around three yards. The end chasing flat behind you runs himself out of the play.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for VEER LEFT / TIGHT.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
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
    detail: 'Your first step is DOWN the line behind the guard, never out. Pull around the far side of the man on him, get your hat on his playside number, and push him away from the play; nothing chases us from behind. Odd front: take the man head up on you instead.',
  },
  Y: {
    rule: 'Playside: base the first man outside the read key.',
    detail:
      'The play comes your way. Never block the read key — release past him and BASE the first defender outside him: the walked-up backer or the playside backer, whichever this front puts there. If the front puts nobody there (the 5-2), stay tight off the read key\'s hip and pin the first color that fills.',
  },
  X: {
    rule: 'Backside: Rip. Anchor the backside of the wall.',
    detail:
      'You are a tight end in this set, not a split end — you have a tight end\'s job. The play goes away from you: step playside, get up and inside toward the ball, and cut off the chase, anchoring the backside of the wall around three yards. (If the play ever comes your way, you base the first man outside the read key, same as Y.)',
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
}

const coachNotes = [
  'Read the end. He crashes down - pull it. He stays wide - give it.',
  "Super: full speed at the guard's hip. Never slow down for the ball.",
  'Pitch man: stay wide, stay behind the quarterback, be ready every time.',
]

const reviewNotes = [
  "NEW PLAY (2026-08-15) — NEEDS COACH RYAN'S CHECK. Veer Left out of Tight was authored by starting from the hand-authored veer-left-red (the TE-side veer): the Tight playside surface — Y at −4.5, wing L at −5.7 — is geometrically identical to Red's left side, so every playside stroke, read key (E-L in every front, per Ryan's 2026-08-15 ruling), and rule carries over verbatim, including the judgment calls flagged on that play's own review list. What changed is the backside, and only the backside.",
  "5-2 READ RESOLVED (Ryan, 2026-08-15): the read key vs the 5-2 is the FIRST MAN OUTSIDE the playside tackle — the end E-L, not the tackle head up on LT as first drafted. LT bases the head-up tackle (bar a yard past the LOS), LG's climb is re-aimed at the playside backer, Y pins tight off the read key's hip instead of basing the end, and the wing pins the next filler outside him. Both inside backers covered exactly once (LG to B-L, C off the scoop to B-R); this 5-2 picture is the exact mirror of veer-right-tight's.",
  'THE ONE REAL CHANGE — X is a tight end here, not a split end. In Red-left, X is split at +12 and works to the safety. In Tight he sits at +4.5, so he takes the backside tight end\'s job the veer already teaches: the Rip cutoff Y runs on veer-right-red, mirrored exactly (+4.35 → +3.6, bar anchoring the backside of the wall at ~3 yards). That makes the whole Tight backside the exact mirror of the hand-authored Red-right backside picture — RT pulls behind RG (even) / bases the man on him (odd), RG climbs (even) / scoops the nose with C (odd), tight end rips.',
  'CONSEQUENCE — nobody works to the safety anymore. Red-left sent X on a work-to path at the free/near safety; Tight has no detached receiver to send, so the deep middle is unblocked in every front. Same trade the wing-side veer already makes; the pitch man beats the safety with the wall in front of him. Flag if Ryan wants somebody released deep instead of X ripping.',
  'BALANCED SET — no formationTwinId, matching the Split Wide ruling: Tight mirrors onto itself, so there is no Red/Black-style formation twin, just the left/right pair. audibleFlipId → veer-right-tight (Indy = left, Hoosier = right at the line, per DIRECTION_AUDIBLES).',
  'PITCH MAN GEOMETRY — R starts at (+5.7, −1) in Tight instead of Red\'s (+4.2, −1), so the first point of his motion squiggle was widened (4.6, −2.7 instead of 4, −2.6); the rest of the path, the pitch relationship, S\'s dive, and Q\'s keep are carried over unchanged.',
  "PLAYSIDE CORNER (C-L) unblocked in every front, same as Red-left: no receiver to that side, and the wing's rule keeps him on the alley. The pitch man has to beat the corner with speed.",
  'VS THE 5-2 BACKSIDE — X\'s rip goes up-and-inside while E-R sits just outside his shoulder unblocked, the same picture the wing-side veer leaves on its backside end: the flat chaser runs himself out of the play behind the rip. Confirm Ryan doesn\'t want X to base E-R instead — that is the alternative reading of a backside TE with a man just outside him.',
  "The wall identity carries over (Ryan's 2026-08-10 markup): one rising wall, single continuous curved block strokes, climbers' bars at 3–4 yards, down-lineman bars a yard past the LOS, every bar cutting back toward the (right) backside except Y's base/kick-outs and the wing's pins.",
]

export const veerLeftTight: Play = {
  id: 'veer-left-tight',
  name: 'Veer',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Veer', label: 'play' },
    { word: 'Left', label: 'direction' },
  ],
  family: 'run',
  formation: 'tight',
  direction: 'left',
  ballCarrier: 'S',
  audibleFlipId: 'veer-right-tight',
  summary: 'Triple option that follows the guard. DE is key.',
  description:
    'The tight-end-side veer out of the balanced set. Same three-way option — dive, keep, pitch — with Y and the wing both on the playside: the tight end bases the first man outside the read key, the wing works outside his block, and R motions across to be the pitch man. Because Tight has a tight end on BOTH edges, X anchors the backside with the Rip cutoff instead of splitting out — and the defense cannot set its front to stop this side without opening up the same play the other way.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes,
}
