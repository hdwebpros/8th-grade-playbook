/**
 * SPLIT WIDE GUN — the Split Wide plays out of the gun.
 *
 * Coach Ryan, 2026-09-21: "all the split-wide stuff remains the same." Split
 * Wide has no wings, so the gun moves exactly two kids (app/data/shotgun.ts):
 *
 *      Q  (0, −1.3) → (0, −3)        S  (0, −4.5) → (−1, −4)
 *
 * The line never moves, the four receivers never move, and every block and
 * route on every front is inherited verbatim from the under-center play —
 * including the 5-2 corrections made on 2026-09-17. All that is re-drawn here
 * is the backfield: where the ball changes hands, how deep the quarterback
 * sets, and how Super and the quarterback get to the SAME aiming points the
 * base plays already own.
 *
 *   - DIVE: Super takes the ball direct from the quarterback's hip instead of
 *     off a reverse pivot, and still aims at the playside hip of the center.
 *   - KEEP: Super STILL motions out and settles (Ryan's ruling), just from a
 *     yard left of the quarterback instead of straight behind him. Same settle
 *     spot, same one-second set, same B gap for the quarterback.
 *   - SCREEN: the keep's motion and settle, then the standing catch. The
 *     quarterback's three-step drop shrinks to one step — he is already at 3.
 *   - VICTORY: play-action off the GUN Dive — mesh off the left hip, then two
 *     steps back to set at 5 instead of 5½. Same routes, same three seconds.
 *
 * 95/59 are NOT gunned — out of scope.
 *
 * DRAFT, exactly like the plays it is built from: every Split Wide play is
 * behind the review gate in HANDOFF §10, and the gun versions inherit that
 * gate plus their own unruled decisions. See `reviewNotes` on each play.
 */

import type { Action, Assignment, FrontId, OffPosId, Play } from '../../types/football'
import { gunPlay } from './gun-shared'
import {
  splitWideDiveLeft,
  splitWideDiveRight,
  splitWideKeeperLeft,
  splitWideKeeperRight,
  splitWideScreenLeft,
  splitWideScreenRight,
  splitWideVictory,
} from './split-wide'

/** The gate, in the same words the base file uses, on every play in here. */
const GATE =
  'DRAFT — Coach Ryan must approve this football before it reaches a player. Split Wide itself is already behind the HANDOFF §10 gate; the gun version inherits that gate and adds the decisions below.'

/** What the gun does and does not change — repeated on every play. */
const INHERIT_NOTE =
  'DRAFT — INHERITED VERBATIM: every lineman, both slots and both wide receivers keep the exact block they have under center, on all three fronts — 4-4, 4-3 and 5-2 — including the 5-2 changes made on 2026-09-17 (center has the nose alone, guards have the tackles, tackles have the ends, slots take the backers). Only S and Q have new actions, and the aiming points they run to are the base play\'s aiming points, unmoved. If the gun should change a block, say which one.'

/**
 * Where Super comes from now. He is a yard LEFT of the quarterback and a yard
 * behind him in EVERY gun set (shotgun.ts), which is why Dive Right and Dive
 * Left are no longer each other's mirror out here: going right he crosses the
 * quarterback's hip, going left he is already on the playside. Flagged.
 */

// ===========================================================================
// DIVE — direct handoff, same aiming point.
// ===========================================================================
//
// Under center: reverse pivot, ball in the belly on Super's second step.
// From the gun: the quarterback catches the snap at 3 yards and hands it to
// Super as he runs past his left hip, and Super squares up to the SAME track —
// across the line at the center's playside hip, then straight downhill.
//
// The mesh is 3 yards deep instead of 2, so the play hits about a count later
// and the line holds its blocks that much longer. That is the whole difference.

/** Right: from (−1,−4), past the quarterback's left hip, up to (0.8, 0.3). */
const DIVE_RIGHT_S: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -0.6, y: -3.6 }, // first step, flat across behind the quarterback
      { x: -0.05, y: -3.1 }, // ball, right off his left hip
      { x: 0.45, y: -1.6 }, // square up — same track as under center
      { x: 0.8, y: 0.3 }, // playside hip of the center — the base aiming point
      { x: 1.05, y: 3 },
      { x: 1.3, y: 6 },
    ],
  },
]

/** Right: catch it, give it on the left hip, boot away — same boot as the base. */
const DIVE_RIGHT_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.3, y: -3.15 }, // open left, ball out
      { x: -0.55, y: -3.05 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: -1.5, y: -3 }, // the base play's boot, landmark for landmark
      { x: -3.5, y: -3.4 },
      { x: -5, y: -3 },
    ],
  },
]

/** Left: from (−1,−4) he is already playside — straight up to (−0.8, 0.3). */
const DIVE_LEFT_S: Action[] = [
  {
    kind: 'carry',
    path: [
      { x: -0.85, y: -3.4 }, // ball, off the quarterback's left hip
      { x: -0.8, y: -2.6 },
      { x: -0.8, y: 0.3 }, // playside hip of the center — the base aiming point
      { x: -1.05, y: 3 },
      { x: -1.3, y: 6 },
    ],
  },
]

