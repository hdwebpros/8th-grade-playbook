<script setup lang="ts">
import { formations, fronts } from '~/data'
import { FRONT_LABELS, callLabelFor, callPartsFor } from '~/utils/playbook'
import type { PlayCard } from '~/composables/useFlashcards'

const props = defineProps<{ card: PlayCard }>()

const formation = computed(() => formations[props.card.play.formation]!)
/** Same word-by-word breakdown the play page stamps — Red is the formation, Veer is the play. */
const callParts = computed(() => callPartsFor(props.card.play, formation.value))
const callLabel = computed(() => callLabelFor(props.card.play, formation.value))
</script>

<template>
  <span class="face front card">
    <span class="face-context">
      Mystery play · vs the {{ FRONT_LABELS[card.front] }}
    </span>
    <span class="face-diagram">
      <PlayDiagram
        :play="card.play"
        :front="card.front"
        :formation="formation"
        :fronts="fronts"
        theme="app"
      />
    </span>
    <span class="face-prompt">
      What's the call?
      <span class="tap-hint muted">
        <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
      </span>
    </span>
  </span>

  <span class="face back card" role="status" aria-live="polite">
    <span class="face-context">
      {{ card.play.family === 'run' ? 'Run' : 'Pass' }}
    </span>
    <span class="answer-name">{{ callLabel }}</span>
    <PlayCallStamp :parts="callParts" />
    <span class="answer-desc muted">{{ card.play.description }}</span>
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
.answer-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--chalk);
}
.answer-desc {
  font-size: 0.95rem;
  max-width: 46ch;
}

@media (min-width: 640px) {
  .answer-name {
    font-size: 3rem;
  }
}
</style>
