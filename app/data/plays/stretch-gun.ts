/**
 * STRETCH from the GUN — the four gun versions of app/data/plays/stretch.ts.
 *
 * Built with `gunPlay` (app/data/plays/gun-shared.ts) off the four under-center
 * Stretch plays. The line, X and Y keep their jobs, so this file overrides only
 * what the gun actually changes: the backfield, the slot wing, the ball
 * carrier, and the words.
 *
 * THE GUN SET (app/data/shotgun.ts): Q (0, −3) · Super (−1, −4) · the OTHER
 * back a yard right of the quarterback and a yard behind at (1, −4) — that is
 * R in Red Gun and L in Black Gun — and the remaining wing out in the open
 * slot, L at (−8.5, −1) in Red, R at (8.5, −1) in Black. Black Gun is NOT Red
 * Gun mirrored: Super is on the quarterback's left in BOTH sets, only the slot
 * changes sides. That is why all four plays are built from their own base with
 * the backfield drawn by hand, and none of them is a mirror.
 *
 * COACH RYAN'S RULINGS (2026-09-21), applied here:
 *   - No pre-snap motion.
 *   - "STRETCH IN THE GUN SHOULD ALWAYS GO TO THE SUPER." Super carries on all
 *     four plays, both directions, both sets. This supersedes the earlier
 *     "playside back gets the ball" rule for Stretch (it still holds for Veer).
 *   - The other back — the wing beside the quarterback — leads play side or
 *     fakes inside.
 *   - The slot wing blocks down when he is play side.
 *
 * WHAT THAT DOES TO THE PICTURE. Under center this family has two wings on the
 * line of scrimmage. From the gun one of them is in the backfield, so on every
 * play exactly one wing block has to be replaced:
 *   - STRONG-SIDE plays (Red Gun Left, Black Gun Right — the tight end is on
 *     the play side): the wing who moved is the BACKSIDE wing, who used to
 *     climb to the backside inside backer. Nobody replaces him; that wing
 *     fakes the inside give instead, which is what holds that backer.
 *   - WEAK-SIDE plays (Red Gun Right, Black Gun Left — the play runs away from
 *     the tight end): the wing who moved is the PLAYSIDE wing, who set the
 *     edge. He LEADS out of the backfield and makes that same block, front for
 *     front, and the tight end — who used to climb past the backside end —
 *     now blocks it, because the slot wing is 8½ yards away and can't.
 *
 * GEOMETRY. Super stands at (−1, −4), a yard LEFT of the quarterback in both
 * sets, so the two directions draw differently:
 *   - LEFT: he is already on the play side. Open left, take the ball at about
 *     (−1.8, −3.4), press flat to the aiming point OUTSIDE the playside tackle
 *     (−3.8, −1.9). No bucket step, no deep mesh.
 *   - RIGHT: he CROSSES BEHIND THE QUARTERBACK — flat along his own depth,
 *     under the quarterback's heels, and takes the ball on the move at about
 *     (2.4, −3.6), behind the inside leg of the right tackle, then presses to
 *     the same aiming point on that side (3.8, −1.9). The quarterback opens
 *     right and works a step of depth to meet him there.
 * Every stroke from the aiming point downfield is the base path verbatim
 * (measured off varsity page-12 — see stretch.ts).
 */

import type { Action, Assignment, Play } from '../../types/football'
import { gunPlay } from './gun-shared'
import {
  stretchLeftBlack,
  stretchLeftRed,
  stretchRightBlack,
  stretchRightRed,
} from './stretch'

/** A block aimed at a defender — no path, so it can never strand a diagram. */
const block = (targetId: string): Action[] => [{ kind: 'block', targetId }]

// ---------------------------------------------------------------------------
// Backfield strokes. Drawn from the GUN starts, never offset from the
// under-center spots. Paths are absolute yards EXCLUDING the player's own
// alignment (docs/SEAM.md §2).
// ---------------------------------------------------------------------------

/**
 * Super going LEFT, from (−1, −4): he is already on the play side. Open left,
 * take the ball at the mesh (−1.8, −3.4), press to the playside tackle's
 * outside shoulder (−3.5, −0.7), then climb the C gap — same as under center.
 */
const CARRY_LEFT: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -1.8, y: -3.4 },
      { x: -3, y: -2.6 },
      { x: -3.35, y: -1.8 },
      { x: -3.5, y: -0.7 },
      { x: -3.75, y: 0.8 },
      { x: -3.9, y: 3.2 },
    ],
  },
]

