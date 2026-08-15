<script setup lang="ts">
import type { FrontId, OffPosId, Play } from '~/types/football'
import { plays, formations, fronts } from '~/data'
import { film } from '~/data/film'
import { FRONT_LABELS, FRONT_ORDER, callPartsFor } from '~/utils/playbook'
import { labelForId } from '~/utils/defense'

const route = useRoute()
const router = useRouter()

const play = computed<Play>(() => {
  const p = plays[route.params.id as string]
  if (!p) {
    throw createError({ statusCode: 404, statusMessage: 'Play not found', fatal: true })
  }
  return p
})

const formation = computed(() => formations[play.value.formation]!)

/** Practice clips of this exact play, if any — see app/data/film.ts. */
const filmClips = computed(() => film[play.value.id] ?? [])

/**
 * Legacy twin (e.g. waggle-red ⇄ waggle-black): same concept, other formation,
 * found by name-match. Only used for plays WITHOUT the explicit variant graph
 * below — all runs now carry the graph, so this serves the passing game.
 */
const twin = computed(() =>
  (Object.values(plays) as Play[]).find(
    (p) => p.name === play.value.name && p.id !== play.value.id,
  ),
)

/* --- The variant graph: direction × formation, four plays per run concept --- */

/** Same formation, opposite direction — what the audible turns this play into. */
const flipPlay = computed<Play | undefined>(() =>
  play.value.audibleFlipId ? plays[play.value.audibleFlipId] : undefined,
)
/** Same play and direction, the other formation. */
const twinPlay = computed<Play | undefined>(() =>
  play.value.formationTwinId ? plays[play.value.formationTwinId] : undefined,
)

/**
 * Any play with a direction flip gets the variant controls. Runs out of
 * Red/Black have both axes; a one-formation concept (Split Wide's Dive) has a
 * flip but no formation twin, so only the Direction toggle renders.
 */
const hasVariantControls = computed(() => !!flipPlay.value)

/** Where each Direction control option navigates: stay put, or one flip hop. */
const directionTarget = (dir: 'right' | 'left') =>
  play.value.direction === dir ? play.value.id : (play.value.audibleFlipId ?? play.value.id)


const callParts = computed(() => callPartsFor(play.value, formation.value))

/**
 * The stamp already says the call, so the subtitle only mentions a `callName`
 * that carries something the stamp does not (e.g. Waggle's 'PAP (Boot)').
 */
const asideCallName = computed(() => {
  const name = play.value.callName
  if (!name) return null
  const spoken = callParts.value.map((p) => p.word).join(' ')
  return spoken.toLowerCase().includes(name.toLowerCase()) ? null : name
})

/* --- Front switcher, kept in the URL so the direction toggle preserves it --- */
const isFrontId = (v: unknown): v is FrontId => FRONT_ORDER.includes(v as FrontId)
const front = ref<FrontId>(isFrontId(route.query.front) ? route.query.front : '44')
watch(front, (f) => {
  // During hydration the router can transiently sit on '/' while this page's
  // watchers are live — writing the query then rewrites the URL to the home
  // page. Only touch the URL when the router is actually on a play route.
  if (route.query.front === f || !route.params.id) return
  router.replace({ query: { ...route.query, front: f } })
})
// During hydration, setup can run before the router settles on the real URL —
// keep the ref synced from the query so a shared ?front= link always wins.
watch(
  () => route.query.front,
  (f) => {
    if (isFrontId(f)) front.value = f
  },
)

const frontOptions = FRONT_ORDER.map((f) => ({ value: f, label: FRONT_LABELS[f] }))
const frontInfo = computed(() => fronts[front.value]!)

const readKeyLabel = computed(() =>
  labelForId(frontInfo.value, formation.value, play.value.vs[front.value]?.readKey),
)

/* --- Selection: diagram tap ⇄ assignment row --- */
const selected = ref<OffPosId | null>(null)
watch(() => play.value.id, () => (selected.value = null))

const panel = ref<{ revealRow: (pos: OffPosId) => void } | null>(null)