/** Left: reach left to give it, then boot away to the right like the base. */
const DIVE_LEFT_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.45, y: -3.25 },
      { x: -0.7, y: -3.1 },
    ],
  },
  {
    kind: 'fake',
    path: [
      { x: 1.5, y: -3 }, // the base play's boot, landmark for landmark
      { x: 3.5, y: -3.4 },
      { x: 5, y: -3 },
    ],
  },
]

const DIVE_NOTES = [
  GATE,
  INHERIT_NOTE,
  'DRAFT — THE MESH. Ryan ruled the aiming point ("same as the base"), not the give. Drawn as a DIRECT HANDOFF: Super runs past the quarterback\'s left hip at about 3 yards deep, takes it there, and squares to the center\'s playside hip. No pivot, no ride — the quarterback catches the snap and puts it in his belly in one motion. Tell me if you want a longer ride or a deeper mesh.',
  'DRAFT — SUPER IS ON THE LEFT IN BOTH DIRECTIONS. The gun rule in app/data/shotgun.ts puts Super a yard LEFT of the quarterback in every set, so Dive Left and Dive Right are no longer mirror images of each other out here: going LEFT he is already playside and runs almost straight downhill; going RIGHT he has to cross the quarterback\'s hip first, so the give happens a half step later and on a slight angle. Both still finish on the base track at the center\'s playside hip. If you would rather Super flop to the quarterback\'s right whenever we call Dive Right, that is a change to the gun alignment rule, not to this play — say the word and it moves everywhere.',
  'DRAFT — TIMING. The mesh is 3 yards deep instead of 2, so the dive hits about a count later than it does under center. The line is blocking the same men for a beat longer, which is a real coaching point vs a hard-charging 5-2 nose. Written into the coach notes as "hold your blocks one more count."',
  'DRAFT — THE BOOT ON DIVE RIGHT. The quarterback hands it off on his LEFT and then boots LEFT, which is the same side Super just came from. It reads clean on the diagram and it is the same boot landmark as the base play, but it is a busier picture than it is under center. Cut the boot or send him the other way if you want it cleaner.',
]

export const splitWideDiveRightGun: Play = gunPlay(splitWideDiveRight, {
  audibleFlipId: 'split-wide-dive-left-gun',
  ballCarrier: 'S',
  actions: { S: DIVE_RIGHT_S, Q: DIVE_RIGHT_Q } satisfies Partial<
    Record<OffPosId, Action[]>
  >,
  description:
    'The same dive, from the gun. Everybody blocks exactly what they block under center — the only change is the mesh: the quarterback catches the snap at 3 yards and hands it straight to Super off his left hip instead of turning his back to give it. Super still aims at the playside hip of the center and still falls forward for four.',
  coachNotes: [
    'Same dive. Only the handoff is different.',
    'Line: hold your blocks one more count - the ball is deeper.',
    'Super: take it off his hip and get square. Do not round it.',
  ],
  assignments: {
    S: {
      rule: 'Dive — take it off the quarterback\'s hip and aim at the playside hip of the center.',
      detail:
        'You start a yard left of him and a yard behind. Flat first step, run past his left hip, and the ball is in your belly right there — do not wait for it and do not reach back for it. Then get SQUARE and run the same track you run under center: the center\'s playside hip, take whatever crease shows, fall forward. Four yards every time.',
    },
    Q: {
      rule: 'Catch it, hand it off your left hip, carry out the fake away.',
      detail:
        'Snap comes to you at 3 yards. Look it in, open to your left, and put it in his belly as he runs past — one motion, no pivot, no ride. Then keep your empty hand on your hip and run three hard steps away from the play with your eyes up. Everyone who bites on you is a man who is not tackling Super.',
    },
  },
  reviewNotes: DIVE_NOTES,
})

export const splitWideDiveLeftGun: Play = gunPlay(splitWideDiveLeft, {
  audibleFlipId: 'split-wide-dive-right-gun',
  ballCarrier: 'S',
  actions: { S: DIVE_LEFT_S, Q: DIVE_LEFT_Q } satisfies Partial<
    Record<OffPosId, Action[]>
  >,
  description:
    'The same dive to the left, from the gun. Everybody blocks exactly what they block under center — the only change is the mesh: the quarterback catches the snap at 3 yards and hands it straight to Super, who is already lined up on the playside and runs almost straight downhill at the left hip of the center.',
  coachNotes: [
    'Same dive. Only the handoff is different.',
    'Line: hold your blocks one more count - the ball is deeper.',
    'Super: you are already on the play side. Straight downhill.',
  ],
  assignments: {
    S: {
      rule: 'Dive — take it off the quarterback\'s hip and aim at the playside hip of the center.',
      detail:
        'The call is LEFT and you are already lined up on that side, so this one is straight downhill — no crossing, no rounding. Run up past his left hip, take the ball right there, and put your helmet at the center\'s left hip. Take whatever crease shows and fall forward.',
    },
    Q: {
      rule: 'Catch it, reach left, hand it off, carry out the fake away.',
      detail:
        'Snap comes to you at 3 yards. Look it in, step to your left, and put it in his belly as he comes up past you — one motion, no pivot, no ride. Then keep your empty hand on your hip and run three hard steps to the RIGHT with your eyes up, away from the ball.',
    },
  },
  reviewNotes: DIVE_NOTES,
})

