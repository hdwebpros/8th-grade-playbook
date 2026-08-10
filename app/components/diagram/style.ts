/**
 * The SEAM §3 visual language, as data.
 *
 * Every colour is read through a CSS custom property with the dark-theme
 * value baked in as the `var()` fallback, so these components render exactly
 * right with no stylesheet loaded at all. `theme="print"` works by putting
 * `.dg-root--print` on the SVG, which redefines the same properties (see
 * `diagram.css`).
 */

import type { ActionKind } from '~/types/football'

/* --- colour tokens (fallbacks = SEAM dark theme) --- */
export const C = {
  field: 'var(--dg-field, #10141A)',
  los: 'var(--dg-los, #E8EAED)',
  grid: 'var(--dg-grid, #232A33)',
  line: 'var(--dg-line, #E8EAED)',
  defense: 'var(--dg-defense, #8A939E)',
  accent: 'var(--dg-accent, #D6202F)',
  accentInk: 'var(--dg-accent-ink, #FFFFFF)',
  playerFill: 'var(--dg-player-fill, #10141A)',
  playerStroke: 'var(--dg-player-stroke, #E8EAED)',
} as const

/* --- fixed geometry, in SVG design units (20 per yard) --- */
export const M = {
  /** Offensive marker radius: 0.55 yd. */
  playerR: 11,
  playerStroke: 2.5,
  /** Extra ring for the QB. */
  qbRingGap: 4,
  qbRingStroke: 1.5,
  letterSize: 13,
  /** Two-character labels (LG, RT…) step down so they sit inside the marker. */
  letterSizeWide: 11,
  losStroke: 2,
  gridStroke: 1,
  /** Half-height of a 1-yard hash tick on the LOS. */
  tickHalf: 3.6,
  readRingR: 16,
  readRingStroke: 2,
  readCaptionSize: 8.5,
  /** Block bar: 0.9 yd end-to-end. */
  tbarWidth: 18,
  /** Gap between a marker and the start of its first path, in yards. */
  pathStartTrim: 0.72,
  /** Standoff so a block bar does not sit on top of the defender letter. */
  blockTargetTrim: 0.62,
} as const

export interface KindStyle {
  width: number
  color: string
  dash?: string
  opacity?: number
  cap: 'arrow' | 'tbar' | 'none'
  /** Arrowhead length / half-width, design units. */
  arrow?: [number, number]
}

/** SEAM §3 path table. */
export const KIND: Record<ActionKind, KindStyle> = {
  carry: { width: 3.5, color: C.accent, cap: 'arrow', arrow: [12, 6.4] },
  run: { width: 2.25, color: C.line, cap: 'arrow', arrow: [10, 5.4] },
  route: { width: 2.25, color: C.line, cap: 'arrow', arrow: [10, 5.4] },
  block: { width: 2.25, color: C.line, cap: 'tbar' },
  motion: { width: 2.25, color: C.line, dash: '6 4', cap: 'none' },
  pitch: { width: 2, color: C.accent, dash: '1 5', cap: 'arrow', arrow: [8, 4.4] },
  fake: { width: 2, color: C.line, opacity: 0.4, cap: 'arrow', arrow: [9, 4.8] },
}

/** Opacity applied to everything that is not the highlighted player. */
export const DIM = 0.35