/**
 * Super going RIGHT, from (−1, −4): he CROSSES BEHIND THE QUARTERBACK. Flat
 * along his own depth (about 4½ deep, under the quarterback's heels and under
 * the other back's spot at (1, −4)), takes the ball on the move at the mesh
 * (2.4, −3.6) behind the right tackle's inside leg, presses to
 * RT's outside shoulder (3.5, −0.7), then climbs the C gap.
 */
const CARRY_RIGHT_CROSS: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: 0.2, y: -4.5 },
      { x: 1.5, y: -4.4 },
      { x: 2.4, y: -3.6 },
      { x: 3.2, y: -2.6 },
      { x: 3.35, y: -1.8 },
      { x: 3.5, y: -0.7 },
      { x: 3.75, y: 0.8 },
      { x: 3.9, y: 3.2 },
    ],
  },
]

/** Q going LEFT: open play side to the mesh, hand it off, short flat fake back. */
const Q_LEFT: Action[] = [
  { kind: 'run', path: [{ x: -1, y: -3.2 }, { x: -1.8, y: -3.4 }] },
  { kind: 'fake', path: [{ x: -0.6, y: -3.6 }, { x: 0.4, y: -3.9 }] },
]

/**
 * Q going RIGHT: open right and work a step of depth to meet Super crossing
 * behind him — the mesh is at (2.4, −3.6) — hand it off, then a short flat
 * fake back to the left, between his own track and Super's.
 */
const Q_RIGHT: Action[] = [
  { kind: 'run', path: [{ x: 1.2, y: -3.3 }, { x: 2.4, y: -3.6 }] },
  { kind: 'fake', path: [{ x: 1.4, y: -3.9 }, { x: 0.3, y: -4.1 }] },
]

/**
 * The other back faking the inside give on a LEFT-going play: the wing at
 * (1, −4) steps across behind the quarterback and runs the playside A gap
 * (x ≈ −0.8) with his arms up.
 */
const FAKE_INSIDE_LEFT: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 0.3, y: -3.5 },
      { x: -0.4, y: -2.2 },
      { x: -0.8, y: -0.8 },
    ],
  },
]

/**
 * The same fake on a RIGHT-going play: the wing at (1, −4) is already on the
 * play side, so he goes straight up — meets the quarterback's opening step at
 * about (1.2, −3.2), gets the ride, and runs the right A gap (x ≈ 0.8) with
 * his arms up while Super takes the ball behind him.
 */
const FAKE_INSIDE_RIGHT: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 1.2, y: -3.2 },
      { x: 0.9, y: -2 },
      { x: 0.8, y: -0.8 },
    ],
  },
]

/**
 * The other back LEADING play side on a RIGHT-going play: the wing at (1, −4)
 * drop-steps and swings BEHIND the mesh (Super is crossing at 4½ deep, so
 * the lead goes a half-yard deeper still), gets outside our tackle at
 * (4.4, −3.2) and blocks the man he would have blocked from his wing spot.
 */
const LEAD_RIGHT = (targetId: string): Action[] => [
  {
    kind: 'run',
    path: [
      { x: 1.6, y: -4.9 },
      { x: 3.2, y: -4.6 },
      { x: 4.4, y: -3.2 },
    ],
  },
  { kind: 'block', targetId },
]

/**
 * The same lead on a LEFT-going play: the wing at (1, −4) runs flat behind
 * the mesh, gets outside our tackle at (−3.9, −2.8) and blocks his man.
 */
const LEAD_LEFT = (targetId: string): Action[] => [
  {
    kind: 'run',
    path: [
      { x: -0.2, y: -4.5 },
      { x: -2.4, y: -4.2 },
      { x: -3.9, y: -2.8 },
    ],
  },
  { kind: 'block', targetId },
]

// ---------------------------------------------------------------------------
// Teaching text the four plays share.
// ---------------------------------------------------------------------------

/** Super going LEFT — he is already on the play side. */
const CARRIER_LEFT: Assignment = {
  rule: 'Take the direct handoff. Eyes on the tackle\'s outside shoulder — cut up the C gap or bounce it.',
  detail:
    'From the gun there is no bucket step — you are already 4 yards deep and already on the play side. Open play side, take the ball off the quarterback right now, and press right at the OUTSIDE SHOULDER of the playside tackle. This is an outside run — never cut up inside the tackle. If the edge is sealed, cut up into the C gap, between the tackle and the man outside him. If the edge runs wide, bounce it to the sideline. One cut and go HARD, no dancing back there.',
}

