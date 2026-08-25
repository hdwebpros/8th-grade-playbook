<script setup lang="ts">
/**
 * The two faces of a "What's My Job" flashcard.
 *
 * Renders EXACTLY two root elements (a Vue 3 fragment): the front face and
 * the back face. The parent page owns the flip button, the 3D scene, and the
 * `.flipped` rotation — this component owns face content and face styling
 * (the face-* and answer-* classes mirror app/pages/quiz/flashcards.vue; scoped
 * styles there can't reach these elements, so the needed rules live here).
 */
import { formations, fronts } from '~/data'
import { FRONT_LABELS, POSITION_NAMES, callLabelFor } from '~/utils/playbook'
import type { JobCard } from '~/composables/useJobDeck'

const props = defineProps<{ card: JobCard }>()

const formation = computed(() => formations[props.card.play.formation]!)
const posName = computed(() => POSITION_NAMES[props.card.pos])
const frontLabel = computed(() => FRONT_LABELS[props.card.front])
/** The full call, formation first — "Red Keep", not just "Keep". */
const callLabel = computed(() => callLabelFor(props.card.play, formation.value))
</script>

<template>
  <span class="face front card" aria-hidden="false">
    <span class="face-context">
      {{ callLabel }} · vs the {{ frontLabel }}
    </span>
    <span class="face-diagram">
      <PlayDiagram
        :play="card.play"
        :front="card.front"
        :formation="formation"
        :fronts="fronts"
        :highlight="card.pos"
        theme="app"
      />
    </span>
    <span class="face-prompt">
      You're the {{ posName }} — what's your job?
      <span class="tap-hint muted">
        <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
      </span>
    </span>
  </span>

  <span class="face back card" role="status" aria-live="polite">
    <span class="answer-pos">{{ posName }}</span>
    <span class="answer-rule">{{ card.answer.rule }}</span>
    <span v-if="card.answer.detail" class="answer-detail muted">
      {{ card.answer.detail }}
    </span>
    <span class="back-context muted">
      {{ callLabel }} · vs the {{ frontLabel }}
    </span>
  </span>
</template>

<style scoped>
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
  border-radius: var(--r-ctl);
  overflow: hidden;
  background: var(--dg-field);
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

/* ---------- back: the rule is a sentence, size for reading ---------- */
.answer-pos {
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
.answer-rule {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.25;
  color: var(--chalk);
  max-width: 26ch;
  text-wrap: balance;
}
.answer-detail {
  font-size: 0.95rem;
  max-width: 46ch;
}
.back-context {
  margin-top: 4px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

@media (min-width: 640px) {
  .answer-rule {
    font-size: 1.7rem;
  }
}
</style>
