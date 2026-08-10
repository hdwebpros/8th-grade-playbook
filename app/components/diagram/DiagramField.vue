<script setup lang="ts">
/**
 * The quiet stage (SEAM §3 "Field"): theme field colour, the LOS as the
 * strongest line, faint 1-yard hash ticks on the LOS, and one faint line
 * 5 yards downfield. Nothing else.
 */
import { computed } from 'vue'
import { U } from './geometry'
import type { Box } from './geometry'
import { C, M } from './style'

const props = defineProps<{ box: Box }>()

const rect = computed(() => ({
  x: props.box.minX * U,
  y: -props.box.maxY * U,
  w: (props.box.maxX - props.box.minX) * U,
  h: (props.box.maxY - props.box.minY) * U,
}))

const edge = computed(() => ({ left: props.box.minX * U, right: props.box.maxX * U }))

/** One tick per whole yard across the visible width. */
const ticks = computed(() => {
  const out: number[] = []
  const from = Math.ceil(props.box.minX)
  const to = Math.floor(props.box.maxX)
  // Guard against a pathological box producing thousands of ticks.
  if (to - from > 120) return out
  for (let x = from; x <= to; x++) out.push(x * U)
  return out
})

const showDepthLine = computed(() => props.box.maxY >= 5.4)
</script>

<template>
  <g class="dg-field" pointer-events="none">
    <rect :x="rect.x" :y="rect.y" :width="rect.w" :height="rect.h" :fill="C.field" />

    <!-- 5 yards downfield -->
    <line
      v-if="showDepthLine"
      :x1="edge.left"
      :y1="-5 * U"
      :x2="edge.right"
      :y2="-5 * U"
      :stroke="C.grid"
      :stroke-width="M.gridStroke"
    />

    <!-- 1-yard hash ticks on the LOS -->
    <g :stroke="C.grid" :stroke-width="M.gridStroke">
      <line v-for="x in ticks" :key="x" :x1="x" :y1="-M.tickHalf" :x2="x" :y2="M.tickHalf" />
    </g>

    <!-- line of scrimmage -->
    <line
      :x1="edge.left"
      :y1="0"
      :x2="edge.right"
      :y2="0"
      :stroke="C.los"
      :stroke-width="M.losStroke"
    />
  </g>
</template>
