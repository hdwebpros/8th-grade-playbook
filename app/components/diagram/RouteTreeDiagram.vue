<script setup lang="ts">
/**
 * RouteTreeDiagram — the numbered route tree, every route fanned from one
 * receiver origin at (0,0) like the poster on the wall. Same visual language
 * as PlayDiagram (SEAM §3): same field, same smoothing, same arrowheads.
 *
 * The tree in app/data/routes.ts is authored with +x = the receiver's OUTSIDE
 * (sideline). Which real-world side that is depends on where he lines up, so
 * the diagram takes a `side` and mirrors the whole tree for a man lined up
 * LEFT of the ball. To make the side obvious without a word of prose, the
 * ball sits on the LOS at the inside edge and the sideline runs down the
 * outside edge — every route reads as "toward the ball" or "toward the
 * sideline" instead of "left" or "right".
 */
import { computed } from 'vue'
import type { Pt, RouteDef } from '~/types/football'
import { fitViewBox, U } from './geometry'
import { resolveActionPath } from './path'
import { C, DIM, M } from './style'
import DiagramField from './DiagramField.vue'
import DiagramActionPath from './DiagramActionPath.vue'
import './diagram.css'

const props = withDefaults(
  defineProps<{
    routes: RouteDef[]
    highlight?: number | null
    theme?: 'app' | 'print'
    /** Which side of the ball the receiver is lined up on. Default: right (Red, X split right). */
    side?: 'left' | 'right'
    /** Draw the ball and the sideline so the side of the field is unmistakable. */
    context?: boolean
  }>(),
  { highlight: null, theme: 'app', side: 'right', context: true },
)

const emit = defineEmits<{ select: [num: number | null] }>()

const ORIGIN: Pt = { x: 0, y: 0 }
const BADGE_R = 9

/** +1 keeps the authored tree (outside = right); -1 mirrors it for the left side. */
const sx = computed(() => (props.side === 'left' ? -1 : 1))

interface RouteEntry {
  num: number
  name: string
  points: Pt[]
  d: string | null
  badge: { x: number; y: number } | null
}

const entries = computed<RouteEntry[]>(() =>
  props.routes.map((r) => {
    const points = [ORIGIN, ...r.path.map((p) => ({ x: p.x * sx.value, y: p.y }))]
    const solved = resolveActionPath(points, 'route', { startTrim: M.pathStartTrim })
    // Park the number just past the arrowhead, along its own tangent.
    const badge = solved
      ? {
          x: solved.end.x + solved.endDir.x * (10 + BADGE_R + 4),
          y: solved.end.y + solved.endDir.y * (10 + BADGE_R + 4),
        }
      : null
    return { num: r.num, name: r.name, points, d: solved?.d ?? null, badge }
  }),
)

const fit = computed(() => {
  const pts: Pt[] = [ORIGIN]
  for (const e of entries.value) pts.push(...e.points)
  // Badges live outside the paths; convert them back to yards for the fit.
  for (const e of entries.value) {
    if (e.badge) {
      const pad = (BADGE_R + 3) / U
      pts.push({ x: e.badge.x / U + pad, y: -e.badge.y / U + pad })
      pts.push({ x: e.badge.x / U - pad, y: -e.badge.y / U - pad })
    }
  }
  if (props.context) {
    // Room for the ball on the inside edge, the sideline on the outside edge,
    // and the two labels just below the LOS.
    let minX = 0
    let maxX = 0
    for (const p of pts) {
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
    }
    pts.push({ x: minX - 2.2, y: -1.9 }, { x: maxX + 2.2, y: -1.9 })
  }
  return fitViewBox(pts, { pad: 1.4, minWidth: 16, minHeight: 12 })
})

/**
 * Where the ball and the sideline sit, in SVG units. The ball is on the LOS
 * at the inside edge of the frame; the sideline is a stripe down the outside
 * edge. Both flip with `side`.
 */
const cue = computed(() => {
  const b = fit.value.box
  const inside = sx.value > 0 ? b.minX : b.maxX
  const outside = sx.value > 0 ? b.maxX : b.minX
  const ballX = (inside + 1.3 * sx.value) * U
  const sideX = outside * U
  const labelY = 1.35 * U
  return {
    ballX,
    sideX,
    labelY,
    top: -b.maxY * U,
    bottom: -b.minY * U,
    sideLabelX: (outside - 0.35 * sx.value) * U,
    ballAnchor: sx.value > 0 ? 'start' : 'end',
    sideAnchor: sx.value > 0 ? 'end' : 'start',
    ballLabelX: (inside + 0.5 * sx.value) * U,
  }
})

