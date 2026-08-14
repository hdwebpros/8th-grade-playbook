<script setup lang="ts">
import type { Play } from '~/types/football'
import { audiblePlays, plays, formations } from '~/data'
import { DIRECTION_AUDIBLES } from '~/utils/playbook'

useHead({ title: 'Plays — Wolves Playbook' })

/**
 * Pair same-name plays into one card per concept, grouped by family.
 * Designed to scale to ~12 concepts.
 *
 * A card is a CONCEPT — one play with a Red and a Black door, or a two-way
 * concept (Veer) with a direction × formation matrix of doors — or a
 * single door onto something bigger. The audible is the second kind: its
 * worked examples are not separate concepts, they are examples of one system,
 * so they collapse into one card that opens /audible.
 */
interface Concept {
  name: string
  callName?: string
  family: Play['family']
  /** One line — the card says the gist, the play page says the rest. */
  summary: string
  directions?: { id: string; formationName: string; callName?: string }[]
  /**
   * Set instead of `directions` when the concept runs BOTH ways out of BOTH
   * formations (four plays). One row per direction, two formation doors each.
   */
  matrix?: {
    direction: Play['direction']
    doors: { id: string; formationName: string }[]
  }[]
  /** Set instead of `directions` when the card is a single door. */
  to?: string
  toLabel?: string
}

/** Book order for a two-way concept's rows: the base call first, its mirror second. */
const DIRECTION_ORDER: Play['direction'][] = ['right', 'left']

/** "INDY flips it left · HOOSIER flips it right" — taught once per two-way card. */
const audibleHint = `${DIRECTION_AUDIBLES.left.toUpperCase()} flips it left · ${DIRECTION_AUDIBLES.right.toUpperCase()} flips it right`

/** The audible examples live on /audible, not on a card of their own. */
const audibleIds = new Set(audiblePlays.map((p) => p.id))

const audibleCard: Concept = {
  name: 'Audible',
  callName: 'Formation · protection · digits',
  family: 'pass',
  summary: 'The numbered passing system. Formation, protection, digits — call any pass at the line.',
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
    // A concept that runs BOTH ways (four plays: 2 directions × 2 formations)
    // gets a matrix card — one row per direction, a formation door per cell.
    // Direction is no longer in any call name (Indy/Hoosier are line audibles
    // now), so the rows are what keep the four doors tellable-apart.
    const dirs = new Set(group.map((p) => p.direction))
    const fms = new Set(group.map((p) => p.formation))
    if (
      (dirs.size > 1 && fms.size > 1 && group.length > 2) ||
      group.some((p) => p.audibleFlipId)
    ) {
      return {
        name: first.name,
        family: first.family,
        summary: first.summary,
        matrix: DIRECTION_ORDER.filter((d) => dirs.has(d)).map((direction) => ({
          direction,
          doors: group
            .filter((p) => p.direction === direction)
            .map((p) => ({
              id: p.id,
              formationName: formations[p.formation]?.name ?? p.formation,
            })),
        })),
      }
    }
    // Mirrored plays can carry OPPOSITE call names (Veer Red is 'Hoosier', Veer
    // Black is 'Indy'). One name at card level would then label the wrong door,
    // so the name only sits on the card when the group speaks with one voice —
    // otherwise it rides on each direction's own door.
    const callNames = [...new Set(group.map((p) => p.callName).filter(Boolean))]
    const shared = callNames.length <= 1
    return {
      name: first.name,
      callName: shared ? callNames[0] : undefined,
      family: first.family,
      summary: first.summary,
      directions: group.map((p) => ({
        id: p.id,
        formationName: formations[p.formation]?.name ?? p.formation,
        callName: shared ? undefined : p.callName,
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
          <p class="play-desc muted">{{ c.summary }}</p>
          <div v-if="c.matrix" class="matrix">
            <div v-for="row in c.matrix" :key="row.direction" class="matrix-row">
              <span class="matrix-dir">{{ row.direction }}</span>
              <div class="dir-row">
                <NuxtLink
                  v-for="d in row.doors"
                  :key="d.id"
                  :to="`/plays/${d.id}`"
                  class="dir-link"
                  :class="d.formationName.toLowerCase().replace(/\s+/g, '-')"
                >
                  {{ d.formationName }}
                  <Icon name="lucide:arrow-right" class="dir-arrow" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
            <p class="audible-hint muted">
              <Icon name="lucide:megaphone" aria-hidden="true" />
              At the line: {{ audibleHint }}
            </p>
          </div>
          <div v-else class="dir-row">
            <NuxtLink
              v-for="d in c.directions"
              :key="d.id"
              :to="`/plays/${d.id}`"
              class="dir-link"
              :class="d.formationName.toLowerCase().replace(/\s+/g, '-')"
            >
              {{ d.formationName }}
              <span v-if="d.callName" class="dir-call">{{ d.callName }}</span>
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
          <p class="play-desc muted">{{ c.summary }}</p>
          <div v-if="c.matrix" class="matrix">
            <div v-for="row in c.matrix" :key="row.direction" class="matrix-row">
              <span class="matrix-dir">{{ row.direction }}</span>
              <div class="dir-row">
                <NuxtLink
                  v-for="d in row.doors"
                  :key="d.id"
                  :to="`/plays/${d.id}`"
                  class="dir-link"
                  :class="d.formationName.toLowerCase().replace(/\s+/g, '-')"
                >
                  {{ d.formationName }}
                  <Icon name="lucide:arrow-right" class="dir-arrow" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
            <p class="audible-hint muted">
              <Icon name="lucide:megaphone" aria-hidden="true" />
              At the line: {{ audibleHint }}
            </p>
          </div>
          <div v-else class="dir-row">
            <NuxtLink v-if="c.to" :to="c.to" class="dir-link">
              {{ c.toLabel ?? 'Open' }}
              <Icon name="lucide:arrow-right" class="dir-arrow" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              v-for="d in c.directions"
              :key="d.id"
              :to="`/plays/${d.id}`"
              class="dir-link"
              :class="d.formationName.toLowerCase().replace(/\s+/g, '-')"
            >
              {{ d.formationName }}
              <span v-if="d.callName" class="dir-call">{{ d.callName }}</span>
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

/* Two-way concepts: one row per direction, formation doors as the cells. */
.matrix {
  display: grid;
  gap: 8px;
}
.matrix-row {
  display: grid;
  grid-template-columns: 58px 1fr;
  align-items: center;
  gap: 10px;
}
.matrix-dir {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--steel);
}
.audible-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
}
.audible-hint .iconify {
  color: var(--red);
  flex: none;
}
.dir-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  min-height: 44px;
  padding: 6px 10px;
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
/* The call name for one direction, riding on its own door. Inherits the door's
   colour so the Red hover state stays legible. */
.dir-call {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  opacity: 0.72;
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
