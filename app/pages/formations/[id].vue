<script setup lang="ts">
/**
 * /formations/[id] — one set, and where YOU stand in it.
 *
 * Built around one question a 14-year-old actually has at the line: "where do
 * I go?" So the position picker is the first control, the answer is the
 * biggest text on the page, and the diagram lights up the same kid. The
 * position remembered is the same anonymous localStorage key the Know-your-job
 * quiz uses, so picking it once anywhere in the app is enough.
 */
import type { FormationId, OffPosId, Play } from '~/types/football'
import { audiblePlays, formations, playList } from '~/data'
import { formationGuideList, formationGuides } from '~/data/formation-guides'
import { POSITION_GROUPS, POSITION_NAMES } from '~/utils/playbook'

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id) as FormationId)
const guide = computed(() => formationGuides[id.value])
const formation = computed(() => formations[id.value])

if (!guide.value || !formation.value) {
  throw createError({ statusCode: 404, statusMessage: 'No such formation', fatal: true })
}

useHead({ title: computed(() => `${formation.value?.name ?? 'Formation'} — Wolves Playbook`) })

/* --- hop between sets without leaving the page --- */
const setOptions = formationGuideList.map((g) => ({
  value: g.id,
  label: formations[g.id]?.name ?? g.id,
}))
const setModel = computed({
  get: () => id.value,
  set: (v: FormationId) => router.replace(`/formations/${v}`),
})

/* --- my position (shared with the quiz's "last time" chip) --- */
const LAST_KEY = 'wolves-kyj-last-pos'
const pos = ref<OffPosId | null>(null)
onMounted(() => {
  // `?pos=Y` wins (a coach can text a kid straight to his spot), then the
  // remembered position.
  const q = String(route.query.pos ?? '').toUpperCase()
  const v = q in POSITION_NAMES ? q : localStorage.getItem(LAST_KEY)
  if (v && v in POSITION_NAMES) pos.value = v as OffPosId
})
function pick(p: OffPosId | null) {
  pos.value = p
  if (p) {
    try {
      localStorage.setItem(LAST_KEY, p)
    } catch {
      /* private mode etc. */
    }
  }
}

const spot = computed(() => (pos.value ? guide.value.lineup[pos.value] : null))

const strengthLabel = computed(() => {
  const s = guide.value.strength.side
  return s === 'balanced' ? 'Balanced — no strong side' : `Strong side: ${s.toUpperCase()}`
})
const strengthIcon = computed(() => {
  const s = guide.value.strength.side
  return s === 'left' ? 'lucide:arrow-left' : s === 'right' ? 'lucide:arrow-right' : 'lucide:equal'
})

const twin = computed(() => (guide.value.twinId ? formations[guide.value.twinId] : null))

/* --- plays we run from this set: one door per concept name. The audible
   examples are one system, so (as on /plays) they collapse into one door. --- */
const audibleIds = new Set(audiblePlays.map((p) => p.id))
const playsFromHere = computed(() => {
  const byName = new Map<string, Play[]>()
  let hasAudible = false
  for (const p of playList) {
    if (p.formation !== id.value) continue
    if (audibleIds.has(p.id)) {
      hasAudible = true
      continue
    }
    const list = byName.get(p.name) ?? []
    list.push(p)
    byName.set(p.name, list)
  }
  const doors = [...byName.entries()].map(([name, group]) => {
    const first = group.find((p) => p.direction === 'right') ?? group[0]!
    return { name, to: `/plays/${first.id}`, family: first.family, count: group.length }
  })
  if (hasAudible) doors.push({ name: 'Audible', to: '/audible', family: 'pass', count: 1 })
  return doors
})

/* Everyone's spot, in the same grouping the assignment panel uses. */
const groups = POSITION_GROUPS
</script>

