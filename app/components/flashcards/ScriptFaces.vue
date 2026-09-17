<script setup lang="ts">
/**
 * ScriptFaces — the two faces of one "First 8" flashcard.
 *
 * Renders EXACTLY two root elements (`.face.front.card` / `.face.back.card`)
 * for the drill page's flip button — same contract as RouteFaces.vue. The
 * page owns the flip state; this component owns face content and styling.
 *
 * Two card directions (see useScriptDeck.ts):
 *  - slot-to-call: front = big "#5", back = the call + the count.
 *  - call-to-slot: front = the call, back = every slot it fills + each count
 *    (Red Veer Left is #2 on two AND #4 on one — both go on the back).
 */
import { computed } from 'vue'
import type { ScriptCard } from '~/composables/useScriptDeck'
import { SNAP_LABELS } from '~/data/script'

const props = defineProps<{ card: ScriptCard }>()

const slotFirst = computed(() => props.card.direction === 'slot-to-call')
</script>

<template>
  <span class="face front card" aria-hidden="false">
    <template v-if="slotFirst">
      <span class="face-context">Opening script · mystery play</span>
      <span class="num-stage">
        <span class="big-number">#{{ card.slot.n }}</span>
      </span>
      <span class="face-prompt">
        What's the call? What's the count?
        <span class="tap-hint muted">
          <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
        </span>
      </span>
    </template>
    <template v-else>
      <span class="face-context">Opening script · which play is it?</span>
      <span class="call-stage">
        <span class="answer-name">{{ card.slot.label }}</span>
      </span>
      <span class="face-prompt">
        What number? What count?
        <span class="tap-hint muted">
          <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
        </span>
      </span>
    </template>
  </span>

  <span class="face back card" role="status" aria-live="polite">
    <template v-if="slotFirst">
      <span class="face-context">Play #{{ card.slot.n }} is</span>
      <span class="answer-name">{{ card.slot.label }}</span>
      <span class="count" :class="{ two: card.slot.count === 2 }">
        {{ SNAP_LABELS[card.slot.count] }}
      </span>
      <span class="answer-desc muted">{{ card.slot.play.summary }}</span>
    </template>
    <template v-else>
      <span class="face-context">{{ card.slot.label }} is</span>
      <span class="answer-slots">
        <span v-for="s in card.slots" :key="s.n" class="answer-slot">
          <span class="big-number answer-number">#{{ s.n }}</span>
          <span class="count" :class="{ two: s.count === 2 }">{{ SNAP_LABELS[s.count] }}</span>
        </span>
      </span>
      <span v-if="card.slots.length > 1" class="answer-desc muted">
        It's in the script twice — same play, different count. Know both.
      </span>
      <span v-else class="answer-desc muted">{{ card.slot.play.summary }}</span>
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
.num-stage,
.call-stage {
  display: grid;
  place-items: center;
  min-height: 180px;
  text-align: center;
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
  font-size: 4.2rem;
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

/* The count pill: quiet for on one, loud red for on two. */
.count {
  padding: 4px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-raised);
  color: var(--steel);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
}
.count.two {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}

.answer-slots {
  display: flex;
  justify-content: center;
  gap: 8px 28px;
  flex-wrap: wrap;
}
.answer-slot {
  display: grid;
  justify-items: center;
  gap: 6px;
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
  .answer-number {
    font-size: 5rem;
  }
}
</style>
