/**
 * Diagram geometry — pure functions, no Vue, no DOM.
 *
 * Field data is in YARDS (x right, y downfield/up). SVG user space is
 * "design units": `U` units per yard, with y negated so downfield is up.
 * Every stroke width in the SEAM §3 table is expressed directly in design
 * units, so the whole diagram scales as one system at any rendered size.
 */

import type { Pt } from '~/types/football'

/** SVG user units per yard. */
export const U = 20

/** A point in SVG user space. */
export interface V {
  x: number
  y: number
}

export const toSvg = (p: Pt): V => ({ x: p.x * U, y: -p.y * U })

const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y })
const len = (v: V): number => Math.hypot(v.x, v.y)

export function norm(v: V): V {
  const l = len(v)
  return l < 1e-9 ? { x: 0, y: -1 } : { x: v.x / l, y: v.y / l }
}

export const perp = (v: V): V => ({ x: -v.y, y: v.x })

const round = (n: number): number => Math.round(n * 100) / 100

/* ------------------------------------------------------------------ */
/* Polyline trimming (in yard space, before smoothing)                 */
/* ------------------------------------------------------------------ */

/** Drop consecutive duplicate points. */
export function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = []
  for (const p of pts) {
    const prev = out[out.length - 1]
    if (!prev || Math.hypot(p.x - prev.x, p.y - prev.y) > 1e-6) out.push(p)
  }
  return out
}

/** Pull the first point `d` yards along the polyline toward the second. */
export function trimStart(pts: Pt[], d: number): Pt[] {
  if (pts.length < 2 || d <= 0) return pts
  const a = pts[0]!
  const b = pts[1]!
  const seg = Math.hypot(b.x - a.x, b.y - a.y)
  if (seg <= d + 0.05) return pts
  const t = d / seg
  const next = pts.slice()
  next[0] = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
  return next
}

/** Pull the last point `d` yards back along the polyline. */
export function trimEnd(pts: Pt[], d: number): Pt[] {
  if (pts.length < 2 || d <= 0) return pts
  const b = pts[pts.length - 1]!
  const a = pts[pts.length - 2]!
  const seg = Math.hypot(b.x - a.x, b.y - a.y)
  if (seg <= d + 0.05) return pts
  const t = d / seg
  const next = pts.slice()
  next[next.length - 1] = { x: b.x - (b.x - a.x) * t, y: b.y - (b.y - a.y) * t }
  return next
}

/* ------------------------------------------------------------------ */
/* Catmull-Rom -> cubic Bezier                                         */
/* ------------------------------------------------------------------ */

export interface SmoothPath {
  /** SVG path `d`. */
  d: string
  /** First point, SVG space. */
  start: V
  /** Last point, SVG space. */
  end: V
  /** Unit tangent leaving the start. */
  startDir: V
  /** Unit tangent arriving at the end. */
  endDir: V
}

/**
 * Uniform Catmull-Rom spline emitted as cubic Beziers, with each control
 * handle clamped to a fraction of its own segment. The clamp is what keeps
 * hard route breaks from looping or overshooting while everything still
 * reads as a confident curve rather than a polyline elbow.
 */
export function smooth(yardPts: Pt[], smoothing = 0.78): SmoothPath | null {
  const clean = dedupe(yardPts)
  if (clean.length < 2) return null
  const p = clean.map(toSvg)
  const n = p.length

  const parts: string[] = [`M ${round(p[0]!.x)} ${round(p[0]!.y)}`]
  let firstC1: V | null = null
  let lastC2: V | null = null

  for (let i = 0; i < n - 1; i++) {
    const p0 = p[i - 1] ?? p[i]!
    const p1 = p[i]!
    const p2 = p[i + 1]!
    const p3 = p[i + 2] ?? p2

    const segLen = len(sub(p2, p1))
    const cap = segLen * 0.42

    let c1: V = {
      x: p1.x + ((p2.x - p0.x) / 6) * smoothing,
      y: p1.y + ((p2.y - p0.y) / 6) * smoothing,
    }
    let c2: V = {
      x: p2.x - ((p3.x - p1.x) / 6) * smoothing,
      y: p2.y - ((p3.y - p1.y) / 6) * smoothing,
    }
    c1 = clampHandle(p1, c1, cap)
    c2 = clampHandle(p2, c2, cap)

    if (i === 0) firstC1 = c1
    lastC2 = c2

    parts.push(
      `C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`,
    )
  }

  const start = p[0]!
  const end = p[n - 1]!
  const startDir = norm(sub(firstC1 && len(sub(firstC1, start)) > 0.5 ? firstC1 : p[1]!, start))
  const endDir = norm(sub(end, lastC2 && len(sub(end, lastC2)) > 0.5 ? lastC2 : p[n - 2]!))

  return { d: parts.join(' '), start, end, startDir, endDir }
}

