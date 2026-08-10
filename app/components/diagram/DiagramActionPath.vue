<script setup lang="ts">
/**
 * One styled movement line, per the SEAM §3 path table. Takes an absolute
 * yard-space polyline (start point already prepended by the caller).
 */
import { computed } from 'vue'
import type { ActionKind, Pt } from '~/types/football'
import { resolveActionPath } from './path'

const props = defineProps<{
  points: Pt[]
  kind: ActionKind
  /** Yards trimmed off the head, so a line clears its own marker. */
  startTrim?: number
  /** Yards trimmed off the tail, e.g. standoff from a targeted defender. */
  endTrim?: number
  /** Overrides the kind's stroke colour (route tree emphasis). */
  color?: string
}>()

const p = computed(() =>
  resolveActionPath(props.points, props.kind, {
    startTrim: props.startTrim,
    endTrim: props.endTrim,
  }),
)

const stroke = computed(() => props.color ?? p.value?.style.color)
</script>

<template>
  <g v-if="p" :opacity="p.style.opacity ?? 1">
    <path
      :d="p.d"
      fill="none"
      :stroke="stroke"
      :stroke-width="p.style.width"
      :stroke-dasharray="p.style.dash"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <polygon v-if="p.arrow" :points="p.arrow" :fill="stroke" />
    <line
      v-else-if="p.tbar"
      :x1="p.tbar.x1"
      :y1="p.tbar.y1"
      :x2="p.tbar.x2"
      :y2="p.tbar.y2"
      :stroke="stroke"
      :stroke-width="p.style.width"
      stroke-linecap="round"
    />
  </g>
</template>
