/**
 * STRETCH BOOT — "Stretch Left Boot Rt".
 *
 * Source is Coach Ryan's own red-ink sketch (Pictures/stretchleftbootrt.png,
 * described to us in his words on 2026-08-11), which is his version of the
 * varsity page-19 panel of the same name. Where the sketch and the varsity
 * panel differ, the sketch wins. His description, near verbatim:
 *
 *   - QB fakes the handoff to Super. Super SELLS it and cuts upfield off the
 *     left tackle's outside hip. QB boots right.
 *   - The O-line blocks the man in front, angled away from the boot, and
 *     HOLDS; uncovered linemen step back and help.
 *   - X is the hot receiver but needs time to develop: a POST-CORNER — ten
 *     yards up, cut in for four, then diagonal to the corner/sideline. The
 *     QB must release before the sideline cut — no huge lobs deep unless the
 *     coverage is blown.
 *   - If X is doubled, look for Y across the middle, then R on the out.
 *   - If the defense is dropped back, hit L in the flats or scramble.
 *   - Y (tight end): post to the middle — six yards, then cut.
 *   - R: eight-yard out to the right sideline.
 *   - L: the flats — sneaking across BEHIND the line of scrimmage, popping
 *     out only once he reaches the boot side.
 *   - Super, after the sell, leaks back to the shallow middle as a late option.
 *
 * Protection, per Coach Ryan: everybody blocks the man in front of him,
 * angled AWAY from the boot (boot right = block left), and the line HOLDS —
 * no collapsing back into the quarterback, no going downfield (penalty on a
 * pass play). Every block is drawn as a SLANTED line: get to the man's
 * outside shoulder and drive him toward the fake side. Against the even
 * fronts the center is the one uncovered lineman — he steps BACK (short
 * stunted line), helps a guard, and picks up any blitz. Against the 5-2
 * every lineman has a man immediately: tackles take the ends, guards take
 * the men over them, center takes the nose — nobody is left free.
 *
 * Differences from Waggle, same boot: pass protection instead of run-action
 * blocks (no guard pull), no motion (R stays put and runs the out), Super
 * sells the fake then leaks middle instead of running the flat, and L runs
 * the flat instead of the post.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
  Pt,
} from '../../types/football'
import { mirrorPlay } from '../../utils/mirror'

/**
 * A pass-protection block drawn as Coach Ryan wants it: a slanted line to the
 * defender's outside shoulder, then the push toward the fake side (left on
 * Red — mirroring flips it for Black). `defX` is the defender's x; the fronts
 * put all their down men a yard deep, so the contact point sits at that depth.
 */
const driveBlock = (defX: number, targetId: string): Action[] => [
  {
    kind: 'block',
    targetId,
    path: [
      { x: defX + 0.45, y: 0.9 },
      { x: defX - 0.75, y: 1.35 },
    ],
  },
]

/** A set step into an empty gap you own, capped with the block bar. */
const setBlock = (path: Pt[]): Action[] => [{ kind: 'block', path }]

// ---------------------------------------------------------------------------
// Skill work — identical against all three fronts.
// ---------------------------------------------------------------------------

/** Q: open into the fake to Super, ride it, then boot to the launch point. */
const Q_BOOT: Action[] = [
  {
    kind: 'run',
    path: [
      { x: -0.6, y: -2.2 },
      { x: -1.3, y: -3.3 },
      { x: -0.3, y: -4.4 },
      { x: 1.8, y: -5.3 },
      { x: 3.7, y: -5.6 },
      { x: 5.6, y: -5.5 },
    ],
  },
]

/**
 * S: take the fake, sell it off the left tackle's outside hip — then, once
 * he's sold it, bend back to the shallow middle as a late option.
 */
const S_FAKE: Action[] = [
  {
    kind: 'fake',
    path: [
      { x: -0.9, y: -3.4 },
      { x: -2.2, y: -2.2 },
      { x: -3.3, y: -0.8 },
      { x: -3.8, y: 0.8 },
    ],
  },
  {
    kind: 'route',
    path: [
      { x: -3.2, y: 2.4 },
      { x: -1.2, y: 3.9 },
      { x: 0.8, y: 4.8 },
    ],
  },
]

