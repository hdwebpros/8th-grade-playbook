<script setup lang="ts">
/**
 * RouteFaces — the two faces of one Route Numbers flashcard.
 *
 * Renders EXACTLY two root elements (`.face.front.card` / `.face.back.card`)
 * so the parent drill page can drop them straight inside its `.flash-card`
 * flip button — the page owns the flip state and the `.flipped` rotation,
 * this component owns face content and face styling.
 *
 * Two card directions (see useRouteDeck.ts):
 *  - number-to-route: front = big number, back = name + drawn shape + coaching line.
 *  - route-to-number: front = drawn shape only, back = big number + name + coaching line.
 *
 * The shape is drawn with the shared SEAM §3 diagram parts (same field, same
 * smoothing, same arrowhead as PlayDiagram / RouteTreeDiagram), in the accent
 * colour because the lone route is the star of the card. No number badge and
 * no name anywhere near a front-side shape — the front never leaks the answer.
 */
import { computed } from 'vue'
import type { Pt } from '~/types/football'
import type { RouteCard } from '~/composables/useRouteDeck'
import { fitViewBox } from '~/components/diagram/geometry'
import { C, M } from '~/components/diagram/style'
import DiagramField from '~/components/diagram/DiagramField.vue'
import DiagramActionPath from '~/components/diagram/DiagramActionPath.vue'
import '~/components/diagram/diagram.css'

const props = defineProps<{ card: RouteCard }>()

const ORIGIN: Pt = { x: 0, y: 0 }

const points = computed<Pt[]>(() => [ORIGIN, ...props.card.route.path])

const fit = computed(() =>
  fitViewBox(points.value, { pad: 1.6, minWidth: 14, minHeight: 10 }),
)

const numFirst = computed(() => props.card.direction === 'number-to-route')
</script>

<template>
  <span class="face front card" aria-hidden="false">
    <template v-if="numFirst">
      <span class="face-context">Route tree · mystery route</span>
      <span class="num-stage">
        <span class="big-number">{{ card.route.num }}</span>
      </span>
      <span class="face-prompt">
        What's the route?
        <span class="tap-hint muted">
          <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
        </span>
      </span>
    </template>
    <template v-else>
      <span class="face-context">Route tree · mystery number</span>
      <span class="face-diagram">
        <svg
          class="dg-root"
          :viewBox="fit.viewBox"
          width="100%"
          role="img"
          aria-label="A drawn route shape — name its number"
        >
          <DiagramField :box="fit.box" />
          <g class="dg-actions">
            <DiagramActionPath
              :points="points"
              kind="route"
              :start-trim="M.pathStartTrim"
              :color="C.accent"
            />
          </g>
          <g class="dg-marker">
            <circle
              :r="M.playerR"
              :fill="C.playerFill"
              :stroke="C.playerStroke"
              :stroke-width="M.playerStroke"
            />
          </g>
        </svg>
      </span>
      <span class="face-prompt">
        What's the number?
        <span class="tap-hint muted">
          <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
        </span>
      </span>
    </template>
  </span>

  <span class="face back card" role="status" aria-live="polite">
    <template v-if="numFirst">
      <span class="face-context">A {{ card.route.num }} is a</span>
      <span class="answer-name">{{ card.route.name }}</span>
      <span class="face-diagram back-diagram">
        <svg
          class="dg-root"
          :viewBox="fit.viewBox"
          width="100%"
          role="img"
          :aria-label="`The ${card.route.name} route, drawn`"
        >
          <DiagramField :box="fit.box" />
          <g class="dg-actions">
            <DiagramActionPath
              :points="points"
              kind="route"
              :start-trim="M.pathStartTrim"
              :color="C.accent"
            />
          </g>
          <g class="dg-marker">
            <circle
              :r="M.playerR"
              :fill="C.playerFill"
              :stroke="C.playerStroke"
              :stroke-width="M.playerStroke"
            />
          </g>
        </svg>
      </span>
      <span class="answer-desc muted">{{ card.route.description }}</span>
    </template>
    <template v-else>
      <span class="face-context">That shape is a</span>
      <span class="big-number answer-number">{{ card.route.num }}</span>
      <span class="answer-call">{{ card.route.name }}</span>
      <span class="answer-desc muted">{{ card.route.description }}</span>
    </template>
  </span>
</template>

<style scoped>
/*
 * The parent page's scoped face styles can't reach these elements, so the
 * face contract (flashcards.vue) is restated here: both faces stack in the
 * same grid cell, the back is pre-rotated for the 3D flip, hidden backfaces,
 * red left border marking the answer side.
 */
.face {
  grid-area: 1 / 1;
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  backface-visibility: hidden;
  min-height: 100%;
}
.face.back {
  transform: rotateY(180deg);
  align-content: center;
  justify-items: center;
  text-align: center;
  border-left: 3px solid var(--red);
}

.face-context {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}
.face-diagram {
  display: block;
  width: 100%;
  border-radius: var(--r-ctl);
  overflow: hidden;
  background: var(--dg-field);
}
.back-diagram {
  max-width: 340px;
}
.face-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk);
}
.tap-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

/* The number, poster-sized — the front question or the back reveal. */
.num-stage {
  display: grid;
  place-items: center;
  min-height: 180px;
}
.big-number {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 6rem;
  line-height: 1;
  color: var(--chalk);
  font-variant-numeric: tabular-nums;
}
.answer-number {
  color: var(--red);
}

.answer-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--chalk);
}
.answer-call {
  padding: 3px 12px;
  border-radius: 999px;
  background: var(--red-glow);
  color: var(--red);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.answer-desc {
  font-size: 0.95rem;
  max-width: 46ch;
}

@media (min-width: 640px) {
  .answer-name {
    font-size: 3rem;
  }
  .big-number {
    font-size: 7rem;
  }
}
</style>
