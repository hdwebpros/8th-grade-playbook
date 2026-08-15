<script setup lang="ts">
/**
 * /formations — the four sets at a glance. One card each, drawn at the SAME
 * scale so a kid can see that Split Wide is wide and Tight is tight before
 * reading a word. Tap a card to open the set and find your spot.
 */
import { formations } from '~/data'
import { formationGuideList } from '~/data/formation-guides'

useHead({ title: 'Formations — Wolves Playbook' })

const cards = computed(() =>
  formationGuideList
    .map((guide) => ({ guide, formation: formations[guide.id] }))
    .filter((c) => c.formation),
)

const strengthLabel = (side: 'left' | 'right' | 'balanced') =>
  side === 'balanced' ? 'Balanced' : `Strong ${side}`
</script>

<template>
  <div class="formations">
    <header class="page-head">
      <p class="eyebrow">Line up right</p>
      <h1>Formations</h1>
      <p class="muted lead">
        Four sets, same eleven kids. Know where you stand before you know what you do.
        Tap a set to find your spot.
      </p>
    </header>

    <div class="grid">
      <NuxtLink
        v-for="c in cards"
        :key="c.guide.id"
        :to="`/formations/${c.guide.id}`"
        class="card fcard"
        :class="`is-${c.guide.id}`"
      >
        <div class="fcard-diagram">
          <FormationDiagram :formation="c.formation!" compact />
        </div>
        <div class="fcard-body">
          <div class="fcard-head">
            <h2 class="fcard-name">{{ c.formation!.name }}</h2>
            <span class="strength" :class="`side-${c.guide.strength.side}`">
              <Icon
                :name="
                  c.guide.strength.side === 'left'
                    ? 'lucide:arrow-left'
                    : c.guide.strength.side === 'right'
                      ? 'lucide:arrow-right'
                      : 'lucide:equal'
                "
                aria-hidden="true"
              />
              {{ strengthLabel(c.guide.strength.side) }}
            </span>
          </div>
          <p class="fcard-tag">{{ c.guide.tagline }}</p>
          <p class="fcard-spot muted">{{ c.guide.spotIt[0] }}</p>
          <span class="fcard-cta">
            Find my spot <Icon name="lucide:arrow-right" aria-hidden="true" />
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 18px;
}
.page-head h1 {
  font-size: 2.4rem;
  margin: 2px 0 6px;
}
.lead {
  max-width: 56ch;
  line-height: 1.45;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.fcard {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: inherit;
  transition:
    border-color var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.fcard:hover {
  border-color: var(--steel);
  transform: translateY(-1px);
}
.fcard:active {
  transform: translateY(0);
}
.fcard.is-red {
  border-top: 3px solid var(--red);
}
.fcard-diagram {
  background: var(--dg-field);
  border-bottom: 1px solid var(--line);
}
.fcard-body {
  padding: 12px 14px 14px;
  display: grid;
  gap: 4px;
}
.fcard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.fcard-name {
  font-size: 1.7rem;
  margin: 0;
}
.strength {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-raised);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--chalk-dim);
  white-space: nowrap;
}
.strength.side-left,
.strength.side-right {
  color: var(--red);
  border-color: color-mix(in srgb, var(--red) 40%, transparent);
}
.fcard-tag {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk-dim);
}
.fcard-spot {
  font-size: 0.95rem;
  line-height: 1.4;
}
.fcard-cta {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--red);
}
</style>
