<script setup lang="ts">
import type { Play } from '~/types/football'
import { audiblePlays, plays, formations } from '~/data'

useHead({ title: 'Plays — Wolves Playbook' })

/**
 * Pair mirrored plays (veer-red / veer-black) into one card per concept,
 * grouped by family. Designed to scale to ~12 concepts.
 *
 * A card is either a CONCEPT — one play with a Red and a Black door — or a
 * single door onto something bigger. The audible is the second kind: its
 * worked examples are not separate concepts, they are examples of one system,
 * so they collapse into one card that opens /audible.
 */
interface Concept {
  name: string
  callName?: string
  family: Play['family']
  description: string
  directions?: { id: string; formationName: string }[]
  /** Set instead of `directions` when the card is a single door. */
  to?: string
  toLabel?: string
}

/** The audible examples live on /audible, not on a card of their own. */
const audibleIds = new Set(audiblePlays.map((p) => p.id))

const audibleCard: Concept = {
  name: 'Audible',
  callName: 'Formation · protection · two digits',
  family: 'pass',
  description:
    'The numbered passing system. Every route on the tree has a digit, and a call is just the formation, the protection, and the digits read outside-to-in. Four worked examples inside — including Split Wide Bull 95-59, a digit for every receiver — or call your own and see it drawn.',
  to: '/audible',
  toLabel: 'Open',
}

const concepts = computed<Concept[]>(() => {
  const byName = new Map<string, Play[]>()
  for (const play of Object.values(plays) as Play[]) {
    if (audibleIds.has(play.id)) continue
    const list = byName.get(play.name) ?? []
    list.push(play)
    byName.set(play.name, list)
  }
  return [...byName.values()].map((group) => {
    const first = group[0]!
    return {
      name: first.name,
      callName: first.callName,
      family: first.family,
      description: first.description,
      directions: group.map((p) => ({
        id: p.id,
        formationName: formations[p.formation]?.name ?? p.formation,
      })),
    }
  })
})

const runs = computed(() => concepts.value.filter((c) => c.family === 'run'))
const passes = computed(() => [
  ...concepts.value.filter((c) => c.family === 'pass'),
  audibleCard,
])
</script>

<template>
  <div class="plays">
    <header class="page-head">
      <p class="eyebrow">Playbook</p>
      <h1>Plays</h1>
    </header>

    <section v-if="runs.length" class="family">
      <h2 class="family-title"><Icon name="lucide:footprints" aria-hidden="true" /> Runs</h2>
      <div class="grid">
        <article v-for="c in runs" :key="c.name" class="card play-card">
          <div class="play-head">
            <h3 class="play-name">{{ c.name }}</h3>
            <span v-if="c.callName" class="call muted">{{ c.callName }}</span>
          </div>
          <p class="play-desc muted">{{ c.description }}</p>
          <div class="dir-row">
            <NuxtLink
              v-for="d in c.directions"
              :key="d.id"
              :to="`/plays/${d.id}`"
              class="dir-link"
              :class="d.formationName.toLowerCase()"
            >
              {{ d.formationName }}
              <Icon name="lucide:arrow-right" class="dir-arrow" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section v-if="passes.length" class="family">
      <h2 class="family-title"><Icon name="lucide:wind" aria-hidden="true" /> Passes</h2>
      <div class="grid">
        <article v-for="c in passes" :key="c.name" class="card play-card">
          <div class="play-head">
            <h3 class="play-name">{{ c.name }}</h3>
            <span v-if="c.callName" class="call muted">{{ c.callName }}</span>
          </div>
          <p class="play-desc muted">{{ c.description }}</p>
          <div class="dir-row">
            <NuxtLink v-if="c.to" :to="c.to" class="dir-link">
              {{ c.toLabel ?? 'Open' }}
              <Icon name="lucide:arrow-right" class="dir-arrow" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              v-for="d in c.directions"
              :key="d.id"
              :to="`/plays/${d.id}`"
              class="dir-link"
              :class="d.formationName.toLowerCase()"
            >
              {{ d.formationName }}
              <Icon name="lucide:arrow-right" class="dir-arrow" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <p class="more muted">
      <Icon name="lucide:hammer" aria-hidden="true" />
      More plays get installed here as coach signs off on them.
    </p>
  </div>
</template>

<style scoped>
.plays {
  display: grid;
  gap: 24px;
}
.page-head h1 {
  font-size: 2.2rem;
}

.family {
  display: grid;
  gap: 12px;
}
.family-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  color: var(--steel);
  letter-spacing: 0.12em;
}
.family-title .iconify {
  color: var(--red);
}

.grid {
  display: grid;
  gap: 12px;
}
@media (min-width: 720px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

.play-card {
  padding: 16px;
  display: grid;
  gap: 10px;
}
.play-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.play-name {
  font-size: 1.6rem;
}
.call {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.play-desc {
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dir-row {
  display: flex;
  gap: 8px;
}
.dir-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  border-radius: var(--r-ctl);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid var(--line);
  background: var(--panel-raised);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.dir-link.red {
  border-color: color-mix(in srgb, var(--red) 50%, transparent);
  color: var(--red);
}
.dir-link.red:hover {
  background: var(--red);
  color: #fff;
}
.dir-link:not(.red):hover {
  border-color: var(--steel);
  color: #fff;
}
.dir-arrow {
  font-size: 15px;
}

.more {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}
</style>
