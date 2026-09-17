/**
 * Opening script — the first plays of every game, in order, with the snap count.
 *
 * This is deliberately NOT part of the Play schema (football.ts is frozen and
 * pure football data). The script is a game-plan asset, like film: it hangs
 * off play ids and changes week to week without touching a single play.
 * To change the script, reorder or edit the rows below. To put a play on two,
 * add `count: 2` — every play is on one unless it says otherwise.
 */

export interface ScriptEntry {
  /** Play.id — must exist in app/data/index.ts `plays` (resolveScript throws if not). */
  playId: string
  /** Snap count. Absent means on one. Only 2 is ever written down. */
  count?: 2
}

export type SnapCount = 1 | 2

/** The eight, in the order they get called. */
export const openingScript: ScriptEntry[] = [
  { playId: 'crush-left-tight', count: 2 },
  { playId: 'veer-left-red', count: 2 },
  { playId: 'veer-right-red' },
  { playId: 'veer-left-red' },
  { playId: 'split-wide-dive-left' },
  { playId: 'split-wide-screen-right' },
  { playId: 'split-wide-victory' },
  { playId: 'buck-sweep-right-tight' },
]

/**
 * The quarterback's cadence, word by word, exactly as he says it at the line.
 * On one, the ball snaps on the first Hut. On two, on the second HUT.
 */
export const CADENCE = ['Set', 'Down', 'Set', 'Hut', 'HUT'] as const

/** Which cadence words are a Hut, in order — index 0 is "on one", index 1 is "on two". */
export const HUT_INDEXES = CADENCE.flatMap((w, i) => (w.toLowerCase() === 'hut' ? [i] : []))

export const SNAP_LABELS: Record<SnapCount, string> = { 1: 'On one', 2: 'On two' }

export const snapCountOf = (entry: ScriptEntry): SnapCount => entry.count ?? 1

/** 1-based slot numbers a play fills in the script — [] if it isn't in it. */
export const scriptSlotsFor = (playId: string): number[] =>
  openingScript.flatMap((entry, i) => (entry.playId === playId ? [i + 1] : []))

/** Play ids that appear anywhere in the script — for "in the script" badges in lists. */
export const scriptPlayIds = new Set(openingScript.map((e) => e.playId))