/** Super going RIGHT — he crosses behind the quarterback to get there. */
const CARRIER_RIGHT: Assignment = {
  rule: 'Cross behind the quarterback. Take the handoff, eyes on the tackle\'s outside shoulder — cut up the C gap or bounce it.',
  detail:
    'The ball is going RIGHT and you are on the quarterback\'s left, so you cross behind him — flat, at your own depth, right under his heels. The other back is already gone. The quarterback opens right and meets you behind the right tackle; take the ball on the move and press right at the OUTSIDE SHOULDER of the playside tackle. This is an outside run — never cut up inside the tackle. If the edge is sealed, cut up into the C gap, between the tackle and the man outside him. If the edge runs wide, bounce it to the sideline. One cut and go HARD, no dancing back there.',
}

const QB_GUN_LEFT: Assignment = {
  rule: 'Catch the snap, open play side, hand it off, carry out a short fake.',
  detail:
    'You are 3 yards back, so there is no reverse pivot and no deep mesh to work for. Open play side as the ball hits your hands, put it in Super\'s belly right away, and then keep running the other way for two steps with your hands on your hip — the back side has to honor you or the Waggle off this look is free.',
}

const QB_GUN_RIGHT: Assignment = {
  rule: 'Catch the snap, open right, meet Super crossing behind you, hand it off, short fake back.',
  detail:
    'Super is on your left and the ball is going right, so he has to cross behind you. Open right as the ball hits your hands and work a step of depth toward the right tackle — that is where you meet him. Put it in his belly on the move, then keep running back to the left for two steps with your hands on your hip. The back side has to honor you or the Waggle off this look is free.',
}

/** The wing beside the quarterback on a LEFT-going play: across and up the A gap. */
const FAKING_BACK_LEFT: Assignment = {
  rule: 'Fake the inside give. Run the A gap like you have it.',
  detail:
    'No handoff is coming to you. Step across behind the quarterback and run straight into the A gap, arms up like you have the ball. You are the reason the inside backers stop for one beat — full speed, get tackled if you have to.',
}

/** The wing beside the quarterback on a RIGHT-going play: straight up the A gap. */
const FAKING_BACK_RIGHT: Assignment = {
  rule: 'Fake the inside give. Run the A gap like you have it.',
  detail:
    'No handoff is coming to you — Super takes it behind you. You are already on the play side, so go NOW: straight up into the A gap, arms up like you have the ball. The quarterback rides you for a step on his way to Super. You are the reason the inside backers stop for one beat — full speed, get tackled if you have to.',
}

const LEAD_BACK: Assignment = {
  rule: 'Lead play side — the edge block you make from the wing is still yours.',
  detail:
    'You are in the backfield now instead of on the line, but the man you block on the edge is the same man. Run flat behind the mesh, get outside our tackle, and put your helmet on the first man who can set the edge. Beat Super there — he is reading your block.',
}

const SLOT_DOWN: Assignment = {
  rule: 'Playside slot: block DOWN.',
  detail:
    'You are 8½ yards out now, not tight to the tackle. On the snap come back DOWN inside and take the first man who shows in the alley from the outside in. Run him away from the football and stay on him — this is the block that breaks the play.',
}

const SLOT_BACKSIDE: Assignment = {
  rule: 'Backside slot: cut off the chase.',
  detail:
    'The play is going away from you. Take the shortest line to the first man on your side who can run it down and wall him off. Nothing crosses your face to the football.',
}

const Y_TAKES_THE_END: Assignment = {
  rule: 'Backside: cutoff — bar the end inside you.',
  detail:
    'The wing who used to block this man is in the backfield now, so the end on your inside shoulder is yours. Step down, get your head across his playside shoulder, and wall him off. Nothing chases us from behind.',
}

const SUMMARY = 'Direct handoff to Super, who runs outside the tackle.'

const coachNotesLeft = [
  'Gun: no bucket step - Super opens play side, takes the ball, gets outside the tackle.',
  'One cut and straight upfield. No dancing.',
  'Line: nothing changed up front - win the race play side.',
]

const coachNotesRight = [
  'Super crosses behind the quarterback - take it on the move, get outside the tackle.',
  'One cut and straight upfield. No dancing.',
  'Line: nothing changed up front - win the race play side.',
]