// ===========================================================================
// KEEP — Super still motions out. Ryan's ruling, 2026-09-21.
// ===========================================================================
//
// Nothing about the picture changes: Super motions out and STOPS between the
// slot and the wide man on the call side, at the same settle spot (±10.75, −1),
// gets set for a full count, and shows his hands like the screen is coming.
// The quarterback waits for him, reads the backers, shows the screen for a beat
// and runs the same B gap — the daylight between the guard and the tackle.
//
// All that is re-drawn is where the motion STARTS. He leaves from (−1, −4) now
// instead of (0, −4.5), so the track to the right is a yard longer and the
// track to the left is a yard shorter. Same landing spot, same rules.
//
// The quarterback's own change: he is already at 3 yards, so there is no step
// up and no turn — he shows the screen from where he stands and goes downhill.

/** The settle spots, straight out of the base plays. */
const SETTLE_RIGHT = { x: 10.75, y: -1 }
const SETTLE_LEFT = { x: -10.75, y: -1 }

/**
 * The motion out to the settle spot, from (−1, −4). Shared by the keep and
 * the screen — the base plays share theirs too, so the two gun diagrams can
 * never drift apart either. Going RIGHT the first step is across BEHIND the
 * quarterback (he is at 3, Super passes at 4.4); going LEFT he is already
 * headed that way.
 */
const MOTION_RIGHT: Action = {
  kind: 'motion',
  path: [
    { x: 1.5, y: -4.4 },
    { x: 5, y: -4 },
    { x: 8.5, y: -2.5 },
    SETTLE_RIGHT,
  ],
}
const MOTION_LEFT: Action = {
  kind: 'motion',
  path: [
    { x: -3, y: -4.4 },
    { x: -6, y: -4 },
    { x: -9, y: -2.5 },
    SETTLE_LEFT,
  ],
}

/** Right: motion from (−1,−4) out to the same settle spot, then show hands. */
const KEEP_RIGHT_S: Action[] = [
  MOTION_RIGHT,
  {
    kind: 'fake',
    path: [
      { x: 10.5, y: -1.3 }, // get set, hands up, eyes on the quarterback
      { x: 10.2, y: -1.6 },
    ],
  },
]

/** Right: show the screen from 3 yards, then downhill in the RG/RT B gap. */
const KEEP_RIGHT_Q: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: 1.3, y: -3.1 }, // eyes and ball out to Super — sell the screen
      { x: 1.6, y: -2.9 },
    ],
  },
  {
    kind: 'carry',
    path: [
      { x: 1.9, y: -2 }, // square the shoulders, get downhill
      { x: 2.3, y: -0.2 }, // outside hip of RG — the base aiming point
      { x: 2.7, y: 1.5 },
      { x: 3, y: 4 },
      { x: 3.3, y: 7 },
    ],
  },
]

/** Left: motion from (−1,−4) out to the same settle spot, then show hands. */
const KEEP_LEFT_S: Action[] = [
  MOTION_LEFT,
  {
    kind: 'fake',
    path: [
      { x: -10.5, y: -1.3 },
      { x: -10.2, y: -1.6 },
    ],
  },
]

/** Left: show the screen from 3 yards, then downhill in the LG/LT B gap. */
const KEEP_LEFT_Q: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: -1.3, y: -3.1 },
      { x: -1.6, y: -2.9 },
    ],
  },
  {
    kind: 'carry',
    path: [
      { x: -1.9, y: -2 },
      { x: -2.3, y: -0.2 }, // outside hip of LG — the base aiming point
      { x: -2.7, y: 1.5 },
      { x: -3, y: 4 },
      { x: -3.3, y: 7 },
    ],
  },
]

const KEEP_NOTES = [
  GATE,
  INHERIT_NOTE,
  'RULED (Coach Ryan, 2026-09-21): the Keep STILL motions Super out from the gun. Veer and Crush lose their motion in the gun; this one keeps it, because the motion and the settle ARE the play — they are what pulls the backers off the line, and the keeper runs behind that.',
  'DRAFT — THE MOTION PATH. Only the start moved. Super leaves from (−1, −4) instead of (0, −4.5) and lands on the SAME settle spot the base play uses (±10.75, −1), dead between the slot and the wide man. That makes Keep Right\'s motion about a yard longer than it is under center and Keep Left\'s about a yard shorter, so the quarterback\'s count is not quite the same on the two calls. Worth a stopwatch in practice; if the right-handed one is too slow, the fix is to start the motion earlier, not to move the settle spot.',
  'DRAFT — SET, NOT MOVING, still applies. He stops and gets set, so he must be SET FOR A FULL SECOND before the snap or it is illegal motion. Same rule as under center, same flag risk, and it is still the opposite of the timing rule on every other motion in our book.',
  'DRAFT — THE QUARTERBACK\'S STEP. Under center he takes one hard step to the call side and shows the screen. From the gun he is already at 3 yards, so it is drawn with NO step up and no turn: he shows the screen with his eyes and the ball from where he stands, squares his shoulders and runs downhill. Same B gap, same aiming point (the outside hip of the playside guard), and he arrives with a head of steam he does not have under center — which is the one real football gain the gun gives this play. The trade is that he is three yards further from the hole, so the line has to hold a beat longer.',
  'DRAFT — SUPER IS A YARD LEFT NOW, which means on Keep Right his first step is across the quarterback\'s tail and on Keep Left he is already headed that way. Neither one changes what the defense sees, but the two motions no longer look identical from the sideline. Flagging it in case you want them taught as one footwork.',
  'DRAFT — THE PRE-SNAP READ IS STILL THE PLAY, and it still depends on an audible that does not exist yet: send Super, WAIT for him to set, watch the backers, snap it if they widen, check out of it if they blitz. The audible builder cannot express "check to the screen" today. Same open item as the under-center play.',
]

