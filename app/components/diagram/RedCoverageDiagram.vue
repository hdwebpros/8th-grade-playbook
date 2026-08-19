<script setup lang="ts">
/**
 * RedCoverageDiagram — our zone defense "RED" (Cover 3), drawn as zones
 * first: three deep thirds across the top (C / F / C), seam-curl-flat
 * lanes on each sideline (Alleys), hook-curl holes in the middle (M / W),
 * and the four down linemen (E T N E) rushing. Coverage drops are dashed,
 * the rush is solid. Offense at the bottom is the gray opponent, for
 * orientation only. Same SEAM §3 tokens as the play diagrams, so it
 * follows the app/print themes automatically.
 *
 * Tap or hover a defender (or their zone) to light that job up; the page
 * can sync with it through v-model:active ('cb' | 'fs' | 'alley' | 'lb').
 */
import { C, M } from './style'
import './diagram.css'

withDefaults(defineProps<{ theme?: 'app' | 'print' }>(), { theme: 'app' })

/** Which coverage job is highlighted (tap/hover), shared with the page. */
type RedPos = 'cb' | 'fs' | 'alley' | 'lb'
const active = defineModel<RedPos | null>('active', { default: null })
const toggle = (k: RedPos) => (active.value = active.value === k ? null : k)
const hot = (k: RedPos) => active.value === k
const dim = (k: RedPos) => active.value !== null && active.value !== k
/* Hover only for a real mouse — on touch, hover events would fire on tap
 * and cancel out the click toggle. */
const hoverIn = (e: PointerEvent, k: RedPos) => {
  if (e.pointerType === 'mouse') active.value = k
}
const hoverOut = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') active.value = null
}

const LOS = 430

/* --- zones (rounded regions; the star of the diagram) --- */
/** Deep thirds run all the way down behind the underneath zones. */
const deepThirds: { x: number; w: number; owner: string; k: RedPos }[] = [
  { x: 8, w: 187, owner: 'C', k: 'cb' },
  { x: 200, w: 180, owner: 'F', k: 'fs' },
  { x: 385, w: 187, owner: 'C', k: 'cb' },
]
const DEEP_Y = 18
const DEEP_H = 242

/** Sideline lanes: seam (deep) over curl over flat (shallow), read top-down. */
const scfZones = [{ x: 8 }, { x: 460 }]
const SCF_Y = 200
const SCF_H = 150
const SCF_W = 112

const hookZones = [{ x: 138 }, { x: 300 }]
const HOOK_Y = 225
const HOOK_H = 118
const HOOK_W = 142

/* --- our kids (player-white) --- */
const rushers = [
  { t: 'E', x: 185 },
  { t: 'T', x: 250 },
  { t: 'N', x: 330 },
  { t: 'E', x: 395 },
]
const RUSH_Y = 398

const droppers: { t: string; k: RedPos; x: number; y: number; tip: { x: number; y: number } }[] = [
  /* corners: bail from press depth all the way to the deep outside thirds */
  { t: 'C', k: 'cb', x: 70, y: 385, tip: { x: 85, y: 150 } },
  { t: 'C', k: 'cb', x: 510, y: 385, tip: { x: 495, y: 150 } },
  /* free safety: already deep, three read steps into the middle third */
  { t: 'F', k: 'fs', x: 290, y: 262, tip: { x: 290, y: 148 } },
  /* alleys: seam-curl-flat on the sidelines */
  { t: 'A', k: 'alley', x: 108, y: 372, tip: { x: 74, y: 300 } },
  { t: 'A', k: 'alley', x: 472, y: 372, tip: { x: 506, y: 300 } },
  /* linebackers: hook-curl, hole of #2 working for depth */
  { t: 'M', k: 'lb', x: 240, y: 372, tip: { x: 212, y: 292 } },
  { t: 'W', k: 'lb', x: 340, y: 372, tip: { x: 368, y: 292 } },
]

