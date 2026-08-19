<script setup lang="ts">
/**
 * KickoffDiagram — hand-traced special-teams diagram of the Wolves KICKOFF
 * alignment and coverage, drawn from the coaches' whiteboard picture.
 *
 * Eleven cover men across the 40: numbers 1–10 with the kicker (K) in the
 * middle. 2–9 are Attackers who sprint converging lanes to the return-side
 * 40. 1 and 10 are Contain Safeties who jog (zigzag path) and hook around
 * the outside, keeping every return inside them. K trails as the last
 * safety and holds up at midfield (T-bar). The gray letters are the
 * opponent's return team. Same SEAM §3 tokens as the play diagrams, so it
 * follows the app/print themes automatically.
 */
import { C, M } from './style'
import './diagram.css'

withDefaults(defineProps<{ theme?: 'app' | 'print' }>(), { theme: 'app' })

/** A jogging (zigzag) vertical polyline from y0 down to y1 at column x. */
function zig(x: number, y0: number, y1: number): string {
  const pts: string[] = [`${x},${y0}`]
  let side = 1
  for (let y = y0 + 6; y < y1 - 4; y += 9) {
    pts.push(`${x + side * 4.5},${y}`)
    side = -side
  }
  pts.push(`${x},${y1}`)
  return pts.join(' ')
}

/* --- kicking team, left to right (image proportions, viewBox units) --- */
const KICK_Y = 92
const attackers = [
  { n: '2', x: 122, tip: { x: 126, y: 318 } },
  { n: '3', x: 162, tip: { x: 190, y: 308 } },
  { n: '4', x: 205, tip: { x: 258, y: 320 } },
  { n: '5', x: 248, tip: { x: 284, y: 328 } },
  { n: '6', x: 340, tip: { x: 312, y: 322 } },
  { n: '7', x: 388, tip: { x: 350, y: 318 } },
  { n: '8', x: 436, tip: { x: 410, y: 315 } },
  { n: '9', x: 478, tip: { x: 468, y: 326 } },
]

/* --- return team (defense-gray) --- */
const returners = [
  { t: 'LT', x: 78, y: 258 },
  { t: 'LG', x: 183, y: 258 },
  { t: 'C', x: 290, y: 258 },
  { t: 'RG', x: 395, y: 258 },
  { t: 'RT', x: 502, y: 258 },
  { t: 'LE', x: 122, y: 360 },
  { t: 'LM', x: 237, y: 360 },
  { t: 'RM', x: 352, y: 360 },
  { t: 'RE', x: 447, y: 360 },
  { t: 'LR', x: 197, y: 492 },
  { t: 'RR', x: 388, y: 492 },
]

/* --- field furniture --- */
const yardLines = [57, 167, 222, 277, 332, 387, 442, 497]
const yardNums = [
  { n: '40', y: 112 },
  { n: '50', y: 222 },
  { n: '40', y: 332 },
  { n: '30', y: 442 },
]
const hashCols = [205, 375]
const hashTicks: number[] = []
for (let y = 62; y <= 530; y += 11) hashTicks.push(y)
</script>

