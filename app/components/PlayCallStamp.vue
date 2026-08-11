<script setup lang="ts">
/**
 * The play call, said out loud, with a squiggle under every word telling you
 * what that word is doing — "Red" is the formation, "Veer" is the play.
 *
 * Drawn as a stamp: this is the thing the kid repeats in the huddle, so it
 * gets its own box with its own label rather than sitting in body copy.
 */
import type { CallPart } from '~/types/football'

defineProps<{ parts: CallPart[] }>()
</script>

<template>
  <fieldset class="stamp">
    <legend>Play call</legend>
    <div class="words">
      <div v-for="(part, i) in parts" :key="`${part.word}-${i}`" class="part">
        <span class="word">{{ part.word }}</span>
        <span class="squiggle" aria-hidden="true" />
        <span class="label">{{ part.label }}</span>
      </div>
    </div>
  </fieldset>
</template>

<style scoped>
.stamp {
  /* Fieldsets come with browser chrome — reset it, then draw our own. */
  margin: 0;
  padding: 8px 14px 10px;
  border: 2px dashed color-mix(in srgb, var(--red) 55%, transparent);
  border-radius: var(--r-card);
  background: color-mix(in srgb, var(--red) 6%, transparent);
  width: fit-content;
  max-width: 100%;
}
legend {
  padding: 0 8px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--red);
}

.words {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 6px 16px;
}
.part {
  display: grid;
  justify-items: center;
  gap: 2px;
}
.word {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--chalk);
}
/* One wave, tiled — so a long word gets more waves rather than stretched ones.
   It is a mask, not a background image, so the colour stays on the token. */
.squiggle {
  width: 100%;
  height: 6px;
  background: var(--red);
  --wave: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath d='M0 4.2 Q 3 0.6 6 4.2 T 12 4.2' fill='none' stroke='%23000' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E");
  -webkit-mask: var(--wave) repeat-x center / 12px 6px;
  mask: var(--wave) repeat-x center / 12px 6px;
}
.label {
  font-family: var(--font-body);
  font-size: 0.72rem;
  line-height: 1.2;
  text-align: center;
  text-transform: lowercase;
  color: var(--steel);
  max-width: 15ch;
}

@media (min-width: 880px) {
  .word {
    font-size: 1.8rem;
  }
  .label {
    font-size: 0.78rem;
  }
}
</style>