const SUPER_ALWAYS_NOTE =
  "COACH-CONFIRMED (Ryan, 2026-09-21): \"Stretch in the gun should always go to the super.\" Super carries on all four gun Stretch plays, both directions, both sets. This replaced the earlier draft where the playside back (R in Red Gun Right, L in Black Gun Right) took the give. ballCarrier is 'S' on every play in this file."

const GEOMETRY_LEFT_NOTE =
  'DRAFT — backfield geometry, LEFT: the mesh is drawn at about (−1.8, −3.4), a yard play side of the quarterback and a half-yard in front of Super, and the handoff happens right there. No bucket step and no deep mesh from the gun. Super presses to the playside tackle\'s outside shoulder (−3.5, −0.7) and climbs the C gap, the same as under center — never inside the tackle (Ryan, 2026-09-25).'

const GEOMETRY_RIGHT_NOTE =
  'DRAFT — backfield geometry, RIGHT: Super starts a yard LEFT of the quarterback, so he crosses behind him. He is drawn flat at about 4½ deep (under the quarterback\'s heels and under the other back\'s spot at (1, −4)), takes the ball on the move at (2.4, −3.6) — behind the right tackle\'s inside leg, the same landmark the under-center mesh uses — and presses to the playside tackle\'s outside shoulder (3.5, −0.7) and climbs the C gap. The quarterback opens right and works a step of depth to meet him. Everything from the aiming point downfield is the under-center path verbatim. The mesh is a step later and a yard wider than on the left-going plays; if you want it tighter, Super\'s crossing line and the quarterback\'s open step both move.'

const QB_FAKE_NOTE =
  'DRAFT — the quarterback carries out a short, flat two-yard fake to the back side after the handoff. The under-center Stretch draws NO boot at all (varsity page-12 stops his line at the mesh); from the gun he has nothing else to do and the fake is what makes the gun Waggle look live. Say the word if you want it longer, shorter, or gone.'

const NO_MOTION_NOTE =
  'Per your 2026-09-21 ruling there is no pre-snap motion on any of these, and the linemen, Y and X inherit their under-center jobs untouched — only the backfield and the slot wing are redrawn here.'

// ---------------------------------------------------------------------------
// RED GUN STRETCH LEFT — strong side (tight end + slot to the left).
// Super carries; R fakes the inside give; the slot wing L blocks down.
// ---------------------------------------------------------------------------

const redLeftGun: Play = gunPlay(stretchLeftRed, {
  ballCarrier: 'S',
  summary: SUMMARY,
  description:
    'Our strong-side stretch out of the gun. Up front nothing changes — the same 45-degree steps, the same wall moving sideways. The backfield does: the quarterback is 3 yards back, so Super opens play side from his gun spot and takes the ball right now instead of bucket-stepping into a deep mesh. The right wing fakes the inside give to hold the backers and the left wing blocks down from the slot. Super still eyes the playside tackle\'s outside shoulder, then cuts up the C gap or bounces it.',
  actions: {
    S: CARRY_LEFT,
    Q: Q_LEFT,
    R: FAKE_INSIDE_LEFT,
  },
  assignments: {
    S: CARRIER_LEFT,
    Q: QB_GUN_LEFT,
    R: FAKING_BACK_LEFT,
    L: SLOT_DOWN,
  },
  vs: {
    '44': {
      assignments: {
        L: {
          rule: 'Playside slot: block down on the force man.',
          detail:
            'In a 4-4 the walked-up backer outside our tight end is the force man, and from the slot he is INSIDE you. Come back down at him and take him from the outside in. If he runs upfield past you, wash him past and turn up on the next color.',
        },
      },
    },
    '43': {
      assignments: {
        L: {
          rule: 'Playside slot: block down on the outside backer.',
          detail:
            'The backer on your side is the first man in the alley. From the slot you are already outside him — come down and get on him before he can run to the sideline. Outside in, and stay on him.',
        },
      },
    },
    '52': {
      assignments: {
        L: {
          rule: 'Playside slot: nobody to block down on — climb to the corner.',
          detail:
            'The 5-2 walks nobody up outside our tight end, so there is nothing between you and the corner. Same as under center: go get him. That block turns eight yards into a touchdown.',
        },
      },
    },
  },
  formationTwinId: 'stretch-left-black-gun',
  audibleFlipId: 'stretch-right-red-gun',
  coachNotes: coachNotesLeft,
  reviewNotes: [
    SUPER_ALWAYS_NOTE,
    "Red Gun Stretch Left: Super is already on the play side, so this is the plain one — he opens left and takes the ball. Built from stretch-left-red with gunPlay; linemen, Y and X inherit.",
    GEOMETRY_LEFT_NOTE,
    QB_FAKE_NOTE,
    "DRAFT — the other back: R FAKES THE INSIDE GIVE rather than leading. Reasoning: on this play the play side already has Y reaching the end, the tackle comboing and climbing, and the slot blocking down, so a fourth body out there has nobody left but a safety; and the man R used to block from the wing spot — the BACKSIDE inside backer — is exactly the man an inside fake freezes. He steps across behind the quarterback and runs the playside A gap (x ≈ −0.8) with his arms up. If you'd rather have him lead into the alley, it is a one-line change per front.",
    'DRAFT — consequence of that choice: the backside inside backer (B-R in the 4-4 and 5-2, S/B-R in the 4-3) is now UNBLOCKED — under center the right wing climbed to him. The fake is what handles him, plus the back side of the line stepping down. Nothing is in `ignored`; say the word if you want a dashed ring on him.',
    "DRAFT — the slot wing's target did not move in any front: 4-4 the walked-up force man (O-L), 4-3 the outside backer (B-L), 5-2 the corner (C-L) — the same men the wing blocked from (−5.7, −1). What changed is the ANGLE and the words: from 8½ yards out he is blocking DOWN on them, outside in, per your 'slot wing blocks down' ruling. The 5-2 is the odd one out — there is nobody walked up out there to block down on, so he keeps the base's climb to the corner. If you'd rather he crack the playside safety (F-L) in that front and let the corner run free, that's a one-liner.",
    NO_MOTION_NOTE,
  ],
})