/* --- gray offense, orientation only --- */
const oLine = [210, 250, 330, 370]
const oWide = [55, 525]
const gridYs = [75, 130, 185, 240, 295, 350]
</script>

<template>
  <svg
    class="dg-root"
    :class="{ 'dg-root--print': theme === 'print' }"
    viewBox="0 0 580 520"
    width="100%"
    role="img"
    aria-label="Red, our Cover 3 zone: both corners and the free safety each take a deep third, the alleys play seam-curl-flat on the sidelines, Mike and Will drop to hook-curl in the middle, and the four down linemen rush"
  >
    <defs>
      <marker
        id="rc-drop"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="C.line" />
      </marker>
      <marker
        id="rc-rush"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6.5"
        markerHeight="6.5"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="C.accent" />
      </marker>
    </defs>

    <!-- field -->
    <rect x="0" y="0" width="580" height="520" :fill="C.field" />
    <g :stroke="C.grid" :stroke-width="M.gridStroke">
      <line v-for="y in gridYs" :key="y" x1="0" :y1="y" x2="580" :y2="y" />
    </g>

    <!-- deep thirds: accent-washed, running down BEHIND the underneath zones -->
    <g>
      <g
        v-for="z in deepThirds"
        :key="z.x"
        class="dg-tap"
        :opacity="dim(z.k) ? 0.35 : 1"
        @pointerenter="hoverIn($event, z.k)"
        @pointerleave="hoverOut"
        @click.stop="toggle(z.k)"
      >
        <rect
          :x="z.x"
          :y="DEEP_Y"
          :width="z.w"
          :height="DEEP_H"
          rx="10"
          :fill="C.accent"
          :fill-opacity="hot(z.k) ? 0.24 : 0.13"
          :stroke="C.accent"
          :stroke-opacity="hot(z.k) ? 0.85 : 0.4"
          stroke-width="1.5"
        />
        <text
          :x="z.x + z.w / 2"
          :y="DEEP_Y + 30"
          text-anchor="middle"
          font-size="13"
          font-weight="700"
          letter-spacing="0.1em"
          :fill="C.accent"
        >
          DEEP 1/3
        </text>
      </g>
    </g>

    <!-- underneath zones: quieter line-toned regions, lit in accent when active -->
    <g>
      <g
        v-for="z in scfZones"
        :key="z.x"
        class="dg-tap"
        :opacity="dim('alley') ? 0.35 : 1"
        @pointerenter="hoverIn($event, 'alley')"
        @pointerleave="hoverOut"
        @click.stop="toggle('alley')"
      >
        <rect
          :x="z.x"
          :y="SCF_Y"
          :width="SCF_W"
          :height="SCF_H"
          rx="10"
          :fill="hot('alley') ? C.accent : C.line"
          :fill-opacity="hot('alley') ? 0.16 : 0.06"
          :stroke="hot('alley') ? C.accent : C.line"
          :stroke-opacity="hot('alley') ? 0.8 : 0.28"
          stroke-width="1.25"
          stroke-dasharray="5 4"
        />
        <!-- seam over curl over flat: deepest word on top, like the field -->
        <g
          :fill="hot('alley') ? C.accent : C.line"
          fill-opacity="0.85"
          font-size="11"
          font-weight="700"
          letter-spacing="0.1em"
          text-anchor="middle"
        >
          <text :x="z.x + SCF_W / 2" :y="SCF_Y + 30">SEAM</text>
          <text :x="z.x + SCF_W / 2" :y="SCF_Y + 66">CURL</text>
          <text :x="z.x + SCF_W / 2" :y="SCF_Y + 102">FLAT</text>
        </g>
      </g>
      <g
        v-for="z in hookZones"
        :key="z.x"
        class="dg-tap"
        :opacity="dim('lb') ? 0.35 : 1"
        @pointerenter="hoverIn($event, 'lb')"
        @pointerleave="hoverOut"
        @click.stop="toggle('lb')"
      >
        <rect
          :x="z.x"
          :y="HOOK_Y"
          :width="HOOK_W"
          :height="HOOK_H"
          rx="10"
          :fill="hot('lb') ? C.accent : C.line"
          :fill-opacity="hot('lb') ? 0.16 : 0.06"
          :stroke="hot('lb') ? C.accent : C.line"
          :stroke-opacity="hot('lb') ? 0.8 : 0.28"
          stroke-width="1.25"
          stroke-dasharray="5 4"
        />
        <text
          :x="z.x + HOOK_W / 2"
          :y="HOOK_Y + 30"
          text-anchor="middle"
          font-size="11"
          font-weight="700"
          letter-spacing="0.1em"
          :fill="hot('lb') ? C.accent : C.line"
          fill-opacity="0.85"
        >
          HOOK-CURL
        </text>
      </g>
    </g>

    <!-- line of scrimmage and the gray offense, orientation only -->
    <line x1="0" :y1="LOS" x2="580" :y2="LOS" :stroke="C.los" :stroke-width="M.losStroke" />
    <g>
      <g v-for="x in oLine" :key="x" class="dg-marker">
        <circle :cx="x" :cy="LOS + 24" r="9" :fill="C.field" :stroke="C.defense" stroke-width="2" />
      </g>
      <rect
        :x="290 - 8.5"
        :y="LOS + 24 - 8.5"
        width="17"
        height="17"
        rx="2.5"
        :fill="C.field"
        :stroke="C.defense"
        stroke-width="2"
      />
      <g v-for="x in oWide" :key="x" class="dg-marker">
        <circle :cx="x" :cy="LOS + 24" r="9" :fill="C.field" :stroke="C.defense" stroke-width="2" />
      </g>
    </g>

    <!-- coverage drops: dashed paths into the zones -->
    <g stroke-width="2.25" fill="none" stroke-dasharray="6 4">
      <line
        v-for="d in droppers"
        :key="`${d.t}-${d.x}`"
        :x1="d.x + (d.tip.x - d.x) * 0.12"
        :y1="d.y - 14"
        :x2="d.tip.x"
        :y2="d.tip.y"
        :stroke="hot(d.k) ? C.accent : C.line"
        :opacity="dim(d.k) ? 0.35 : 1"
        :marker-end="hot(d.k) ? 'url(#rc-rush)' : 'url(#rc-drop)'"
      />
    </g>

    <!-- the rush: four solid accent arrows into the line -->
    <g :stroke="C.accent" stroke-width="2.5" fill="none">
      <line
        v-for="r in rushers"
        :key="`rush-${r.x}`"
        :x1="r.x"
        :y1="RUSH_Y + 13"
        :x2="r.x"
        :y2="LOS - 4"
        marker-end="url(#rc-rush)"
      />
    </g>

    <!-- our kids -->
    <g>
      <g v-for="r in rushers" :key="`dl-${r.x}`" class="dg-marker">
        <circle
          :cx="r.x"
          :cy="RUSH_Y"
          :r="M.playerR"
          :fill="C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <text
          :x="r.x"
          :y="RUSH_Y"
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="M.letterSize"
          font-weight="700"
          :fill="C.playerStroke"
        >
          {{ r.t }}
        </text>
      </g>
      <g
        v-for="d in droppers"
        :key="`db-${d.t}-${d.x}`"
        class="dg-marker dg-tap"
        :opacity="dim(d.k) ? 0.35 : 1"
        @pointerenter="hoverIn($event, d.k)"
        @pointerleave="hoverOut"
        @click.stop="toggle(d.k)"
      >
        <circle
          v-if="hot(d.k)"
          :cx="d.x"
          :cy="d.y"
          :r="M.playerR + M.qbRingGap"
          fill="none"
          :stroke="C.accent"
          :stroke-width="M.qbRingStroke"
        />
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
          {{ d.t }}
        </text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.dg-root {
  max-width: 100%;
}
.dg-tap {
  cursor: pointer;
  transition: opacity 0.15s ease;
}
</style>
