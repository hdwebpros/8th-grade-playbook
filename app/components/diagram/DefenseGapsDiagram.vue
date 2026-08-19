<script setup lang="ts">
/**
 * DefenseGapsDiagram — the "Defense 101" chart: the offensive front drawn in
 * defense-gray (they're the opponent here), gap letters above the line and
 * alignment/technique numbers below it, redrawn from the coaches' handout.
 *
 * Gaps read outside-in toward the ball: D outside the TE, then C-B-A to the
 * center; the right side has no TE, so it stops at C. Each blocker owns a
 * triplet of technique numbers — outside shoulder / head up / inside
 * shoulder: C = 1·0·1, G = 3·2·2i, T = 5·4·4i, TE = 7·6·6i. Same SEAM §3
 * tokens as the play diagrams, so it follows the app/print themes
 * automatically.
 */
import { C, M } from './style'
import './diagram.css'

withDefaults(defineProps<{ theme?: 'app' | 'print' }>(), { theme: 'app' })

const LINE_Y = 110

/* --- offensive front, left to right (TE only on the left, like the chart) --- */
const blockers = [
  { t: 'TE', x: 98 },
  { t: 'T', x: 162 },
  { t: 'G', x: 226 },
  { t: 'C', x: 290, square: true },
  { t: 'G', x: 354 },
  { t: 'T', x: 418 },
]

/* --- gap letters, centered over each gap --- */
const gaps = [
  { g: 'D', x: 54 },
  { g: 'C', x: 130 },
  { g: 'B', x: 194 },
  { g: 'A', x: 258 },
  { g: 'A', x: 322 },
  { g: 'B', x: 386 },
  { g: 'C', x: 462 },
]

/*
 * Technique triplets, one per blocker: outside shoulder / head up / inside
 * shoulder. Left of the ball, outside is to the left; right of the ball it
 * mirrors. TE = 7·6·6i, T = 5·4·4i, G = 3·2·2i, C = 1·0·1.
 */
const TECH_DX = 22
const techGroups = blockers.map((b) => {
  const byPos: Record<string, [string, string, string]> = {
    TE: ['7', '6', '6i'],
    T: ['5', '4', '4i'],
    G: ['3', '2', '2i'],
    C: ['1', '0', '1'],
  }
  const [out, on, inn] = byPos[b.t]!
  const sign = b.x < 290 ? 1 : -1 // which side "inside" is on
  return {
    x: b.x,
    nums: [
      { n: out, x: b.x - sign * TECH_DX },
      { n: on, x: b.x },
      { n: inn, x: b.x + sign * TECH_DX },
    ],
  }
})
</script>

<template>
  <svg
    class="dg-root"
    :class="{ 'dg-root--print': theme === 'print' }"
    viewBox="0 0 580 212"
    width="100%"
    role="img"
    aria-label="Gaps and alignment techniques: gap letters D-C-B-A over the offensive line with the ball in the middle, and three technique numbers under each blocker for his outside shoulder, head up, and inside shoulder — center 1-0-1, guards 3-2-2i, tackles 5-4-4i, tight end 7-6-6i"
  >
    <!-- field -->
    <rect x="0" y="0" width="580" height="212" :fill="C.field" />

    <!-- caption: gaps -->
    <text
      x="290"
      y="24"
      text-anchor="middle"
      :fill="C.line"
      font-size="11"
      font-weight="700"
      letter-spacing="0.22em"
      opacity="0.65"
    >
      GAPS
    </text>

    <!-- gap letters -->
    <g
      :fill="C.accent"
      font-size="24"
      font-weight="700"
      text-anchor="middle"
      dominant-baseline="central"
    >
      <text v-for="(gp, i) in gaps" :key="i" :x="gp.x" y="58">{{ gp.g }}</text>
    </g>

    <!-- line of scrimmage, through the blockers -->
    <line x1="14" :y1="LINE_Y" x2="566" :y2="LINE_Y" :stroke="C.los" :stroke-width="M.losStroke" opacity="0.35" />

    <!-- offensive front (opponent = defense-gray) -->
    <g>
      <g v-for="(b, i) in blockers" :key="i" :transform="`translate(${b.x}, ${LINE_Y})`" class="dg-marker">
        <rect
          v-if="b.square"
          x="-10"
          y="-10"
          width="20"
          height="20"
          rx="2.5"
          :fill="C.field"
          :stroke="C.defense"
          stroke-width="2"
        />
        <circle v-else r="11" :fill="C.field" :stroke="C.defense" stroke-width="2" />
        <text
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="b.t.length > 1 ? 9 : 11"
          font-weight="700"
          :fill="C.defense"
        >
          {{ b.t }}
        </text>
      </g>
    </g>

    <!-- technique triplets: outside / head-up / inside under each blocker -->
    <g>
      <g v-for="(tg, gi) in techGroups" :key="gi">
        <rect
          :x="tg.x - TECH_DX - 8"
          y="140"
          :width="TECH_DX * 2 + 16"
          height="24"
          rx="7"
          :fill="C.line"
          fill-opacity="0.06"
          :stroke="C.line"
          stroke-opacity="0.18"
          stroke-width="1"
        />
        <g
          :fill="C.line"
          font-size="13"
          font-weight="600"
          text-anchor="middle"
          dominant-baseline="central"
          opacity="0.92"
        >
          <text v-for="(t, i) in tg.nums" :key="i" :x="t.x" y="152">{{ t.n }}</text>
        </g>
      </g>
    </g>

    <!-- caption: techniques -->
    <text
      x="290"
      y="192"
      text-anchor="middle"
      :fill="C.line"
      font-size="11"
      font-weight="700"
      letter-spacing="0.22em"
      opacity="0.65"
    >
      ALIGNMENT / TECHNIQUE
    </text>
  </svg>
</template>

<style scoped>
.dg-root {
  max-width: 100%;
}
</style>
