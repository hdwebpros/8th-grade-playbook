/**
 * STUMBLEBUM — a trick play out of TIGHT. Coach Ryan's own play (2026-09-28),
 * not in any playbook. His description, near verbatim:
 *
 *   - At the snap, Super DIVES on the ground toward the quarterback like there
 *     is a fumble.
 *   - The whole offensive line yells "FUMBLE" at the same time — and it is
 *     crucial that they BLOCK LIKE CRAZY while they do it.
 *   - The quarterback looks like he tripped and leans toward the ground. If he
 *     is gutsy he can touch the ball to the ground, but he keeps full
 *     possession of it.
 *   - The only man out on a route is the tight end, on a 9 — the fade.
 *   - The defense rushes in for the "fumble"; the quarterback pops up and
 *     throws it deep over everybody's heads to the tight end. Everybody else
 *     blocks.
 *
 * His rulings on the follow-ups, same day:
 *   - Y (the LEFT tight end) runs the 9. There is one version — no Right/Left,
 *     so `direction` is 'left', the side the ball goes to.
 *   - Y releases RIGHT OFF THE SNAP — no block first.
 *   - Super dives, then POPS UP AND BLOCKS the first man who comes free.
 *   - It carries the Uncommon Play badge: once a game.
 *
 * Protection is the Tight audible's straight-up pass set (passLine, nothing
 * called): five kick-steps back, the tackles out on the ends, nobody past the
 * line. With only Y out, X and both wings stay home on the edges. The front
 * changes which jersey shows up, not the job, so all three fronts draw the
 * same picture — the same call the Tight audible makes.
 */