function clampHandle(anchor: V, handle: V, maxLen: number): V {
  const v = sub(handle, anchor)
  const l = len(v)
  if (l <= maxLen || l < 1e-9) return handle
  const k = maxLen / l
  return { x: anchor.x + v.x * k, y: anchor.y + v.y * k }
}

/* ------------------------------------------------------------------ */
/* End caps                                                            */
/* ------------------------------------------------------------------ */

/** Compact filled triangle with its tip exactly on the path end. */
export function arrowPoints(tip: V, dir: V, length: number, halfWidth: number): string {
  const d = norm(dir)
  const q = perp(d)
  const base: V = { x: tip.x - d.x * length, y: tip.y - d.y * length }
  const a: V = { x: base.x + q.x * halfWidth, y: base.y + q.y * halfWidth }
  const b: V = { x: base.x - q.x * halfWidth, y: base.y - q.y * halfWidth }
  return `${round(tip.x)},${round(tip.y)} ${round(a.x)},${round(a.y)} ${round(b.x)},${round(b.y)}`
}

/** Perpendicular block bar, `width` units end-to-end, centred on the end. */
export function tbarPoints(end: V, dir: V, width: number): { x1: number; y1: number; x2: number; y2: number } {
  const q = perp(norm(dir))
  const h = width / 2
  return {
    x1: round(end.x + q.x * h),
    y1: round(end.y + q.y * h),
    x2: round(end.x - q.x * h),
    y2: round(end.y - q.y * h),
  }
}

/* ------------------------------------------------------------------ */
/* Viewport auto-fit                                                   */
/* ------------------------------------------------------------------ */

export interface Box {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/**
 * Fit a viewBox (SVG space) to a set of yard-space points plus padding.
 * `minWidth` / `minHeight` are in yards and stop a sparse diagram from
 * blowing up to absurd scale.
 */
export function fitViewBox(
  yardPts: Pt[],
  opts: { pad?: number; minWidth?: number; minHeight?: number } = {},
): { viewBox: string; box: Box } {
  const pad = opts.pad ?? 1.7
  const minWidth = opts.minWidth ?? 14
  const minHeight = opts.minHeight ?? 10

  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0
  if (yardPts.length) {
    minX = maxX = yardPts[0]!.x
    minY = maxY = yardPts[0]!.y
    for (const p of yardPts) {
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
    }
  }
  // The LOS is always drawn, so it is always inside the frame.
  if (minY > 0) minY = 0
  if (maxY < 0) maxY = 0

  minX -= pad
  maxX += pad
  minY -= pad
  maxY += pad

  const grow = (lo: number, hi: number, min: number): [number, number] => {
    const short = min - (hi - lo)
    if (short <= 0) return [lo, hi]
    return [lo - short / 2, hi + short / 2]
  }
  ;[minX, maxX] = grow(minX, maxX, minWidth)
  ;[minY, maxY] = grow(minY, maxY, minHeight)

  const box: Box = { minX, maxX, minY, maxY }
  const x = round(minX * U)
  const y = round(-maxY * U)
  const w = round((maxX - minX) * U)
  const h = round((maxY - minY) * U)
  return { viewBox: `${x} ${y} ${w} ${h}`, box }
}