/** Y: the post — six yards up, then cut to the deep middle. */
const Y_POST: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -4.3, y: 2.0 },
      { x: -4.1, y: 6.0 },
      { x: -2.0, y: 9.0 },
      { x: 0.8, y: 12.5 },
    ],
  },
]

/**
 * L: sneaks BEHIND the line of scrimmage all the way across, and only pops
 * out past the line once he's in the flat on the boot side — the outlet.
 */
const L_FLAT: Action[] = [
  {
    kind: 'route',
    path: [
      { x: -3.5, y: -1.8 },
      { x: 0.0, y: -2.0 },
      { x: 4.0, y: -1.8 },
      { x: 7.5, y: -1.0 },
      { x: 10.0, y: 0.5 },
    ],
  },
]

/** R: the eight-yard out to the right sideline. */
const R_OUT: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 4.8, y: 1.5 },
      { x: 5.2, y: 5.0 },
      { x: 5.4, y: 8.0 },
      { x: 9.0, y: 8.1 },
      { x: 13.0, y: 8.1 },
    ],
  },
]

/** X: the post-corner — ten up, four-yard cut in, then diagonal to the corner. */
const X_POST_CORNER: Action[] = [
  {
    kind: 'route',
    path: [
      { x: 12.1, y: 2.5 },
      { x: 12.0, y: 10.0 },
      { x: 9.2, y: 12.8 },
      { x: 11.8, y: 16.5 },
      { x: 13.6, y: 19.5 },
    ],
  },
]

const SKILL = {
  Q: Q_BOOT,
  S: S_FAKE,
  Y: Y_POST,
  L: L_FLAT,
  R: R_OUT,
  X: X_POST_CORNER,
} satisfies Partial<Record<OffPosId, Action[]>>

// ---------------------------------------------------------------------------
// Front plans — pass protection, per Coach Ryan:
//   - Everybody blocks the man in front of him, angled AWAY from the boot
//     (boot right = block left). HOLD the line — do not collapse backward
//     into the quarterback, and never drift downfield (that is a penalty
//     on a pass play).
//   - Every block line is drawn SLANTED to the fake side: out to the man's
//     outside shoulder, then the push (left on Red, right on Black).
//   - Vs the even fronts the center has nobody in front — he STEPS BACK
//     (short stunted line), helps the guard next to him, picks up any blitz.
//   - Vs the 5-2 every lineman has a guy immediately: tackles on the ends,
//     guards on the men outside them, center on the nose. Nobody free.
// The fronts draw their down men a yard deep; contact is AT the line.
// ---------------------------------------------------------------------------

/**
 * 4-4: their big men are in front of everybody except the center — he steps
 * back, helps, and eats any blitz.
 */
const vs44: FrontPlan = {
  actions: {
    ...SKILL,
    LT: driveBlock(-4.8, 'E-L'),
    LG: driveBlock(-1.6, 'T-L'),
    C: setBlock([{ x: -0.5, y: -0.9 }]),
    RG: driveBlock(1.6, 'T-R'),
    RT: driveBlock(4.8, 'E-R'),
  },
  assignments: {
    C: {
      rule: 'Nobody in front of you — step BACK, help a guard, eat any blitz.',
      detail:
        'No one is on your nose in this front. Snap the ball and take one short step back — never forward, that is a penalty on a pass play. Eyes up: if a linebacker comes, he is yours. If nobody comes, push in and help whichever guard is losing his fight.',
    },
  },
}

/** 4-3: same four big men in front; the center steps back, helps, eats blitz. */
const vs43: FrontPlan = {
  actions: {
    ...SKILL,
    LT: driveBlock(-4.8, 'E-L'),
    LG: driveBlock(-1.6, 'T-L'),
    C: setBlock([{ x: -0.5, y: -0.9 }]),
    RG: driveBlock(1.6, 'T-R'),
    RT: driveBlock(4.8, 'E-R'),
  },
  assignments: {
    C: {
      rule: 'Nobody in front of you — step BACK, help a guard, eat any blitz.',
      detail:
        'No one is on your nose in this front. Snap the ball and take one short step back — never forward, that is a penalty on a pass play. The middle linebacker is lurking behind their line: if he comes, he is yours. If he drops, push in and help whichever guard is losing his fight.',
    },
  },
}