export const splitWideKeeperRightGun: Play = gunPlay(splitWideKeeperRight, {
  audibleFlipId: 'split-wide-keeper-left-gun',
  ballCarrier: 'Q',
  actions: { S: KEEP_RIGHT_S, Q: KEEP_RIGHT_Q } satisfies Partial<
    Record<OffPosId, Action[]>
  >,
  description:
    'The same keeper, from the gun. Super still motions out to the right, still stops between R and X, still shows his hands like the screen is coming — he just starts a yard left of the quarterback instead of straight behind him. The quarterback is already at 3 yards, so he shows the screen from where he stands and runs downhill in the B gap between the right guard and the right tackle with a head of steam.',
  coachNotes: [
    'Super still motions. Set for a full second before the snap.',
    'QB: no step up - show the screen from where you are and go.',
    'Take your three or four yards and get down.',
  ],
  assignments: {
    S: {
      rule: 'Motion out between R and X. STOP. Get set. Hands up, eyes on the quarterback.',
      detail:
        'Nothing changes because we are in the gun — you just leave from a yard left of the quarterback, so your first step is across behind him. On his call, run out behind the line and stop between R and X, right in the middle of them. Get your feet set and stay set for a full count; if you are still moving at the snap we get a flag. Then turn your numbers to him, hands up, and stare at him like the ball is coming. You are not getting it. Every step a linebacker takes out toward you is a step away from where the quarterback is running.',
    },
    Q: {
      rule: 'Send Super out. Wait for him to set. Read them. Show the screen and run the B gap.',
      detail:
        'Call Super in motion and WAIT — he has to be stopped and set before you snap it. While you wait, watch their linebackers: widen or back off, snap it; walk up and show blitz, check out of it. Then you are already 3 yards deep, so there is no step up and no turn — sell the screen with your eyes and the ball for one beat, square your shoulders and run downhill in the gap between RG and RT. You get there with speed this time. This is a keeper, not a read, and it is still not a home run: take what is sitting there and get down.',
    },
  },
  reviewNotes: KEEP_NOTES,
})

export const splitWideKeeperLeftGun: Play = gunPlay(splitWideKeeperLeft, {
  audibleFlipId: 'split-wide-keeper-right-gun',
  ballCarrier: 'Q',
  actions: { S: KEEP_LEFT_S, Q: KEEP_LEFT_Q } satisfies Partial<
    Record<OffPosId, Action[]>
  >,
  description:
    'The same keeper to the left, from the gun. Super still motions out to the left, still stops between L and Y, still shows his hands like the screen is coming — he just starts a yard left of the quarterback, so he is already headed that way. The quarterback is already at 3 yards, so he shows the screen from where he stands and runs downhill in the B gap between the left guard and the left tackle with a head of steam.',
  coachNotes: [
    'Super still motions. Set for a full second before the snap.',
    'QB: no step up - show the screen from where you are and go.',
    'Take your three or four yards and get down.',
  ],
  assignments: {
    S: {
      rule: 'Motion out between L and Y. STOP. Get set. Hands up, eyes on the quarterback.',
      detail:
        'The call says LEFT and you are already lined up a yard that way, so you are headed there off your first step. On his call, run out behind the line and stop between L and Y, right in the middle of them. Feet set, stay set for a full count — if you are still moving at the snap we get a flag. Then turn your numbers to him, hands up, and stare at him like the ball is coming. You are not getting it. Every step a linebacker takes out toward you is a step away from where the quarterback is running.',
    },
    Q: {
      rule: 'Send Super out LEFT. Wait for him to set. Read them. Show the screen and run the B gap.',
      detail:
        'Call Super in motion to the left and WAIT — he has to be stopped and set before you snap it. While you wait, watch their linebackers: widen or back off, snap it; walk up and show blitz, check out of it. Then you are already 3 yards deep, so there is no step up and no turn — sell the screen with your eyes and the ball for one beat, square your shoulders and run downhill in the gap between LG and LT. You get there with speed this time. This is a keeper, not a read, and it is still not a home run: take what is sitting there and get down.',
    },
  },
  reviewNotes: KEEP_NOTES,
})

