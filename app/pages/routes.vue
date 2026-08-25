<script setup lang="ts">
import { routes } from '~/data'

useHead({ title: 'Route Tree — Wolves Playbook' })

const highlight = ref<number | null>(null)

/**
 * Which side of the ball the receiver is lined up on. The numbers never
 * change — a 1 is a slant toward the ball from either side — so this only
 * mirrors the picture. Right is the default because that is Red, X split right.
 */
type Side = 'left' | 'right'
const side = ref<Side>('right')

const sideOptions: { value: Side; label: string; hint: string }[] = [
  { value: 'left', label: 'Left of the ball', hint: 'Black — X split left' },
  { value: 'right', label: 'Right of the ball', hint: 'Red — X split right' },
]

/** The formation that puts X on the chosen side; carried into the audible page. */
const formationFor = computed(() => (side.value === 'left' ? 'black' : 'red'))

/** Where "put it in action" goes: the audible pad, in this formation, with the picked route as X's digit. */
const audibleLink = computed(() => ({
  path: '/audible',
  query: {
    formation: formationFor.value,
    ...(highlight.value !== null ? { outside: String(highlight.value) } : {}),
  },
}))

function pick(num: number | null) {
  highlight.value = num === null || highlight.value === num ? null : num
}

const selectedRoute = computed(() =>
  highlight.value === null ? null : (routes.find((r) => r.num === highlight.value) ?? null),
)
</script>

<template>
  <div class="routes-page">
    <header class="page-head">
      <p class="eyebrow">Reference</p>
      <h1>Route Tree</h1>
      <p class="muted lead">
        Ten routes, numbered 0&ndash;9. Free-call combos are read outside-to-in &mdash;
        <strong class="ex">54</strong> means the outside man runs the 5, the next man runs the 4.
      </p>
    </header>

    <div class="side-switch" role="group" aria-label="Which side of the ball are you lined up on?">
      <p class="side-q">Where are you lined up?</p>
      <div class="seg">
        <button
          v-for="o in sideOptions"
          :key="o.value"
          type="button"
          class="seg-btn"
          :class="{ active: side === o.value }"
          :aria-pressed="side === o.value"
          @click="side = o.value"
        >
          <Icon
            v-if="o.value === 'left'"
            name="lucide:arrow-left"
            class="seg-arrow"
            aria-hidden="true"
          />
          <span class="seg-text">
            <span class="seg-label">{{ o.label }}</span>
            <span class="seg-hint">{{ o.hint }}</span>
          </span>
          <Icon
            v-if="o.value === 'right'"
            name="lucide:arrow-right"
            class="seg-arrow"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <div class="tree card">
      <RouteTreeDiagram
        :routes="routes"
        :highlight="highlight"
        :side="side"
        theme="app"
        @select="pick"
      />
    </div>

    <p class="same-both muted">
      <strong>Same numbers on both sides.</strong> Inside always means toward the ball, outside
      always means toward the sideline. Flip the switch and watch the tree mirror &mdash; the 1 is
      still a slant, it just breaks the other way.
    </p>

    <div class="legend" role="group" aria-label="Routes">
      <button
        v-for="r in routes"
        :key="r.num"
        type="button"
        class="route-btn"
        :class="{ active: highlight === r.num }"
        :aria-pressed="highlight === r.num"
        @click="pick(r.num)"
      >
        <span class="route-num">{{ r.num }}</span>
        <span class="route-name">{{ r.name }}</span>
      </button>
    </div>

    <Transition name="pop">
      <div v-if="selectedRoute" class="detail card" aria-live="polite">
        <div class="detail-head">
          <span class="detail-num">{{ selectedRoute.num }}</span>
          <h2 class="detail-name">{{ selectedRoute.name }}</h2>
        </div>
        <p class="detail-desc muted">{{ selectedRoute.description }}</p>
      </div>
    </Transition>

    <div class="action card">
      <div class="action-text">
        <p class="action-title">Put it in action</p>
        <p class="muted action-desc">
          <template v-if="selectedRoute">
            Call X on a {{ selectedRoute.num }} out of
            <strong class="ex">{{ formationFor === 'red' ? 'Red' : 'Black' }}</strong> and see the
            whole play drawn.
          </template>
          <template v-else>
            Open the audible pad in
            <strong class="ex">{{ formationFor === 'red' ? 'Red' : 'Black' }}</strong> &mdash; X on
            this side &mdash; and call your own numbers.
          </template>
        </p>
      </div>
      <NuxtLink class="action-btn" :to="audibleLink">
        Call it
        <Icon name="lucide:arrow-right" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.side-switch {
  display: grid;
  gap: 8px;
}
.side-q {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}
.seg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.seg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
  padding: 8px 12px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-ctl);
  color: var(--chalk);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.seg-btn:hover {
  border-color: var(--steel);
}
.seg-btn.active {
  border-color: var(--red);
  background: var(--red-glow);
}
.seg-arrow {
  flex: none;
  font-size: 1.3rem;
  color: var(--steel);
}
.seg-btn.active .seg-arrow {
  color: var(--red);
}
.seg-text {
  display: grid;
  gap: 1px;
  text-align: left;
}
.seg-btn:first-child .seg-text {
  text-align: left;
}
.seg-btn:last-child .seg-text {
  text-align: right;
}
.seg-label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.1;
}
.seg-hint {
  font-size: 0.75rem;
  color: var(--steel);
}
.seg-btn.active .seg-hint {
  color: var(--chalk-dim);
}
.same-both {
  font-size: 0.9rem;
  max-width: 56ch;
}

.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  flex-wrap: wrap;
}
.action-text {
  display: grid;
  gap: 2px;
  flex: 1 1 240px;
}
.action-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.action-desc {
  font-size: 0.9rem;
}
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--r-ctl);
  border: 1px solid var(--red);
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: background var(--t-fast) var(--ease);
}
.action-btn:hover {
  background: color-mix(in srgb, var(--red) 85%, #000);
}

.routes-page {
  display: grid;
  gap: 16px;
  max-width: 720px;
  margin: 0 auto;
}
.page-head {
  display: grid;
  gap: 6px;
}
.page-head h1 {
  font-size: 2.2rem;
}
.lead {
  font-size: 0.95rem;
  max-width: 52ch;
}
.ex {
  color: var(--red);
}

.tree {
  overflow: hidden;
  background: var(--dg-field);
}

.legend {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.route-btn {
  display: grid;
  justify-items: center;
  gap: 2px;
  padding: 10px 4px;
  min-height: 60px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-ctl);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.route-btn:hover {
  border-color: var(--steel);
}
.route-btn.active {
  border-color: var(--red);
  background: var(--red-glow);
}
.route-num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--chalk);
}
.route-btn.active .route-num {
  color: var(--red);
}
.route-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--steel);
  text-align: center;
}

.detail {
  padding: 14px 16px;
  display: grid;
  gap: 6px;
  border-left: 3px solid var(--red);
}
.detail-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.detail-num {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
}
.detail-name {
  font-size: 1.4rem;
}
.detail-desc {
  font-size: 0.95rem;
}

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

@media (min-width: 880px) {
  .legend {
    grid-template-columns: repeat(10, 1fr);
  }
}
</style>
