/**
 * The playbook's data, in one place.
 *
 * Everything here is yard-coordinate football data typed by
 * app/types/football.ts. No pixels, no colors, no styling.
 */

import type { Play } from '../types/football'
import { buckSweepPlays } from './plays/buck-sweep'
import { buckSweepTightPlays } from './plays/buck-sweep-tight'
import { crushPlays } from './plays/crush'
import { crushTightPlays } from './plays/crush-tight'
import { audiblePlays } from './plays/audible'
import { splitWidePlays } from './plays/split-wide'
import { stretchPlays } from './plays/stretch'
import { stretchTightPlays } from './plays/stretch-tight'
import { stretchBootPlays } from './plays/stretch-boot'
import { veerPlays } from './plays/veer'
import { veerLeftTight } from './plays/veer-tight-left'
import { veerRightTight } from './plays/veer-tight-right'
import { wagglePlays } from './plays/waggle'

export { black, formations, red } from './formations'
export { five2, four3, four4, fronts } from './fronts'
export { buckSweepPlays } from './plays/buck-sweep'
export { buckSweepLeftTight, buckSweepRightTight, buckSweepTightPlays } from './plays/buck-sweep-tight'
export { crushPlays } from './plays/crush'
export { crushLeftTight, crushRightTight, crushTightPlays } from './plays/crush-tight'
export {
  audibleExamples,
  audiblePlays,
  buildAudible,
  callNameOf,
  digitsOf,
  PROTECTION_LABELS,
} from './plays/audible'
export type { AudibleCall, AudibleExample, Protection } from './plays/audible'
export {
  LEAN_LABELS,
  buildSplitWideAudible,
  splitWideCallName,
  splitWideDigitsOf,
} from './plays/audible-split-wide'
export type { Lean, SplitWideCall } from './plays/audible-split-wide'
export { splitWidePlays } from './plays/split-wide'
export { splitWideBull9559 } from './plays/split-wide-9559'
export { stretchPlays } from './plays/stretch'
export { stretchLeftTight, stretchRightTight, stretchTightPlays } from './plays/stretch-tight'
export { stretchBootBlack, stretchBootPlays, stretchBootRed } from './plays/stretch-boot'
export { routes } from './routes'
export { veerLeftBlack, veerLeftRed, veerPlays, veerRightBlack, veerRightRed } from './plays/veer'
export { veerLeftTight } from './plays/veer-tight-left'
export { veerRightTight } from './plays/veer-tight-right'
export { wagglePlays } from './plays/waggle'
export { splitWide } from './split-wide-formation'
export { tight } from './tight-formation'

/**
 * Same plays, in book order: runs first (Veer, Crush, Buck Sweep, Stretch),
 * then passing (Waggle, Boot, the audible examples), then the Split
 * Wide package
 * (DRAFT — gated on Coach Ryan's football review, HANDOFF §10).
 */
export const playList: Play[] = [
  ...veerPlays,
  veerRightTight,
  veerLeftTight,
  ...crushPlays,
  ...crushTightPlays,
  ...buckSweepPlays,
  ...buckSweepTightPlays,
  ...stretchPlays,
  ...stretchTightPlays,
  ...wagglePlays,
  ...stretchBootPlays,
  ...audiblePlays,
  ...splitWidePlays,
]

/** Keyed by Play.id — 'veer-right-red', 'audible-33-red', … */
export const plays: Record<string, Play> = Object.fromEntries(
  playList.map((p) => [p.id, p]),
)