/**
 * 5-2 (odd): five big men on the line, so every lineman has a guy to block
 * immediately — tackles take the ends (get his outside shoulder, drive him
 * to the fake side), guards take the men over them, center takes the nose.
 * Nobody is left free.
 */
const vs52: FrontPlan = {
  actions: {
    ...SKILL,
    LT: driveBlock(-5.2, 'E-L'),
    LG: driveBlock(-3, 'T-L'),
    C: driveBlock(0, 'N'),
    RG: driveBlock(3, 'T-R'),
    RT: driveBlock(5.2, 'E-R'),
  },
  assignments: {
    C: {
      rule: 'A man is right on your nose — he is yours. Drive him to the fake side.',
      detail:
        'Snap the ball and get into the man in front of you the same instant. Get to his outside shoulder and push him toward the fake with everybody else. He is trying to walk you backward into the quarterback — do not let him. Hold your spot.',
    },
    LG: {
      rule: 'The big man just outside you is yours — block him, angled to the fake side, and HOLD.',
      detail:
        'In this front their big man lines up between you and your tackle, and your tackle is going past him to the outside man — so he is YOURS. Get into him fast, steer him toward the fake with everybody else, and hold your ground. Never chase downfield — that is a penalty on a pass play.',
    },
    RG: {
      rule: 'The big man just outside you is yours — block him, angled to the fake side, and HOLD.',
      detail:
        'Same job as the other guard: your tackle steps out to their outside man, so the big man between you two is YOURS. Get into him, push him toward the fake, and give no ground — your side is the side the quarterback is booting to, so nobody gets through you.',
    },
    LT: {
      rule: 'Their outside man is yours — outside shoulder, drive him to the fake side.',
      detail:
        'Step out to the man on the end of their line. Get your helmet to his outside shoulder and drive him down toward the fake with everybody else. Hold — no ground given, no going downfield.',
    },
    RT: {
      rule: 'Their outside man is yours — outside shoulder, drive him to the fake side.',
      detail:
        'You are on the boot side, so this is the block the play needs most. Step out to the man on the end of their line, get your helmet to his outside shoulder, and drive him down toward the fake. The quarterback boots around your block — HOLD it.',
    },
  },
}

// ---------------------------------------------------------------------------
// The front-independent teaching table — written from Coach Ryan's own
// description of the play. Line rule: man in front of you, lean to the fake
// side, HOLD — and never downfield (penalty).
// ---------------------------------------------------------------------------

