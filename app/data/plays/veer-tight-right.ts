/**
 * VEER RIGHT out of TIGHT — hand-authored 2026-08-15.
 *
 * The TE-side veer picture (veer-left-red is the model) run to the RIGHT out
 * of the 2-tight-end set: Tight puts X on the line at +4.5 as the RIGHT tight
 * end (app/data/tight-formation.ts), so running right at him is the same
 * football as Red's Veer Left at Y, mirrored. The geometry lines up exactly —
 * Tight's X (+4.5) and R (+5.7, −1) are the mirror of Red's Y (−4.5) and L
 * (−5.7, −1) — so the playside strokes here are veer-left-red's playside
 * negated in x, and the backfield (dive, read, pitch) is veer-right-red's
 * verbatim, because Tight's L wing and Super stand where Red's do.
 *
 * What Tight CHANGES from the Red left picture: the backside is not a split
 * end working to a safety — it is the OTHER tight end. Y (−4.5) takes the
 * backside tight end's cutoff job the veer already teaches: Rip up and inside,
 * anchor the backside of the wall at about 3 yards (the same Y_RIP stroke
 * veer-right-red draws, at the same alignment).
 *
 * Roles, Tight right:
 *   PST = RT · PSG = RG · C = C · BSG = LG · BST = LT
 *   playside TE = X · PSW = R · pitch man = L (motions left-to-right)
 *   Y = BACKSIDE tight end (Rip) · S = dive back · Q = quarterback
 *
 * Direction is play identity; Indy (left) / Hoosier (right) are line audibles
 * wired through `audibleFlipId` → 'veer-left-tight'. Tight is a balanced set
 * that mirrors onto itself, so — like Split Wide's pairs — there is NO
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

// ---------------------------------------------------------------------------
// Skill actions, identical against all three fronts. The dive, the read, and
// the pitch are the same yards as Veer Right out of Red — Super, Q, and the
// left wing stand in the same spots in Tight as in Red.
// ---------------------------------------------------------------------------

/** S: dive at the crack (inside leg) of RG, mesh with Q. */
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

/** Q: step right, ride the mesh flat, break upfield at ~45° outside the wing. */
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
 * L is the pitch man: pre-snap motion left-to-right through the heels of
 * Super, then arc out and hold the 5-by-1 with the quarterback. Tight's L
 * stands at (−5.7, −1), the same spot as Red's L, so this is the same
 * squiggle Veer Right out of Red draws.
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

