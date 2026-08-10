<script setup lang="ts">
import type { Assignment, FrontId, OffPosId, Play } from '~/types/football'
import { plays, formations, fronts } from '~/data'
import {
  FRONT_LABELS,
  FRONT_ORDER,
  POSITION_GROUPS,
  POSITION_NAMES,
  mergedAssignments,
  playSideOf,
} from '~/utils/playbook'

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

/** The mirrored twin (veer-red ⇄ veer-black): same concept, other direction. */
const twin = computed(() =>
  (Object.values(plays) as Play[]).find(
    (p) => p.name === play.value.name && p.id !== play.value.id,
  ),
)

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

const readKeyLabel = computed(() => {
  const keyId = play.value.vs[front.value]?.readKey
  if (!keyId) return null
  return frontInfo.value.defenders.find((d) => d.id === keyId)?.label ?? null
})

/* --- Selection: diagram tap ⇄ assignment row --- */
const selected = ref<OffPosId | null>(null)
watch(() => play.value.id, () => (selected.value = null))

const rowEls = ref<Partial<Record<OffPosId, HTMLElement>>>({})
function setRowEl(pos: OffPosId, el: unknown) {
  if (el instanceof HTMLElement) rowEls.value[pos] = el
}

function onDiagramSelect(pos: OffPosId | null) {
  selected.value = pos
  if (pos) {
    nextTick(() => rowEls.value[pos]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
  }
}

function onRowClick(pos: OffPosId) {
  selected.value = selected.value === pos ? null : pos
}

/* --- Assignment panel data --- */
const assignments = computed(() => mergedAssignments(play.value, front.value))

const groups = computed(() =>
  POSITION_GROUPS.map((g) => ({
    label: g.label,
    rows: g.positions
      .filter((pos) => assignments.value[pos])
      .map((pos) => ({
        pos,
        name: POSITION_NAMES[pos],
        side: playSideOf(pos, play.value, formation.value, front.value),
        assignment: assignments.value[pos] as Assignment,
        overridden: Boolean(play.value.vs[front.value]?.assignments?.[pos]),
      })),
  })).filter((g) => g.rows.length),
)

useHead(() => ({
  title: `${play.value.name} ${formation.value.name} — Wolves Playbook`,
}))
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
          <p class="subtitle muted">
            <span v-if="play.callName">{{ play.callName }} &middot; </span>
            {{ formation.name }} formation &middot; going {{ play.direction }}
          </p>
        </div>

        <nav v-if="twin" class="dir-toggle" aria-label="Direction">
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
      <section class="stage" aria-label="Play diagram">
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
      </section>

      <section class="panel" aria-label="Assignments">
        <p class="desc">{{ play.description }}</p>

        <div v-for="group in groups" :key="group.label" class="group">
          <h2 class="group-title">{{ group.label }}</h2>
          <ul class="rows">
            <li
              v-for="row in group.rows"
              :key="row.pos"
              :ref="(el) => setRowEl(row.pos, el)"
            >
              <button
                type="button"
                class="row"
                :class="{ selected: selected === row.pos }"
                :aria-expanded="selected === row.pos"
                @click="onRowClick(row.pos)"
              >
                <span class="pos-chip" :class="{ hot: row.pos === play.ballCarrier }">
                  {{ row.pos }}
                </span>
                <span class="row-main">
                  <span class="row-top">
                    <span class="row-name">{{ row.name }}</span>
                    <PlaySideBadge :side="row.side" />
                    <span v-if="row.overridden" class="vs-chip">
                      vs {{ FRONT_LABELS[front] }}
                    </span>
                  </span>
                  <span class="row-rule">{{ row.assignment.rule }}</span>
                  <span
                    v-if="row.assignment.detail && selected === row.pos"
                    class="row-detail muted"
                  >
                    {{ row.assignment.detail }}
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>

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
.title {
  font-size: 2.4rem;
}
.subtitle {
  font-size: 0.95rem;
  text-transform: capitalize;
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

/* --- Assignment panel --- */
.panel {
  display: grid;
  gap: 16px;
}
.desc {
  font-size: 1rem;
  color: var(--chalk-dim);
}

.group {
  display: grid;
  gap: 8px;
}
.group-title {
  font-size: 0.95rem;
  color: var(--steel);
  letter-spacing: 0.14em;
}
.rows {
  display: grid;
  gap: 6px;
}
.row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-left: 3px solid var(--line);
  border-radius: var(--r-card);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.row:hover {
  background: var(--panel-raised);
}
.row.selected {
  border-color: var(--red);
  background: var(--panel-raised);
}
.pos-chip {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 999px;
  border: 2px solid var(--chalk);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--chalk);
}
.pos-chip.hot {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.row-main {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.row-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.row-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--steel);
}
.vs-chip {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--panel-raised);
  border: 1px solid var(--steel);
  color: var(--chalk);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.row-rule {
  font-size: 1rem;
  font-weight: 600;
  color: var(--chalk);
}
.row-detail {
  font-size: 0.92rem;
  padding-top: 2px;
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