// ===========================================================================
// SCREEN — the keep's motion and settle, then the standing catch.
// ===========================================================================
//
// Under center the screen and the keep are one picture until the quarterback
// decides: Super motions out, STOPS between the slot and the wide man, and
// shows his hands. Out here that is unchanged — the motion is MOTION_RIGHT /
// MOTION_LEFT, the very same actions the gun keep uses, landing on the same
// settle spot; then the standing catch and the sideline, straight off the
// base play. Every block on every front (the reach, the pull, the bump, the
// one-count hold, the 5-2 no-pull) is inherited verbatim.
//
// What the gun changes is the QUARTERBACK. Under center he takes a hard
// three-step drop opening away from the screen, from 1.3 to 4.4 deep. From the
// gun he is already at 3, so the drop is ONE step: catch it, open away, hold
// the back side a count, turn and throw it flat. He sets at about 4.6 — the
// same depth the base drop ends at — and the ball is out a beat sooner.

/** Right: the keep's motion, then get set, catch it standing still, get north. */
const SCREEN_RIGHT_S: Action[] = [
  MOTION_RIGHT,
  {
    kind: 'carry',
    path: [
      { x: 10.5, y: -1.3 }, // get set, hands up — the base's SETTLE_SHOW
      { x: 10.2, y: -1.6 },
      { x: 10.8, y: 1 }, // the base's sideline track, unmoved
      { x: 11.4, y: 5 },
      { x: 11.8, y: 9 },
    ],
  },
]

/** Right: catch at 3, one step opening AWAY (left), then the flat throw. */
const SCREEN_RIGHT_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.8, y: -3.6 }, // open away — one hard step, eyes to the back side
      { x: -1.6, y: -4.6 }, // set — the same depth the base drop ends at
    ],
  },
  {
    // The ball flight. Drawn as `pitch` because the frozen schema has no
    // `pass` kind — same choice as the base play, flagged in its notes.
    kind: 'pitch',
    path: [
      { x: 1, y: -4.4 },
      { x: 4, y: -3.6 },
      { x: 7, y: -2.6 },
      { x: 10.2, y: -1.6 }, // Super's numbers, standing still
    ],
  },
]

/** Left: the keep's motion, then get set, catch it standing still, get north. */
const SCREEN_LEFT_S: Action[] = [
  MOTION_LEFT,
  {
    kind: 'carry',
    path: [
      { x: -10.5, y: -1.3 },
      { x: -10.2, y: -1.6 },
      { x: -10.8, y: 1 },
      { x: -11.4, y: 5 },
      { x: -11.8, y: 9 },
    ],
  },
]

/** Left: catch at 3, one step opening AWAY (right), then the flat throw. */
const SCREEN_LEFT_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.8, y: -3.6 },
      { x: 1.6, y: -4.6 },
    ],
  },
  {
    kind: 'pitch',
    path: [
      { x: -1, y: -4.4 },
      { x: -4, y: -3.6 },
      { x: -7, y: -2.6 },
      { x: -10.2, y: -1.6 },
    ],
  },
]

const SCREEN_NOTES = [
  GATE,
  INHERIT_NOTE,
  'DRAFT — SUPER CROSSES BEHIND THE QUARTERBACK ON SCREEN RIGHT. He starts a yard LEFT of the quarterback and a yard behind him, so a right-handed motion has to pass him. Drawn BEHIND: the quarterback is at 3 and Super\'s first motion point is at 4.4, so he goes across the quarterback\'s tail, never in front of the snap. It is the identical motion the gun keep uses (the two share the MOTION_RIGHT constant), so the screen and the keep still show the defense one picture. On Screen Left he is already headed that way and crosses nobody. Not a leak-out screen — this is still pre-snap motion, set for a full second, same as under center.',
  'DRAFT — THE DROP. Under center the quarterback takes a hard three-step drop opening away, from 1.3 to 4.4 deep. From the gun he is already at 3, so it is drawn as ONE step: catch it, open away, set at about 4.6 — the same depth the base drop ends at — hold the back side for one count, turn and throw. That is the "same relative amount or less" rule: he ends where the base drop ends, from a start that is already most of the way there. The ball comes out about a half count sooner than it does under center.',
  'DRAFT — THE PULL HAS LESS TIME. Because the throw is a half count quicker, RG (LG on the left call) has that much less time to check the tackle, pull around the reach block and turn up before the ball is in Super\'s hands. The base note already says "RG has to be moving on his pull or he will not be around the end in time"; from the gun that is truer. Nothing on the diagram changes for him. If it is late in practice, the fix is the quarterback holding the back side a full count, not a shorter pull — or, if you want, tell the quarterback to take one more step. Both are prose.',
  'DRAFT — THE AWAY-SIDE END. The one man the base lets loose is the away-side end after LT bumps him, coming from the side the quarterback opens to. From the gun the quarterback is a yard and a half further from him at the snap and the ball is out sooner, so that end has a longer run to a quicker throw. This is the one real football gain the gun gives the screen, and it is written into the quarterback\'s detail.',
  'DRAFT — SUPER IS A YARD LEFT NOW, so Screen Right\'s motion is about a yard longer than under center and Screen Left\'s a yard shorter — the same timing asymmetry flagged on the gun keep, and the same fix (start the motion earlier, do not move the settle spot).',
  'DRAFT — THE CHECK BETWEEN KEEP AND SCREEN at the line is still the point of the pair and still needs an audible that does not exist yet. Same open item as the base plays.',
]

