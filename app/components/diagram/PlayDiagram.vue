<script setup lang="ts">
/**
 * PlayDiagram — draws one Play against one Front, per docs/SEAM.md §3.
 *
 * Pure SVG, viewBox-based, sizes to its container. Semantics come in as data
 * (ActionKind), every styling decision is made here. Assignment text is never
 * drawn inside the SVG — the page owns that panel.
 */
import { computed } from 'vue'
import type {
  ActionKind,
  Defender,
  FrontId,
  Formation,
  OffPosId,
  Play,
  Front,
  Pt,
} from '~/types/football'
import { labelledDefenders } from '~/utils/defense'
import { fitViewBox, U } from './geometry'
import { C, DIM, M } from './style'
import DiagramField from './DiagramField.vue'
import DiagramActionPath from './DiagramActionPath.vue'
import './diagram.css'

const props = withDefaults(
  defineProps<{
    play: Play
    front: FrontId
    formation: Formation
    fronts: Record<FrontId, Front>
    highlight?: OffPosId | null
    interactive?: boolean
    theme?: 'app' | 'print'
  }>(),
  { highlight: null, interactive: false, theme: 'app' },
)

const emit = defineEmits<{ select: [pos: OffPosId | null] }>()

/* ---------------- resolve the play against the front ---------------- */

const plan = computed(() => props.play.vs[props.front])

/* Letters like W/S and F/$ are named off the offense's strength, so they're
   resolved against this formation rather than read straight off the front. */
const defenders = computed<Defender[]>(() =>
  labelledDefenders(props.fronts[props.front], props.formation),
)

const defenderById = computed(() => {
  const m = new Map<string, Defender>()
  for (const d of defenders.value) m.set(d.id, d)
  return m
})

/** Formation alignment with this front's alignOverrides applied. */
const alignments = computed(() => {
  const m = new Map<OffPosId, Pt>()
  for (const p of props.formation.players) m.set(p.pos, p.at)
  const ov = plan.value?.alignOverrides
  if (ov) {
    for (const key of Object.keys(ov) as OffPosId[]) {
      const at = ov[key]
      if (at) m.set(key, at)
    }
  }
  return m
})

interface DrawnPath {
  points: Pt[]
  kind: ActionKind
  startTrim: number
  endTrim: number
}

interface PlayerEntry {
  pos: OffPosId
  at: Pt
  paths: DrawnPath[]
  isCarrier: boolean
  isQb: boolean
  isCenter: boolean
}

/**
 * Actions chain: each one starts where the previous ended, and the first
 * starts at the player's alignment. A `block` with a targetId and no path is
 * drawn from the chain position to the defender and capped with the bar, so
 * retuning a front never strands a hand-authored path.
 */
const players = computed<PlayerEntry[]>(() =>
  props.formation.players.map((fp) => {
    const at = alignments.value.get(fp.pos) ?? fp.at
    const actions = plan.value?.actions?.[fp.pos] ?? []
    const paths: DrawnPath[] = []
    let cursor: Pt = at

    for (const action of actions) {
      const target = action.targetId ? defenderById.value.get(action.targetId) : undefined
      let points: Pt[] | null = null
      let endTrim = 0

      if (action.path && action.path.length > 0) {
        points = [cursor, ...action.path]
      } else if (target) {
        points = [cursor, target.at]
        endTrim = M.blockTargetTrim
      }
      if (!points) continue

      paths.push({
        points,
        kind: action.kind,
        startTrim: paths.length === 0 ? M.pathStartTrim : 0,
        endTrim,
      })
      cursor = points[points.length - 1]!
    }

    return {
      pos: fp.pos,
      at,
      paths,
      isCarrier: fp.pos === props.play.ballCarrier,
      isQb: fp.pos === 'Q',
      isCenter: fp.pos === 'C',
    }
  }),
)

const readKeyId = computed(() => plan.value?.readKey ?? null)

/** Deliberately-unblocked defenders. The read key keeps its own red ring. */
const ignoredIds = computed(() => {
  const ids = new Set(plan.value?.ignored ?? [])
  if (readKeyId.value) ids.delete(readKeyId.value)
  return ids
})

