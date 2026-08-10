<script setup lang="ts">
defineProps<{
  title?: string
  notes: string[]
}>()
</script>

<template>
  <aside class="note" role="note">
    <div class="note-head">
      <Icon name="lucide:clipboard-pen-line" class="note-icon" aria-hidden="true" />
      <span class="note-title">{{ title ?? "Coach's notes" }}</span>
    </div>
    <ul class="note-list">
      <li v-for="(n, i) in notes" :key="i">{{ n }}</li>
    </ul>
  </aside>
</template>

<style scoped>
.note {
  background: color-mix(in srgb, var(--red-deep) 12%, var(--panel));
  border: 1px solid color-mix(in srgb, var(--red) 30%, var(--line));
  border-left: 3px solid var(--red);
  border-radius: var(--r-card);
  padding: 12px 14px;
}
.note-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.note-icon {
  font-size: 16px;
  color: var(--red);
}
.note-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--red);
}
.note-list {
  display: grid;
  gap: 4px;
  font-size: 0.95rem;
  color: var(--chalk-dim);
}
.note-list li {
  padding-left: 14px;
  position: relative;
}
.note-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--red);
}
</style>
