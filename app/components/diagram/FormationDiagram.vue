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
 *
 * `moves` turns the picture into a VARIATION of a base set (the Gun): the
 * `formation` is already the variation, and each move draws a faint ghost
 * where that kid used to stand plus a dashed shift line into his new spot.
 * Nobody dims for it — the whole set stays readable and the ghost is the cue.
 */
import { computed } from 'vue'
import type { Formation, OffPosId, Pt } from '~/types/football'
import type { GunMove } from '~/data/shotgun'
import { fitViewBox, U } from './geometry'
import { C, DIM, M } from './style'
import DiagramField from './DiagramField.vue'
import DiagramActionPath from './DiagramActionPath.vue'
import './diagram.css'

const props = withDefaults(
  defineProps<{
    formation: Formation
    highlight?: OffPosId | null
    interactive?: boolean
    theme?: 'app' | 'print'
    /** Tighter framing for small cards. */
    compact?: boolean
    /** Alignment shifts into this variation: ghost + dashed line per kid. */
    moves?: GunMove[]
  }>(),
  {
    highlight: null,
    interactive: false,
    theme: 'app',
    compact: false,
    moves: () => [],
  },
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

/* One shift each: where he stood, where he stands now, and the marker shape
   to echo in the ghost. The line lands on the real marker's own coordinates
   so it can never point at a spot with nobody on it. */
const shifts = computed(() =>
  props.moves.map((m) => {
    const real = props.formation.players.find((p) => p.pos === m.pos)
    const to = real?.at ?? m.to
    // A one-yard shift would vanish under the full marker trim, so short
    // moves keep a shorter standoff: at least 40% of the line stays visible.
    const len = Math.hypot(to.x - m.from.x, to.y - m.from.y)
    const trim = Math.min(M.pathStartTrim, len * 0.3)
    return {
      pos: m.pos,
      from: m.from,
      to,
      trim,
      isQb: m.pos === 'Q',
      isCenter: m.pos === 'C',
    }
  }),
)

/* Framed to the formation, with a floor so a tight set doesn't balloon. The
   hero picture on the formation page wants big markers; `compact` (index
   cards) frames a little tighter still. A variation also frames its ghosts,
   so nobody's old spot falls off the edge. */
const fit = computed(() => {
  const pts: Pt[] = props.formation.players.map((p) => p.at)
  for (const s of shifts.value) pts.push(s.from)
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

/* A ghost is a whisper of a marker to begin with; when somebody else is
   highlighted it recedes by the same DIM rule as the rest of the picture. */
const GHOST = 0.32
/* Floor so a dimmed ghost stays findable on the dark field (0.32 × DIM ≈ 0.11
   is past the edge of visibility). */
const GHOST_DIM = 0.18
const ghostOpacityFor = (pos: OffPosId) =>
  dimming.value && pos !== props.highlight ? GHOST_DIM : GHOST

/* "Red Gun formation, eleven offensive players lined up; 4 players moved
   from Red." Only a real variation says the second half. */
const label = computed(() => {
  const base = `${props.formation.name} formation, eleven offensive players lined up`
  const n = shifts.value.length
  if (props.formation.variant !== 'gun' || n === 0) return base
  const from = props.formation.name.replace(/\s+Gun$/, '')
  return `${base}; ${n} ${n === 1 ? 'player' : 'players'} moved from ${from}`
})

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
    :aria-label="label"
    @click="clearSelection"
  >
    <DiagramField :box="fit.box" />

    <g v-if="shifts.length" class="dg-ghosts" pointer-events="none">
      <g
        v-for="s in shifts"
        :key="`g-${s.pos}`"
        :opacity="ghostOpacityFor(s.pos)"
      >
        <g :transform="`translate(${s.from.x * U}, ${-s.from.y * U})`">
          <circle
            v-if="s.isQb"
            :r="M.playerR + M.qbRingGap"
            fill="none"
            :stroke="C.playerStroke"
            :stroke-width="M.qbRingStroke"
          />
          <rect
            v-if="s.isCenter"
            :x="-M.playerR * 0.94"
            :y="-M.playerR * 0.94"
            :width="M.playerR * 1.88"
            :height="M.playerR * 1.88"
            rx="2.5"
            fill="none"
            :stroke="C.playerStroke"
            :stroke-width="M.playerStroke"
          />
          <circle
            v-else
            :r="M.playerR"
            fill="none"
            :stroke="C.playerStroke"
            :stroke-width="M.playerStroke"
          />
        </g>
        <DiagramActionPath
          :points="[s.from, s.to]"
          kind="motion"
          :start-trim="s.trim"
          :end-trim="s.trim"
        />
      </g>
    </g>

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