import type {
  Action,
  Assignment,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'
import { passLine, routeOn, setBlock } from './audible-shared'

// ---------------------------------------------------------------------------
// Skill work — identical against all three fronts.
// ---------------------------------------------------------------------------

/** Q: two steps back, stumble and lean to the turf — then pop up and throw. */
const Q_STUMBLE: Action[] = [
  {
    kind: 'run',
    path: [
      { x: 0.1, y: -2.2 },
      { x: -0.2, y: -3 },
    ],
  },
]

/**
 * S: dive forward and land BESIDE the quarterback's feet like the ball is
 * loose, then get up and step into the first man who comes free.
 */
const S_DIVE: Action[] = [
  {
    // A solid 'run', not a faded 'fake': the dive is only a yard long, and
    // faded it reads as a plain step into a block.
    kind: 'run',
    path: [
      { x: 0.1, y: -3.9 },
      { x: 0.35, y: -3.25 },
    ],
  },
  {
    kind: 'block',
    path: [{ x: 1.5, y: -2.5 }],
  },
]

/** Y: the 9 off the tree, from the left tight end spot, toward the left sideline. */
const Y_FADE: Action[] = routeOn(9, { x: -4.5, y: 0 }, -1)

/** X stays in: kick-step back, take the first man outside the right tackle. */
const X_SET: Action[] = setBlock([
  { x: 4.6, y: -0.7 },
  { x: 4.9, y: 0.3 },
])

/** L takes the left edge Y just left — set out, clear of Y's release. */
const L_SET: Action[] = setBlock([
  { x: -6.1, y: -0.6 },
  { x: -6.5, y: 0.1 },
])

/** R takes anybody wider than X on the right edge. */
const R_SET: Action[] = setBlock([
  { x: 6.2, y: -0.6 },
  { x: 6.7, y: 0.1 },
])

const plan: FrontPlan = {
  actions: {
    ...passLine(null),
    Q: Q_STUMBLE,
    S: S_DIVE,
    Y: Y_FADE,
    X: X_SET,
    L: L_SET,
    R: R_SET,
  },
}

// ---------------------------------------------------------------------------
// The teaching table.
// ---------------------------------------------------------------------------

const a = (rule: string, detail: string): Assignment => ({ rule, detail })

/** Every lineman's job starts the same way: yell it, then block like crazy. */
const lineJob = (rule: string, extra: string): Assignment =>
  a(
    `Yell FUMBLE, then ${rule} Block like crazy.`,
    `The second the ball is snapped, yell FUMBLE as loud as you can — all five of us at the same time. Then block harder than you have all game. Every defender thinks the ball is on the ground, so every one of them is coming. ${extra} Never turn around to look at the ball, never fall on it, and never go past the line — this is a pass, and that is a penalty on us.`,
  )

const assignments: Record<OffPosId, Assignment> = {
  Q: a(
    'Fake a trip and lean to the ground. Pop up and throw the 9 to Y.',
    'Take a clean snap and take two steps back like normal. Then stumble like you tripped over your own feet and lean way over toward the ground. If you are gutsy, touch the ball to the turf — but it NEVER leaves your hands. Hands and feet only: if a knee touches the ground, you are down and the play is over. Stay low for a two-count while they dive in for the "fumble." Then pop up, set your feet, and throw it deep to Y up the left sideline, over everybody\'s heads.',
  ),
  S: a(
    'Dive on the ground by the quarterback like the ball is loose. Then pop up and block.',
    'On the snap, dive forward and land right next to the quarterback\'s feet, like you are going after a fumble. Sell it. Land BESIDE him, never into him — you cannot take his legs out. Then get right back up and block the first man who comes free. Everybody on defense is coming for that ball, so the quarterback needs you up fast.',
  ),
  Y: a(
    'Run the 9 — fade — right off the snap. You are the only one going out.',
    'Release the second the ball is snapped and run straight up the field, leaning toward the left sideline. The defense thinks the ball is on the ground, so nobody should be with you. Keep running. Look for the ball over your outside shoulder around 20 yards and go get it.',
  ),
  X: a(
    'Yell FUMBLE and stay in to block. Anybody who comes outside the right tackle is yours.',
    'You are a tight end on this play, not a receiver. Yell FUMBLE with the line, kick-step back, and take the first man who comes off the edge outside the tackle. Keep blocking — the fake only works if nobody stops.',
  ),
  L: a(
    'Stay in and block the left edge. Y is gone, so it is all yours.',
    'Y leaves on his route right away, so nobody else is out there. Step up and take the first man who comes off the left edge outside the tackle. Stay behind the line and keep him off the quarterback.',
  ),
  R: a(
    'Stay in and block the right edge. Take anybody wider than X.',
    'X is blocking right beside you. Step up and take the first man who comes wider than him. Stay behind the line and keep him away from the quarterback.',
  ),
  LT: lineJob(
    'pass block the end on your outside shoulder.',
    'Kick-step back and take the end — the line has the ends on every play.',
  ),
  LG: lineJob(
    'pass block the man in front of you.',
    'Short step back, hands inside, and hold your spot. If nobody is over you, take the first jersey that shows up between you and the center.',
  ),
  C: a(
    'Snap it clean, yell FUMBLE, then pass block. Block like crazy.',
    'The snap has to be a normal, clean snap — the quarterback fakes the fumble, you do not. Yell FUMBLE with everybody the second it is gone. A man on your nose is yours; if nobody is there, step back and help a guard. Never turn around to look at the ball, never fall on it, and never go past the line — that is a penalty on us.',
  ),
  RG: lineJob(
    'pass block the man in front of you.',
    'Short step back, hands inside, and hold your spot. If nobody is over you, take the first jersey that shows up between you and the center.',
  ),
  RT: lineJob(
    'pass block the end on your outside shoulder.',
    'Kick-step back and take the end — the line has the ends on every play.',
  ),
}

const reviewNotes = [
  'YOUR PLAY, YOUR WORDS (2026-09-28): Super dives at the quarterback like it is a fumble, the whole line yells FUMBLE and blocks like crazy, the quarterback fakes a trip and leans to the ground (touching the ball down if he is gutsy, never letting go), Y is the only man out on a 9, and the quarterback pops up and throws it over everybody\'s heads.',
  'YOUR RULINGS: Y (the LEFT tight end) runs the 9, one version only, so the play is drawn going LEFT and has no Right/Left toggle. Y goes right off the snap, no block first. Super dives, then pops up and blocks the first man free. Uncommon Play badge: once a game.',
  'LEAGUE RULES: you confirmed your league allows the "fumble" yell (2026-09-28).',
  'MY CALL — THE PROTECTION: the straight-up pass set from the Tight audible, nothing slid. Tackles have the ends, guards and center take the man in front of them, nobody past the line. Same picture against all three fronts.',
  'MY CALL — X AND THE WINGS: X stays in and takes the first man outside the right tackle. R takes anybody wider than X. L takes the first man off the left edge outside the tackle, because with Y gone nobody else is out there. Only the line and X are told to yell; the wings and Super are not. Say the word if you want everybody yelling.',
  'MY CALL — THE TIMING: the quarterback takes two steps back, stumbles, and stays low for a two-count before he pops up. The drawn stumble is two yards deep. Y\'s route is the 9 straight off the route tree.',
  'MY CALL — SUPER: he lands BESIDE the quarterback\'s feet, never into them, so he cannot trip him for real. The dive is drawn as a short solid line to the quarterback\'s feet, then his block turns out to the right.',
]

export const stumblebumTight: Play = {
  id: 'stumblebum-tight',
  name: 'Stumblebum',
  call: [
    { word: 'Tight', label: 'formation' },
    { word: 'Stumblebum', label: 'play' },
  ],
  family: 'pass',
  formation: 'tight',
  direction: 'left',
  ballCarrier: 'Q',
  summary: 'Fake a fumble, then throw it deep to Y while they dive for the ball.',
  description:
    'A trick play. On the snap, Super dives on the ground by the quarterback like the ball is loose and the whole line yells FUMBLE — and keeps blocking like crazy. The quarterback stumbles like he tripped and leans to the ground, but he never lets go of the ball. The defense crashes in to jump on it. Then the quarterback pops up and throws it deep to Y on the 9, up the left sideline, over everybody\'s heads. Y is the only one going out. Everybody else blocks.',
  assignments,
  vs: { '44': plan, '43': plan, '52': plan } satisfies Record<FrontId, FrontPlan>,
  uncommon: 'Trick play. Call it once a game, when the defense is crashing hard on the run.',
  coachNotes: [
    'Line: yell FUMBLE, then block like crazy. Never look back at the ball.',
    'QB: hands and feet only. A knee on the ground and you are down.',
    'Pop up and throw it deep, over everybody to Y.',
  ],
  reviewNotes,
}

export const stumblebumPlays: Play[] = [stumblebumTight]