/** The highlighted route paints last so nothing dimmed crosses over it. */
const ordered = computed(() =>
  entries.value.slice().sort((a, b) => Number(a.num === props.highlight) - Number(b.num === props.highlight)),
)

const dimming = computed(() => props.highlight != null)
const opacityFor = (num: number): number =>
  dimming.value && props.highlight !== num ? DIM : 1
const isOn = (num: number): boolean => props.highlight === num

function pick(num: number) {
  emit('select', props.highlight === num ? null : num)
}
</script>

<template>
  <svg
    class="dg-root"
    :class="{ 'dg-root--print': theme === 'print' }"
    :viewBox="fit.viewBox"
    width="100%"
    role="img"
    :aria-label="`Route tree — the ten numbered routes, receiver lined up ${side} of the ball`"
    @click="emit('select', null)"
  >
    <DiagramField :box="fit.box" />

    <!-- Which way is which: the ball inside, the sideline outside. -->
    <g v-if="context" class="dg-cue" pointer-events="none">
      <line
        :x1="cue.sideX"
        :y1="cue.top"
        :x2="cue.sideX"
        :y2="cue.bottom"
        :stroke="C.line"
        stroke-width="5"
        opacity="0.9"
      />
      <text
        :x="cue.sideLabelX"
        :y="cue.labelY"
        :text-anchor="cue.sideAnchor"
        dominant-baseline="central"
        font-size="11.5"
        font-weight="700"
        letter-spacing="1"
        :fill="C.defense"
      >
        SIDELINE
      </text>
      <g :transform="`translate(${cue.ballX}, 0)`">
        <ellipse rx="13" ry="7.5" :fill="C.accent" />
        <line x1="-4.5" y1="0" x2="4.5" y2="0" :stroke="C.accentInk" stroke-width="1.4" />
        <line x1="-2.2" y1="-2.2" x2="-2.2" y2="2.2" :stroke="C.accentInk" stroke-width="1.2" />
        <line x1="2.2" y1="-2.2" x2="2.2" y2="2.2" :stroke="C.accentInk" stroke-width="1.2" />
      </g>
      <text
        :x="cue.ballLabelX"
        :y="cue.labelY"
        :text-anchor="cue.ballAnchor"
        dominant-baseline="central"
        font-size="11.5"
        font-weight="700"
        letter-spacing="1"
        :fill="C.defense"
      >
        BALL
      </text>
    </g>

    <g
      v-for="e in ordered"
      :key="e.num"
      class="dg-actions"
      :opacity="opacityFor(e.num)"
      role="button"
      tabindex="0"
      :aria-label="`${e.num} ${e.name}`"
      :aria-pressed="isOn(e.num)"
      style="cursor: pointer"
      @click.stop="pick(e.num)"
      @keydown.enter.prevent="pick(e.num)"
      @keydown.space.prevent="pick(e.num)"
    >
      <DiagramActionPath
        :points="e.points"
        kind="route"
        :start-trim="M.pathStartTrim"
        :color="isOn(e.num) ? C.accent : undefined"
      />
      <!-- fat transparent stroke so a thin route is still easy to tap -->
      <path
        v-if="e.d"
        :d="e.d"
        fill="none"
        stroke="transparent"
        stroke-width="22"
        stroke-linecap="round"
      />
      <g v-if="e.badge" :transform="`translate(${e.badge.x}, ${e.badge.y})`">
        <circle
          :r="BADGE_R"
          :fill="isOn(e.num) ? C.accent : C.field"
          :stroke="isOn(e.num) ? C.accent : C.line"
          stroke-width="1.6"
        />
        <text
          text-anchor="middle"
          dominant-baseline="central"
          font-size="11"
          font-weight="700"
          :fill="isOn(e.num) ? C.accentInk : C.line"
        >
          {{ e.num }}
        </text>
      </g>
    </g>

    <!-- the receiver -->
    <g class="dg-marker">
      <circle
        :r="M.playerR"
        :fill="C.playerFill"
        :stroke="C.playerStroke"
        :stroke-width="M.playerStroke"
      />
    </g>
  </svg>
</template>
