/**
 * Turns a yard-space polyline + ActionKind into everything needed to draw it:
 * a smoothed `d`, the stroke spec, and the geometry of its end cap.
 */

import type { ActionKind, Pt } from '~/types/football'
import { smooth, trimEnd, trimStart, arrowPoints, tbarPoints } from './geometry'
import type { V } from './geometry'
import { KIND, M } from './style'
import type { KindStyle } from './style'

export interface ResolvedPath {
  d: string
  style: KindStyle
  /** Filled-triangle points, when the cap is an arrowhead. */
  arrow?: string
  /** Perpendicular block bar, when the cap is a T-bar. */
  tbar?: { x1: number; y1: number; x2: number; y2: number }
  /** SVG-space end of the drawn stroke, and the unit tangent arriving there. */
  end: V
  endDir: V
}

export function resolveActionPath(
  points: Pt[],
  kind: ActionKind,
  opts: { startTrim?: number; endTrim?: number } = {},
): ResolvedPath | null {
  let pts = points
  if (opts.startTrim) pts = trimStart(pts, opts.startTrim)
  if (opts.endTrim) pts = trimEnd(pts, opts.endTrim)

  const s = smooth(pts)
  if (!s) return null

  const style = KIND[kind]
  const out: ResolvedPath = { d: s.d, style, end: s.end, endDir: s.endDir }

  if (style.cap === 'arrow' && style.arrow) {
    out.arrow = arrowPoints(s.end, s.endDir, style.arrow[0], style.arrow[1])
  } else if (style.cap === 'tbar') {
    out.tbar = tbarPoints(s.end, s.endDir, M.tbarWidth)
  }
  return out
}
