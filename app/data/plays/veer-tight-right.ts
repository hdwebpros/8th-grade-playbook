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
 * backside tight end's cutoff job the veer already teaches: Rip up off the
 * end's outside hip and inside, anchoring the backside of the wall at ~3 yards (the same Y_RIP stroke
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
 * here. Their end is a 5-technique at x −3.55, right on his INSIDE shoulder,
 * so there is no lane to rip under him: he steps up off the end's OUTSIDE
 * hip, then climbs and bends INSIDE toward the ball, bar around 3 yards and
 * inside the end — the backside anchor of the wall, the identical stroke and
 * alignment as Red's Y on Veer Right.
 */
const Y_RIP: Action[] = [
  {
    kind: 'block',
    path: [
      { x: -4.45, y: 0.9 },
      { x: -4.15, y: 2.1 },
      { x: -3.4, y: 3 },
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
// of Red: LT pulls down the line behind LG, washes the 3-technique on the
// guard's outside shoulder (T-L at x −1.8) away from the play (bar a yard
// past the LOS on his playside shoulder), and LG releases inside that man and
// climbs to the wall at the backside backer. RG bases the 3-technique on HIS
// outside shoulder (T-R at x 1.8). Bars cut back toward the backside
// (the LEFT, −x).
// ---------------------------------------------------------------------------

const EVEN_BACKSIDE = {
  LT: [
    {
      kind: 'block',
      path: [
        { x: -2, y: 0.1 },
        { x: -1, y: 0.5 },
        { x: -0.8, y: 1.2 },
        { x: -1.2, y: 1.7 },
      ],
    },
  ],
  RG: [
    // PSG bases the 3-technique on his OUTSIDE shoulder (T-R at x 1.8) —
    // bar a yard past the LOS.
    {
      kind: 'block',
      path: [
        { x: 2.25, y: 0.45 },
        { x: 2.5, y: 1.15 },
        { x: 2.05, y: 1.75 },
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
    // RT's veer release: the end is a 5-technique on his outside shoulder
    // (3.55), so he steps INSIDE him and climbs through the lane over his own
    // spot, up to the backer over the guard.
    RT: [
      {
        kind: 'block',
        path: [
          { x: 2.6, y: 1.1 },
          { x: 2.4, y: 2.6 },
          { x: 2, y: 3.6 },
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
    // LG releases INSIDE the tackle on his outside shoulder (T-L at −1.8)
    // and climbs to the backside backer — his piece of the wall.
    LG: [
      {
        kind: 'block',
        path: [
          { x: -1, y: 1 },
          { x: -1.4, y: 2.2 },
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
      detail: 'The end is a 5-technique on your INSIDE shoulder, and he is the read key: never block him. Release outside him and BASE the walked-up backer — drive him out of the alley. On the backside veer we leave that man to the option; running at you, he is yours.',
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
      detail: 'Our tackle pulls down for the man on your outside shoulder, so you release INSIDE that man and climb. Get to the second level, bend back toward the backside, and set your block on the backer around three to four yards — that is your piece of the wall.',
    },
    Y: {
      rule: 'Backside — Rip and anchor the wall.',
      detail: 'You are the backside tight end on this one. Their end is right on your inside shoulder, so go up off his OUTSIDE hip, then rip up and inside toward the ball and cut off the chase — your bar around three yards is the backside anchor of the wall.',
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
          { x: 2.6, y: 1.2 },
          { x: 2.55, y: 2.6 },
          { x: 2.3, y: 3.7 },
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
          { x: -1, y: 1 },
          { x: -1.7, y: 2.5 },
          { x: -3.4, y: 4 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Uncovered — get vertical to the Mike.',
      detail: 'Even front again, and the Mike is stacked head up on you. Step playside, get vertical, and put your helmet on him.',
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
      detail: 'Our tackle pulls down for the man on your outside shoulder, so you release INSIDE him and climb, bending back to the backer away from the play. He is wider in this front, so you have farther to run — go get him.',
    },
    Y: {
      rule: 'Backside — Rip and anchor the wall.',
      detail: 'Their end is right on your inside shoulder, so step up off his OUTSIDE hip, then rip up and inside toward the ball and cut off the chase — your bar around three yards is the backside anchor of the wall.',
    },
  },
}

const vs52: FrontPlan = {
  // Ryan's 2026-08-15 ruling: the read key vs the 5-2 is the FIRST MAN
  // OUTSIDE the playside tackle — the end E-R, same as the even fronts. Since
  // the 2026-09-17 alignment change there is no man head up on RT at all:
  // their tackle is a 3-technique on RG's outside shoulder (x 1.8) and the
  // end is a 5-technique at 3.55. RT is uncovered inside.
  readKey: 'E-R',
  actions: {
    ...SKILL,
    // X: the end on his inside shoulder is the READ — never block him.
    // Release tight off his outside hip and pin the first jersey that fills,
    // pushing back inside: the same pin shape the wing draws off the even
    // read keys, hung off E-R's hip at 3.55.
    X: [
      {
        kind: 'block',
        path: [
          { x: 4.55, y: 0.1 },
          { x: 5.15, y: 1.6 },
          { x: 5.05, y: 3.3 },
          { x: 4.5, y: 4.1 },
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
    // RT has nobody but the read-key end outside him, so he runs the even
    // fronts' job exactly: release inside the end and climb to the playside
    // backer.
    RT: [
      {
        kind: 'block',
        path: [
          { x: 2.6, y: 1.1 },
          { x: 2.4, y: 2.6 },
          { x: 2, y: 3.6 },
        ],
      },
    ],
    // RG is COVERED in the 5-2 now — their tackle is on his outside shoulder
    // (x 1.8), the same look the even fronts give him — so he bases him,
    // bar a yard past the LOS.
    RG: [
      {
        kind: 'block',
        path: [
          { x: 2.25, y: 0.45 },
          { x: 2.5, y: 1.15 },
          { x: 2.05, y: 1.75 },
        ],
      },
    ],
    // Scoop: LG takes the nose over so C can climb.
    LG: [
      {
        kind: 'block',
        path: [
          { x: -0.6, y: 0.3 },
          { x: 0.68, y: 1.05 },
          { x: 0.4, y: 1.65 },
        ],
      },
    ],
    // C takes the nose's playside number, then climbs off his playside edge
    // and bends back to the backside backer.
    C: [
      {
        kind: 'block',
        path: [
          { x: 0.75, y: 0.7 },
          { x: 0.5, y: 2.3 },
          { x: -1.4, y: 3.5 },
        ],
      },
    ],
    // LT: BST vs odd — their tackle is not on him any more, he is the
    // 3-technique in the gap between LT and LG. Step down and take him.
    LT: [
      {
        kind: 'block',
        path: [
          { x: -2.5, y: 0.25 },
          { x: -1.25, y: 1.45 },
          { x: -1.6, y: 1.85 },
        ],
      },
    ],
  },
  assignments: {
    C: {
      rule: 'Step playside. Covered — Scoop with the backside guard.',
      detail: "Odd front: the nose is head up on you. Step playside and take his playside number until the backside guard takes him over — then climb to the wall, bending back to the backside backer around three to four yards.",
    },
    LG: {
      rule: 'Odd — Scoop with C.',
      detail: 'Step playside and take the nose over so the center can climb. Get your helmet on his playside number and push him back toward the backside. If the nose slants away from us, he is yours alone and the center climbs early.',
    },
    LT: {
      rule: 'Step down — take the tackle inside you.',
      detail: 'Nobody is head up on you in this front. Their tackle is on the guard\'s outside shoulder, in the gap between you and him — so step DOWN and take him: hat across his playside number, drive him back off the line toward the backside. Nothing chases us from behind.',
    },
    RG: {
      rule: 'Base — the tackle on your outside shoulder.',
      detail: 'You are COVERED in a 5-2: their tackle sits on your outside shoulder, the same place he sits in an even front, so he is yours. Step playside, get your helmet across his playside number, and drive him back off the line — your bar sets about a yard past it.',
    },
    RT: {
      rule: 'Step inside, veer inside — up to the backer.',
      detail: 'Nobody lines up on you in a 5-2 and the only man outside you is the END — that is the read key, so leave him alone. Release inside him and climb to the playside backer, exactly the same as the even fronts.',
    },
    X: {
      rule: 'Tight off the read key — pin the first filler.',
      detail: 'The end is a 5-technique on your INSIDE shoulder, and he is the READ KEY — never block him. Release tight off his outside hip, same as the wing does off the even read keys, and pin the first jersey that fills, pushing him back inside. Both backers are covered underneath you.',
    },
    R: {
      rule: 'Work outside X — pin the next filler.',
      detail: 'The tight end pins off the read key, so wrap outside his block and pin the next color that fills — in this front that is the near safety coming down. Rule two: hit the near color — find an opponent and block.',
    },
    Y: {
      rule: 'Backside — Rip and anchor the wall.',
      detail: 'Their end is right on your inside shoulder, so step up off his OUTSIDE hip, then rip up and inside toward the ball and cut off the chase — your bar around three yards is the backside anchor of the wall.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table, roles resolved for VEER RIGHT out of
// Tight: PST=RT, PSG=RG, playside TE=X, PSW=R, pitch man=L, backside TE=Y.
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  RT: {
    rule: 'Never block the read key — release inside him and climb.',
    detail:
      'The read key is the first man OUTSIDE you — never block him. Step inside with your playside foot, release inside the end, and take the first backer you see. Same job in every front we see: nothing lines up head up on you, their tackle is on the guard beside you, and the end outside you is always the read.',
  },
  RG: {
    rule: 'Step inside. Covered: base. Uncovered: base the backer.',
    detail: 'If a man is on you, take him — and in every front we see their tackle is on your outside shoulder, so he is yours. If nobody is on you, step playside and go get a linebacker.',
  },
  C: {
    rule: 'Step playside. Covered: base. Uncovered: get vertical.',
    detail: 'Playside foot first, every time. Covered means block him. Uncovered means climb straight up the middle to the second level.',
  },
  LG: {
    rule: 'Even: Rip with the tackle outside you. Odd: Scoop with C.',
    detail: 'Look at the center\'s nose. Nobody there (even) — Rip: our tackle pulls down for the man on your outside shoulder, and you release inside him and climb to the wall at the backside backer. A nose guard there (odd) — Scoop it with the center.',
  },
  LT: {
    rule: 'Rip with the guard inside you. Odd: step down and take the tackle.',
    detail: 'Your first step is DOWN the line behind the guard, never out. Even front: pull around the far side of the tackle on the guard\'s outside shoulder, get your helmet on his playside number, and push him away from the play. Odd front: nobody pulls — that same tackle is in the gap right inside you, so step down and take him. Nothing chases us from behind.',
  },
  X: {
    rule: 'Playside: base the first man outside the read key.',
    detail:
      'You are a tight end in this set and the play comes right at you. Never block the read key — release past him and BASE the first defender outside him: the walked-up backer or the playside backer, whichever this front puts there. If the front puts nobody there (the 5-2), stay tight off the read key\'s hip and pin the first color that fills.',
  },
  Y: {
    rule: 'Backside: Rip.',
    detail:
      'You are the backside tight end on this one. Their end is a 5-technique right on your inside shoulder, so there is no lane under him: step up off his OUTSIDE hip, then rip up and inside toward the ball and cut off the chase — anchor the backside of the wall around three yards. (If the play ever comes your way, you base the first man outside the read key.)',
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
  'Read key per front — RESOLVED (Ryan, 2026-08-15): the read is the FIRST MAN OUTSIDE the playside tackle in EVERY front — the end E-R, vs the 5-2 too (not a tackle head up on RT, as first drafted). X releases past the read key in every front and never blocks him.',
  'DL ALIGNMENT (Ryan, 2026-09-17): "N is directly over C. DT should be directly over the last letter on the guard (either the L or the G in RG). DE should be directly over the edge of the circle on the OT." Every front now aligns its tackles at x ±1.8 (a 3-technique on the guard\'s outside shoulder) and its ends at x ±3.55 (a 5-technique on our tackle\'s outside shoulder) — the 5-2 included, where the tackles used to sit head up on our tackles at ±3. For this play: the playside GUARD is covered on all three fronts, the playside TACKLE on none of them, X\'s release off the read key was pulled in almost a full yard (the end moved from 4.4 to 3.55), and Y\'s backside rip now goes up off the end\'s OUTSIDE hip because the 5-technique leaves him no inside lane.',
  "JUDGMENT CALL — vs the 4-4 the walked-up outside backer (O-R) is BLOCKED, not ignored: he is the first man outside the read key, so X bases him and drives him out of the alley — no `ignored` list, unlike the wing-only picture that leaves two men to the option. X's bar pushes away from the wall, the base/kick-out exception.",
  'JUDGMENT CALL — vs the 4-3, X climbs and bases the playside backer (B-R); RT walls off the first jersey inside instead; the wing pins the first color filling the alley, modeled as the near safety coming down. Same division of labor veer-left-red drafted — the alternative is RT to the backer and X to the safety.',
  "Vs the 5-2 — REWORKED to Ryan's 2026-08-15 read ruling and RE-ALIGNED 2026-09-17: the read key is the end E-R, so X's base of the end is GONE (he is deliberately unblocked). With the tackle now a 3-technique on RG's outside shoulder, the playside pair SWAPPED jobs from the 2026-08-15 pass: RG bases that tackle (bar a yard past the LOS) and RT — uncovered except for the read-key end — releases inside and climbs to the playside backer, the same stroke he runs vs the even fronts. LT steps DOWN onto the backside 3-technique in the gap inside him instead of basing a man head up. X pins tight off the read key's hip and the wing wraps outside him and pins the next filler. Both inside backers covered exactly once (RT to B-R, C off the scoop to B-L); the 5-2 picture is the exact mirror of veer-left-tight's.",
  'JUDGMENT CALL — the playside corner (C-R) is unblocked in every front, same as veer-left-red: no split receiver exists in Tight, and the wing\'s rule keeps him on the alley. The pitch man has to beat the corner with speed. Flag if Ryan wants the wing on the corner instead.',
  "The wall identity carries over (Ryan's 2026-08-10 markup): one rising wall, single continuous curved block strokes, climbers' bars at 3–4 yards, down-lineman bars a yard past the LOS, bars cutting back toward the backside (the LEFT here) except X's base/kick-outs and the wing's pins. Backside Rip: LT pulls behind LG and washes the 3-technique on LG's outside shoulder away; LG releases inside that man and climbs to the backside backer. Vs the 5-2 LT steps down onto that same 3-technique (nobody is head up on him) and LG scoops the nose with C.",
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
