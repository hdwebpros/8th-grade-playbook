<script setup lang="ts">
import { routes } from '~/data'

useHead({ title: 'Route Tree — Wolves Playbook' })

const highlight = ref<number | null>(null)

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

    <div class="tree card">
      <RouteTreeDiagram :routes="routes" :highlight="highlight" theme="app" @select="pick" />
    </div>

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
  </div>
</template>

<style scoped>
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