/* ---------------- viewport ---------------- */

const fit = computed(() => {
  const pts: Pt[] = []
  for (const p of players.value) {
    pts.push(p.at)
    for (const path of p.paths) pts.push(...path.points)
  }
  for (const d of defenders.value) pts.push(d.at)
  return fitViewBox(pts, { pad: 1.8, minWidth: 16, minHeight: 11 })
})

/* ---------------- highlight ---------------- */

const dimming = computed(() => props.highlight != null)
const opacityFor = (pos: OffPosId): number =>
  dimming.value && props.highlight !== pos ? DIM : 1
const othersOpacity = computed(() => (dimming.value ? DIM : 1))

/* ---------------- interaction ---------------- */

/**
 * SEAM asks for a >=44px hit area. In yards that is roughly 1.9 (a 32-yard
 * diagram on a 375px phone), which is wider than the gap between interior
 * linemen — so the radius is capped just under half the distance to the
 * nearest team-mate. Every target is then as large as it can be without ever
 * stealing a tap from its neighbour.
 */
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

/** Largest targets painted first, so a small one is never covered. */
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

const label = computed(
  () =>
    `${props.play.name} versus the ${props.fronts[props.front]?.name ?? props.front} front, ` +
    `${props.formation.name} formation`,
)
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

    <!-- movement, under the markers so lines emerge from behind them -->
    <g class="dg-paths">
      <g
        v-for="p in players"
        :key="`a-${p.pos}`"
        class="dg-actions"
        :opacity="opacityFor(p.pos)"
        pointer-events="none"
      >
        <DiagramActionPath
          v-for="(path, i) in p.paths"
          :key="i"
          :points="path.points"
          :kind="path.kind"
          :start-trim="path.startTrim"
          :end-trim="path.endTrim"
        />
      </g>
    </g>

    <!-- defense: bare letters, no circles -->
    <g class="dg-defense" :opacity="othersOpacity" pointer-events="none">
      <g v-for="d in defenders" :key="d.id" :transform="`translate(${d.at.x * U}, ${-d.at.y * U})`">
        <template v-if="d.id === readKeyId">
          <circle
            :r="M.readRingR"
            fill="none"
            :stroke="C.accent"
            :stroke-width="M.readRingStroke"
            stroke-dasharray="5 4"
            stroke-linecap="round"
          />
          <text
            :y="-(M.readRingR + 7)"
            text-anchor="middle"
            :font-size="M.readCaptionSize"
            font-weight="700"
            letter-spacing="1"
            :fill="C.accent"
          >
            READ
          </text>
        </template>
        <circle
          v-if="ignoredIds.has(d.id)"
          :r="M.ignoredRingR"
          fill="none"
          :stroke="C.defense"
          :stroke-width="M.ignoredRingStroke"
          stroke-dasharray="3 4"
          stroke-linecap="round"
        />
        <text
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="M.letterSize"
          font-weight="600"
          :fill="C.defense"
        >
          {{ d.label }}
        </text>
      </g>
    </g>

    <!-- offense -->
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
          :fill="p.isCarrier ? C.accent : C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <circle
          v-else
          :r="M.playerR"
          :fill="p.isCarrier ? C.accent : C.playerFill"
          :stroke="C.playerStroke"
          :stroke-width="M.playerStroke"
        />
        <text
          text-anchor="middle"
          dominant-baseline="central"
          :font-size="p.pos.length > 1 ? M.letterSizeWide : M.letterSize"
          font-weight="700"
          :fill="p.isCarrier ? C.accentInk : C.playerStroke"
        >
          {{ p.pos }}
        </text>
      </g>
    </g>

    <!-- tap targets -->
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
        :aria-label="`${p.pos} assignment`"
        :aria-pressed="highlight === p.pos"
        @click.stop="pick(p.pos)"
        @keydown.enter.prevent="pick(p.pos)"
        @keydown.space.prevent="pick(p.pos)"
      />
    </g>
  </svg>
</template>