function onDiagramSelect(pos: OffPosId | null) {
  selected.value = pos
  if (pos) panel.value?.revealRow(pos)
}

/**
 * Formation options in a fixed Red-then-Black order, each pointing at the id
 * that navigation should land on (the current play, or its formation twin).
 */
const variantFormationOptions = computed(() => {
  if (!twinPlay.value) return []
  const pair = [play.value, twinPlay.value!]
  return (['red', 'black'] as const)
    .map((f) => pair.find((p) => p.formation === f))
    .filter((p): p is Play => !!p)
    .map((p) => ({
      id: p.id,
      label: formations[p.formation]?.name ?? p.formation,
      active: p.id === play.value.id,
    }))
})

useHead(() => {
  // "Split Wide Screen" already names its formation — don't say it twice.
  const sayFormation = !play.value.name.startsWith(formation.value.name)
  const base = hasVariantControls.value
    ? `${play.value.name} ${play.value.direction === 'left' ? 'Left' : 'Right'}` +
      (sayFormation ? ` · ${formation.value.name}` : '')
    : play.value.name + (sayFormation ? ` ${formation.value.name}` : '')
  return { title: `${base} — Wolves Playbook` }
})
</script>

<template>
  <div class="play-page">
    <header class="head">
      <NuxtLink to="/plays" class="back">
        <Icon name="lucide:chevron-left" aria-hidden="true" /> Plays
      </NuxtLink>
      <div class="head-row">
        <div class="head-titles">
          <h1 class="title">{{ play.name }}</h1>
          <PlayCallStamp :parts="callParts" />
          <!-- The call stamp already says the direction on variant plays, so
               the subtitle only earns its place on the legacy two-play shape. -->
          <p v-if="!hasVariantControls" class="subtitle muted">
            Going {{ play.direction }}
            <span v-if="asideCallName">&middot; also called {{ asideCallName }}</span>
          </p>
        </div>

        <!-- Direction × Formation: two link-toggles over the four-play graph.
             One hop each way — direction rides audibleFlipId, formation rides
             formationTwinId — and ?front= travels with every link. -->
        <div v-if="hasVariantControls" class="variant-controls">
          <div class="variant">
            <span class="variant-label" aria-hidden="true">Direction</span>
            <nav class="dir-toggle" aria-label="Direction">
              <NuxtLink
                v-for="dir in ['right', 'left'] as const"
                :key="dir"
                :to="{ path: `/plays/${directionTarget(dir)}`, query: { front } }"
                class="dir-btn"
                :class="{ active: play.direction === dir }"
                :aria-current="play.direction === dir ? 'page' : undefined"
              >
                {{ dir }}
              </NuxtLink>
            </nav>
          </div>
          <div v-if="variantFormationOptions.length" class="variant">
            <span class="variant-label" aria-hidden="true">Formation</span>
            <nav class="dir-toggle" aria-label="Formation">
              <NuxtLink
                v-for="opt in variantFormationOptions"
                :key="opt.id"
                :to="{ path: `/plays/${opt.id}`, query: { front } }"
                class="dir-btn"
                :class="{ active: opt.active }"
                :aria-current="opt.active ? 'page' : undefined"
              >
                {{ opt.label }}
              </NuxtLink>
            </nav>
          </div>
        </div>

        <nav v-else-if="twin" class="dir-toggle" aria-label="Formation">
          <NuxtLink
            :to="{ path: `/plays/${play.id}`, query: { front } }"
            class="dir-btn active"
            aria-current="page"
          >
            {{ formation.name }}
          </NuxtLink>
          <NuxtLink
            :to="{ path: `/plays/${twin.id}`, query: { front } }"
            class="dir-btn"
          >
            {{ formations[twin.formation]?.name ?? twin.formation }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <div class="stage-wrap">
      <section class="stage" :class="{ 'has-callout': flipPlay }" aria-label="Play diagram">
        <div class="stage-bar">
          <SegmentedControl v-model="front" :options="frontOptions" label="Defensive front" />
          <span v-if="readKeyLabel" class="read-chip">
            <Icon name="lucide:eye" aria-hidden="true" /> Read: {{ readKeyLabel }}
          </span>
        </div>
        <div class="diagram card">
          <PlayDiagram
            :play="play"
            :front="front"
            :formation="formation"
            :fronts="fronts"
            :highlight="selected"
            :interactive="true"
            theme="app"
            @select="onDiagramSelect"
          />
        </div>
        <p class="hint muted">
          <Icon name="lucide:pointer" aria-hidden="true" />
          Tap a player to see his job &middot; vs {{ frontInfo.name }}
        </p>

        <AudibleCallout v-if="flipPlay" :play="play" :flip="flipPlay" :front="front" />
      </section>

      <section class="panel" aria-label="Assignments">
        <p class="summary">{{ play.summary }}</p>
        <p class="desc">{{ play.description }}</p>

        <AssignmentPanel
          ref="panel"
          :play="play"
          :front="front"
          :formation="formation"
          :selected="selected"
          @select="selected = $event"
        />

        <GameFilm v-if="filmClips.length" :clips="filmClips" />

        <CoachNote
          v-if="play.reviewNotes?.length"
          title="Coach's film notes"
          :notes="play.reviewNotes"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.play-page {
  display: grid;
  gap: 14px;
}

.head {
  display: grid;
  gap: 8px;
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
  transition: color var(--t-fast) var(--ease);
}
.back:hover {
  color: var(--chalk);
}
.head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.head-titles {
  display: grid;
  justify-items: start;
  gap: 10px;
}
.title {
  font-size: 2.4rem;
}
.subtitle {
  font-size: 0.95rem;
}

.dir-toggle {
  display: inline-flex;
  padding: 3px;
  gap: 3px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-ctl);
}
.dir-btn {
  padding: 7px 16px;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  border-radius: calc(var(--r-ctl) - 3px);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--steel);
  transition:
    color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.dir-btn:hover {
  color: var(--chalk);
}
.dir-btn.active {
  background: var(--red);
  color: #fff;
}

