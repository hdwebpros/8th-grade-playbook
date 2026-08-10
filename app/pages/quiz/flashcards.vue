<script setup lang="ts">
import type { Component } from 'vue'
import type { Formation } from '~/types/football'
import { formations, playList, routes } from '~/data'
import { buildPlayDeck, relapPlayDeck, type PlayCard } from '~/composables/useFlashcards'
import { buildFormationDeck, relapFormationDeck, type FormationCard } from '~/composables/useFormationDeck'
import { buildJobDeck, relapJobDeck, type JobCard } from '~/composables/useJobDeck'
import { buildRouteDeck, relapRouteDeck, type RouteCard } from '~/composables/useRouteDeck'
import { FormationFaces, JobFaces, PlayFaces, RouteFaces } from '#components'

useHead({ title: 'Flashcards — Wolves Playbook' })

/**
 * A flashcard is one of the deck-specific card shapes; each deck brings its
 * own builder, relap and faces component, and the drill loop below stays
 * deck-agnostic. Decks marked available: false are designed, not built yet.
 */
type AnyCard = PlayCard | FormationCard | JobCard | RouteCard

const formationList = Object.values(formations).filter((f): f is Formation => !!f)

interface DeckDef {
  id: string
  icon: string
  title: string
  sub: string
  available: boolean
  /** Fresh shuffled deck for lap 1. */
  build?: () => AnyCard[]
  /** Reshuffled deck for the next lap; must not open with `last`. */
  relap?: (last: AnyCard) => AnyCard[]
  /** Fragment component rendering .face.front + .face.back for a card. */
  faces?: Component
  /** Optional post-flip deep link into the book. */
  studyLink?: (card: AnyCard) => string | null
}

const decks: DeckDef[] = [
  {
    id: 'name-that-play',
    icon: 'lucide:eye',
    title: 'Name That Play',
    sub: 'See the picture, call the play. Every play in the book, fronts re-rolled every lap.',
    available: true,
    build: () => buildPlayDeck(playList),
    relap: (last) => relapPlayDeck(playList, (last as PlayCard).play.id),
    faces: PlayFaces,
    studyLink: (card) => `/plays/${(card as PlayCard).play.id}?front=${(card as PlayCard).front}`,
  },
  {
    id: 'name-that-formation',
    icon: 'lucide:shapes',
    title: 'Name That Formation',
    sub: 'Just the alignment dots — Red, Black, or Split Wide?',
    available: true,
    build: () => buildFormationDeck(formationList),
    relap: (last) => relapFormationDeck(formationList, (last as FormationCard).formation.id),
    faces: FormationFaces,
  },
  {
    id: 'route-numbers',
    icon: 'lucide:git-branch',
    title: 'Route Numbers',
    sub: 'What’s a 5? Numbers to routes and back again.',
    available: true,
    build: () => buildRouteDeck(routes),
    relap: (last) => relapRouteDeck(routes, (last as RouteCard).route.num),
    faces: RouteFaces,
  },
  {
    id: 'whats-my-job',
    icon: 'lucide:clipboard-check',
    title: 'What’s My Job',
    sub: 'Your position, a play, a front. Say the rule out loud, then flip.',
    available: true,
    build: () => buildJobDeck(playList),
    relap: (last) => relapJobDeck(playList, (last as JobCard).play.id),
    faces: JobFaces,
    studyLink: (card) => `/plays/${(card as JobCard).play.id}?front=${(card as JobCard).front}`,
  },
]

type Phase = 'pick' | 'drill'

const phase = ref<Phase>('pick')
const activeDeck = ref<DeckDef | null>(null)
const deck = ref<AnyCard[]>([])
const cardIndex = ref(0)
const flipped = ref(false)
/** Total cards seen this session — a rep counter, not a score. */
const reps = ref(0)
const lap = ref(1)

const card = computed<AnyCard | null>(() => deck.value[cardIndex.value] ?? null)
const studyTo = computed(() =>
  card.value && activeDeck.value?.studyLink ? activeDeck.value.studyLink(card.value) : null,
)

function startDrill(d: DeckDef) {
  if (!d.available || !d.build) return
  activeDeck.value = d
  deck.value = d.build()
  cardIndex.value = 0
  flipped.value = false
  reps.value = 0
  lap.value = 1
  phase.value = 'drill'
  window.scrollTo({ top: 0 })
}

function flip() {
  flipped.value = !flipped.value
}

function next() {
  if (!card.value || !activeDeck.value?.relap) return
  reps.value++
  flipped.value = false
  if (cardIndex.value >= deck.value.length - 1) {
    deck.value = activeDeck.value.relap(card.value)
    cardIndex.value = 0
    lap.value++
  } else {
    cardIndex.value++
  }
}

