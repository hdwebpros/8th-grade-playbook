<script setup lang="ts">
/**
 * RouteTreeDiagram — the numbered route tree, every route fanned from one
 * receiver origin at (0,0) like the poster on the wall. Same visual language
 * as PlayDiagram (SEAM §3): same field, same smoothing, same arrowheads.
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
  }>(),
  { highlight: null, theme: 'app' },
)

const emit = defineEmits<{ select: [num: number | null] }>()

const ORIGIN: Pt = { x: 0, y: 0 }
const BADGE_R = 9

interface RouteEntry {
  num: number
  name: string
  points: Pt[]
  d: string | null
  badge: { x: number; y: number } | null
}

const entries = computed<RouteEntry[]>(() =>
  props.routes.map((r) => {
    const points = [ORIGIN, ...r.path]
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
  return fitViewBox(pts, { pad: 1.4, minWidth: 16, minHeight: 12 })
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
    aria-label="Route tree — the ten numbered routes"
    @click="emit('select', null)"
  >
    <DiagramField :box="fit.box" />

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