export const splitWideScreenRightGun: Play = gunPlay(splitWideScreenRight, {
  audibleFlipId: 'split-wide-screen-left-gun',
  ballCarrier: 'S',
  actions: { S: SCREEN_RIGHT_S, Q: SCREEN_RIGHT_Q } satisfies Partial<
    Record<OffPosId, Action[]>
  >,
  description:
    'The same screen, from the gun. Super still motions out and settles between R and X with his hands up — he just leaves from a yard left of the quarterback, so his first step is across behind him. Every block is the block you have under center: RT reaches the end and pushes him inside, RG pulls around that block to the backer, R has the alley, X has the corner, and the away side holds one count and climbs. The one change is the quarterback: he is already at 3 yards, so there is no three-step drop — catch it, open away one step, hold the back side a count, and throw it flat to Super standing still. The ball is out a beat sooner.',
  coachNotes: [
    'Same screen. Super still motions - set for a full second before the snap.',
    'QB: no three-step drop. Catch it, open away one step, throw it flat on time.',
    'RT: reach the end. RG: around him to the backer. Ball out - everybody climbs.',
  ],
  assignments: {
    S: {
      rule: 'Motion out between R and X. STOP. Get set, hands up — then catch it and get north.',
      detail:
        'Same trip as the gun keep: you leave from a yard left of the quarterback, so your first step is across behind him, then out behind the line to stop between R and X, right in the middle of them. Feet set, numbers to the quarterback, hands up — set for a full count before the snap. Stand still and let it come to you; it comes a beat sooner than it does under center, because he is not dropping three steps. Do not drift toward him and do not start upfield until you have caught it. Look the ball all the way in, THEN find your blockers: RT has the end sealed inside, RG is coming around the end to wall off the backer, R has the alley, X has the corner. Get up the sideline. Never bounce back inside.',
    },
    Q: {
      rule: 'Send him out, wait for him to set, catch it, open away one step, throw it flat on time.',
      detail:
        'Same start as the keep — call Super out, WAIT for him to be stopped and set, and look at their linebackers while you wait. Then snap it. You are already 3 yards deep, so there is no three-step drop: look the snap in, open AWAY from the screen with one hard step, and hold your eyes to the back side for one full count. RT is reaching the end on the screen side, so nobody should be in your throwing lane — the man who might get to you is the away-side end after LT bumps him, and he is coming from the side you opened to, but he has a longer run to you out here. Turn and throw it at Super\'s numbers while he is standing still — a short, flat, hard throw behind the line. Never late and never behind him. Against a team that blitzes the ball MUST be out on time, and from the gun it comes out a beat sooner than it does under center — that is the whole reason to run it from here.',
    },
  },
  reviewNotes: SCREEN_NOTES,
})

export const splitWideScreenLeftGun: Play = gunPlay(splitWideScreenLeft, {
  audibleFlipId: 'split-wide-screen-right-gun',
  ballCarrier: 'S',
  actions: { S: SCREEN_LEFT_S, Q: SCREEN_LEFT_Q } satisfies Partial<
    Record<OffPosId, Action[]>
  >,
  description:
    'The same screen to the left, from the gun. Super still motions out and settles between L and Y with his hands up — he just leaves from a yard left of the quarterback, so he is already headed that way. Every block is the block you have under center: LT reaches the end and pushes him inside, LG pulls around that block to the backer, L has the alley, Y has the corner, and the away side holds one count and climbs. The one change is the quarterback: he is already at 3 yards, so there is no three-step drop — catch it, open away one step to the right, hold the back side a count, and throw it flat to Super standing still. The ball is out a beat sooner.',
  coachNotes: [
    'Same screen. Super still motions - set for a full second before the snap.',
    'QB: no three-step drop. Catch it, open away one step, throw it flat on time.',
    'LT: reach the end. LG: around him to the backer. Ball out - everybody climbs.',
  ],
  assignments: {
    S: {
      rule: 'Motion out between L and Y. STOP. Get set, hands up — then catch it and get north.',
      detail:
        'Same trip as the gun keep to the left: you are already lined up a yard that way, so you are headed there off your first step — out behind the line, stop between L and Y, right in the middle of them. Feet set, numbers to the quarterback, hands up — set for a full count before the snap. Stand still and let it come to you; it comes a beat sooner than it does under center, because he is not dropping three steps. Do not drift toward him and do not start upfield until you have caught it. Look the ball all the way in, THEN find your blockers: LT has the end sealed inside, LG is coming around the end to wall off the backer, L has the alley, Y has the corner. Get up the LEFT sideline. Never bounce back inside.',
    },
    Q: {
      rule: 'Send him out LEFT, wait for him to set, catch it, open away one step, throw it flat on time.',
      detail:
        'Same play as the gun Screen Right, sent the other way. Call Super out to your LEFT, WAIT for him to be stopped and set, and look at their linebackers while you wait. Then snap it. You are already 3 yards deep, so there is no three-step drop: look the snap in, open AWAY to the RIGHT with one hard step, and hold your eyes to the back side for one full count. LT is reaching the end on the screen side, so nobody should be in your throwing lane — the man who might get to you is the right end after RT bumps him, and he has a longer run to you out here. Turn and throw it at Super\'s numbers while he is standing still — a short, flat, hard throw behind the line, and throwing it to your left is still the harder half of this pair, so it gets its own reps. Never late and never behind him. Against a team that blitzes the ball MUST be out on time, and from the gun it comes out a beat sooner than it does under center.',
    },
  },
  reviewNotes: SCREEN_NOTES,
})

