<script setup lang="ts">
/**
 * FormationDiagram — the eleven offensive markers of one Formation, lettered,
 * with no defense and no paths. The "where do I stand" picture.
 *
 * Same visual language as PlayDiagram (geometry helpers, style tokens,
 * DiagramField stage), so it looks like every other diagram in the app.
 * Interactive mode gives each marker a generous tap target and emits
 * `select` with the position (or null when tapped again / field tapped);
 * `highlight` dims everyone else the same way the play page does.
 */
import { computed } from 'vue'
import type { Formation, OffPosId, Pt } from '~/types/football'
import { fitViewBox, U } from './geometry'
import { C, DIM, M } from './style'
import DiagramField from './DiagramField.vue'
import './diagram.css'

const props = withDefaults(
  defineProps<{
    formation: Formation
    highlight?: OffPosId | null
    interactive?: boolean
    theme?: 'app' | 'print'
    /** Tighter framing for small cards. */
    compact?: boolean
  }>(),
  { highlight: null, interactive: false, theme: 'app', compact: false },
)

const emit = defineEmits<{ select: [pos: OffPosId | null] }>()

const players = computed(() =>
  props.formation.players.map((p) => ({
    pos: p.pos,
    at: p.at,
    isQb: p.pos === 'Q',
    isCenter: p.pos === 'C',
  })),
)

/* Framed to the formation, with a floor so a tight set doesn't balloon. The
   hero picture on the formation page wants big markers; `compact` (index
   cards) frames a little tighter still. */
const fit = computed(() => {
  const pts: Pt[] = props.formation.players.map((p) => p.at)
  // A little downfield air above the LOS, a little behind Super.
  pts.push({ x: 0, y: 1.4 }, { x: 0, y: -5.4 })
  return fitViewBox(pts, {
    pad: props.compact ? 1.4 : 1.8,
    minWidth: props.compact ? 22 : 20,
    minHeight: 9,
  })
})

const dimming = computed(() => props.highlight !== null)
const opacityFor = (pos: OffPosId) => (dimming.value && pos !== props.highlight ? DIM : 1)

/* Tap targets: as big as they can be without stealing a neighbour's tap
   (same rule as PlayDiagram). */
const HIT_MAX = 1.9
const HIT_MIN = 0.62
const hitRadius = computed(() => {
  const m = new Map<OffPosId, number>()
  for (const a of players.value) {
    let nearest = Infinity
    for (const b of players.value) {
      if (b.pos === a.pos) continue
      const d = Math.hypot(a.at.x - b.at.x, a.at.y - b.at.y)
      if (d < nearest) nearest = d
    }
    const r = Number.isFinite(nearest) ? Math.min(HIT_MAX, nearest * 0.48) : HIT_MAX
    m.set(a.pos, Math.max(HIT_MIN, r))
  }
  return m
})
const hitOrder = computed(() =>
  players.value
    .slice()
    .sort((a, b) => (hitRadius.value.get(b.pos) ?? 0) - (hitRadius.value.get(a.pos) ?? 0)),
)

function pick(pos: OffPosId) {
  emit('select', props.highlight === pos ? null : pos)
}
function clearSelection() {
  if (props.interactive) emit('select', null)
}
</script>

<template>
  <svg
    class="dg-root"
    :class="{ 'dg-root--print': theme === 'print' }"
    :viewBox="fit.viewBox"
    width="100%"
    role="img"
    :aria-label="`${formation.name} formation, eleven offensive players lined up`"
    @click="clearSelection"
  >
    <DiagramField :box="fit.box" />

    <g class="dg-players">
      <g
        v-for="p in players"
        :key="p.pos"
        class="dg-marker"
        :opacity="opacityFor(p.pos)"
        :transform="`translate(${p.at.x * U}, ${-p.at.y * U})`"
        pointer-events="none"
      >
        <circle
          v-if="p.pos === highlight"
          :r="M.playerR + M.qbRingGap + 3"
          fill="none"
          :stroke="C.accent"
          :stroke-width="M.readRingStroke"
        />
        <circle
          v-if="p.isQb"
          :r="M.playerR + M.qbRingGap"
          fill="none"
          :stroke="C.playerStroke"
          :stroke-width="M.qbRingStroke"
        />
        <rect
          v-if="p.isCenter"
          :x="-M.playerR * 0.94"
          :y="-M.playerR * 0.94"
          :width="M.playerR * 1.88"
          :height="M.playerR * 1.88"
          rx="2.5"
          :fill="p.pos === highlight ? C.accent : C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <circle
          v-else
          :r="M.playerR"
          :fill="p.pos === highlight ? C.accent : C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <text
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="p.pos.length > 1 ? M.letterSizeWide : M.letterSize"
          font-weight="700"
          :fill="p.pos === highlight ? C.accentInk : C.playerStroke"
        >
          {{ p.pos }}
        </text>
      </g>
    </g>

    <g v-if="interactive" class="dg-hits">
      <circle
        v-for="p in hitOrder"
        :key="`h-${p.pos}`"
        class="dg-hit"
        :cx="p.at.x * U"
        :cy="-p.at.y * U"
        :r="(hitRadius.get(p.pos) ?? 1) * U"
        tabindex="0"
        role="button"
        :aria-label="`Where ${p.pos} stands`"
        :aria-pressed="highlight === p.pos"
        @click.stop="pick(p.pos)"
        @keydown.enter.prevent="pick(p.pos)"
        @keydown.space.prevent="pick(p.pos)"
      />
    </g>
  </svg>
</template>