<template>
  <div v-if="guide && formation" class="fpage">
    <NuxtLink to="/formations" class="back">
      <Icon name="lucide:chevron-left" aria-hidden="true" /> Formations
    </NuxtLink>

    <div class="switcher">
      <SegmentedControl v-model="setModel" :options="setOptions" label="Formation" />
    </div>

    <header class="page-head">
      <p class="eyebrow">{{ guide.tagline }}</p>
      <h1>{{ formation.name }}</h1>
    </header>

    <div class="hero">
    <!-- The picture -->
    <div class="card diagram-card">
      <FormationDiagram :formation="formation" :highlight="pos" interactive @select="pick" />
      <p class="tap-hint muted">
        <Icon name="lucide:pointer" aria-hidden="true" />
        Tap a player to see where he stands
      </p>
    </div>

    <!-- Where do I stand? -->
    <section class="card spot-card" aria-live="polite">
      <div class="spot-head">
        <h2 class="spot-title">Where do I stand?</h2>
        <button v-if="pos" type="button" class="clear" @click="pick(null)">Clear</button>
      </div>

      <div class="pos-picker" role="group" aria-label="Pick your position">
        <div v-for="g in groups" :key="g.label" class="pos-group">
          <span class="pos-group-label muted">{{ g.label }}</span>
          <div class="pos-chips">
            <button
              v-for="p in g.positions"
              :key="p"
              type="button"
              class="pos-chip"
              :class="{ active: pos === p }"
              :aria-pressed="pos === p"
              @click="pick(pos === p ? null : p)"
            >
              {{ p }}
            </button>
          </div>
        </div>
      </div>

      <Transition name="pop" mode="out-in">
        <div v-if="pos && spot" :key="pos" class="answer">
          <div class="answer-who">
            <span class="answer-letter">{{ pos }}</span>
            <span class="answer-name">{{ POSITION_NAMES[pos] }}</span>
          </div>
          <p class="answer-where">{{ spot.where }}</p>
          <p v-if="spot.check" class="answer-check">
            <Icon name="lucide:check-circle-2" aria-hidden="true" />
            <span>{{ spot.check }}</span>
          </p>
        </div>
        <p v-else class="answer-empty muted">
          Pick your position above, or tap yourself on the field.
        </p>
      </Transition>
    </section>
    </div>

    <!-- Spot it / why / strength -->
    <div class="two-up">
      <section class="card info-card">
        <h2 class="info-title"><Icon name="lucide:eye" aria-hidden="true" /> Spot it</h2>
        <ul class="spot-list">
          <li v-for="(s, i) in guide.spotIt" :key="i">{{ s }}</li>
        </ul>
      </section>

      <section class="card info-card">
        <h2 class="info-title"><Icon name="lucide:compass" aria-hidden="true" /> Strong side</h2>
        <p class="strength-line" :class="`side-${guide.strength.side}`">
          <Icon :name="strengthIcon" aria-hidden="true" /> {{ strengthLabel }}
        </p>
        <p class="muted info-body">{{ guide.strength.note }}</p>
      </section>
    </div>

    <section class="card info-card">
      <h2 class="info-title"><Icon name="lucide:lightbulb" aria-hidden="true" /> Why we get in it</h2>
      <p class="info-body">{{ guide.why }}</p>
      <p v-if="guide.vsRed" class="vs-red muted">
        <strong>vs Red:</strong> {{ guide.vsRed }}
      </p>
      <NuxtLink v-if="twin" :to="`/formations/${twin.id}`" class="twin-link">
        <Icon name="lucide:flip-horizontal-2" aria-hidden="true" />
        {{ twin.name }} is {{ formation.name }} flipped — open {{ twin.name }}
        <Icon name="lucide:arrow-right" aria-hidden="true" />
      </NuxtLink>
    </section>

    <CoachNote title="Remember" :notes="guide.remember" />

    <!-- Everybody's spot -->
    <details class="card everyone">
      <summary class="everyone-summary">
        <Icon name="lucide:users" aria-hidden="true" />
        Everybody's spot
        <Icon name="lucide:chevron-down" class="chev" aria-hidden="true" />
      </summary>
      <div v-for="g in groups" :key="g.label" class="everyone-group">
        <h3 class="everyone-group-title muted">{{ g.label }}</h3>
        <ul class="everyone-list">
          <li
            v-for="p in g.positions"
            :key="p"
            class="everyone-row"
            :class="{ me: pos === p }"
          >
            <button type="button" class="everyone-letter" @click="pick(pos === p ? null : p)">
              {{ p }}
            </button>
            <div class="everyone-text">
              <span class="everyone-name">{{ POSITION_NAMES[p] }}</span>
              <span class="everyone-where">{{ guide.lineup[p].where }}</span>
            </div>
          </li>
        </ul>
      </div>
    </details>

    <!-- Plays from here -->
    <section v-if="playsFromHere.length" class="plays-here">
      <h2 class="info-title"><Icon name="lucide:book-open" aria-hidden="true" /> Plays we run from {{ formation.name }}</h2>
      <div class="play-chips">
        <NuxtLink
          v-for="p in playsFromHere"
          :key="p.name"
          :to="p.to"
          class="play-chip"
          :class="p.family"
        >
          <Icon :name="p.family === 'run' ? 'lucide:footprints' : 'lucide:wind'" aria-hidden="true" />
          {{ p.name }}
          <span v-if="p.count > 1" class="play-count">×{{ p.count }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fpage {
  display: grid;
  gap: 14px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--steel);
  justify-self: start;
}
.back:hover {
  color: var(--chalk);
}
.switcher {
  overflow-x: auto;
  scrollbar-width: none;
  margin: -4px -16px;
  padding: 4px 16px;
}
.switcher::-webkit-scrollbar {
  display: none;
}
.page-head h1 {
  font-size: 2.6rem;
  margin-top: 2px;
}

/* --- diagram --- */
.hero {
  display: grid;
  gap: 14px;
}
@media (min-width: 880px) {
  .hero {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    align-items: start;
  }
}
.diagram-card {
  overflow: hidden;
  background: var(--dg-field);
}
.tap-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-top: 1px solid var(--line);
}