// ===========================================================================
// VICTORY — play-action off the GUN Dive. Same routes, same three seconds.
// ===========================================================================
//
// The base Victory starts as the Dive: the quarterback opens right and meshes
// at the Dive's spot, Super sells the Dive track and plants a yard behind the
// right A gap to block the first man through, and the quarterback pulls it
// and sets up at about 5½. The fake SIDE is the quarterback's call (RIGHT is
// the default drawing); the line runs Ram either way.
//
// From the gun it starts as the GUN Dive instead, which is the whole point of
// running it after the gun Dive: Super's first two steps are DIVE_RIGHT_S's
// first two points — flat across, past the quarterback's left hip — then
// downhill at the center's right hip, sold to a yard and a half from the line,
// and he plants on the SAME spot the base play owns, (0.9, −1). The
// quarterback's mesh is DIVE_RIGHT_Q's mesh, then he pulls it and takes two
// steps back to set at 5 — shallower than the base's 5.6 because he started at
// 3, not 1.3. No boot, no ride. The routes and the protection are inherited.
//
// A LEFT call is the gun Dive Left: Super is already on that side and goes
// straight downhill at the center's left hip (DIVE_LEFT_S), and the quarterback
// meshes off his left hip the same way. Still not drawn — same schema limit as
// the base play (one diagram per play, no per-call toggle).

/** From (0,−3): the gun Dive's mesh off the left hip, then two steps back to set at 5. */
const VIC_GUN_Q: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.3, y: -3.15 }, // open left, ball out — the gun Dive Right mesh
      { x: -0.55, y: -3.05 },
      { x: -0.45, y: -4 }, // pull it — two steps straight back
      { x: -0.3, y: -5 }, // set — about 5 deep, eyes on the slants
    ],
  },
]

/**
 * From (−1,−4): the gun Dive Right's first steps as a FAKE — flat across,
 * past the quarterback's hip, downhill at the center's right hip — then the
 * block bar on the base play's own plant spot, a yard behind the right A gap.
 * No defender named on purpose: the man is whoever comes through.
 */
const VIC_GUN_S: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: -0.6, y: -3.6 }, // DIVE_RIGHT_S's first two points
      { x: -0.05, y: -3.1 },
      { x: 0.5, y: -1.9 }, // sold to here — the base fake ends at the same depth
    ],
  },
  {
    kind: 'block',
    path: [{ x: 0.9, y: -1 }], // the base's plant spot, unmoved
  },
]

/** Prepended to each front's Super detail so the front-specific words stay verbatim. */
const VIC_S_GUN_LEAD =
  'From the gun the fake is the gun Dive: on RIGHT you cross past the quarterback\'s left hip to the center\'s right hip, on LEFT you go straight downhill at his left hip — then plant a yard behind that A gap.'

/** The base front's Super assignment with the gun track in front of it. */
const vicSuperVs = (front: FrontId): Assignment => {
  const base = splitWideVictory.vs[front].assignments!.S!
  return { rule: base.rule, detail: `${VIC_S_GUN_LEAD} ${base.detail ?? ''}`.trim() }
}