function exitDrill() {
  phase.value = 'pick'
  activeDeck.value = null
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="flash">
    <!-- ============ PICK A DECK ============ -->
    <template v-if="phase === 'pick'">
      <header class="page-head">
        <NuxtLink to="/quiz" class="back">
          <Icon name="lucide:chevron-left" aria-hidden="true" /> Quiz
        </NuxtLink>
        <p class="eyebrow">Quiz Mode</p>
        <h1>Self-Study Flashcards</h1>
        <p class="muted lead">
          Bus mode. Flip cards until it's automatic — unlimited reps, instant reveal,
          nothing scored, nothing saved.
        </p>
      </header>

      <div class="decks">
        <component
          :is="d.available ? 'button' : 'div'"
          v-for="d in decks"
          :key="d.id"
          :type="d.available ? 'button' : undefined"
          class="card deck"
          :class="{ off: !d.available }"
          @click="startDrill(d)"
        >
          <span class="deck-icon" :class="{ hot: d.available }">
            <Icon :name="d.icon" aria-hidden="true" />
          </span>
          <span class="deck-text">
            <span class="deck-title-row">
              <span class="deck-title">{{ d.title }}</span>
              <span v-if="!d.available" class="soon">Up next</span>
            </span>
            <span class="deck-sub muted">{{ d.sub }}</span>
          </span>
          <Icon v-if="d.available" name="lucide:chevron-right" class="deck-chev" aria-hidden="true" />
        </component>
      </div>
    </template>

    <!-- ============ THE DRILL ============ -->
    <template v-else-if="card && activeDeck">
      <div class="drill-bar">
        <button type="button" class="exit" @click="exitDrill">
          <Icon name="lucide:chevron-left" aria-hidden="true" /> Decks
        </button>
        <span class="deck-name">{{ activeDeck.title }}</span>
        <span class="count">
          {{ cardIndex + 1 }} / {{ deck.length }}
          <span v-if="lap > 1" class="lap">· lap {{ lap }}</span>
        </span>
      </div>

      <Transition name="q" mode="out-in">
        <div :key="`${lap}-${cardIndex}`" class="scene">
          <button
            type="button"
            class="flash-card"
            :class="{ flipped }"
            :aria-label="flipped ? 'Card back — tap to see the front again' : 'Card front — tap to reveal the answer'"
            @click="flip"
          >
            <component :is="activeDeck.faces" :card="card" />
          </button>
        </div>
      </Transition>

      <div class="drill-actions">
        <button type="button" class="cta" @click="flipped ? next() : flip()">
          {{ flipped ? 'Next card' : 'Reveal' }}
          <Icon :name="flipped ? 'lucide:arrow-right' : 'lucide:eye'" aria-hidden="true" />
        </button>
        <button v-if="!flipped" type="button" class="cta ghost" @click="next">
          Next
        </button>
        <NuxtLink v-else-if="studyTo" class="cta ghost" :to="studyTo">
          Study it
          <Icon name="lucide:book-open" aria-hidden="true" />
        </NuxtLink>
      </div>

      <p class="reps muted">
        <Icon name="lucide:infinity" aria-hidden="true" />
        {{ reps }} {{ reps === 1 ? 'rep' : 'reps' }} this ride — deck reshuffles forever
      </p>
    </template>
  </div>
</template>

<style scoped>
.flash {
  display: grid;
  gap: 16px;
  max-width: 720px;
  margin: 0 auto;
}

/* ---------- shared head bits (match quiz/index) ---------- */
.page-head {
  display: grid;
  gap: 6px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--steel);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  width: fit-content;
  margin-bottom: 4px;
  transition: color var(--t-fast) var(--ease);
}
.back:hover {
  color: var(--chalk);
}
.page-head h1 {
  font-size: 2.2rem;
}
.lead {
  font-size: 0.95rem;
  max-width: 48ch;
}

/* ---------- deck picker (mirrors quiz/index mode cards) ---------- */
.decks {
  display: grid;
  gap: 10px;
}
.deck {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  text-align: left;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
button.deck:hover {
  border-color: var(--red);
  background: var(--panel-raised);
}
.deck.off {
  opacity: 0.65;
}
.deck-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex: none;
  border-radius: var(--r-ctl);
  background: var(--panel-raised);
  color: var(--steel);
  font-size: 22px;
}
.deck-icon.hot {
  background: var(--red-glow);
  color: var(--red);
}
.deck-text {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.deck-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.deck-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--chalk);
}
.soon {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-raised);
  color: var(--steel);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.deck-sub {
  font-size: 0.92rem;
}
.deck-chev {
  margin-left: auto;
  color: var(--steel);
  flex: none;
}

/* ---------- drill chrome ---------- */
.drill-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
}
.exit {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-height: 44px;
  padding-right: 6px;
  color: var(--steel);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color var(--t-fast) var(--ease);
}
.exit:hover {
  color: var(--chalk);
}
.deck-name {
  margin-left: auto;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--chalk);
}
.count {
  margin-left: auto;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: var(--steel);
  font-variant-numeric: tabular-nums;
}
.deck-name + .count {
  margin-left: 0;
}
.lap {
  color: var(--red);
}

/* ---------- the card (faces live in components/flashcards/*Faces.vue) ---------- */
.scene {
  perspective: 1200px;
}
.flash-card {
  position: relative;
  display: grid;
  width: 100%;
  text-align: left;
  transform-style: preserve-3d;
  transition: transform var(--t-slow) var(--ease);
}
.flash-card.flipped {
  transform: rotateY(180deg);
}

/* ---------- actions ---------- */
.drill-actions {
  display: grid;
  gap: 8px;
}
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 10px 20px;
  background: var(--red);
  color: #fff;
  border-radius: var(--r-ctl);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition:
    background var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.cta:hover {
  background: var(--red-deep);
}
.cta:active {
  transform: scale(0.98);
}
.cta.ghost {
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--chalk);
}
.cta.ghost:hover {
  background: var(--panel-raised);
  border-color: var(--steel);
}
.reps {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  font-size: 0.82rem;
}

/* ---------- motion ---------- */
.q-enter-active,
.q-leave-active {
  transition:
    opacity var(--t-base) var(--ease),
    transform var(--t-base) var(--ease);
}
.q-enter-from {
  opacity: 0;
  transform: translateX(14px);
}
.q-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
@media (prefers-reduced-motion: reduce) {
  .q-enter-active,
  .q-leave-active,
  .flash-card {
    transition: none;
  }
  .cta:active {
    transform: none;
  }
}

/* ---------- desktop ---------- */
@media (min-width: 640px) {
  .drill-actions {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }
}
</style>
