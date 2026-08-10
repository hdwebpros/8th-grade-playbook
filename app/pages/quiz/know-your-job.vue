<script setup lang="ts">
import type { FrontId, OffPosId } from '~/types/football'
import { plays, playList, formations, fronts } from '~/data'
import {
  FRONT_LABELS,
  POSITION_GROUPS,
  POSITION_NAMES,
  playSideOf,
} from '~/utils/playbook'
import { buildRound, type JobQuestion, type JobResult } from '~/composables/useKnowYourJob'

useHead({ title: 'Know Your Job — Wolves Playbook' })

type Phase = 'pick' | 'ask' | 'reveal' | 'summary'

const phase = ref<Phase>('pick')
const pos = ref<OffPosId | null>(null)
const round = ref<JobQuestion[]>([])
const qIndex = ref(0)
const picked = ref<string | null>(null)
const results = ref<JobResult[]>([])

/* Last-picked position: trivial, anonymous, localStorage only. */
const LAST_KEY = 'wolves-kyj-last-pos'
const lastPos = ref<OffPosId | null>(null)
onMounted(() => {
  const v = localStorage.getItem(LAST_KEY)
  if (v && v in POSITION_NAMES) lastPos.value = v as OffPosId
})

const q = computed<JobQuestion | null>(() => round.value[qIndex.value] ?? null)
const total = computed(() => round.value.length)
const score = computed(() => results.value.filter((r) => r.correct).length)

const formationOf = (question: JobQuestion) => formations[question.play.formation]!

const sideOf = (question: JobQuestion) =>
  playSideOf(question.pos, question.play, formationOf(question), question.front)

/** "Same job vs the 4-3" — the fronts this rule also covers. */
const alsoCovers = computed(() => {
  if (!q.value) return null
  const rest = q.value.frontsCovered.filter((f) => f !== q.value!.front)
  if (!rest.length) return null
  return rest.map((f: FrontId) => FRONT_LABELS[f]).join(' and the ')
})

const wasCorrect = computed(() => picked.value === q.value?.answer.rule)

/** On a miss: whose job did the kid tap? */
const pickedOwner = computed<OffPosId | null>(() => {
  if (!q.value || !picked.value || wasCorrect.value) return null
  return q.value.ownerOf[picked.value] ?? null
})

const isLast = computed(() => qIndex.value >= total.value - 1)

const progress = computed(() => {
  if (!total.value) return 0
  return ((qIndex.value + (phase.value === 'reveal' ? 1 : 0)) / total.value) * 100
})

function start(p: OffPosId) {
  pos.value = p
  lastPos.value = p
  try {
    localStorage.setItem(LAST_KEY, p)
  } catch {
    /* private mode etc. — the quiz doesn't care */
  }
  round.value = buildRound(p, playList)
  qIndex.value = 0
  results.value = []
  picked.value = null
  phase.value = 'ask'
  window.scrollTo({ top: 0 })
}

function choose(option: string) {
  if (!q.value || phase.value !== 'ask') return
  picked.value = option
  results.value.push({
    question: q.value,
    picked: option,
    correct: option === q.value.answer.rule,
  })
  phase.value = 'reveal'
}

function next() {
  if (isLast.value) {
    phase.value = 'summary'
  } else {
    qIndex.value++
    picked.value = null
    phase.value = 'ask'
  }
  window.scrollTo({ top: 0 })
}

function runAgain() {
  if (pos.value) start(pos.value)
}

function switchPosition() {
  phase.value = 'pick'
  window.scrollTo({ top: 0 })
}

const verdict = computed(() => {
  if (!total.value) return ''
  const pct = score.value / total.value
  if (pct === 1) return 'Perfect round. You know your job.'
  if (pct >= 0.7) return 'Almost automatic. One more run.'
  if (pct >= 0.4) return 'Getting there. Run it back.'
  return 'Back to the film. Run it until it sticks.'
})

/** Context line: "Veer · out of Red · going right" */
const contextOf = (question: JobQuestion) =>
  `${question.play.name} · out of ${formationOf(question).name} · going ${question.play.direction}`
</script>