// ---------------------------------------------------------------------------
// RED GUN STRETCH RIGHT — weak side (away from the tight end). Super crosses
// behind the quarterback and carries; R — the playside wing, now in the
// backfield — LEADS and makes his own edge block; Y takes the backside end
// the slot wing can no longer reach.
// ---------------------------------------------------------------------------

const redRightGun: Play = gunPlay(stretchRightRed, {
  ballCarrier: 'S',
  summary: SUMMARY,
  description:
    'The weak-side stretch out of the gun, and the ball still goes to Super — he crosses behind the quarterback from his spot on the left and takes the handoff on the move. The right wing is the back beside the quarterback now, so he leads out in front of Super and makes the same edge block he would have made from the wing; the left wing cuts off from the slot, and Y walls off the end inside him. Same 45-degree steps up front, same aiming point: the playside tackle\'s outside shoulder.',
  actions: {
    S: CARRY_RIGHT_CROSS,
    Q: Q_RIGHT,
    // The slot wing is 8½ yards away and can no longer bar the backside end,
    // so the tight end — who used to climb PAST him — blocks him instead.
    Y: block('E-L'),
  },
  assignments: {
    S: CARRIER_RIGHT,
    Q: QB_GUN_RIGHT,
    R: LEAD_BACK,
    L: SLOT_BACKSIDE,
    Y: Y_TAKES_THE_END,
  },
  vs: {
    '44': {
      actions: { R: LEAD_RIGHT('O-R'), L: block('O-L') },
      assignments: {
        S: CARRIER_RIGHT,
        Y: Y_TAKES_THE_END,
        R: {
          rule: 'Lead play side — block the force man.',
          detail:
            'In a 4-4 the walked-up backer outside is the force man, and he is your man when we are under center. Drop-step, swing flat behind the mesh, get outside our tackle and put your helmet on him. If he runs upfield past you, wash him past and Super bounces around it.',
        },
        L: {
          rule: 'Backside slot: cut off the backer on your side.',
          detail:
            'The walked-up backer away from the play is the one who chases us down from behind. Take the shortest line to his outside shoulder and wall him off.',
        },
      },
    },
    '43': {
      actions: { R: LEAD_RIGHT('B-R'), L: block('B-L') },
      assignments: {
        S: CARRIER_RIGHT,
        Y: Y_TAKES_THE_END,
        R: {
          rule: 'Lead play side — block the outside backer.',
          detail:
            'In a 4-3 the backer on the play side is the first man in the alley, and he is your man when we are under center. Drop-step, swing flat behind the mesh, get outside our tackle and get on him before he can run to the sideline.',
        },
        L: {
          rule: 'Backside slot: cut off the Will.',
          detail:
            'The backside backer is the man who runs this down from behind. Come down off your slot spot and wall him off — nothing crosses your face to the football.',
        },
      },
    },
    '52': {
      actions: { R: LEAD_RIGHT('E-R'), L: block('C-L') },
      assignments: {
        S: CARRIER_RIGHT,
        Y: Y_TAKES_THE_END,
        R: {
          rule: 'Lead play side — help our tackle on the end.',
          detail:
            'In a 5-2 the end is tight, right on our tackle\'s outside shoulder, and that is the man you reach when we are under center. Drop-step, swing flat behind the mesh and get your helmet across his outside number so our tackle can come off to the backer. Turn him in — Super runs off your block.',
        },
        L: {
          rule: 'Backside slot: run off the corner.',
          detail:
            'The 5-2 has nobody in the backside alley, so the corner over you is the only man who can chase from your side. Get on him and stay on him.',
        },
      },
    },
  },
  formationTwinId: 'stretch-right-black-gun',
  audibleFlipId: 'stretch-left-red-gun',
  coachNotes: coachNotesRight,
  reviewNotes: [
    SUPER_ALWAYS_NOTE,
    'Red Gun Stretch Right: Super carries, crossing behind the quarterback from his spot on the left. Built from stretch-right-red with gunPlay; linemen and X inherit.',
    GEOMETRY_RIGHT_NOTE,
    QB_FAKE_NOTE,
    "DRAFT — the other back (R) LEADS on this one instead of faking. The wing who moved into the backfield is the PLAYSIDE wing, the man who sets the edge on the weak side — if nobody replaces him the play has no edge blocker at all (X is split to the numbers). So R makes his own block from a new spot: the force man O-R in the 4-4, the Sam B-R in the 4-3, the end E-R in the 5-2. This is the same lead/fake split the file had before the 'always Super' ruling (lead on the split-end side, fake on the tight-end side); it was tied to which WING is in the backfield, not to who carries, so it carried over unchanged.",
    "DRAFT — R's lead is drawn as a drop-step and a swing BEHIND the mesh — down to about 4.9 deep, then out to (4.4, −3.2) outside our tackle — because Super is crossing right through the spot R started on. R has to clear first and stay out of Super's lane; the deeper swing is what keeps the two paths apart on the diagram and on the field. If you would rather he take a flat lateral step and let Super go behind him, the first point moves.",
    "DRAFT — the 5-2 version of that lead is the one to eyeball. A back starting 4 yards deep arrives on a down lineman later than a wing standing at (4.2, −1) did. The alternative is our tackle taking the end alone (drop his chained climb) and R climbing to the playside backer B-R instead. Coded the first way because it keeps RT's combo-and-climb exactly as it is under center.",
    "DRAFT — Y now BLOCKS the backside end (E-L) in all three fronts instead of climbing past him. Under center the left wing barred that end from (−5.7, −1) and Y scrambled up inside him; from the gun that wing is out in the slot at −8.5 and cannot get there, so the end would run the play down from behind. Y stepping down on him is the plain answer. Nobody is left climbing inside behind LT's cutoff — LT's own step-down covers that gap.",
    "DRAFT — the backside slot wing's job: cut off the first man on his side who can chase — O-L in the 4-4, B-L (Will) in the 4-3, and in the 5-2 there is nobody in that alley so he runs off the corner C-L. As a bonus this puts a body on the Will in the even fronts, which the under-center play left unblocked (flagged in stretch.ts's review notes).",
    NO_MOTION_NOTE,
  ],
})

