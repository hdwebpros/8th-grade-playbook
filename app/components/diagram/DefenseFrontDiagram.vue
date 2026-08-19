<script setup lang="ts">
/**
 * DefenseFrontDiagram — one of our three defensive fronts, drawn from the
 * coaches' fronts sheet. Four down linemen (E T N E) and two linebackers
 * (M, W) against a generic offensive line (gray, square center, no TE).
 *
 * The three fronts share one geometry table: the ends are always 5-techs
 * (C gap) and the backers always 30s (stacked over the guards at depth) —
 * only the interior linemen's shade and everyone's gap changes:
 *   Stack    — T/N head-up 2s on the guards (A gap), backers fit B. HEAD UP.
 *   Oklahoma — T/N 3-techs, outside shoulder (B gap), backers fit A. OUTSIDE.
 *   Indiana  — T/N 2i, inside shoulder (A gap), backers fit B. INSIDE.
 * Gap letters sit under each defender in accent red; dashed lines show the
 * backers' fits, like the whiteboard. Same SEAM §3 tokens as every diagram.
 */
import { computed } from 'vue'
import { C, M } from './style'
import './diagram.css'

type FrontName = 'stack' | 'oklahoma' | 'indiana'

const props = withDefaults(defineProps<{ front: FrontName; theme?: 'app' | 'print' }>(), {
  theme: 'app',
})

/* --- shared geometry (SVG units, 20 per yard) --- */
const CX = 290 // the ball
const OL_DX = 32 // offensive linemen are 1.6 yd apart, center to center
const SHOULDER = 9 // shade offset: one shoulder off head-up
const OL_Y = 52
const LOS_Y = 74
const DL_Y = 98
const LB_Y = 176
/** Gap midpoints, distance from the ball. */
const GAP_DX = { A: OL_DX / 2, B: OL_DX * 1.5, C: OL_DX * 2.5 } as const

interface FrontSpec {
  tag: string
  aria: string
  /** Interior linemen (T/N) distance from the ball — the shade. */
  interiorDx: number
  interiorGap: 'A' | 'B'
  lbGap: 'A' | 'B'
}

const SPEC: Record<FrontName, FrontSpec> = {
  stack: {
    tag: 'HEAD UP',
    aria: 'Stack front: ends in 5-techniques with C gap, tackles head-up 2s on the guards with A gap, Mike and Will at 30 fitting the B gaps',
    interiorDx: OL_DX,
    interiorGap: 'A',
    lbGap: 'B',
  },
  oklahoma: {
    tag: 'OUTSIDE',
    aria: 'Oklahoma front: ends in 5-techniques with C gap, tackles in 3-techniques on the guards outside shoulder with B gap, Mike and Will at 30 fitting the A gaps',
    interiorDx: OL_DX + SHOULDER,
    interiorGap: 'B',
    lbGap: 'A',
  },
  indiana: {
    tag: 'INSIDE',
    aria: 'Indiana front: ends in 5-techniques with C gap, tackles in 2i on the guards inside shoulder with A gap, Mike and Will at 30 fitting the B gaps',
    interiorDx: OL_DX - SHOULDER,
    interiorGap: 'A',
    lbGap: 'B',
  },
}

const spec = computed(() => SPEC[props.front])

/** The offensive line: tackle, guard, center, guard, tackle. */
const oline = [-2, -1, 0, 1, 2].map((i) => ({ x: CX + i * OL_DX, square: i === 0 }))

interface Marker {
  label: string
  x: number
  y: number
  gap: 'A' | 'B' | 'C'
  /** Dashed fit line down to the LOS (backers only). */
  fitX?: number
}

const defenders = computed<Marker[]>(() => {
  const s = spec.value
  return [
    { label: 'E', x: CX - (OL_DX * 2 + SHOULDER), y: DL_Y, gap: 'C' },
    { label: 'T', x: CX - s.interiorDx, y: DL_Y, gap: s.interiorGap },
    { label: 'N', x: CX + s.interiorDx, y: DL_Y, gap: s.interiorGap },
    { label: 'E', x: CX + (OL_DX * 2 + SHOULDER), y: DL_Y, gap: 'C' },
    { label: 'M', x: CX - OL_DX, y: LB_Y, gap: s.lbGap, fitX: CX - GAP_DX[s.lbGap] },
    { label: 'W', x: CX + OL_DX, y: LB_Y, gap: s.lbGap, fitX: CX + GAP_DX[s.lbGap] },
  ]
})
</script>

<template>
  <svg
    class="dg-root"
    :class="{ 'dg-root--print': theme === 'print' }"
    viewBox="0 0 580 260"
    width="100%"
    role="img"
    :aria-label="spec.aria"
  >
    <defs>
      <marker
        id="df-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="C.line" />
      </marker>
    </defs>

    <!-- field -->
    <rect x="0" y="0" width="580" height="260" :fill="C.field" />
    <line x1="0" :y1="LOS_Y" x2="580" :y2="LOS_Y" :stroke="C.los" :stroke-width="M.losStroke" />

    <!-- how the front shades -->
    <text
      x="290"
      y="26"
      text-anchor="middle"
      font-size="13"
      font-weight="700"
      letter-spacing="0.08em"
      :fill="C.accent"
    >
      {{ spec.tag }}
    </text>

    <!-- their offensive line -->
    <g v-for="o in oline" :key="o.x" class="dg-marker">
      <rect
        v-if="o.square"
        :x="o.x - M.playerR * 0.94"
        :y="OL_Y - M.playerR * 0.94"
        :width="M.playerR * 1.88"
        :height="M.playerR * 1.88"
        rx="2.5"
        :fill="C.field"
        :stroke="C.defense"
        stroke-width="2"
      />
      <circle v-else :cx="o.x" :cy="OL_Y" r="10" :fill="C.field" :stroke="C.defense" stroke-width="2" />
    </g>

    <!-- backer fits: dashed, into the gap -->
    <g :stroke="C.line" stroke-width="2.25" fill="none" stroke-dasharray="6 4">
      <template v-for="d in defenders" :key="d.label + d.x">
        <line
          v-if="d.fitX !== undefined"
          :x1="d.x"
          :y1="d.y - M.playerR - 4"
          :x2="d.fitX"
          :y2="LOS_Y + 8"
          marker-end="url(#df-arrow)"
        />
      </template>
    </g>

    <!-- our defenders -->
    <g v-for="d in defenders" :key="'m' + d.label + d.x" class="dg-marker">
      <circle
        :cx="d.x"
        :cy="d.y"
        :r="M.playerR"
        :fill="C.playerFill"
        :stroke="C.playerStroke"
        :stroke-width="M.playerStroke"
      />
      <text
        :x="d.x"
        :y="d.y"
        text-anchor="middle"
        dominant-baseline="central"
        :font-size="M.letterSize"
        font-weight="700"
        :fill="C.playerStroke"
      >
        {{ d.label }}
      </text>
      <!-- gap responsibility -->
      <text
        :x="d.x"
        :y="d.y + M.playerR + 15"
        text-anchor="middle"
        font-size="11"
        font-weight="700"
        letter-spacing="0.06em"
        :fill="C.accent"
      >
        {{ d.gap }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.dg-root {
  max-width: 100%;
}
</style>