<template>
  <div class="kyj">
    <!-- ============ PICK YOUR POSITION ============ -->
    <template v-if="phase === 'pick'">
      <header class="page-head">
        <NuxtLink to="/quiz" class="back">
          <Icon name="lucide:chevron-left" aria-hidden="true" /> Quiz
        </NuxtLink>
        <p class="eyebrow">Quiz Mode</p>
        <h1>Know Your Job</h1>
        <p class="muted lead">
          Pick your position. We ask what <em>you</em> do on every play, against every front —
          tap the right job, then the diagram shows you the truth.
        </p>
      </header>

      <section
        v-for="group in POSITION_GROUPS"
        :key="group.label"
        class="pick-group"
        :aria-label="group.label"
      >
        <h2 class="group-title">{{ group.label }}</h2>
        <div class="pick-grid">
          <button
            v-for="p in group.positions"
            :key="p"
            type="button"
            class="pick-tile"
            :class="{ last: p === lastPos }"
            @click="start(p)"
          >
            <span class="pick-chip">{{ p }}</span>
            <span class="pick-name">{{ POSITION_NAMES[p] }}</span>
            <span v-if="p === lastPos" class="last-chip">Last time</span>
          </button>
        </div>
      </section>
    </template>

    <!-- ============ THE ROUND ============ -->
    <template v-else-if="(phase === 'ask' || phase === 'reveal') && q && pos">
      <div class="round-bar">
        <button type="button" class="exit" @click="switchPosition">
          <Icon name="lucide:chevron-left" aria-hidden="true" /> Positions
        </button>
        <span class="round-pos">
          <span class="mini-chip">{{ pos }}</span>
          <span class="round-pos-name">{{ POSITION_NAMES[pos] }}</span>
        </span>
        <span class="count">{{ qIndex + 1 }} / {{ total }}</span>
      </div>
      <div class="progress" role="presentation">
        <div class="progress-fill" :style="{ width: `${progress}%` }" />
      </div>

      <Transition name="q" mode="out-in">
        <!-- ---- Question ---- -->
        <section v-if="phase === 'ask'" :key="`ask-${qIndex}`" class="qcard card">
          <p class="q-context">
            {{ contextOf(q) }}
            <PlaySideBadge :side="sideOf(q)" />
          </p>
          <h2 class="q-title">
            You're the {{ POSITION_NAMES[q.pos] }}
            <span class="q-vs">vs the {{ FRONT_LABELS[q.front] }}</span>
          </h2>
          <p class="q-prompt">What's your job?</p>

          <div class="options">
            <button
              v-for="opt in q.options"
              :key="opt"
              type="button"
              class="option"
              @click="choose(opt)"
            >
              {{ opt }}
            </button>
          </div>
        </section>

        <!-- ---- Reveal ---- -->
        <section v-else :key="`reveal-${qIndex}`" class="reveal">
          <div
            class="verdict-chip"
            :class="wasCorrect ? 'good' : 'miss'"
            role="status"
            aria-live="polite"
          >
            <Icon
              :name="wasCorrect ? 'lucide:check-circle-2' : 'lucide:x-circle'"
              aria-hidden="true"
            />
            {{ wasCorrect ? 'Nailed it' : 'Not this one' }}
          </div>

          <div class="answer card">
            <p class="q-context">
              {{ contextOf(q) }} · vs the {{ FRONT_LABELS[q.front] }}
              <PlaySideBadge :side="sideOf(q)" />
            </p>
            <p class="answer-rule">{{ q.answer.rule }}</p>
            <p v-if="q.answer.detail" class="answer-detail muted">{{ q.answer.detail }}</p>
            <p v-if="pickedOwner" class="teachback">
              <Icon name="lucide:info" class="tb-icon" aria-hidden="true" />
              You tapped the {{ POSITION_NAMES[pickedOwner] }}'s job — he's got that one covered.
            </p>
            <p v-if="alsoCovers" class="also muted">
              <Icon name="lucide:repeat" aria-hidden="true" />
              Same job vs the {{ alsoCovers }}.
            </p>
          </div>

          <div class="diagram card">
            <PlayDiagram
              :play="q.play"
              :front="q.front"
              :formation="formationOf(q)"
              :fronts="fronts"
              :highlight="q.pos"
              theme="app"
            />
          </div>
          <p class="hint muted">
            <Icon name="lucide:sparkles" aria-hidden="true" />
            That's you, lit up — vs the {{ FRONT_LABELS[q.front] }}
          </p>

          <button type="button" class="cta" @click="next">
            {{ isLast ? 'See your score' : 'Next play' }}
            <Icon
              :name="isLast ? 'lucide:flag' : 'lucide:arrow-right'"
              aria-hidden="true"
            />
          </button>
        </section>
      </Transition>
    </template>

    <!-- ============ SUMMARY ============ -->
    <template v-else-if="phase === 'summary' && pos">
      <div class="round-bar">
        <button type="button" class="exit" @click="switchPosition">
          <Icon name="lucide:chevron-left" aria-hidden="true" /> Positions
        </button>
        <span class="round-pos">
          <span class="mini-chip">{{ pos }}</span>
          <span class="round-pos-name">{{ POSITION_NAMES[pos] }}</span>
        </span>
        <span class="count">Done</span>
      </div>

      <section class="summary card">
        <p class="eyebrow">Round complete</p>
        <p class="score" :class="{ perfect: score === total }">
          {{ score }}<span class="score-of"> / {{ total }}</span>
        </p>
        <p class="verdict-line">{{ verdict }}</p>

        <ul class="recap">
          <li
            v-for="(r, i) in results"
            :key="i"
            class="recap-row"
            :class="{ miss: !r.correct }"
          >
            <Icon
              :name="r.correct ? 'lucide:check' : 'lucide:x'"
              class="recap-icon"
              :class="r.correct ? 'good' : 'bad'"
              aria-hidden="true"
            />
            <span class="recap-main">
              <span class="recap-context">
                {{ r.question.play.name }} · {{ formationOf(r.question).name }} · vs
                {{ FRONT_LABELS[r.question.front] }}
              </span>
              <span v-if="!r.correct" class="recap-rule">{{ r.question.answer.rule }}</span>
            </span>
          </li>
        </ul>

        <div class="summary-actions">
          <button type="button" class="cta" @click="runAgain">
            Run it again
            <Icon name="lucide:rotate-ccw" aria-hidden="true" />
          </button>
          <button type="button" class="cta ghost" @click="switchPosition">
            Switch position
          </button>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.kyj {
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
.lead em {
  color: var(--chalk);
  font-style: normal;
  font-weight: 600;
}

/* ---------- position picker ---------- */
.pick-group {
  display: grid;
  gap: 8px;
}
.group-title {
  font-size: 0.95rem;
  color: var(--steel);
  letter-spacing: 0.14em;
}
.pick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.pick-tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
  padding: 10px 12px;
  text-align: left;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.pick-tile:hover {
  border-color: var(--red);
  background: var(--panel-raised);
}
.pick-tile:active {
  transform: scale(0.98);
}
.pick-tile.last {
  border-color: color-mix(in srgb, var(--red) 55%, transparent);
}
.pick-chip {
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
.pick-tile:hover .pick-chip {
  border-color: var(--red);
  color: var(--red);
}
.pick-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk);
}
.last-chip {
  position: absolute;
  top: -8px;
  right: 10px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ---------- round chrome ---------- */
.round-bar {
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
.round-pos {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.mini-chip {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  border-radius: 999px;
  border: 2px solid var(--chalk);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--chalk);
}
.round-pos-name {
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
.round-pos + .count {
  margin-left: 0;
}
.progress {
  height: 4px;
  border-radius: 999px;
  background: var(--panel-raised);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--red);
  transition: width var(--t-slow) var(--ease);
}

/* ---------- question ---------- */
.qcard {
  display: grid;
  gap: 10px;
  padding: 18px 16px 16px;
}
.q-context {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}
.q-title {
  font-size: 1.9rem;
  line-height: 1.05;
}
.q-vs {
  color: var(--red);
}
.q-prompt {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--chalk-dim);
}
.options {
  display: grid;
  gap: 8px;
  margin-top: 2px;
}
.option {
  min-height: 56px;
  padding: 12px 14px;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  color: var(--chalk);
  background: var(--panel-raised);
  border: 1px solid var(--line);
  border-left: 3px solid var(--line);
  border-radius: var(--r-ctl);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.option:hover {
  border-color: var(--red);
}
.option:active {
  transform: scale(0.99);
}

/* ---------- reveal ---------- */
.reveal {
  display: grid;
  gap: 10px;
}
.verdict-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 14px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.verdict-chip.good {
  background: var(--red);
  color: #fff;
}
.verdict-chip.miss {
  background: var(--panel-raised);
  color: var(--chalk);
  border: 1px solid var(--steel);
}
.answer {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-left: 3px solid var(--red);
}
.answer-rule {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--chalk);
}
.answer-detail {
  font-size: 0.95rem;
}
.teachback {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.92rem;
  color: var(--chalk-dim);
  padding: 8px 10px;
  background: var(--panel-raised);
  border-radius: var(--r-ctl);
}
.tb-icon {
  flex: none;
  margin-top: 2px;
  color: var(--steel);
}
.also {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
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

/* ---------- CTA buttons ---------- */
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
.reveal .cta {
  width: 100%;
  margin-top: 2px;
}

/* ---------- summary ---------- */
.summary {
  display: grid;
  gap: 12px;
  padding: 24px 18px;
  justify-items: center;
  text-align: center;
}
.score {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 4rem;
  line-height: 1;
  color: var(--chalk);
}
.score.perfect {
  color: var(--red);
}
.score-of {
  font-size: 2rem;
  color: var(--steel);
}
.verdict-line {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk-dim);
}
.recap {
  display: grid;
  gap: 6px;
  width: 100%;
  margin-top: 4px;
  list-style: none;
  padding: 0;
}
.recap-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  text-align: left;
  background: var(--panel-raised);
  border-radius: var(--r-ctl);
  border: 1px solid transparent;
}
.recap-row.miss {
  border-color: color-mix(in srgb, var(--red) 40%, transparent);
}
.recap-icon {
  flex: none;
  margin-top: 3px;
  font-size: 15px;
}
.recap-icon.good {
  color: var(--steel);
}
.recap-icon.bad {
  color: var(--red);
}
.recap-main {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.recap-context {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--steel);
}
.recap-rule {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--chalk);
}
.summary-actions {
  display: grid;
  gap: 8px;
  width: 100%;
  margin-top: 6px;
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
  transform: translateY(8px);
}
.q-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .q-enter-active,
  .q-leave-active {
    transition: none;
  }
  .progress-fill {
    transition: none;
  }
  .pick-tile:active,
  .option:active,
  .cta:active {
    transform: none;
  }
}

/* ---------- desktop ---------- */
@media (min-width: 640px) {
  .pick-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .summary-actions {
    grid-auto-flow: column;
    justify-content: center;
    grid-auto-columns: minmax(200px, auto);
  }
  .q-title {
    font-size: 2.3rem;
  }
}
</style>
