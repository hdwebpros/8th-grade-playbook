/**
 * The playbook's data, in one place.
 *
 * Everything here is yard-coordinate football data typed by
 * app/types/football.ts. No pixels, no colors, no styling.
 */

import type { Play } from '../types/football'
import { buckSweepPlays } from './plays/buck-sweep'
import { buckSweepGunPlays } from './plays/buck-sweep-gun'
import { buckSweepTightPlays } from './plays/buck-sweep-tight'
import { crushPlays } from './plays/crush'
import { crushGunPlays } from './plays/crush-gun'
import { crushTightPlays } from './plays/crush-tight'
import { audiblePlays } from './plays/audible'
import { splitWidePlays } from './plays/split-wide'
import { splitWideGunPlays } from './plays/split-wide-gun'
import { speedOptionGunPlays } from './plays/speed-option-gun'
import { stretchPlays } from './plays/stretch'
import { stretchGunPlays } from './plays/stretch-gun'
import { stretchTightPlays } from './plays/stretch-tight'
import { stretchBootPlays } from './plays/stretch-boot'
import { veerPlays } from './plays/veer'
import { veerGunPlays } from './plays/veer-gun'
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
} from './plays/audible'
export type { AudibleCall, AudibleExample } from './plays/audible'
export { PROTECTION_LABELS, slideOf } from './plays/audible-shared'
export type { DashSide, Protection, Side } from './plays/audible-shared'
export {
  buildSplitWideAudible,
  splitWideCallName,
  splitWideDigitsOf,
} from './plays/audible-split-wide'
export type { SplitWideCall } from './plays/audible-split-wide'
export {
  buildTightAudible,
  tightCallName,
  tightDigitsOf,
} from './plays/audible-tight'
export type { TightCall } from './plays/audible-tight'
export { splitWidePlays } from './plays/split-wide'
export { splitWide9559 } from './plays/split-wide-9559'
export { speedOptionGunPlays } from './plays/speed-option-gun'
export { stretchPlays } from './plays/stretch'
export { stretchLeftTight, stretchRightTight, stretchTightPlays } from './plays/stretch-tight'
export { stretchBootBlack, stretchBootPlays, stretchBootRed } from './plays/stretch-boot'
export { routes } from './routes'
export { veerLeftBlack, veerLeftRed, veerPlays, veerRightBlack, veerRightRed } from './plays/veer'
export { veerLeftTight } from './plays/veer-tight-left'
export { veerRightTight } from './plays/veer-tight-right'
export { wagglePlays } from './plays/waggle'
export { splitWide } from './split-wide-formation'
export {
  blackGun,
  gunFormations,
  gunMoves,
  gunOf,
  hasGun,
  redGun,
  splitWideGun,
} from './shotgun'
export type { GunMove } from './shotgun'
export { formationFor } from './shotgun'
export { baseIdOf, gunIdOf, gunPlay, isGunPlay } from './plays/gun-shared'
export type { GunPlaySpec } from './plays/gun-shared'
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

/**
 * Gun versions of the runs. App only for now: they are reachable from the
 * play page's Under center / Gun toggle and by id, but stay OUT of `playList`
 * so the print book, flashcards and Know Your Job do not pick them up until
 * Coach Ryan signs the football off (HANDOFF §10).
 */
export const gunPlayList: Play[] = [
  ...veerGunPlays,
  ...crushGunPlays,
  ...buckSweepGunPlays,
  ...stretchGunPlays,
  ...speedOptionGunPlays,
  ...splitWideGunPlays,
]

/** Keyed by Play.id — 'veer-right-red', 'veer-right-red-gun', 'audible-red-33', … */
export const plays: Record<string, Play> = Object.fromEntries(
  [...playList, ...gunPlayList].map((p) => [p.id, p]),
)