/* --- where do I stand --- */
.spot-card {
  padding: 14px 16px 16px;
  border-left: 3px solid var(--red);
  display: grid;
  gap: 12px;
}
.spot-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.spot-title {
  font-size: 1.35rem;
  margin: 0;
}
.clear {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--steel);
  padding: 4px 8px;
}
.clear:hover {
  color: var(--chalk);
}
.pos-picker {
  display: grid;
  gap: 8px;
}
.pos-group {
  display: grid;
  gap: 4px;
}
@media (min-width: 420px) {
  .pos-group {
    grid-template-columns: 78px 1fr;
    align-items: center;
    gap: 10px;
  }
}
.pos-group-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.pos-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.pos-chip {
  min-width: 44px;
  min-height: 40px;
  padding: 0 10px;
  border-radius: var(--r-ctl);
  border: 1px solid var(--line);
  background: var(--panel-raised);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  color: var(--chalk-dim);
  transition:
    background var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease),
    border-color var(--t-fast) var(--ease);
}
.pos-chip:hover {
  color: var(--chalk);
  border-color: var(--steel);
}
.pos-chip.active {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.answer {
  display: grid;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px solid var(--line);
  padding-top: 12px;
}
.answer-who {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.answer-letter {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.6rem;
  line-height: 1;
  color: var(--red);
}
.answer-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--chalk-dim);
}
.answer-where {
  font-size: 1.2rem;
  line-height: 1.4;
  color: var(--chalk);
}
.answer-check {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--chalk-dim);
}
.answer-check .iconify {
  flex: none;
  margin-top: 3px;
  color: var(--red);
  font-size: 18px;
}
.answer-empty {
  font-size: 1rem;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

/* --- info cards --- */
.two-up {
  display: grid;
  gap: 14px;
}
@media (min-width: 640px) {
  .two-up {
    grid-template-columns: 1fr 1fr;
  }
}
.info-card {
  padding: 14px 16px;
  display: grid;
  gap: 8px;
  align-content: start;
}
.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  margin: 0;
}
.info-title .iconify {
  color: var(--red);
  font-size: 18px;
}
.info-body {
  font-size: 1.02rem;
  line-height: 1.45;
}
.spot-list {
  display: grid;
  gap: 6px;
  padding-left: 0;
  list-style: none;
}
.spot-list li {
  position: relative;
  padding-left: 16px;
  font-size: 1.02rem;
  line-height: 1.4;
}
.spot-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--red);
}
.strength-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk);
}
.strength-line.side-left,
.strength-line.side-right {
  color: var(--red);
}
.vs-red {
  font-size: 0.95rem;
  line-height: 1.4;
}
.vs-red strong {
  color: var(--red);
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.twin-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--r-ctl);
  border: 1px solid var(--line);
  background: var(--panel-raised);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk-dim);
  justify-self: start;
}
.twin-link:hover {
  color: #fff;
  border-color: var(--steel);
}
.twin-link .iconify:first-child {
  color: var(--red);
}

/* --- everybody --- */
.everyone {
  overflow: hidden;
}
.everyone-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  cursor: pointer;
  list-style: none;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  user-select: none;
}
.everyone-summary::-webkit-details-marker {
  display: none;
}
.everyone-summary .iconify:first-child {
  color: var(--red);
}
.chev {
  margin-left: auto;
  color: var(--steel);
  transition: transform var(--t-fast) var(--ease);
}
.everyone[open] .chev {
  transform: rotate(180deg);
}
.everyone-group {
  border-top: 1px solid var(--line);
  padding: 10px 16px 12px;
}
.everyone-group-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 6px;
}
.everyone-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 8px;
}
.everyone-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 6px 8px;
  margin: 0 -8px;
  border-radius: var(--r-ctl);
}
.everyone-row.me {
  background: var(--red-glow);
}
.everyone-letter {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--chalk);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  color: var(--chalk);
  background: var(--dg-field);
}
.everyone-row.me .everyone-letter {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.everyone-text {
  display: grid;
  gap: 2px;
}
.everyone-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--steel);
}
.everyone-where {
  font-size: 0.98rem;
  line-height: 1.4;
}

/* --- plays from here --- */
.plays-here {
  display: grid;
  gap: 10px;
}
.play-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.play-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  padding: 6px 14px;
  border-radius: var(--r-ctl);
  border: 1px solid var(--line);
  background: var(--panel-raised);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk-dim);
}
.play-chip:hover {
  color: #fff;
  border-color: var(--steel);
}
.play-chip .iconify {
  color: var(--red);
}
.play-count {
  font-size: 0.75rem;
  color: var(--steel);
}

/* pop transition (matches routes page) */
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity var(--t-base) var(--ease),
    transform var(--t-base) var(--ease);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
