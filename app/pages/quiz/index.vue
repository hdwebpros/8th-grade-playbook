<script setup lang="ts">
import { NuxtLink } from '#components'

useHead({ title: 'Quiz — Wolves Playbook' })

const modes = [
  {
    to: '/quiz/know-your-job',
    icon: 'lucide:target',
    title: 'Know Your Job',
    sub: 'Pick your position — tap your job on every play, against every front.',
    available: true,
  },
  {
    icon: 'lucide:layers',
    title: 'Self-Study Flashcards',
    sub: 'Unlimited reps, instant reveal, nothing scored. Bus mode.',
    available: false,
  },
  {
    icon: 'lucide:monitor-play',
    title: 'Coach Mode',
    sub: 'Coach drives it on the big screen. Team calls it out.',
    available: false,
  },
]
</script>

<template>
  <div class="quiz-page">
    <header class="page-head">
      <p class="eyebrow">Practice</p>
      <h1>Quiz</h1>
      <p class="muted lead">Reps win games. Drill your assignments until they're automatic.</p>
    </header>

    <div class="modes">
      <component
        :is="mode.available ? NuxtLink : 'div'"
        v-for="mode in modes"
        :key="mode.title"
        :to="mode.available ? mode.to : undefined"
        class="card mode"
        :class="{ off: !mode.available }"
      >
        <span class="mode-icon" :class="{ hot: mode.available }">
          <Icon :name="mode.icon" aria-hidden="true" />
        </span>
        <span class="mode-text">
          <span class="mode-title-row">
            <span class="mode-title">{{ mode.title }}</span>
            <span v-if="!mode.available" class="soon">Coming soon</span>
          </span>
          <span class="mode-sub muted">{{ mode.sub }}</span>
        </span>
        <Icon v-if="mode.available" name="lucide:chevron-right" class="mode-chev" aria-hidden="true" />
      </component>
    </div>
  </div>
</template>

<style scoped>
.quiz-page {
  display: grid;
  gap: 20px;
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
}

.modes {
  display: grid;
  gap: 10px;
}
.mode {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
a.mode:hover {
  border-color: var(--red);
  background: var(--panel-raised);
}
.mode.off {
  opacity: 0.65;
}
.mode-icon {
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
.mode-icon.hot {
  background: var(--red-glow);
  color: var(--red);
}
.mode-text {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.mode-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.mode-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
.mode-sub {
  font-size: 0.92rem;
}
.mode-chev {
  margin-left: auto;
  color: var(--steel);
  flex: none;
}
</style>
