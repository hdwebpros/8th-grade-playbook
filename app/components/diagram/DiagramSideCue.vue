<script setup lang="ts">
/**
 * Which way is which: a football on the LOS at the inside edge of the frame
 * ("BALL") and a stripe down the outside edge ("SIDELINE"). Drawn inside any
 * route diagram so a lone route reads as "toward the ball" or "toward the
 * sideline" instead of "left" or "right". Callers reserve the room (~2 yd
 * each side, ~1.9 yd below the LOS) when they fit the viewBox.
 */
import { computed } from 'vue'
import { U } from './geometry'
import type { Box } from './geometry'
import { C } from './style'

const props = withDefaults(
  defineProps<{
    box: Box
    /** Which side of the ball the receiver is lined up on. */
    side?: 'left' | 'right'
  }>(),
  { side: 'right' },
)

const cue = computed(() => {
  const b = props.box
  const sx = props.side === 'left' ? -1 : 1
  const inside = sx > 0 ? b.minX : b.maxX
  const outside = sx > 0 ? b.maxX : b.minX
  return {
    ballX: (inside + 1.3 * sx) * U,
    ballLabelX: (inside + 0.5 * sx) * U,
    ballAnchor: sx > 0 ? 'start' : 'end',
    sideX: outside * U,
    sideLabelX: (outside - 0.35 * sx) * U,
    sideAnchor: sx > 0 ? 'end' : 'start',
    labelY: 1.35 * U,
    top: -b.maxY * U,
    bottom: -b.minY * U,
  }
})
</script>

<template>
  <g class="dg-cue" pointer-events="none">
    <line
      :x1="cue.sideX"
      :y1="cue.top"
      :x2="cue.sideX"
      :y2="cue.bottom"
      :stroke="C.line"
      stroke-width="5"
      opacity="0.9"
    />
    <text
      :x="cue.sideLabelX"
      :y="cue.labelY"
      :text-anchor="cue.sideAnchor"
      dominant-baseline="central"
      font-size="11.5"
      font-weight="700"
      letter-spacing="1"
      :fill="C.defense"
    >
      SIDELINE
    </text>
    <g :transform="`translate(${cue.ballX}, 0)`">
      <ellipse rx="13" ry="7.5" :fill="C.accent" />
      <line x1="-4.5" y1="0" x2="4.5" y2="0" :stroke="C.accentInk" stroke-width="1.4" />
      <line x1="-2.2" y1="-2.2" x2="-2.2" y2="2.2" :stroke="C.accentInk" stroke-width="1.2" />
      <line x1="2.2" y1="-2.2" x2="2.2" y2="2.2" :stroke="C.accentInk" stroke-width="1.2" />
    </g>
    <text
      :x="cue.ballLabelX"
      :y="cue.labelY"
      :text-anchor="cue.ballAnchor"
      dominant-baseline="central"
      font-size="11.5"
      font-weight="700"
      letter-spacing="1"
      :fill="C.defense"
    >
      BALL
    </text>
  </g>
</template>