const assignments: Record<OffPosId, Assignment> = {
  Q: {
    rule: 'Fake to Super, boot right. X is your guy but he takes time — doubled means Y, then R. Defense sitting deep means L in the flat, or run.',
    detail:
      'Open and fake the handoff to Super exactly like Stretch — put the ball in his pocket and ride it — then pull it and boot right to about five outside and five deep. The line is holding in front of you and leaning toward the fake, but get your width anyway; the fake going the other way is what buys you the corner. X on the post-corner is who this play is for, but his route takes time to develop, so let it. Throw him the ball BEFORE his cut to the sideline — lead him to the corner, no huge lobs deep unless the coverage is flat-out blown. If X is doubled, come off him: Y crossing the middle first, then R on the out. If the defense has dropped everybody back, take the easy one — L in the flat — or tuck it and go. And do not forget Super: after he sells the fake he leaks back to the shallow middle, late, right where a scrambling quarterback wants a friend.',
  },
  S: {
    rule: 'Sell the fake off the left tackle’s hip, then leak to the shallow middle.',
    detail:
      'Take the fake like it is Stretch and the ball is yours — pocket open, pads down. Then SELL it: cut upfield right off the left tackle’s outside hip and run like you have it. Every linebacker you take with you is one the quarterback does not have to beat. Once you have sold it, bend back into the shallow middle and find a window — you are the quarterback’s late option when he is on the move.',
  },
  Y: {
    rule: 'Post to the middle — six yards, then cut.',
    detail:
      'Release up the field six yards, then stick your foot in the ground and cut to the deep middle on the post angle. You are the quarterback’s second look — if they double X, the middle of the field is yours. Keep working across until the ball comes or he takes off.',
  },
  R: {
    rule: 'Eight-yard out to the right sideline.',
    detail:
      'Push up the field to eight yards, then snap it off flat to the sideline. Come back toward the ball if the throw is late — the sideline is your friend, nobody can hit you from out of bounds. You are the third look, after X and Y.',
  },
  L: {
    rule: 'Get to the flat on the boot side — you are the outlet.',
    detail:
      'Sneak across the whole formation BEHIND the line of scrimmage — stay a yard or two in the backfield, behind your blockers, so nobody sees you coming. Pop out past the line only when you reach the flat on the boot side. Keep your eyes on the quarterback the entire way — if the defense drops back, the easy ball is yours. Turn upfield the second you catch it.',
  },
  X: {
    rule: 'Post-corner — ten up, cut in for four, then diagonal to the corner.',
    detail:
      'You are the shot on this play. Stem hard up the field ten yards, cut inside for about four like you are running the post — make the corner and safety believe it — then break diagonally back out for the corner and the sideline. The ball is coming BEFORE your sideline cut, so find it early over your outside shoulder and go get it.',
  },
  LT: {
    rule: 'Block the man in front of you, angled to the fake side. HOLD — no ground given, no going downfield.',
    detail:
      'The quarterback is booting one way, so the whole line leans the OTHER way — toward the fake. Take the man in front of you, get to his outside shoulder, and drive him that way. Hold your ground: do not get pushed back into the quarterback, and never chase downfield — that is a penalty on a pass play. Super is faking right off your outside hip, so a firm block here sells the run all by itself.',
  },
  LG: {
    rule: 'Block the man in front of you, angled to the fake side. HOLD — no ground given, no going downfield.',
    detail:
      'Lean toward the fake side with everybody else and take the man in front of you. Hold the line — the quarterback needs the middle to stay right where it is while he boots around the outside. Never push downfield; that is a penalty on a pass play.',
  },
  C: {
    rule: 'Snap, then block the man in front of you — or step BACK and help if nobody is there.',
    detail:
      'Snap it and go to work the same instant. A man on your nose is yours — hold him, give no ground. If nobody is in front of you, take one short step BACK (never forward — penalty), watch for a blitz, and help the guard next to you who needs it.',
  },
  RG: {
    rule: 'Block the man in front of you, angled to the fake side. HOLD — no ground given, no going downfield.',
    detail:
      'Lean toward the fake side and take the man in front of you. Do not turn and chase toward the boot — the quarterback is going out that way on purpose. Hold your ground so the middle stays clean behind him.',
  },
  RT: {
    rule: 'Block the man in front of you, angled to the fake side. HOLD — no ground given, no going downfield.',
    detail:
      'You are on the boot side, so your block matters most: take the man in front of you, get your helmet to his outside shoulder, and drive him toward the fake with everyone else. HOLD it — he does not come free, he does not push you back, and you never chase him downfield; that is a penalty on a pass play.',
  },
}