const VICTORY_NOTES = [
  GATE,
  INHERIT_NOTE,
  'DRAFT — THE FAKE IS THE GUN DIVE, so the mesh is on the quarterback\'s LEFT hip on BOTH calls now. Under center he opens RIGHT to mesh on a RIGHT call. From the gun Super is a yard left of him in every set (app/data/shotgun.ts), so on RIGHT Super crosses past the quarterback\'s left hip and cuts to the center\'s right hip — exactly the gun Dive Right — and on LEFT he is already on that side and goes straight downhill, exactly the gun Dive Left. The quarterback opens left and gives (fakes) off the same hip either way; only Super\'s track changes with the call. That is one less thing for the quarterback to learn, and it is why this fake only works after we have shown the gun Dive.',
  'DRAFT — THE DROP. Under center he meshes at 2.4 deep and sets at 5.6, about three yards off the mesh. From the gun he meshes at 3 and sets at 5 — two steps, not a full drop. Shallower than the base by half a yard on purpose: the "same relative amount or less" rule, and a three-second clock does not want a deeper set. The count is unchanged: one-thousand-one is the fake, one-thousand-two he is set, one-two-three the ball is gone. He is set a beat sooner, which is a beat more to look at the slants.',
  'DRAFT — SUPER\'S PLANT SPOT IS UNMOVED at (0.9, −1), a yard behind the right A gap. He gets there from the left now, so his path crosses in front of where the quarterback sets up — he is between the quarterback and the line the whole way, which is where a blocker wants to be. The per-front "who to expect" (stacked backer / Mike / somebody, every snap) is the base\'s, verbatim, with one gun sentence in front of it.',
  'DRAFT — THE LINE PASS-SETS, same as the base, and the base\'s honest weak spot stands: a pass-setting line is the first thing a coached backer keys. From the gun that is a little better hidden, because the gun Dive itself already has the line holding a count longer before the ball hits. Still Ram, still slides right regardless of the call, still LT\'s "Super is not on your hip" rule. Nothing changed for any lineman.',
  'DRAFT — NO LEFT DIAGRAM, same schema limit as the base play: one drawing per play, no per-call toggle. RIGHT is drawn; LEFT is described. The lead sentence on Super\'s assignment covers both.',
  'DRAFT — THE FAKE ONLY SELLS IF THE GUN DIVE HAS BEEN RUN. The base note says run this after the Dive; from the gun the same rule applies to the GUN Dive specifically, because the crossing mesh looks nothing like the under-center reverse pivot. In the description.',
]

export const splitWideVictoryGun: Play = gunPlay(splitWideVictory, {
  ballCarrier: 'Q',
  actions: { S: VIC_GUN_S, Q: VIC_GUN_Q } satisfies Partial<Record<OffPosId, Action[]>>,
  vs: {
    '44': { assignments: { S: vicSuperVs('44') } },
    '43': { assignments: { S: vicSuperVs('43') } },
    '52': { assignments: { S: vicSuperVs('52') } },
  },
  description:
    'The same play-action, from the gun — run it after we have run the gun Dive, because it starts as the gun Dive. Four receivers, left to right: post, slant, slant, fade, unchanged. The quarterback catches the snap at 3 yards and puts the ball in Super\'s belly off his left hip as Super crosses, Super sells it into the A gap and plants there to block the first man through, and the quarterback pulls it and takes two steps back to set at about 5 yards. Which A gap is still the quarterback\'s call before the snap. Same Ram slide, same three-second clock: the ball is out in three, thrown or thrown away.',
  coachNotes: [
    'Quarterback: call the side, catch it, fake it off your hip, two steps back. One-two-three and the ball is GONE.',
    'Super: fake the gun Dive to the side you were told, plant in that A gap, block the first man through.',
    'Center: never go upfield. Double with the guard and watch for the blitz.',
  ],
  assignments: {
    S: {
      rule: 'Take the gun Dive fake to the side the quarterback calls. Plant in that A gap. Block the first man through.',
      detail:
        'The quarterback tells you the side before the snap — RIGHT or LEFT — and that is the A gap you fake into. From the gun this is the gun Dive to you for two steps: you start a yard left of him and a yard behind, so on RIGHT it is a flat first step, past his left hip, take the fake there and cut to the center\'s right hip; on LEFT you are already on that side and it is straight downhill at his left hip. Hands out, shoulders square, sold all the way — the only difference from the Dive is the ball is not there. Do NOT slow down when it is not: plant a yard behind the A gap you were sent to, get your eyes up, and the first man who comes through is yours — step to him, hands inside, put him on his back foot. If nobody comes, stay planted and square until the ball is gone. The snap you jog the fake is the snap the linebackers sit on the slants.',
    },
    Q: {
      rule: 'Call the fake side. Catch it, fake to Super off your hip, two steps back, set, throw. Slants first. Ball out in THREE SECONDS.',
      detail:
        'Before the snap, look at the backers and guess which side the blitz is coming from — a backer walked up, a backer leaning, a safety creeping down — and tell Super that side, one word: RIGHT or LEFT. No read? Call RIGHT; that is the way the Dive goes and the way the line slides. Then catch the snap at 3 yards and fake it exactly like the gun Dive: open to your left, and Super is either crossing past your hip (RIGHT) or running straight up past it (LEFT) — put the ball in his belly right there, one motion, and pull it right back out. No pivot, no ride, no boot. Two steps straight back and set at about 5 yards with your eyes on the slants. Count it: one-thousand-one is the fake, one-thousand-two you are set, one-two-three the ball is GONE. Pick the slant on the side where the backer bit the fake and throw it out in front of him. If both backers sit and a safety bit the fake, hit Y on the post behind him. If a corner sits down on R\'s slant, X is open over the top. Nothing there on three? Throw it away or run. You NEVER hold it for a fourth count — Super is a blocker, not a checkdown, and the protection is built for three seconds, not five.',
    },
  },
  reviewNotes: VICTORY_NOTES,
})

export const splitWideGunPlays: Play[] = [
  splitWideDiveRightGun,
  splitWideDiveLeftGun,
  splitWideKeeperRightGun,
  splitWideKeeperLeftGun,
  splitWideScreenRightGun,
  splitWideScreenLeftGun,
  splitWideVictoryGun,
]