// ---------------------------------------------------------------------------
// BLACK GUN STRETCH RIGHT — strong side out of Black (tight end + slot right).
// Super crosses behind the quarterback and carries; L — the back beside the
// quarterback — fakes inside; the slot wing R blocks down. NOT a mirror of
// Red Gun Left — Super stays on the quarterback's LEFT in both sets.
// ---------------------------------------------------------------------------

const blackRightGun: Play = gunPlay(stretchRightBlack, {
  ballCarrier: 'S',
  summary: SUMMARY,
  description:
    'The strong-side stretch out of Black Gun, and the ball goes to Super — he crosses behind the quarterback from his spot on the left and takes the handoff on the move behind the right tackle. The left wing is the back beside the quarterback now; he fakes the inside give straight up the A gap to freeze the backers while Super goes by behind him. The right wing blocks down from the slot, and the line takes the same 45-degree steps it takes under center.',
  actions: {
    S: CARRY_RIGHT_CROSS,
    Q: Q_RIGHT,
    L: FAKE_INSIDE_RIGHT,
  },
  assignments: {
    S: CARRIER_RIGHT,
    Q: QB_GUN_RIGHT,
    L: FAKING_BACK_RIGHT,
    R: SLOT_DOWN,
  },
  vs: {
    '44': {
      assignments: {
        R: {
          rule: 'Playside slot: block down on the force man.',
          detail:
            'In a 4-4 the walked-up backer outside our tight end is the force man, and from the slot he is INSIDE you. Come back down at him and take him from the outside in. If he runs upfield past you, wash him past and turn up on the next color.',
        },
      },
    },
    '43': {
      assignments: {
        R: {
          rule: 'Playside slot: block down on the outside backer.',
          detail:
            'The backer on your side is the first man in the alley. From the slot you are already outside him — come down and get on him before he can run to the sideline. Outside in, and stay on him.',
        },
      },
    },
    '52': {
      assignments: {
        R: {
          rule: 'Playside slot: nobody to block down on — climb to the corner.',
          detail:
            'The 5-2 walks nobody up outside our tight end, so there is nothing between you and the corner. Same as under center: go get him. That block turns eight yards into a touchdown.',
        },
      },
    },
  },
  formationTwinId: 'stretch-right-red-gun',
  audibleFlipId: 'stretch-left-black-gun',
  coachNotes: coachNotesRight,
  reviewNotes: [
    SUPER_ALWAYS_NOTE,
    "Black Gun Stretch Right: Super carries, crossing behind the quarterback. This is NOT Red Gun Stretch Left mirrored — Super stands on the quarterback's left in both sets — so it is built from stretch-right-black with the backfield drawn by hand.",
    GEOMETRY_RIGHT_NOTE,
    QB_FAKE_NOTE,
    "DRAFT — the other back (L) FAKES THE INSIDE GIVE rather than leading, for the same reason as Red Gun Left: the play side already has Y reaching the end, the tackle comboing and climbing and the slot blocking down; and the man L used to block from his wing spot — the BACKSIDE inside backer — is the man an inside fake freezes. Same lead/fake split the file had before the 'always Super' ruling; it hangs on which wing is in the backfield, not on who carries.",
    "DRAFT — L's fake is drawn STRAIGHT UP from (1, −4) into the right A gap (x ≈ 0.8): he is already on the play side, so there is no step across. His line meets the quarterback's opening step at about (1.2, −3.2) — that is the ride — and Super's crossing line passes under his spot at about 4½ deep. The order on the field is L first, Super behind him; the diagram shows the two strokes close together in that yard of backfield. If you'd rather L fake the BACKSIDE A gap so the quarterback's ride and Super's mesh are on opposite sides of him, that is a three-point change.",
    'DRAFT — consequence: the backside inside backer (B-L) is UNBLOCKED in all three fronts, because the wing who climbed to him under center is now the faking back. The fake plus the back side stepping down is what handles him. Nothing is in `ignored`.',
    "DRAFT — the slot wing's targets are unchanged from the under-center wing's (O-R in the 4-4, B-R in the 4-3, C-R in the 5-2); what changed is the angle and the words — from 8½ yards out he blocks DOWN on them, outside in. The 5-2 again has nobody walked up to block down on, so he keeps the climb to the corner.",
    NO_MOTION_NOTE,
  ],
})