const reviewNotes = [
  'Source is YOUR red-ink sketch and your description (2026-08-11), not the varsity book — the varsity page-19 "Stretch Left Boot Rt" panel was only used to fill in what you did not mention. The routes, the fake to Super, the protection rules, and the read progression are your words as given.',
  'PROTECTION, PER YOUR NOTES: every lineman blocks the man in front of him, angled away from the boot (boot right = block left — written as "toward the fake side" so it mirrors to Black correctly), holds the line without collapsing, and never goes downfield (the penalty is called out in every lineman’s coaching text). Vs the 4-4 and 4-3 the center is the one uncovered lineman — he steps BACK with a short stunted line and helps/eats any blitz. Vs the 5-2, per your note, everyone has a guy immediately: tackles take the outside men (outside shoulder, drive to the fake side), guards take the big men between them and the tackles, center takes the man on his nose — nobody is left free, no dashed rings. Note this differs from Waggle, which sells Stretch with run-action blocks and a pulling guard — on this play the line pass-sets.',
  'DIAGRAM CONVENTION ON BLOCKS: every block is drawn as a slanted line, per your note — out to the defender’s outside shoulder, then the push toward the fake side (left on Red, right on Black). The defenders’ circles sit a yard past the line of scrimmage so the picture stays readable; the contact is AT the line, and "never go downfield" lives in the coaching text.',
  'Super’s path is sell-then-middle per your note: he carries the fake up off the left tackle’s outside hip, then bends back into the shallow middle (drawn settling around five yards over the ball) as the quarterback’s late option. He is written into the end of Q’s read as the scramble friend, not into the main progression (X → Y → R → L) — tell us if he should slot in earlier.',
  'Depths are estimates where your description gave none: Y’s post is drawn cutting at six and finishing near 12-13 deep middle; X’s post-corner stems to ten, cuts in about four, and finishes near 19-20 at the sideline; L crosses a yard or two BEHIND the line per your note and only crosses it once he reaches the boot-side flat. Say the word if any of those should compress.',
  'You called X the "hot receiver, but needs time to develop." We wrote the quarterback’s read as: X is the primary and you give his route time — doubled means work Y across the middle, then R on the out; defense dropped back means L in the flat or scramble. If "hot" meant something more specific (a blitz answer, a pre-snap alert), tell us and we will re-word the read.',
  'The release rule is coded as coaching language on both Q and X: ball out BEFORE X’s sideline cut, thrown to the corner, no deep lobs unless coverage is blown. There is no mechanism in the data to enforce it — it lives in the assignment text, so it will show up on the play page, the flashcards, and the printed book.',
  'R’s out at eight and X’s stem occupy the same sideline area — the drawn routes cross near the numbers, which matches your sketch. Football-wise they hold different levels (8 vs 19); flagging only so the picture does not surprise you.',
  'Stretch Boot Black is generated by mirroring Red with no hand corrections — fake Stretch right to Super, boot left, same protection flipped (the line leans toward the fake side either way, so the words mirror cleanly), L runs the out, R runs the flat behind the line, X (split left in Black) runs the post-corner on the boot side. Nobody has drawn that direction; it is symmetric football but check it like you checked Waggle Black.',
]

export const stretchBootRed: Play = {
  id: 'stretch-boot-red',
  name: 'Stretch Boot',
  callName: 'Stretch Left Boot Rt',
  family: 'pass',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'Q',
  description:
    'Play action off Stretch. The quarterback fakes the handoff to Super, who sells it off the left tackle’s hip like he has the ball and then leaks back to the shallow middle — while the quarterback boots back to the right behind a line that blocks the men in front of it, leans left with the fake, and HOLDS. X runs the post-corner and he is the one this play is for, but his route takes time: if he is doubled, Y is crossing the deep middle and R is snapping off an eight-yard out underneath him. If the defense just drops everybody back, L is sneaking behind the line to the flat for the easy one — or the quarterback tucks it and runs.',
  assignments,
  vs: { '44': vs44, '43': vs43, '52': vs52 } satisfies Record<FrontId, FrontPlan>,
  reviewNotes,
}

/**
 * Stretch Boot Black — generated by mirroring Red.
 *
 * Hand corrections after the mirror: NONE geometric. The sketch only draws the
 * play one way; all three fronts are symmetric and every job flips cleanly —
 * the fake goes right to Super, the boot goes left, L runs the eight-yard out,
 * R runs the flat across behind the line, and X (split left in Black) runs the
 * post-corner on the boot side. Straight-up protection has no direction in it,
 * so even the words mirror cleanly.
 */
export const stretchBootBlack: Play = mirrorPlay(stretchBootRed, {
  id: 'stretch-boot-black',
  formation: 'black',
  callName: 'Stretch Right Boot Lt',
  description:
    'Stretch Boot the other way out of Black. Fake the Stretch to the right to Super, boot left, same picture flipped: the line blocks the men in front of it, leans right with the fake, and holds; X on the post-corner is the shot, Y crossing the deep middle behind him, L on the eight-yard out, R sneaking behind the line to the flat as the outlet, Super leaking to the shallow middle after the sell.',
})

export const stretchBootPlays: Play[] = [stretchBootRed, stretchBootBlack]
