<script setup lang="ts">
import { learningVideos } from '~/data/learning'

useHead({ title: 'Learning Materials — Wolves Playbook' })
</script>

<template>
  <div class="learn-page">
    <header class="page-head">
      <NuxtLink to="/quiz" class="back muted">
        <Icon name="lucide:chevron-left" aria-hidden="true" /> Quiz
      </NuxtLink>
      <p class="eyebrow">Film room</p>
      <h1>Learning Materials</h1>
      <p class="muted lead">Coaching videos by position. Tap to play, or open in YouTube.</p>
    </header>
    <div class="videos">
      <LearningVideo v-for="v in learningVideos" :key="v.id" :video="v" />
    </div>
  </div>
</template>

<style scoped>
.learn-page {
  display: grid;
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}
.page-head {
  display: grid;
  gap: 6px;
}
.page-head h1 {
  font-size: 2.2rem;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  width: fit-content;
  margin-bottom: 6px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.back:hover {
  color: var(--chalk);
}
.lead {
  font-size: 0.95rem;
}
.videos {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
