<script setup lang="ts">
/**
 * ComingSoon — placeholder body for a section that has a tab but no content
 * yet. Says what's planned so a kid (or coach) knows what to expect here.
 */
defineProps<{
  icon: string
  planned: string[]
}>()
</script>

<template>
  <div class="card soon">
    <span class="soon-icon"><Icon :name="icon" aria-hidden="true" /></span>
    <h2 class="soon-title">Content coming soon</h2>
    <p class="muted soon-sub">Coach is still drawing this up. Here's what's on the way:</p>
    <ul class="soon-list">
      <li v-for="item in planned" :key="item">
        <Icon name="lucide:check" class="soon-check" aria-hidden="true" />
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 36px 20px;
}
.soon-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--red-glow);
  color: var(--red);
  font-size: 26px;
  margin-bottom: 6px;
}
.soon-title {
  font-size: 1.6rem;
}
.soon-sub {
  max-width: 36ch;
}
.soon-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
  text-align: left;
}
.soon-list li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.soon-check {
  color: var(--red);
  flex: none;
}
</style>