// ---------------------------------------------------------------------------
// BLACK GUN STRETCH LEFT — weak side out of Black. Super is already on the
// play side and carries; L LEADS out of the backfield and takes over the edge
// block he would have made from the wing spot; Y takes the backside end.
// ---------------------------------------------------------------------------

const blackLeftGun: Play = gunPlay(stretchLeftBlack, {
  ballCarrier: 'S',
  summary: SUMMARY,
  description:
    'The weak-side stretch out of Black Gun. Super opens left from his gun spot and takes the direct handoff — no bucket step, no deep mesh — and the left wing, who is now the back beside the quarterback, leads out in front of him and makes the same edge block he would have made from the wing. The right wing cuts off from the slot, Y walls off the end inside him, and the line never changes.',
  actions: {
    S: CARRY_LEFT,
    Q: Q_LEFT,
    // The slot wing is 8½ yards away and can no longer bar the backside end,
    // so the tight end — who used to climb PAST him — blocks him instead.
    Y: block('E-R'),
  },
  assignments: {
    S: CARRIER_LEFT,
    Q: QB_GUN_LEFT,
    L: LEAD_BACK,
    R: SLOT_BACKSIDE,
    Y: Y_TAKES_THE_END,
  },
  vs: {
    '44': {
      actions: { L: LEAD_LEFT('O-L'), R: block('O-R') },
      assignments: {
        Y: Y_TAKES_THE_END,
        L: {
          rule: 'Lead play side — block the force man.',
          detail:
            'In a 4-4 the walked-up backer outside is the force man, and he is your man when we are under center. Run flat behind the mesh, get outside our tackle and put your helmet on him. If he runs upfield past you, wash him past and Super bounces around it.',
        },
        R: {
          rule: 'Backside slot: cut off the backer on your side.',
          detail:
            'The walked-up backer away from the play is the one who chases us down from behind. Take the shortest line to his outside shoulder and wall him off.',
        },
      },
    },
    '43': {
      actions: { L: LEAD_LEFT('B-L'), R: block('B-R') },
      assignments: {
        Y: Y_TAKES_THE_END,
        L: {
          rule: 'Lead play side — block the outside backer.',
          detail:
            'In a 4-3 the backer on the play side is the first man in the alley. Run flat behind the mesh, get outside our tackle and get on him before he can run to the sideline.',
        },
        R: {
          rule: 'Backside slot: cut off the backer away from the play.',
          detail:
            'He is the man who runs this down from behind. Come down off your slot spot and wall him off — nothing crosses your face to the football.',
        },
      },
    },
    '52': {
      actions: { L: LEAD_LEFT('E-L'), R: block('C-R') },
      assignments: {
        Y: Y_TAKES_THE_END,
        L: {
          rule: 'Lead play side — help our tackle on the end.',
          detail:
            'In a 5-2 the end is tight, right on our tackle\'s outside shoulder, and that is the man you reach when we are under center. Run flat behind the mesh and get your helmet across his outside number so our tackle can come off to the backer. Turn him in — Super runs off your block.',
        },
        R: {
          rule: 'Backside slot: run off the corner.',
          detail:
            'The 5-2 has nobody in the backside alley, so the corner over you is the only man who can chase from your side. Get on him and stay on him.',
        },
      },
    },
  },
  formationTwinId: 'stretch-left-red-gun',
  audibleFlipId: 'stretch-right-black-gun',
  coachNotes: coachNotesLeft,
  reviewNotes: [
    SUPER_ALWAYS_NOTE,
    'Black Gun Stretch Left: Super is already on the play side, so he opens left and takes the ball, same as under center. Built from stretch-left-black with gunPlay; linemen and X inherit.',
    GEOMETRY_LEFT_NOTE,
    QB_FAKE_NOTE,
    "DRAFT — the other back (L) LEADS. The wing who moved into the backfield here is L, the PLAYSIDE wing on this weak-side play — the man who sets the edge — so he simply makes his own block from a new spot: the force man O-L in the 4-4, the backer B-L in the 4-3, the end E-L in the 5-2. Without him there is no edge blocker at all on this side (X is split to the numbers). He crosses behind the quarterback to get there, flat at about 4½ deep.",
    "DRAFT — the 5-2 version of that lead is the one to eyeball: a back starting 4 yards deep arrives on a down lineman later than a wing standing at (−5.7, −1) did. The alternative is our tackle taking the end alone and L climbing to the playside backer B-L instead. Coded the first way so LT's combo-and-climb stays exactly as it is under center.",
    "DRAFT — Y now BLOCKS the backside end (E-R) in all three fronts instead of climbing past him, because the right wing who barred that end under center is out in the slot at +8.5 and cannot reach him.",
    "DRAFT — the backside slot wing cuts off the first man on his side who can chase — O-R in the 4-4, B-R in the 4-3, the corner C-R in the 5-2, where nobody is in that alley. In the even fronts this puts a body on a backer the under-center play left unblocked.",
    NO_MOTION_NOTE,
  ],
})

export const stretchGunPlays: Play[] = [
  redRightGun,
  blackRightGun,
  redLeftGun,
  blackLeftGun,
]
