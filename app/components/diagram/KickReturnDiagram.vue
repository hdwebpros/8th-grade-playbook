<script setup lang="ts">
/**
 * KickReturnDiagram — hand-traced special-teams diagram of the KICK RETURN
 * alignment (traced from the coaching sheet). Kicking team shown as numbers
 * 1–10 + K at the top; our return unit below: a 5-man front line and a 4-man
 * second line, each blocker assigned a numbered opponent and dropping
 * 10–15 yards to block them out (hook paths ending in block bars), plus two
 * deep returners — the non-ball-carrier lead blocks up the middle (solid
 * arrow into the wedge T-bar) while the ball carrier hits the middle hard
 * (dashed converge paths). Self-contained inline SVG, themed via the shared
 * --dg-* custom properties.
 */
import { C, KIND, M } from './style'

/** Kicking team across the top: assignment numbers 1–10 with the kicker. */
const kickers = [
  { t: '1', x: 72 },
  { t: '2', x: 104 },
  { t: '3', x: 139 },
  { t: '4', x: 185 },
  { t: '5', x: 230 },
  { t: 'K', x: 285 },
  { t: '6', x: 328 },
  { t: '7', x: 373 },
  { t: '8', x: 420 },
  { t: '9', x: 462 },
  { t: '10', x: 510 },
] as const

/** Return-unit markers. `num` is the assigned opponent to block out. */
const players = [
  // front line — watch the ball overhead (live if it doesn't pass you)
  { id: 'LT', x: 75, y: 245, num: '2' },
  { id: 'LG', x: 172, y: 245, num: '4' },
  { id: 'C', x: 285, y: 245, num: '6' },
  { id: 'RG', x: 380, y: 245, num: '7' },
  { id: 'RT', x: 480, y: 245, num: '9' },
  // second line — drop 10–15 yards, block your man out
  { id: 'LE', x: 110, y: 350, num: '3' },
  { id: 'LM', x: 228, y: 350, num: '5' },
  { id: 'RM', x: 340, y: 350, num: '8' },
  { id: 'RE', x: 432, y: 350, num: '10' },
  // returners
  { id: 'LR', x: 192, y: 478 },
  { id: 'RR', x: 375, y: 478 },
] as const

/** Hook-back blocking paths, each capped with a block bar (T-bar). */
const blocks = [
  // front line
  { d: 'M 86 254 C 106 296 150 308 150 274', bar: [142, 267, 158, 267] },
  { d: 'M 180 256 C 196 300 232 302 230 272', bar: [222, 266, 238, 266] },
  { d: 'M 292 256 C 300 292 312 292 306 271', bar: [298, 266, 314, 266] },
  { d: 'M 372 256 C 358 300 340 298 344 272', bar: [336, 268, 352, 268] },
  { d: 'M 470 255 C 448 298 424 296 430 271', bar: [422, 266, 438, 266] },
  // second line
  { d: 'M 122 358 C 150 392 190 390 190 363', bar: [182, 357, 198, 357] },
  { d: 'M 234 362 C 246 396 226 402 222 385', bar: [213, 383, 229, 379] },
  { d: 'M 332 360 C 322 386 316 386 322 373', bar: [313, 369, 329, 367] },
  { d: 'M 424 360 C 400 415 330 420 300 386', bar: [290, 387, 303, 378] },
] as const

/** Faint 5-yard field lines (the y=100 line is the kicking 40). */
const gridLines = [8, 45, 143, 198, 253, 308, 363, 418, 473, 528] as const

/** Side yard numbers, top to bottom. */
const yardNums = [
  { t: '40', y: 100 },
  { t: '50', y: 208 },
  { t: '40', y: 316 },
  { t: '30', y: 424 },
  { t: '20', y: 528 },
] as const
</script>

<template>
  <svg
    class="dg-root kick-return"
    viewBox="0 0 570 546"
    role="img"
    aria-label="Kick return alignment: five-man front line, four-man second line, two deep returners"
  >
    <rect x="0" y="0" width="570" height="546" :fill="C.field" />

    <!-- field: faint 5-yard lines, hash columns, side numbers -->
    <g pointer-events="none">
      <line
        v-for="y in gridLines"
        :key="y"
        x1="0"
        :y1="y"
        x2="570"
        :y2="y"
        :stroke="C.grid"
        :stroke-width="M.gridStroke"
      />
      <line
        x1="180"
        y1="8"
        x2="180"
        y2="528"
        :stroke="C.grid"
        :stroke-width="M.gridStroke"
        stroke-dasharray="2 9"
      />
      <line
        x1="378"
        y1="8"
        x2="378"
        y2="528"
        :stroke="C.grid"
        :stroke-width="M.gridStroke"
        stroke-dasharray="2 9"
      />
      <g :fill="C.grid" font-size="22" text-anchor="middle">
        <text
          v-for="n in yardNums"
          :key="`l${n.y}`"
          :transform="`translate(28 ${n.y}) rotate(90)`"
        >
          {{ n.t }}
        </text>
        <text
          v-for="n in yardNums"
          :key="`r${n.y}`"
          :transform="`translate(542 ${n.y}) rotate(-90)`"
        >
          {{ n.t }}
        </text>
      </g>
      <!-- the kicking team's restraining line (their 40) -->
      <line x1="0" y1="100" x2="570" y2="100" :stroke="C.los" :stroke-width="M.losStroke" />
    </g>

    <!-- kicking team: numbered coverage men and the kicker, ball teed under K -->
    <g :fill="C.defense" font-size="13" font-weight="600" text-anchor="middle">
      <text v-for="k in kickers" :key="k.t" :x="k.x" y="69">{{ k.t }}</text>
    </g>
    <rect x="278" y="90" width="14" height="14" fill="none" :stroke="C.defense" stroke-width="2" />

    <!-- blocking paths: drop and wall your man out (block bars at the contact point) -->
    <g fill="none" :stroke="C.line" :stroke-width="KIND.block.width" stroke-linecap="round">
      <template v-for="(b, i) in blocks" :key="i">
        <path :d="b.d" />
        <line :x1="b.bar[0]" :y1="b.bar[1]" :x2="b.bar[2]" :y2="b.bar[3]" />
      </template>
      <!-- wedge point: lead returner's block up the middle -->
      <line x1="268" y1="340" x2="296" y2="340" />
      <path d="M 278 428 C 274 400 276 374 280 356" />
    </g>
    <polygon points="280,344 273,360 287,360" :fill="C.line" />

    <!-- returners converge on the middle (dashed) -->
    <g fill="none" :stroke="C.line" stroke-width="2.25" stroke-dasharray="6 4">
      <path d="M 202 470 C 235 452 255 448 272 432" />
      <path d="M 366 474 C 335 492 305 470 288 438" />
    </g>

    <!-- return-unit markers with assignment numbers -->
    <g v-for="p in players" :key="p.id">
      <circle
        :cx="p.x"
        :cy="p.y"
        :r="M.playerR"
        :fill="C.playerFill"
        :stroke="C.playerStroke"
        :stroke-width="M.playerStroke"
      />
      <text
        :x="p.x"
        :y="p.y"
        :fill="C.playerStroke"
        :font-size="p.id.length > 1 ? M.letterSizeWide : M.letterSize"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="central"
      >
        {{ p.id }}
      </text>
      <text
        v-if="'num' in p && p.num"
        :x="p.x + 18"
        :y="p.y + 5"
        :fill="C.line"
        font-size="11"
        font-weight="600"
      >
        {{ p.num }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.kick-return {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