/**
 * Y on the backside Rip — the second tight end is what Tight buys us back
 * here. Up and INSIDE toward the ball, bar around 3 yards: the backside
 * anchor of the wall, the identical stroke and alignment as Red's Y on Veer
 * Right.
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
  Y: Y_RIP,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Backside line for the even fronts — the Rip, same roles as Veer Right out
// of Red: LT pulls down the line behind LG, washes the DT away from the play
// (bar a yard past the LOS on his playside shoulder), and LG climbs to the
// wall at the backside backer. RG bases the down man on him. Bars cut back
// toward the backside (the LEFT, −x).
// ---------------------------------------------------------------------------

const EVEN_BACKSIDE = {
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
    // PSG bases the down man on him (T-R) — bar a yard past the LOS.
    {
      kind: 'block',
      path: [
        { x: 2.1, y: 0.4 },
        { x: 2.3, y: 1.1 },
        { x: 2, y: 1.6 },
      ],
    },
  ],
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Front plans
// ---------------------------------------------------------------------------

const vs44: FrontPlan = {
  readKey: 'E-R',
  // No `ignored` list: with X on the playside, the walked-up outside backer
  // is BASED by the tight end instead of left to the option — the extra
  // playside blocker is the point of running at a tight end.
  actions: {
    ...SKILL,
    ...EVEN_BACKSIDE,
    // X playside: base the first man outside the read key — here the
    // walked-up outside backer. Drive him out of the alley; a base bar
    // pushing away from the wall, like a kick-out.
    X: [
      {
        kind: 'block',
        path: [
          { x: 5, y: 0.7 },
          { x: 5.5, y: 1.6 },
          { x: 6.1, y: 2.6 },
          { x: 6.6, y: 3.2 },
        ],
      },
    ],
    // R: outside X's block — every backer inside is covered, so he walls the
    // alley: bar around 4 yards cutting back inside on the first pursuit.
    R: [
      {
        kind: 'block',
        path: [
          { x: 6.8, y: 0.3 },
          { x: 7.5, y: 1.9 },
          { x: 7.6, y: 3.4 },
          { x: 7, y: 4.2 },
        ],
      },
    ],
    // RT veers inside the read key, climbs to the backer over the guard.
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
    // C uncovered: climb, bend back toward the (left) backside, bar mid-wall.
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
    // LG climbs to the backside backer — his piece of the wall.
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
    X: {
      rule: 'Playside — base the first man outside the read key.',
      detail: 'The end on your nose is the read key: never block him. Release outside him and BASE the walked-up backer — drive him out of the alley. On the backside veer we leave that man to the option; running at you, he is yours.',
    },
    R: {
      rule: 'Work outside X — wall the alley.',
      detail: 'Every backer inside is covered, so swing outside the tight end\'s block, climb to about four yards, and wall off the first pursuit that shows, pushing him back inside. Rule two: hit the near color — find an opponent and block.',
    },
    LT: {
      rule: 'Rip — pull behind the guard, wash his man away from the play.',
      detail: 'Even front, so it\'s Rip. Pull down the line behind the guard, come around the FAR side of the tackle on him, and push him away from the playside — your block lands on his playside shoulder, driving him back where we came from. The guard climbs to the wall.',
    },
    LG: {
      rule: 'Rip — climb to the wall at the backside backer.',
      detail: 'The tackle outside you takes the man on your nose, so you climb. Get to the second level, bend back toward the backside, and set your block on the backer around three to four yards — that is your piece of the wall.',
    },
    Y: {
      rule: 'Backside — Rip and anchor the wall.',
      detail: 'You are the backside tight end on this one. Step playside, get up and inside the end, and cut off the chase — your bar around three yards is the backside anchor of the wall.',
    },
  },
}

const vs43: FrontPlan = {
  readKey: 'E-R',
  actions: {
    ...SKILL,
    ...EVEN_BACKSIDE,
    // X: the first man outside the read key is the playside backer sitting
    // over your head — climb and base him.
    X: [
      {
        kind: 'block',
        path: [
          { x: 4.7, y: 1 },
          { x: 4.5, y: 2.6 },
          { x: 4.2, y: 4 },
        ],
      },
    ],
    // R: outside X's block, pin the first color filling the alley — in this
    // front that is the near safety coming down. Bar cuts back inside.
    R: [
      {
        kind: 'block',
        path: [
          { x: 6.5, y: 0.2 },
          { x: 7, y: 1.8 },
          { x: 7, y: 3.3 },
          { x: 6.4, y: 4.4 },
        ],
      },
    ],
    // RT veers inside the read key; the playside backer is X's man, so he
    // walls off the first jersey that shows inside — bar mid-wall.
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
    // C: the Mike is stacked head up — get vertical to him.
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
    // LG: climb and bend back to the wider backside backer.
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
  },
  assignments: {
    C: {
      rule: 'Step playside. Uncovered — get vertical to the Mike.',
      detail: 'Even front again, and the Mike is stacked head up on you. Step playside, get vertical, and put your hat on him.',
    },
    RT: {
      rule: 'Step inside, veer inside — climb to the wall.',
      detail: 'Release inside the read key and climb. The playside backer is the tight end\'s man, so you wall off the first jersey that shows inside him — set your block on the wall around three to four yards.',
    },
    X: {
      rule: 'Playside — base the first man outside the read key.',
      detail: 'That is the playside backer sitting over your head. Release outside the read key, climb, and base him — turn him out of the lane.',
    },
    R: {
      rule: 'Work outside X — pin the alley filler.',
      detail: 'The backers inside are covered, so swing outside the tight end\'s block and pin the first color that fills the alley — in this front that is the near safety coming down. Rule two: hit the near color — find an opponent and block.',
    },
    LT: {
      rule: 'Rip — pull behind the guard, wash his man away from the play.',
      detail: 'Even front, so it\'s Rip. Pull down the line behind the guard, come around the FAR side of the tackle on him, and push him away from the playside. The guard climbs behind you.',
    },
    LG: {
      rule: 'Rip — climb to the wall at the backside backer.',
      detail: 'The tackle outside you takes the man on your nose, so you climb and bend back to the backer away from the play. He is wider in this front, so you have farther to run — go get him.',
    },
    Y: {
      rule: 'Backside — Rip and anchor the wall.',
      detail: 'Step playside, get up and inside the end, and cut off the chase — your bar around three yards is the backside anchor of the wall.',
    },
  },
}

const vs52: FrontPlan = {
  // Ryan's 2026-08-15 ruling: the read key vs the 5-2 is the FIRST MAN
  // OUTSIDE the playside tackle — the end E-R, same as the even fronts —
  // NOT the tackle head up on RT. RT bases that head-up man instead.
  readKey: 'E-R',
  actions: {
    ...SKILL,
    // X: the end just outside your shoulder is the READ — never block him.
    // Release tight off his outside hip and pin the first jersey that fills,
    // pushing back inside: the same pin shape the wing draws off the even
    // read keys, hung off E-R's hip.
    X: [
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
    // R: wrap outside X's pin and pin the next filler — modeled as the near
    // safety coming down, the same stroke as the 4-3 picture.
    R: [
      {
        kind: 'block',
        path: [
          { x: 6.5, y: 0.2 },
          { x: 7, y: 1.8 },
          { x: 7, y: 3.3 },
          { x: 6.4, y: 4.4 },
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
    // RG uncovered: climb to the playside backer — with RT basing the
    // head-up tackle, the backer is the guard's man. Bar bends back into
    // the wall around 3–4 yards.
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
    // Scoop: LG takes the nose over so C can climb.
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
    // LT: BST vs odd — take the man head up on you.
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
    X: {
      rule: 'Tight off the read key — pin the first filler.',
      detail: 'The end just outside your shoulder is the READ KEY — never block him. Release tight off his outside hip, same as the wing does off the even read keys, and pin the first jersey that fills, pushing him back inside. Both backers are covered underneath you.',
    },
    R: {
      rule: 'Work outside X — pin the next filler.',
      detail: 'The tight end pins off the read key, so wrap outside his block and pin the next color that fills — in this front that is the near safety coming down. Rule two: hit the near color — find an opponent and block.',
    },
    Y: {
      rule: 'Backside — Rip and anchor the wall.',
      detail: 'Step playside, get up and inside the end, and cut off the chase — your bar around three yards is the backside anchor of the wall.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for VEER RIGHT out of
// Tight: PST=RT, PSG=RG, playside TE=X, PSW=R, pitch man=L, backside TE=Y.
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
  X: {
    rule: 'Playside: base the first man outside the read key.',
    detail:
      'You are a tight end in this set and the play comes right at you. Never block the read key — release past him and BASE the first defender outside him: the walked-up backer or the playside backer, whichever this front puts there. If the front puts nobody there (the 5-2), stay tight off the read key\'s hip and pin the first color that fills.',
  },
  Y: {
    rule: 'Backside: Rip.',
    detail:
      'You are the backside tight end on this one. Step playside, get inside the end, and cut off the chase — anchor the backside of the wall around three yards. (If the play ever comes your way, you base the first man outside the read key.)',
  },
  R: {
    rule: 'Playside wing — work outside X\'s block.',
    detail: 'The tight end takes the first man outside the read key, so you work OUTSIDE his block: wrap tight off it and pin the first color that shows, pushing him back inside — never a deep chase. Rule two: hit the near color — find an opponent and block.',
  },
  L: {
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
  "NEW PICTURE (2026-08-15) — NEEDS COACH RYAN'S CHECK. Veer Right out of Tight is the TE-side veer surface (the veer-left-red model) run to the right at X, who is a TIGHT END in this set (+4.5, on the line). Tight's playside geometry is the exact mirror of Red's TE side — X (+4.5) and R (+5.7, −1) mirror Red's Y (−4.5) and L (−5.7, −1) — so the playside strokes are veer-left-red's negated in x, and the dive/read/pitch are veer-right-red's yards verbatim (Super, Q, and the left wing stand in the same spots in Tight as in Red). Check it against the veer-left-red picture, not veer-right-red's wing-only one.",
  'BALANCED SET, NO TWIN: Tight mirrors onto itself, so like Split Wide there is no formationTwinId — this play and veer-left-tight are a 1×2 left/right pair linked by audibleFlipId (Indy = left, Hoosier = right at the line).',
  "JUDGMENT CALL — the backside tight end: Red's TE-side veer has a split end backside working to the safety; Tight has a second tight end there instead. Y takes the backside TE cutoff job the veer already teaches — Rip up and inside, anchor the backside of the wall at ~3 yards — the identical stroke and alignment as Red's Y on Veer Right. Nobody works to the backside safety on any front; confirm that trade.",
  'Read key per front — RESOLVED (Ryan, 2026-08-15): the read is the FIRST MAN OUTSIDE the playside tackle in EVERY front — the end E-R, vs the 5-2 too (not the tackle head up on RT, as first drafted). X releases past the read key in every front and never blocks him.',
  "JUDGMENT CALL — vs the 4-4 the walked-up outside backer (O-R) is BLOCKED, not ignored: he is the first man outside the read key, so X bases him and drives him out of the alley — no `ignored` list, unlike the wing-only picture that leaves two men to the option. X's bar pushes away from the wall, the base/kick-out exception.",
  'JUDGMENT CALL — vs the 4-3, X climbs and bases the playside backer (B-R); RT walls off the first jersey inside instead; the wing pins the first color filling the alley, modeled as the near safety coming down. Same division of labor veer-left-red drafted — the alternative is RT to the backer and X to the safety.',
  "Vs the 5-2 — REWORKED to Ryan's 2026-08-15 read ruling: the read key is the end E-R, so X's base of the end is GONE (he is deliberately unblocked). RT bases the tackle head up on him (bar a yard past the LOS), RG's climb is re-aimed at the playside backer, X pins tight off the read key's hip (the wing's even-front pin shape hung off E-R), and the wing wraps outside X and pins the next filler. Both inside backers covered exactly once (RG to B-R, C off the scoop to B-L); the 5-2 picture is the exact mirror of veer-left-tight's.",
  'JUDGMENT CALL — the playside corner (C-R) is unblocked in every front, same as veer-left-red: no split receiver exists in Tight, and the wing\'s rule keeps him on the alley. The pitch man has to beat the corner with speed. Flag if Ryan wants the wing on the corner instead.',
  "The wall identity carries over (Ryan's 2026-08-10 markup): one rising wall, single continuous curved block strokes, climbers' bars at 3–4 yards, down-lineman bars a yard past the LOS, bars cutting back toward the backside (the LEFT here) except X's base/kick-outs and the wing's pins. Backside Rip: LT pulls behind LG and washes the DT away; LG climbs to the backside backer. Vs the 5-2 LT takes the man head up on him and LG scoops the nose with C.",
  'If any of the veer-left-red answers change at review, this play changes with them — it was authored as that picture mirrored onto Tight, with only the backside (Y instead of a split end) newly decided.',
]

export const veerRightTight: Play = {
  id: 'veer-right-tight',
  name: 'Veer',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Veer', label: 'play' },
    { word: 'Right', label: 'direction' },
  ],
  family: 'run',
  formation: 'tight',
  direction: 'right',
  ballCarrier: 'S',
  audibleFlipId: 'veer-left-tight',
  summary: 'Triple option that follows the guard. DE is key.',
  description:
    'Veer to the right out of the two-tight-end set. Same three-way option — dive, keep, pitch — run at a tight end surface: X bases the first man outside the read key, the right wing works outside his block, and L motions across to be the pitch man. Because Tight has a tight end on BOTH edges, the backside is stronger too — Y rips inside and anchors the wall, and the defense cannot set its front to a strength that is not there.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  coachNotes,
  reviewNotes,
}
