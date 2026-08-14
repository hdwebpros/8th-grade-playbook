<script setup lang="ts">
/**
 * "At the line" — the audible that flips a run play's direction, taught the
 * way it happens on the field. The huddle called this play; the QB sees the
 * defense leaning into it; he yells the word twice and the same play goes the
 * other way. The action link IS the lesson: press it and the diagram mirrors.
 *
 * Renders only for plays wired with `audibleFlipId` (the four Veers). The
 * page passes the resolved flip play so this component stays a dumb card.
 */
import type { FrontId, Play } from '~/types/football'
import { DIRECTION_AUDIBLES } from '~/utils/playbook'

const props = defineProps<{
  /** The play on screen right now. */
  play: Play
  /** Same play, same formation, opposite direction — what the audible makes it. */
  flip: Play
  /** Current defensive front, carried through the link so the picture holds. */
  front: FrontId
}>()

/** The word that sends the play the OTHER way — Indy for left, Hoosier for right. */
const word = computed(() => DIRECTION_AUDIBLES[props.flip.direction])

const yelled = computed(() => {
  const w = word.value.toUpperCase()
  return `${w}! ${w}!`
})

/** "Safety cheating right?" — the trouble is on the side we were headed. */
const story = computed(() => {
  const was = props.play.direction
  const now = props.flip.direction
  return `Safety cheating ${was}? Line shifted over? The quarterback yells it twice — same play, now going ${now.toUpperCase()}.`
})

const flipLabel = computed(
  () => `${props.flip.name} ${props.flip.direction === 'left' ? 'Left' : 'Right'}`,
)
</script>

<template>
  <fieldset class="callout">
    <legend>At the line</legend>

    <div class="say">
      <span class="say-label">Say it</span>
      <p class="say-phrase">{{ yelled }}</p>
    </div>

    <p class="story">{{ story }}</p>

    <NuxtLink
      class="flip-btn"
      :to="{ path: `/plays/${flip.id}`, query: { front } }"
    >
      See the flip
      <Icon name="lucide:arrow-right" aria-hidden="true" />
      {{ flipLabel }}
    </NuxtLink>

    <dl class="gloss">
      <div class="gloss-item">
        <dt>{{ DIRECTION_AUDIBLES.left }}</dt>
        <dd>run goes left</dd>
      </div>
      <span class="gloss-dot" aria-hidden="true">&middot;</span>
      <div class="gloss-item">
        <dt>{{ DIRECTION_AUDIBLES.right }}</dt>
        <dd>run goes right</dd>
      </div>
    </dl>
  </fieldset>
</template>

<style scoped>
.callout {
  margin: 0;
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  padding: 12px 14px 14px;
  background: var(--panel);
}
.callout legend {
  padding: 0 6px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}

/* The yelled word — same idiom as the audible page's SAY IT box, but loud. */
.say {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--r-ctl);
  border: 1px solid color-mix(in srgb, var(--red) 45%, var(--line));
  background: color-mix(in srgb, var(--red) 10%, var(--panel-raised));
}
.say-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}
.say-phrase {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.7rem;
  line-height: 1.1;
  letter-spacing: 0.04em;
  color: var(--red);
}

.story {
  font-size: 0.92rem;
  color: var(--chalk-dim);
}

.flip-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  width: fit-content;
  border-radius: var(--r-ctl);
  border: 1px solid var(--red);
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition:
    background var(--t-fast) var(--ease),
    border-color var(--t-fast) var(--ease);
}
.flip-btn:hover {
  background: color-mix(in srgb, var(--red) 85%, #000);
  border-color: color-mix(in srgb, var(--red) 85%, #000);
}

/* Both words, one line: Indy = run goes left · Hoosier = run goes right. */
.gloss {
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
  font-size: 0.88rem;
}
.gloss-item {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.gloss-item dt {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--red);
}
.gloss-item dd {
  margin: 0;
  color: var(--chalk-dim);
}
.gloss-dot {
  color: var(--steel);
}
</style>