<template>
  <svg
    class="dg-root"
    :class="{ 'dg-root--print': theme === 'print' }"
    viewBox="0 0 580 555"
    width="100%"
    role="img"
    aria-label="Kickoff coverage: eight attackers sprint lanes, two contain safeties jog and hook outside, the kicker trails as last safety"
  >
    <defs>
      <marker
        id="ko-arrow"
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
    <rect x="0" y="0" width="580" height="555" :fill="C.field" />
    <g :stroke="C.grid" :stroke-width="M.gridStroke">
      <line v-for="y in yardLines" :key="y" x1="0" :y1="y" x2="580" :y2="y" />
    </g>
    <g :stroke="C.grid" :stroke-width="M.gridStroke" opacity="0.7">
      <template v-for="x in hashCols" :key="x">
        <line v-for="y in hashTicks" :key="y" :x1="x - 3" :y1="y" :x2="x + 3" :y2="y" />
      </template>
    </g>
    <g
      :fill="C.grid"
      font-size="17"
      font-weight="700"
      opacity="0.9"
      text-anchor="middle"
      dominant-baseline="central"
    >
      <template v-for="n in yardNums" :key="n.y">
        <text x="18" :y="n.y">{{ n.n }}</text>
        <text x="562" :y="n.y">{{ n.n }}</text>
      </template>
    </g>
    <!-- kicking team's restraining line (our 40) — strongest line on the field -->
    <line x1="0" y1="112" x2="580" y2="112" :stroke="C.los" :stroke-width="M.losStroke" />

    <!-- attacker sprint lanes: straight, converging, solid arrows -->
    <g :stroke="C.line" stroke-width="2.25" fill="none">
      <line
        v-for="a in attackers"
        :key="a.n"
        :x1="a.x"
        :y1="KICK_Y + 14"
        :x2="a.tip.x"
        :y2="a.tip.y"
        marker-end="url(#ko-arrow)"
      />
    </g>

    <!-- contain safeties: zigzag jog, then a dashed hook around the outside -->
    <g :stroke="C.line" stroke-width="2.25" fill="none">
      <polyline :points="zig(75, KICK_Y + 14, 228)" />
      <path
        d="M 75 228 C 58 252, 56 274, 76 282 C 90 287, 100 289, 110 290"
        stroke-dasharray="6 4"
        marker-end="url(#ko-arrow)"
      />
      <polyline :points="zig(525, KICK_Y + 14, 228)" />
      <path
        d="M 525 228 C 542 252, 544 274, 524 282 C 510 287, 500 289, 490 290"
        stroke-dasharray="6 4"
        marker-end="url(#ko-arrow)"
      />
    </g>

    <!-- kicker: zigzag trail down the middle, holds up at midfield (T-bar) -->
    <g :stroke="C.line" stroke-width="2.25" fill="none">
      <polyline :points="zig(290, KICK_Y + 16, 218)" />
      <line x1="290" y1="218" x2="290" y2="236" stroke-dasharray="6 4" />
      <line :x1="290 - M.tbarWidth / 2" y1="238" :x2="290 + M.tbarWidth / 2" y2="238" />
    </g>

    <!-- return team -->
    <g>
      <g
        v-for="r in returners"
        :key="r.t"
        :transform="`translate(${r.x}, ${r.y})`"
        class="dg-marker"
      >
        <circle r="9" :fill="C.field" :stroke="C.defense" stroke-width="2" />
        <text
          text-anchor="middle"
          dominant-baseline="central"
          font-size="9"
          font-weight="700"
          :fill="C.defense"
        >
          {{ r.t }}
        </text>
      </g>
    </g>

    <!-- kicking team markers -->
    <g>
      <!-- contain safeties, accent-ringed -->
      <g v-for="s in [{ n: '1', x: 75 }, { n: '10', x: 525 }]" :key="s.n" class="dg-marker">
        <circle
          :cx="s.x"
          :cy="KICK_Y"
          :r="M.playerR + M.qbRingGap"
          fill="none"
          :stroke="C.accent"
          :stroke-width="M.qbRingStroke"
        />
        <circle
          :cx="s.x"
          :cy="KICK_Y"
          :r="M.playerR"
          :fill="C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <text
          :x="s.x"
          :y="KICK_Y"
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="s.n.length > 1 ? M.letterSizeWide : M.letterSize"
          font-weight="700"
          :fill="C.playerStroke"
        >
          {{ s.n }}
        </text>
      </g>

      <!-- attackers -->
      <g v-for="a in attackers" :key="a.n" class="dg-marker">
        <circle
          :cx="a.x"
          :cy="KICK_Y"
          :r="M.playerR"
          :fill="C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <text
          :x="a.x"
          :y="KICK_Y"
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="M.letterSize"
          font-weight="700"
          :fill="C.playerStroke"
        >
          {{ a.n }}
        </text>
      </g>

      <!-- kicker: square marker, like the whiteboard -->
      <g class="dg-marker">
        <rect
          :x="290 - M.playerR * 0.94"
          :y="KICK_Y - M.playerR * 0.94"
          :width="M.playerR * 1.88"
          :height="M.playerR * 1.88"
          rx="2.5"
          :fill="C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <text
          x="290"
          :y="KICK_Y"
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="M.letterSize"
          font-weight="700"
          :fill="C.playerStroke"
        >
          K
        </text>
      </g>
    </g>

    <!-- coaching labels -->
    <g font-size="13" font-weight="700" letter-spacing="0.08em">
      <text x="75" y="62" text-anchor="middle" :fill="C.accent">CONTAIN</text>
      <text x="525" y="62" text-anchor="middle" :fill="C.accent">CONTAIN</text>
      <text x="290" y="62" text-anchor="middle" :fill="C.defense">ATTACKERS — SPRINT YOUR LANE</text>
      <text x="75" y="316" text-anchor="middle" :fill="C.accent" font-size="10.5">
        JOG · KEEP IT INSIDE
      </text>
      <text x="525" y="316" text-anchor="middle" :fill="C.accent" font-size="10.5">
        JOG · KEEP IT INSIDE
      </text>
      <text x="290" y="256" text-anchor="middle" :fill="C.defense" font-size="10.5">
        K STAYS BACK
      </text>
    </g>
  </svg>
</template>

<style scoped>
.dg-root {
  max-width: 100%;
}
</style>