/* --- Direction × Formation controls (variant plays only) --- */
.variant-controls {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px 14px;
}
.variant {
  display: grid;
  gap: 4px;
  justify-items: start;
}
.variant-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
  padding-left: 4px;
}

/* --- Stage: sticky on phones so the diagram stays up while reading jobs --- */
.stage-wrap {
  display: grid;
  gap: 16px;
}
.stage {
  position: sticky;
  top: var(--header-h);
  z-index: 10;
  background: var(--ink);
  display: grid;
  gap: 8px;
  padding-bottom: 6px;
  box-shadow: 0 12px 16px -14px rgba(0, 0, 0, 0.8);
}
.stage-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 8px;
}
.read-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px dashed color-mix(in srgb, var(--red) 60%, transparent);
  color: var(--red);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.diagram {
  overflow: hidden;
  background: var(--dg-field);
}
.hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
}

/* With the audible callout aboard, the stage grows past a phone screen —
   pinning it would bury the assignments underneath, so it scrolls normally. */
@media (max-width: 879px) {
  .stage.has-callout {
    position: static;
    box-shadow: none;
    background: none;
  }
}

/* --- Assignment panel --- */
.panel {
  display: grid;
  gap: 16px;
}
/* The one-line gist, said the way a coach says it — sits above the detail. */
.summary {
  font-size: 1.05rem;
  font-weight: 600;
}
.panel .summary + .desc {
  margin-top: -8px;
}
.desc {
  font-size: 1rem;
  color: var(--chalk-dim);
}

/* --- Desktop: diagram pinned left, jobs scroll right --- */
@media (min-width: 880px) {
  .stage-wrap {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1fr);
    align-items: start;
    gap: 28px;
  }
  .stage {
    top: calc(var(--header-h) + 12px);
    box-shadow: none;
    background: none;
  }
  .title {
    font-size: 3rem;
  }
}
</style>
